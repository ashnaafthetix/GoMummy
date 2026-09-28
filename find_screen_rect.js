import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const IMG_PATH = path.resolve('public/assets/workstation-brief.jpg')

async function findScreenRect() {
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new' })
  const page = await browser.newPage()
  const b64 = fs.readFileSync(IMG_PATH).toString('base64')

  await page.setContent(`
    <style>body { margin:0; background:black; }</style>
    <img id="im" src="data:image/jpeg;base64,${b64}" />
  `)

  // Let's inspect the monitor screen coordinates
  const rect = await page.evaluate(() => {
    const im = document.getElementById('im')
    const c = document.createElement('canvas')
    c.width = im.naturalWidth
    c.height = im.naturalHeight
    const ctx = c.getContext('2d')
    ctx.drawImage(im, 0, 0)

    // Let's sample along horizontal line y = 250 (middle of the CRT screen)
    // The screen in the middle is blue sky (#9ad6ff or similar)
    const y = 250
    let startX = -1, endX = -1
    for (let x = 100; x < 900; x++) {
      const p = ctx.getImageData(x, y, 1, 1).data
      // blue sky: r ~ 130-220, g ~ 190-250, b > 230
      if (p[2] > 200 && p[1] > 180 && startX === -1) {
        startX = x
      }
      if (startX !== -1 && (p[2] < 150 || (p[0] < 50 && p[1] < 50 && p[2] < 50))) {
        endX = x
        break
      }
    }

    // Let's sample along vertical line x = 500
    let startY = -1, endY = -1
    for (let curY = 50; curY < 600; curY++) {
      const p = ctx.getImageData(500, curY, 1, 1).data
      if (p[2] > 200 && p[1] > 180 && startY === -1) {
        startY = curY
      }
      if (startY !== -1 && curY > 400 && p[0] < 80 && p[1] < 80 && p[2] < 80) {
        endY = curY
        break
      }
    }

    return {
      naturalWidth: im.naturalWidth,
      naturalHeight: im.naturalHeight,
      screenX: startX,
      screenEndX: endX,
      screenWidth: endX - startX,
      screenY: startY,
      screenEndY: endY,
      screenHeight: endY - startY,
      leftPercent: (startX / im.naturalWidth) * 100,
      widthPercent: ((endX - startX) / im.naturalWidth) * 100,
      topPercent: (startY / im.naturalHeight) * 100,
      heightPercent: ((endY - startY) / im.naturalHeight) * 100,
    }
  })

  console.log('Detected CRT Screen Coordinates:', rect)
  await browser.close()
}

findScreenRect()
