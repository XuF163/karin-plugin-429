import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';
export class Minchao extends plugin {
  constructor() {
    super({
      name: 'Wuthering_waves',
      dsc: '感觉不如原神',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: '^%.*图鉴$',
          fnc: 'minchao',
          log: true,
          permission: 'all'
        }
      ],
    });
    this.base_url = 'https://mc.kuro.wiki/';
    this.role_url = 'https://mc.kuro.wiki/codex/roles/detail?id=';
    // const weapos_url = 'https://mc.kuro.wiki/codex/weapons/detail?id=';
    // const item_url = 'https://mc.kuro.wiki/codex/items/detail?id=1';
  }

  async minchao(e) {
    let msg = e.msg;
    let target_name = msg.replace(/%/g, '').replace(/图鉴/g, '');
    let url = `${this.role_url}${target_name}`;
    logger.mark(`${url}`)
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
      ignoreHTTPSErrors: true,
      defaultViewport: { width: 1080, height: 1920 }
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1');
    await page.goto(url);
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'example.png' });
    e.reply([segment.image('example.png')]);
    await browser.close();
  }
}
