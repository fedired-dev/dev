## fedired-js向け型生成モジュール

バックエンドが吐き出すOpenAPI準拠のapi.jsonからfedired-jsで使用される型エイリアスを生成するためのモジュールです。
このモジュールはfedired-jsそのものにバンドルされることは想定しておらず、生成物をfedired-jsのsrc配下にコピーして使用することを想定しています。

## 使い方

まず、Fediredのバックエンドからapi.jsonを取得する必要があります。任意のFediredインスタンスの/api-docからダウンロードしても良いですし、
backendモジュール配下で`pnpm generate-api-json`を実行しても良いでしょう。

api.jsonを入手したら、このファイルがあるディレクトリに置いてください。

その後、以下コマンドを実行します。

```shell
pnpm generate
```

上記を実行することで、`./built`ディレクトリ配下にtsファイルが生成されます。
