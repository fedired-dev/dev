/*
 * SPDX-FileCopyrightText: Fedired
 * SPDX-License-Identifier: AGPL-3.0-only
 */


import * as Fedired from 'fedired-js';
import { url } from '@@/js/config.js';

export const acct = (user: Fedired.Acct) => {
	return Fedired.acct.toString(user);
};

export const userName = (user: Fedired.entities.User) => {
	return user.name || user.username;
};

export const userPage = (user: Fedired.Acct, path?: string, absolute = false) => {
	return `${absolute ? url : ''}/@${acct(user)}${(path ? `/${path}` : '')}`;
};

export const notePage = (note: Fedired.entities.Note) => {
	return `/notes/${note.id}`;
};
