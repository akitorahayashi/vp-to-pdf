import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as assert from 'assert';

const projectRoot = process.cwd();
const docsDir = path.join(projectRoot, 'docs');
const pdfPath = path.join(projectRoot, 'test-doc.pdf');

function cleanup() {
    console.log('Cleaning up...');
    if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
    }
}

async function runTest() {
    let serverProcess: cp.ChildProcess | null = null;
    try {
        // 1. Start VitePress dev server
        console.log('Starting VitePress dev server...');
        serverProcess = cp.spawn('npx', ['vitepress', 'dev', 'docs'], {
            stdio: 'inherit',
            shell: true,
        });

        // Wait for server to be ready
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10s for server to start

        // 2. Run export-pdf command
        console.log('Running export-pdf command...');
        cp.execSync(`node dist/export-pdf.js --url http://localhost:5173 --out ${pdfPath}`);

        // 3. Assert that PDF is created
        console.log('Asserting PDF creation...');
        assert.ok(fs.existsSync(pdfPath), 'PDF file should be created');
        console.log('PDF created successfully.');

    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    } finally {
        if (serverProcess) {
            serverProcess.kill();
        }
        cleanup();
    }
}

runTest();
