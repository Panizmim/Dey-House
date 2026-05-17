const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const TARGET_DIRS = [
  'public/images',
  'public/uploads',
  'public/icons',
]

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG']

const CONFIG = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 82,
  convertToWebP: false,
}

let totalOriginal = 0
let totalOptimized = 0
let processedCount = 0
let skippedCount = 0

function findImages(dir) {
  const images = []
  if (!fs.existsSync(dir)) return images
  const items = fs.readdirSync(dir)
  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      if (item === 'icons') continue
      images.push(...findImages(fullPath))
    } else {
      const ext = path.extname(item)
      if (IMAGE_EXTENSIONS.includes(ext)) {
        images.push(fullPath)
      }
    }
  }
  return images
}

async function optimizeImage(filePath) {
  try {
    const originalSize = fs.statSync(filePath).size
    const originalKB = Math.round(originalSize / 1024)

    if (originalSize < 100 * 1024) {
      console.log(`Skip (already small): ${filePath} — ${originalKB}KB`)
      skippedCount++
      return
    }

    const ext = path.extname(filePath).toLowerCase()
    const tempPath = filePath + '.tmp'

    let sharpInstance = sharp(filePath).resize({
      width: CONFIG.maxWidth,
      height: CONFIG.maxHeight,
      fit: 'inside',
      withoutEnlargement: true,
    })

    if (ext === '.jpg' || ext === '.jpeg') {
      sharpInstance = sharpInstance.jpeg({ quality: CONFIG.quality, progressive: true })
    } else if (ext === '.png') {
      sharpInstance = sharpInstance.png({ quality: CONFIG.quality, compressionLevel: 8 })
    } else if (ext === '.webp') {
      sharpInstance = sharpInstance.webp({ quality: CONFIG.quality })
    }

    await sharpInstance.toFile(tempPath)

    const newSize = fs.statSync(tempPath).size
    const newKB = Math.round(newSize / 1024)
    const savings = Math.round((1 - newSize / originalSize) * 100)

    if (newSize < originalSize) {
      fs.renameSync(tempPath, filePath)
      totalOriginal += originalSize
      totalOptimized += newSize
      processedCount++
      const relativePath = filePath.replace(process.cwd() + '/', '')
      console.log(`OK  ${relativePath}  ${originalKB}KB → ${newKB}KB  (${savings}% کاهش)`)
    } else {
      fs.unlinkSync(tempPath)
      console.log(`Skip (already optimal): ${filePath} — ${originalKB}KB`)
      skippedCount++
    }
  } catch (err) {
    console.error(`Error: ${filePath}`, err.message)
    const tempPath = filePath + '.tmp'
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath)
  }
}

async function main() {
  console.log('در حال پیدا کردن عکس‌ها...\n')

  let allImages = []
  for (const dir of TARGET_DIRS) {
    allImages.push(...findImages(dir))
  }

  if (allImages.length === 0) {
    console.log('هیچ عکسی پیدا نشد.')
    return
  }

  console.log(`${allImages.length} عکس پیدا شد\n`)
  console.log('-'.repeat(60))

  for (const imagePath of allImages) {
    await optimizeImage(imagePath)
  }

  console.log('\n' + '-'.repeat(60))
  console.log('بهینه‌سازی تمام شد!\n')
  console.log(`بهینه شده: ${processedCount} عکس`)
  console.log(`رد شده:    ${skippedCount} عکس`)

  if (totalOriginal > 0) {
    const totalOriginalMB = (totalOriginal / 1024 / 1024).toFixed(2)
    const totalOptimizedMB = (totalOptimized / 1024 / 1024).toFixed(2)
    const totalSavings = Math.round((1 - totalOptimized / totalOriginal) * 100)
    console.log(`حجم قبل:   ${totalOriginalMB}MB`)
    console.log(`حجم بعد:   ${totalOptimizedMB}MB`)
    console.log(`کاهش کل:   ${totalSavings}%`)
  }
}

main().catch(console.error)
