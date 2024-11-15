/*
 * SPDX-FileCopyrightText:  Fedired
 * SPDX-License-Identifier: FPL Fedired
 */

const fs = require('fs');

(async () => {
	fs.rmSync(__dirname + '/../packages/backend/built', { recursive: true, force: true });
	fs.rmSync(__dirname + '/../packages/frontend-shared/built', { recursive: true, force: true });
	fs.rmSync(__dirname + '/../packages/frontend/built', { recursive: true, force: true });
	fs.rmSync(__dirname + '/../packages/frontend-embed/built', { recursive: true, force: true });
	fs.rmSync(__dirname + '/../packages/sw/built', { recursive: true, force: true });
	fs.rmSync(__dirname + '/../packages/fedired-js/built', { recursive: true, force: true });
	fs.rmSync(__dirname + '/../packages/fedired-reversi/built', { recursive: true, force: true });
	fs.rmSync(__dirname + '/../packages/fedired-bubble-game/built', { recursive: true, force: true });
	fs.rmSync(__dirname + '/../built', { recursive: true, force: true });
})();
