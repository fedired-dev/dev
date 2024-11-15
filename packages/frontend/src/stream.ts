/*
 * SPDX-FileCopyrightText: Fedired
 * SPDX-License-Identifier: AGPL-3.0-only
 */


import * as Fedired from 'fedired-js';
import { markRaw } from 'vue';
import { $i } from '@/account.js';
import { wsOrigin } from '@@/js/config.js';
// TODO: No WebsocketモードでStreamMockが使えそう
//import { StreamMock } from '@/scripts/stream-mock.js';

// heart beat interval in ms
const HEART_BEAT_INTERVAL = 1000 * 60;

let stream: Fedired.IStream | null = null;
let timeoutHeartBeat: number | null = null;
let lastHeartbeatCall = 0;

export function useStream(): Fedired.IStream {
	if (stream) return stream;

	// TODO: No Websocketモードもここで判定
	stream = markRaw(new Fedired.Stream(wsOrigin, $i ? {
		token: $i.token,
	} : null));

	if (timeoutHeartBeat) window.clearTimeout(timeoutHeartBeat);
	timeoutHeartBeat = window.setTimeout(heartbeat, HEART_BEAT_INTERVAL);

	// send heartbeat right now when last send time is over HEART_BEAT_INTERVAL
	document.addEventListener('visibilitychange', () => {
		if (
			!stream
			|| document.visibilityState !== 'visible'
			|| Date.now() - lastHeartbeatCall < HEART_BEAT_INTERVAL
		) return;
		heartbeat();
	});

	return stream;
}

function heartbeat(): void {
	if (stream != null && document.visibilityState === 'visible') {
		stream.heartbeat();
	}
	lastHeartbeatCall = Date.now();
	if (timeoutHeartBeat) window.clearTimeout(timeoutHeartBeat);
	timeoutHeartBeat = window.setTimeout(heartbeat, HEART_BEAT_INTERVAL);
}
