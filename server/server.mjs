// FM Bomboniere VPS server: static dist/ + admin API. Node >= 22, no dependencies.
// Env: ADMIN_PASSWORD (required), PORT (8080), DATA_DIR (./data), DIST_DIR (./dist),
//      SESSION_SECRET (random per start if unset: sessions end on restart), COOKIE_SECURE=1 to force Secure cookies.
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { mkdir, readFile, rename, stat, unlink, writeFile, readdir } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve, sep } from 'node:path'

const PORT = Number(process.env.PORT ?? 8080)
const DATA = resolve(process.env.DATA_DIR ?? 'data')
const DIST = resolve(process.env.DIST_DIR ?? 'dist')
const UPLOADS = join(DATA, 'uploads')
const CONTENT = join(DATA, 'content.json')
const PASSWORD = process.env.ADMIN_PASSWORD ?? ''
const SECRET = process.env.SESSION_SECRET || randomBytes(32).toString('hex')
const SESSION_MS = 12 * 60 * 60 * 1000
const MAX_UPLOAD = 8 * 1024 * 1024
const MAX_CONTENT = 2 * 1024 * 1024
const UPLOAD_NAME = /^[a-z0-9-]{1,80}~[a-z0-9]{1,16}(-640)?\.webp$/

if (PASSWORD.length < 10) {
  console.error('ADMIN_PASSWORD must be set (at least 10 characters).')
  process.exit(1)
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
}

// Sessions: stateless HMAC token "<expiry>.<sig>" in an HttpOnly SameSite=Strict cookie.
const sign = (v) => createHmac('sha256', SECRET).update(v).digest('base64url')
const equal = (a, b) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b))
function authed(req) {
  const m = /(?:^|;\s*)fm_session=([^;]+)/.exec(req.headers.cookie ?? '')
  if (!m) return false
  const [exp, sig] = m[1].split('.')
  return !!exp && !!sig && Number(exp) > Date.now() && equal(sig, sign(exp))
}
function cookie(req, value, maxAge) {
  const secure = process.env.COOKIE_SECURE === '1' || req.headers['x-forwarded-proto'] === 'https' ? '; Secure' : ''
  return `fm_session=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`
}

// Login throttle: 5 failures per IP per 15 minutes.
const failures = new Map()
function throttled(ip) {
  const f = failures.get(ip)
  if (!f || f.until < Date.now()) return false
  return f.count >= 5
}
function fail(ip) {
  const f = failures.get(ip)
  if (!f || f.until < Date.now()) failures.set(ip, { count: 1, until: Date.now() + 15 * 60 * 1000 })
  else f.count++
}

function send(res, status, body, headers = {}) {
  const data = typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body)
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers })
  res.end(data)
}

async function body(req, limit) {
  const chunks = []
  let size = 0
  for await (const c of req) {
    size += c.length
    if (size > limit) throw Object.assign(new Error('too large'), { status: 413 })
    chunks.push(c)
  }
  return Buffer.concat(chunks)
}

const str = (v, max = 2000) => typeof v === 'string' && v.length <= max
const PATH = /^(img\/gallery|uploads)\/[A-Za-z0-9._~-]+\.webp$/

/** Shape check for content.json; rejects anything the site could not render or that points outside the image folders. */
function validContent(c) {
  if (!c || typeof c !== 'object' || !Array.isArray(c.collections) || !Array.isArray(c.photos) || !Array.isArray(c.hero) || !str(c.about, 200)) return false
  const ids = new Set()
  for (const k of c.collections) {
    if (!k || !/^[a-z0-9-]{1,60}$/.test(k.id) || !str(k.it, 120) || !str(k.en, 120) || ids.has(k.id)) return false
    ids.add(k.id)
  }
  for (const p of c.photos) {
    if (!p || !PATH.test(p.src) || !PATH.test(p.thumb) || !Number.isInteger(p.w) || !Number.isInteger(p.h) || p.w < 1 || p.h < 1) return false
    if (!ids.has(p.collection) || !str(p.alt_it, 500) || !str(p.alt_en, 500) || typeof p.featured !== 'boolean' || !str(p.date, 10)) return false
  }
  if (c.hero.length > 3 || !c.hero.every((s) => str(s, 200))) return false
  if (c.text !== undefined) {
    if (!c.text || typeof c.text !== 'object') return false
    for (const l of Object.keys(c.text)) {
      if ((l !== 'it' && l !== 'en') || !c.text[l] || typeof c.text[l] !== 'object') return false
      if (!Object.values(c.text[l]).every((v) => str(v, 1000))) return false
    }
  }
  return true
}

/** Remove uploads no longer referenced by the saved content (deleted or replaced photos). */
async function pruneUploads(c) {
  const used = new Set(c.photos.flatMap((p) => [p.src, p.thumb]).filter((p) => p.startsWith('uploads/')).map((p) => p.slice(8)))
  for (const f of await readdir(UPLOADS)) {
    // Keep files from the last hour: they may belong to an upload whose content is not saved yet.
    if (used.has(f)) continue
    const s = await stat(join(UPLOADS, f))
    if (Date.now() - s.mtimeMs > 60 * 60 * 1000) await unlink(join(UPLOADS, f)).catch(() => {})
  }
}

