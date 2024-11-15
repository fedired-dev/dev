/*
 * SPDX-FileCopyrightText: Fedired
 * SPDX-License-Identifier: AGPL-3.0-only
 */


import * as Fedired from 'fedired-js';
import { i18n } from '@/i18n.js';
import * as os from '@/os.js';
import { fediredApi } from '@/scripts/fedired-api.js';

export async function lookupUser() {
	const { canceled, result } = await os.inputText({
		title: i18n.ts.usernameOrUserId,
	});
	if (canceled) return;

	const show = (user) => {
		os.pageWindow(`/admin/user/${user.id}`);
	};

	const usernamePromise = fediredApi('users/show', Fedired.acct.parse(result));
	const idPromise = fediredApi('users/show', { userId: result });
	let _notFound = false;
	const notFound = () => {
		if (_notFound) {
			os.alert({
				type: 'error',
				text: i18n.ts.noSuchUser,
			});
		} else {
			_notFound = true;
		}
	};
	usernamePromise.then(show).catch(err => {
		if (err.code === 'NO_SUCH_USER') {
			notFound();
		}
	});
	idPromise.then(show).catch(err => {
		notFound();
	});
}

export async function lookupUserByEmail() {
	const { canceled, result } = await os.inputText({
		title: i18n.ts.emailAddress,
		type: 'email',
	});
	if (canceled) return;

	try {
		const user = await os.apiWithDialog('admin/accounts/find-by-email', { email: result });

		os.pageWindow(`/admin/user/${user.id}`);
	} catch (err) {
		if (err.code === 'USER_NOT_FOUND') {
			os.alert({
				type: 'error',
				text: i18n.ts.noSuchUser,
			});
		} else {
			throw err;
		}
	}
}

export async function lookupFile() {
	const { canceled, result: q } = await os.inputText({
		title: i18n.ts.fileIdOrUrl,
		minLength: 1,
	});
	if (canceled) return;

	const show = (file) => {
		os.pageWindow(`/admin/file/${file.id}`);
	};

	fediredApi('admin/drive/show-file', q.startsWith('http://') || q.startsWith('https://') ? { url: q.trim() } : { fileId: q.trim() }).then(file => {
		show(file);
	}).catch(err => {
		if (err.code === 'NO_SUCH_FILE') {
			os.alert({
				type: 'error',
				text: i18n.ts.notFound,
			});
		}
	});
}
