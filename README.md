## 概要

このパッケージは、VitePressの開発サーバーで表示される任意のページURLを指定して、その内容をPDFとしてエクスポートします。

## 前提条件

1. Node.jsとnpmがインストールされている必要があります。
2. プロジェクトのルートで `npm install` を実行し、必要な依存パッケージをインストールしてください。

## 実行コマンド

VitePressサーバーが起動している状態で、プロジェクトのルートディレクトリから以下のコマンドを実行します。

```bash
npx export-pdf --url http://localhost:5173/apple-ecosystem/index.html
```

### オプション

- `--url` ... PDF化したいページのURL（例: http://localhost:5173/apple-ecosystem/index.html）

## 出力先

生成されたPDFファイルは、すべて `packages/export-pdf/pdf/` ディレクトリに保存されます。
URLの末尾ファイル名（.html→.pdf変換）で保存されます。

例: `http://localhost:5173/apple-ecosystem/index.html` → `packages/export-pdf/pdf/index.pdf`