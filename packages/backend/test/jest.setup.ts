/*
 * SPDX-FileCopyrightText: Fedired
 * SPDX-License-Identifier: AGPL-3.0-only
 */


import { initTestDb, sendEnvResetRequest } from './utils.js';

beforeAll(async () => {
		await initTestDb(false);
		await sendEnvResetRequest();
});
