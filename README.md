## 概要

このパッケージは、VitePressの開発サーバーで表示される任意のページURLを指定して、その内容をPDFとしてエクスポートします。

## 前提条件

1. Node.jsとnpmがインストールされている必要があります。
2. プロジェクトのルートで `npm install` を実行し、必要な依存パッケージをインストールしてください。

## 実行コマンド

VitePressサーバーが起動している状態で、プロジェクトのルートディレクトリから以下のコマンドを実行します。

```bash
npx export-pdf --url <URL> [--outDir <出力ディレクトリ>]
```

### オプション

- `--url` (必須) ... PDF化したいページのURL（例: `http://localhost:5173/index.html`）
- `--outDir` (任意) ... PDFの出力先ディレクトリ。相対パス、絶対パスのどちらも指定可能です。指定しない場合は、コマンドを実行したカレントディレクトリに出力されます。（例: `./pdf-output`）


### 実行例

```bash
# カレントディレクトリに index.pdf を出力
npx export-pdf --url http://localhost:5173/index.html

# ./docs ディレクトリに guide.pdf を出力
npx export-pdf --url http://localhost:5173/guide/ --outDir ./docs
```

## 出力

PDFファイルは、`--outDir`で指定されたディレクトリ、またはカレントディレクトリに生成されます。
ファイル名はURLのパスから自動的に決定されます。

- `http://localhost:5173/` -> `index.pdf`
- `http://localhost:5173/guide/` -> `guide.pdf`
- `http://localhost:5173/guide/getting-started.html` -> `getting-started.pdf`
