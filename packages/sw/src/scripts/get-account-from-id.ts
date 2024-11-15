/*
 * SPDX-FileCopyrightText: Fedired
 * SPDX-License-Identifier: AGPL-3.0-only
 */


import { get } from 'idb-keyval';
import * as Fedired from 'fedired-js';

export async function getAccountFromId(id: string): Promise<Pick<Fedired.entities.SignupResponse, 'id' | 'token'> | undefined> {
	const accounts = await get<Pick<Fedired.entities.SignupResponse, 'id' | 'token'>[]>('accounts');
	if (!accounts) {
		console.log('Accounts are not recorded');
		return;
	}
	return accounts.find(e => e.id === id);
}
