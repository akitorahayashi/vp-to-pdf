const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const projectRoot = process.cwd();
const outputDir = path.join(projectRoot, 'test-output');
const pdfPath = path.join(outputDir, 'index.pdf');




async function runTest() {

    try {
        // VITEPRESS_PORT環境変数からポート番号を取得
        const port = process.env.VITEPRESS_PORT;
        if (!port) {
            throw new Error('VITEPRESS_PORT環境変数が設定されていません');
        }

        // 1. Run export-pdf command
        console.log('Running export-pdf command...');
        cp.execSync(`node sources/export-pdf.js --url http://localhost:${port} --outDir ./test-output`);

        // 2. Assert that PDF is created
        console.log('Asserting PDF creation...');
        assert.ok(fs.existsSync(pdfPath), 'PDF file should be created');
        console.log('PDF created successfully.');

    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
}

runTest();
