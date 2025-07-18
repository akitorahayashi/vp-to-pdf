#!/usr/bin/env node
import puppeteer, { Browser } from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';
import { URL } from 'url';

(async () => {
    const args = process.argv.slice(2);
    let urlArg: string | undefined;
    let outDirArg: string | undefined;

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--url' && args[i + 1]) {
            urlArg = args[i + 1];
            i++;
        } else if (args[i] === '--outDir' && args[i + 1]) {
            outDirArg = args[i + 1];
            i++;
        }
    }

    if (!urlArg) {
        console.error('ページURL(--url)を指定してください。');
        console.error('例: npx export-pdf --url http://localhost:5173/index.html --outDir ./pdf');
        process.exit(1);
    }

    const targetUrl: string = urlArg;

    const url = new URL(targetUrl);
    let pdfName = path.basename(url.pathname);
    if (pdfName === '' || pdfName === '/') {
        pdfName = 'index.pdf';
    } else if (pdfName.endsWith('.html')) {
        pdfName = pdfName.replace('.html', '.pdf');
    } else {
        pdfName = `${pdfName}.pdf`;
    }

    const outDir = outDirArg ? path.resolve(process.cwd(), outDirArg) : process.cwd();
    const pdfPath: string = path.join(outDir, pdfName);

    console.log(`PuppeteerでアクセスするURL: ${targetUrl}`);
    console.log(`PDFの出力先: ${pdfPath}`);

    let browser: Browser | undefined;
    try {
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
        }

        console.log('Puppeteerを起動');
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        console.log('ページの作成');
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(30000);

        console.log(`ページの移動: ${targetUrl}`);
        await page.goto(targetUrl, {
            waitUntil: 'load'
        });

        await page.emulateMediaType('print');
        await page.waitForSelector('.VPContent', { visible: true, timeout: 30000 });

        console.log(`PDFを生成: ${pdfPath}`);
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' }
        });

        console.log('PDFの生成が完了');

    } catch (error) {
        console.error('PDF生成エラー:', error);
        process.exit(1);
    } finally {
        if (browser) {
            console.log('ブラウザを終了');
            await browser.close();
        }
    }
})();