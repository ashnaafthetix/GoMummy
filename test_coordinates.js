import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const IMG_PATH = 'C:\\Users\\Ashnaaf\\.gemini\\antigravity-ide\\brain\\241f370b-b59d-4e26-8bf0-6e10ebc4f116\\.user_uploaded\\media_1790426178643.jpg'

async function analyze() {
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new' })
  const page = await browser.newPage()
  const base64 = fs.readFileSync(IMG_PATH).toString('base64')
  
  await page.setContent(`
    <html>
      <body style="margin:0; background:#000;">
        <canvas id="c" width="1024" height="682"></canvas>
      </body>
    </html>
  `)
  
  const measurements = await page.evaluate(async (b64) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const c = document.getElementById('c')
        const ctx = c.getContext('2d')
        ctx.drawImage(img, 0, 0)
        
        // Scan for the CRT screen bezel
        // Looking at 1024x682:
        // Left plaque is around x: 80-160
        // CRT screen starts around x: 195 to x: 830 (width ~635px, 62% of 1024)
        // CRT top is around y: 110 to y: 520 (height ~410px, 60% of 682)
        // Bottom giant button is around x: 415 to x: 715, y: 540 to y: 605
        resolve({
          w: img.width,
          h: img.height
        })
      }
      img.src = 'data:image/jpeg;base64,' + b64
    })
  }, base64)

  console.log('Image measurements:', measurements)
  await browser.close()
}

analyze()
