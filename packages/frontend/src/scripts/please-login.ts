/*
 * SPDX-FileCopyrightText: Fedired
 * SPDX-License-Identifier: AGPL-3.0-only
 */


import { defineAsyncComponent } from 'vue';
import { $i } from '@/account.js';
import { i18n } from '@/i18n.js';
import { popup } from '@/os.js';

export type OpenOnRemoteOptions = {
	/**
	 * 外部のFedired Webで特定のパスを開く
	 */
	type: 'web';

	/**
	 * 内部パス（例: `/settings`）
	 */
	path: string;
} | {
	/**
	 * 外部のFedired Webで照会する
	 */
	type: 'lookup';

	/**
	 * 照会したいエンティティのURL
	 *
	 * （例: `https://fedired.example.com/notes/abcdexxxxyz`）
	 */
	url: string;
} | {
	/**
	 * 外部のFediredでノートする
	 */
	type: 'share';

	/**
	 * `/share` ページに渡すクエリストリング
	 *
	 * @see https://go.joinfedired.org/spec/share/
	 */
	params: Record<string, string>;
};

export function pleaseLogin(opts: {
	path?: string;
	message?: string;
	openOnRemote?: OpenOnRemoteOptions;
} = {}) {
	if ($i) return;

	const { dispose } = popup(defineAsyncComponent(() => import('@/components/MkSigninDialog.vue')), {
		autoSet: true,
		message: opts.message ?? (opts.openOnRemote ? i18n.ts.signinOrContinueOnRemote : i18n.ts.signinRequired),
		openOnRemote: opts.openOnRemote,
	}, {
		cancelled: () => {
			if (opts.path) {
				window.location.href = opts.path;
			}
		},
		closed: () => dispose(),
	});

	throw new Error('signin required');
}
