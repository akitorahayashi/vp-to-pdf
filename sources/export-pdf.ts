#!/usr/bin/env node
import puppeteer, { Browser } from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';


(async () => {
    const args = process.argv.slice(2);
    let urlArg: string | undefined;
    let outArg: string | undefined;

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--url' && args[i + 1]) {
            urlArg = args[i + 1];
            i++;
        } else if (args[i] === '--out' && args[i + 1]) {
            outArg = args[i + 1];
            i++;
        }
    }

    if (!urlArg) {
        console.error('ページURL(--url)を指定してください。');
        console.error('例: npx export-pdf --url http://localhost:5173/apple-ecosystem/index.html --out ./output.pdf');
        process.exit(1);
    }

    if (!outArg) {
        console.error('出力パス(--out)を指定してください。');
        console.error('例: npx export-pdf --url http://localhost:5173/apple-ecosystem/index.html --out ./output.pdf');
        process.exit(1);
    }

    const targetUrl: string = urlArg;
    const outPath: string = outArg;

    // PDF出力パスを生成
    const projectRoot: string = process.cwd();
    const pdfPath: string = path.isAbsolute(outPath) ? outPath : path.join(projectRoot, outPath);

    console.log(`PuppeteerでアクセスするURL: ${targetUrl}`);
    console.log(`PDFの出力先: ${pdfPath}`);

    let browser: Browser | undefined;
    try {
        // PDF出力先ディレクトリ作成
        const pdfDir: string = path.dirname(pdfPath);
        if (!fs.existsSync(pdfDir)) {
            fs.mkdirSync(pdfDir, { recursive: true });
        }

        console.log('Puppeteerを起動');
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        console.log('ページの作成');
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(30000); // 30秒

        console.log(`ページの移動: ${targetUrl}`);
        await page.goto(targetUrl, {
            waitUntil: 'load'
        });

        // 印刷用スタイル
        await page.emulateMediaType('print');

        // VitePressコンテンツの表示を待つ
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