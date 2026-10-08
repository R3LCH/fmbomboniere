/** Mirrors research/build.py: 1600px long side at q82 + 640px thumb at q80, WebP. Runs in the browser so the server needs no image libraries. */
export type Processed = { big: Blob; thumb: Blob; w: number; h: number }

async function render(bmp: ImageBitmap, max: number, quality: number): Promise<{ blob: Blob; w: number; h: number }> {
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height))
  const w = Math.round(bmp.width * scale)
  const h = Math.round(bmp.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bmp, 0, 0, w, h)
  const { promise, resolve, reject } = Promise.withResolvers<Blob>()
  canvas.toBlob((b) => (b && b.type === 'image/webp' ? resolve(b) : reject(new Error('webp-unsupported'))), 'image/webp', quality)
  return { blob: await promise, w, h }
}

export async function processImage(file: File): Promise<Processed> {
  // imageOrientation applies EXIF rotation from phone photos.
  const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' })
  try {
    const big = await render(bmp, 1600, 0.82)
    const thumb = await render(bmp, 640, 0.8)
    return { big: big.blob, thumb: thumb.blob, w: big.w, h: big.h }
  } finally {
    bmp.close()
  }
}

/** URL-safe slug from free text: lowercase ASCII, accents stripped, dashes. */
export function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}
