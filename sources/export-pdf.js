#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var puppeteer_1 = require("puppeteer");
var path = require("path");
var fs = require("fs");
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var args, urlArg, outArg, i, targetUrl, outPath, projectRoot, pdfPath, browser, pdfDir, page, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                args = process.argv.slice(2);
                for (i = 0; i < args.length; i++) {
                    if (args[i] === '--url' && args[i + 1]) {
                        urlArg = args[i + 1];
                        i++;
                    }
                    if (args[i] === '--out' && args[i + 1]) {
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
                targetUrl = urlArg;
                outPath = outArg;
                projectRoot = process.cwd();
                pdfPath = path.isAbsolute(outPath) ? outPath : path.join(projectRoot, outPath);
                console.log("Puppeteer\u3067\u30A2\u30AF\u30BB\u30B9\u3059\u308BURL: ".concat(targetUrl));
                console.log("PDF\u306E\u51FA\u529B\u5148: ".concat(pdfPath));
                _a.label = 1;
            case 1:
                _a.trys.push([1, 9, 10, 13]);
                pdfDir = path.dirname(pdfPath);
                if (!fs.existsSync(pdfDir)) {
                    fs.mkdirSync(pdfDir, { recursive: true });
                }
                console.log('Puppeteerを起動');
                return [4 /*yield*/, puppeteer_1.default.launch({
                        headless: true,
                        args: ['--no-sandbox', '--disable-setuid-sandbox']
                    })];
            case 2:
                browser = _a.sent();
                console.log('ページの作成');
                return [4 /*yield*/, browser.newPage()];
            case 3:
                page = _a.sent();
                return [4 /*yield*/, page.setDefaultNavigationTimeout(30000)];
            case 4:
                _a.sent(); // 30秒
                console.log("\u30DA\u30FC\u30B8\u306E\u79FB\u52D5: ".concat(targetUrl));
                return [4 /*yield*/, page.goto(targetUrl, {
                        waitUntil: 'load'
                    })];
            case 5:
                _a.sent();
                // 印刷用スタイル
                return [4 /*yield*/, page.emulateMediaType('print')];
            case 6:
                // 印刷用スタイル
                _a.sent();
                // VitePressコンテンツの表示を待つ
                return [4 /*yield*/, page.waitForSelector('.VPContent', { visible: true, timeout: 30000 })];
            case 7:
                // VitePressコンテンツの表示を待つ
                _a.sent();
                console.log("PDF\u3092\u751F\u6210: ".concat(pdfPath));
                return [4 /*yield*/, page.pdf({
                        path: pdfPath,
                        format: 'A4',
                        printBackground: true,
                        margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' }
                    })];
            case 8:
                _a.sent();
                console.log('PDFの生成が完了');
                return [3 /*break*/, 13];
            case 9:
                error_1 = _a.sent();
                console.error('PDF生成エラー:', error_1);
                process.exit(1);
                return [3 /*break*/, 13];
            case 10:
                if (!browser) return [3 /*break*/, 12];
                console.log('ブラウザを終了');
                return [4 /*yield*/, browser.close()];
            case 11:
                _a.sent();
                _a.label = 12;
            case 12: return [7 /*endfinally*/];
            case 13: return [2 /*return*/];
        }
    });
}); })();
