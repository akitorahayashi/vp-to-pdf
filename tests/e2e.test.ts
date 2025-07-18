import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as assert from 'assert';

const projectRoot = process.cwd();
const outputDir = path.join(projectRoot, 'test-output');
const pdfPath = path.join(outputDir, 'index.pdf');

function cleanup() {
    console.log('Cleaning up...');
    if (fs.existsSync(outputDir)) {
        fs.rmSync(outputDir, { recursive: true, force: true });
    }
}

function waitForServer(serverProcess: cp.ChildProcess): Promise<number> {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('VitePress server startup timeout'));
        }, 30000); // 30秒のタイムアウト
        serverProcess.stdout?.on('data', (data) => {
            const output = data.toString();
            console.log(output);
            const match = output.match(/http:\/\/localhost:(\d+)/);
            if (match) {
                const port = parseInt(match[1], 10);
                clearTimeout(timeout);
                resolve(port);
            }
        });

        serverProcess.stderr?.on('data', (data) => {
            console.error(data.toString());
            clearTimeout(timeout);
            reject(new Error('VitePress server failed to start'));
        });
    });
}

async function runTest() {
    let serverProcess: cp.ChildProcess | null = null;
    try {
        cleanup();

        // 1. Start VitePress dev server
        console.log('Starting VitePress dev server...');
        serverProcess = cp.spawn('npx', ['vitepress', 'dev', 'docs', '--port', '0'], {
            stdio: 'pipe',
            shell: true,
        });

        const port = await waitForServer(serverProcess);
        console.log(`VitePress server started on port ${port}`);

        // 2. Run export-pdf command
        console.log('Running export-pdf command...');
        cp.execSync(`node dist/export-pdf.js --url http://localhost:${port} --outDir ./test-output`);

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
