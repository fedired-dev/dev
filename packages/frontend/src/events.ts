/*
 * SPDX-FileCopyrightText: Fedired
 * SPDX-License-Identifier: AGPL-3.0-only
 */


import { EventEmitter } from 'eventemitter3';
import * as Fedired from 'fedired-js';

export const globalEvents = new EventEmitter<{
	themeChanged: () => void;
	clientNotification: (notification: Fedired.entities.Notification) => void;
	requestClearPageCache: () => void;
}>();
