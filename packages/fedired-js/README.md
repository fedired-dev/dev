# fedired.js
**Strongly-typed official Fedired SDK for browsers/Node.js.**

[![Test](https://github.com/fedired-dev/fedired.js/actions/workflows/test.yml/badge.svg)](https://github.com/fedired-dev/fedired.js/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/fedired-dev/fedired.js/branch/develop/graph/badge.svg?token=PbrTtk3nVD)](https://codecov.io/gh/fedired-dev/fedired.js)

[![NPM](https://nodei.co/npm/fedired-js.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/fedired-js)

JavaScript(TypeScript)用の公式FediredSDKです。ブラウザ/Node.js上で動作します。

以下が提供されています:
- ユーザー認証
- APIリクエスト
- ストリーミング
- ユーティリティ関数
- Fediredの各種型定義

対応するFediredのバージョンは12以上です。

## Install
```
npm i fedired-js
```

# Usage
インポートは以下のようにまとめて行うと便利です。

``` ts
import * as Fedired from 'fedired-js';
```

便宜上、以後のコード例は上記のように`* as Fedired`としてインポートしている前提のものになります。

ただし、このインポート方法だとTree-Shakingできなくなるので、コードサイズが重要なユースケースでは以下のような個別インポートをお勧めします。

``` ts
import { api as fediredApi } from 'fedired-js';
```

## Authenticate
todo

## API request
APIを利用する際は、利用するサーバーの情報とアクセストークンを与えて`APIClient`クラスのインスタンスを初期化し、そのインスタンスの`request`メソッドを呼び出してリクエストを行います。

``` ts
const cli = new Fedired.api.APIClient({
	origin: 'https://fedired.test',
	credential: 'TOKEN',
});

const meta = await cli.request('meta', { detail: true });
```

`request`の第一引数には呼び出すエンドポイント名、第二引数にはパラメータオブジェクトを渡します。レスポンスはPromiseとして返ります。

## Streaming
fedired.jsのストリーミングでは、二つのクラスが提供されます。
ひとつは、ストリーミングのコネクション自体を司る`Stream`クラスと、もうひとつはストリーミング上のチャンネルの概念を表す`Channel`クラスです。
ストリーミングを利用する際は、まず`Stream`クラスのインスタンスを初期化し、その後で`Stream`インスタンスのメソッドを利用して`Channel`クラスのインスタンスを取得する形になります。

``` ts
const stream = new Fedired.Stream('https://fedired.test', { token: 'TOKEN' });
const mainChannel = stream.useChannel('main');
mainChannel.on('notification', notification => {
	console.log('notification received', notification);
});
```

コネクションが途切れても自動で再接続されます。

### チャンネルへの接続
チャンネルへの接続は`Stream`クラスの`useChannel`メソッドを使用します。

パラメータなし
``` ts
const stream = new Fedired.Stream('https://fedired.test', { token: 'TOKEN' });

const mainChannel = stream.useChannel('main');
```

パラメータあり
``` ts
const stream = new Fedired.Stream('https://fedired.test', { token: 'TOKEN' });

const messagingChannel = stream.useChannel('messaging', {
	otherparty: 'xxxxxxxxxx',
});
```

### チャンネルから切断
`Channel`クラスの`dispose`メソッドを呼び出します。

``` ts
const stream = new Fedired.Stream('https://fedired.test', { token: 'TOKEN' });

const mainChannel = stream.useChannel('main');

mainChannel.dispose();
```

### メッセージの受信
`Channel`クラスはEventEmitterを継承しており、メッセージがサーバーから受信されると受け取ったイベント名でペイロードをemitします。

``` ts
const stream = new Fedired.Stream('https://fedired.test', { token: 'TOKEN' });
const mainChannel = stream.useChannel('main');
mainChannel.on('notification', notification => {
	console.log('notification received', notification);
});
```

### メッセージの送信
`Channel`クラスの`send`メソッドを使用してメッセージをサーバーに送信することができます。

``` ts
const stream = new Fedired.Stream('https://fedired.test', { token: 'TOKEN' });
const messagingChannel = stream.useChannel('messaging', {
	otherparty: 'xxxxxxxxxx',
});

messagingChannel.send('read', {
	id: 'xxxxxxxxxx'
});
```

### コネクション確立イベント
`Stream`クラスの`_connected_`イベントが利用可能です。

``` ts
const stream = new Fedired.Stream('https://fedired.test', { token: 'TOKEN' });
stream.on('_connected_', () => {
	console.log('connected');
});
```

### コネクション切断イベント
`Stream`クラスの`_disconnected_`イベントが利用可能です。

``` ts
const stream = new Fedired.Stream('https://fedired.test', { token: 'TOKEN' });
stream.on('_disconnected_', () => {
	console.log('disconnected');
});
```

### コネクションの状態
`Stream`クラスの`state`プロパティで確認できます。

- `initializing`: 接続確立前
- `connected`: 接続完了
- `reconnecting`: 再接続中

---

<div align="center">
	<a href="https://github.com/fedired-dev/fedired/blob/develop/CONTRIBUTING.md"><img src="https://assets.joinfedired.org/public/i-want-you.png" width="300"></a>
</div>
