## 概要

このパッケージは、VitePressの開発サーバーで表示される任意のページURLを指定して、その内容をPDFとしてエクスポートします。

## 前提条件

1. Node.jsとnpmがインストールされている必要があります。
2. プロジェクトのルートで `npm install` を実行し、必要な依存パッケージをインストールしてください。

## 実行コマンド

VitePressサーバーが起動している状態で、プロジェクトのルートディレクトリから以下のコマンドを実行します。

```bash
npx export-pdf --url <URL> --out <出力パス>
```

### オプション

- `--url` ... PDF化したいページのURL（例: `http://localhost:5173/index.html`）
- `--out` ... PDFの出力先パス（例: `./output.pdf`）

### 実行例

```bash
npx export-pdf --url http://localhost:5173/index.html --out ./vitepress.pdf
```

## 出力

指定された出力パスにPDFファイルが生成されます。