async function api(req, res, path, url) {
  const ip = req.headers['x-real-ip'] ?? req.socket.remoteAddress ?? ''
  const method = req.method ?? 'GET'

  if (path === 'content' && method === 'GET') {
    const json = await readFile(CONTENT).catch(() => null)
    return json ? send(res, 200, json, { 'Cache-Control': 'no-cache' }) : send(res, 404, { error: 'none' })
  }
  if (path === 'session' && method === 'GET') return send(res, 200, { authed: authed(req) })

  // Every mutating call needs the custom header: browsers cannot send it cross-site without a CORS preflight we never answer.
  if (method !== 'GET' && req.headers['x-fm-admin'] !== '1') return send(res, 403, { error: 'csrf' })

  if (path === 'login' && method === 'POST') {
    if (throttled(ip)) return send(res, 429, { error: 'throttled' })
    let password = ''
    try {
      password = JSON.parse((await body(req, 4096)).toString()).password ?? ''
    } catch {
      return send(res, 400, { error: 'bad json' })
    }
    const a = createHmac('sha256', SECRET).update(String(password)).digest()
    const b = createHmac('sha256', SECRET).update(PASSWORD).digest()
    if (!timingSafeEqual(a, b)) {
      fail(ip)
      return send(res, 401, { error: 'wrong password' })
    }
    failures.delete(ip)
    const exp = String(Date.now() + SESSION_MS)
    return send(res, 200, { ok: true }, { 'Set-Cookie': cookie(req, `${exp}.${sign(exp)}`, SESSION_MS / 1000) })
  }
  if (path === 'logout' && method === 'POST') return send(res, 200, { ok: true }, { 'Set-Cookie': cookie(req, '', 0) })

  if (!authed(req)) return send(res, 401, { error: 'auth' })

  if (path === 'content' && method === 'PUT') {
    let c
    try {
      c = JSON.parse((await body(req, MAX_CONTENT)).toString())
    } catch {
      return send(res, 400, { error: 'bad json' })
    }
    if (!validContent(c)) return send(res, 422, { error: 'invalid content' })
    // Atomic replace so a crash never leaves a half-written file.
    await writeFile(CONTENT + '.tmp', JSON.stringify(c))
    await rename(CONTENT + '.tmp', CONTENT)
    await pruneUploads(c).catch((e) => console.error('prune', e))
    return send(res, 200, { ok: true })
  }
  if (path === 'upload' && method === 'POST') {
    const name = url.searchParams.get('name') ?? ''
    if (!UPLOAD_NAME.test(name)) return send(res, 400, { error: 'bad name' })
    const buf = await body(req, MAX_UPLOAD)
    // WebP magic: "RIFF" .... "WEBP"
    if (buf.length < 12 || buf.toString('latin1', 0, 4) !== 'RIFF' || buf.toString('latin1', 8, 12) !== 'WEBP') return send(res, 415, { error: 'not webp' })
    await writeFile(join(UPLOADS, name), buf)
    return send(res, 200, { ok: true })
  }
  return send(res, 404, { error: 'not found' })
}

async function file(req, res, root, rel, cache) {
  const full = normalize(join(root, rel))
  if (full !== root && !full.startsWith(root + sep)) return false
  const s = await stat(full).catch(() => null)
  if (!s?.isFile()) return false
  res.writeHead(200, { 'Content-Type': MIME[extname(full)] ?? 'application/octet-stream', 'Content-Length': s.size, 'Cache-Control': cache })
  if (req.method === 'HEAD') res.end()
  else createReadStream(full).pipe(res)
  return true
}

const server = createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  try {
    const url = new URL(req.url ?? '/', 'http://localhost')
    const path = decodeURIComponent(url.pathname)
    if (path.startsWith('/api/')) return await api(req, res, path.slice(5), url)
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'method' })
    if (path === '/admin.html' || path === '/admin') res.setHeader('X-Frame-Options', 'DENY')
    if (path === '/admin') return void (await file(req, res, DIST, 'admin.html', 'no-cache'))
    // Upload names are versioned, so they are immutable like hashed assets.
    if (path.startsWith('/uploads/') && (await file(req, res, UPLOADS, path.slice(9), 'public, max-age=31536000, immutable'))) return
    const immutable = /^\/(assets|img)\//.test(path)
    if (await file(req, res, DIST, path === '/' ? 'index.html' : path.slice(1), immutable ? 'public, max-age=31536000, immutable' : 'no-cache')) return
    // Unknown paths fall back to the single page.
    if (!(await file(req, res, DIST, 'index.html', 'no-cache'))) send(res, 404, 'not found', { 'Content-Type': 'text/plain' })
  } catch (e) {
    if (!res.headersSent) send(res, e?.status ?? 500, { error: e?.status ? 'too large' : 'server error' })
    if (!e?.status) console.error(e)
  }
})

await mkdir(UPLOADS, { recursive: true })
server.listen(PORT, () => console.log(`fmbomboniere on :${PORT} (dist ${DIST}, data ${DATA})`))
