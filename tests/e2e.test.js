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

        // 3. Run export-pdf without outDir (should create index.pdf in cwd)
        const cwdPdfPath = path.join(projectRoot, 'index.pdf');
        console.log('Running export-pdf command without outDir...');
        cp.execSync(`node sources/export-pdf.js --url http://localhost:${port}`);
        // 4. Assert that PDF is created in cwd
        console.log('Asserting PDF creation in cwd...');
        assert.ok(fs.existsSync(cwdPdfPath), 'PDF file should be created in cwd');
        console.log('PDF created in cwd successfully.');
        // 5. Delete the created PDF in cwd
        fs.unlinkSync(cwdPdfPath);
        console.log('PDF in cwd deleted.');

    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
}

runTest();
