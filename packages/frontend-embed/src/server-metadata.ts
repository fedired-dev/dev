/*
 * SPDX-FileCopyrightText: Fedired
 * SPDX-License-Identifier: AGPL-3.0-only
 */


import * as Fedired from 'fedired-js';
import { fediredApi } from '@/fedired-api.js';

const providedMetaEl = document.getElementById('fediredmeta');

const _serverMetadata: Fedired.entities.MetaDetailed | null = (providedMetaEl && providedMetaEl.textContent) ? JSON.parse(providedMetaEl.textContent) : null;

// NOTE: devモードのときしか _serverMetadata が null になることは無い
export const serverMetadata: Fedired.entities.MetaDetailed = _serverMetadata ?? await fediredApi('meta', {
	detail: true,
});
