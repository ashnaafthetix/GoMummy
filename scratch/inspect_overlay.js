import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const IMG_PATH = path.resolve('public/assets/workstation-brief.jpg')
const ARTIFACT_DIR = 'C:\\Users\\Ashnaaf\\.gemini\\antigravity-ide\\brain\\241f370b-b59d-4e26-8bf0-6e10ebc4f116'

async function inspectLayout() {
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new' })
  const page = await browser.newPage()
  const b64 = fs.readFileSync(IMG_PATH).toString('base64')

  await page.setContent(`
    <style>
      body { margin: 0; background: #000; overflow: hidden; }
      .wrapper { position: relative; width: 1024px; height: 682px; }
      img { width: 1024px; height: 682px; display: block; }
      .box { position: absolute; border: 2px solid lime; box-sizing: border-box; font-family: monospace; font-size: 10px; color: yellow; background: rgba(0,255,0,0.1); pointer-events: none; }
    </style>
    <div class="wrapper">
      <img src="data:image/jpeg;base64,${b64}" />
      <!-- Top HUD tabs -->
      <div class="box" style="left: 250px; top: 41px; width: 73px; height: 32px;">BRIEF</div>
      <div class="box" style="left: 330px; top: 41px; width: 80px; height: 32px;">RESULTS</div>
      <div class="box" style="left: 414px; top: 41px; width: 85px; height: 32px;">SHORTLIST</div>
      <div class="box" style="left: 506px; top: 41px; width: 85px; height: 32px;">COMPARE</div>
      <div class="box" style="left: 597px; top: 41px; width: 89px; height: 32px;">QUESTIONS</div>
      <div class="box" style="left: 717px; top: 41px; width: 76px; height: 32px;">SFX</div>
      
      <!-- CRT Monitor Bezel inner viewport -->
      <div class="box" style="left: 194px; top: 114px; width: 657px; height: 431px; border-color: red; border-radius: 16px;">CRT SCREEN</div>

      <!-- Inner Brief Controls -->
      <div class="box" style="left: 247px; top: 345px; width: 466px; height: 52px; border-color: yellow;">INPUT TEXT FIELD</div>
      <div class="box" style="left: 730px; top: 345px; width: 76px; height: 52px; border-color: pink;">ARROW BTN</div>
      
      <div class="box" style="left: 314px; top: 413px; width: 72px; height: 34px; border-color: cyan;">TLD .COM</div>
      <div class="box" style="left: 395px; top: 413px; width: 62px; height: 34px; border-color: cyan;">TLD .IO</div>
      <div class="box" style="left: 463px; top: 413px; width: 62px; height: 34px; border-color: cyan;">TLD .AI</div>

      <!-- Example ideas row -->
      <div class="box" style="left: 337px; top: 469px; width: 88px; height: 20px; border-color: orange;">EX 1</div>
      <div class="box" style="left: 432px; top: 469px; width: 83px; height: 20px; border-color: orange;">EX 2</div>
      <div class="box" style="left: 524px; top: 469px; width: 87px; height: 20px; border-color: orange;">EX 3</div>
      <div class="box" style="left: 618px; top: 469px; width: 85px; height: 20px; border-color: orange;">EX 4</div>
      <div class="box" style="left: 708px; top: 469px; width: 85px; height: 20px; border-color: orange;">EX 5</div>

      <!-- Lower Mechanical Bar -->
      <div class="box" style="left: 210px; top: 554px; width: 172px; height: 44px; border-color: cyan; border-radius: 4px;">QUESTIONS BTN</div>
      <div class="box" style="left: 413px; top: 546px; width: 295px; height: 50px; border-color: magenta; border-radius: 6px;">FIND NAMES ENTER</div>
    </div>
  `)

  await page.setViewport({ width: 1024, height: 682 })
  const outPath = path.join(ARTIFACT_DIR, 'scratch', 'test_overlay_alignment.png')
  await page.screenshot({ path: outPath })
  console.log('Saved alignment overlay to:', outPath)
  await browser.close()
}

inspectLayout()
