/*
 * SPDX-FileCopyrightText: Fedired
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import * as Fedired from 'fedired-js';

const providedContextEl = document.getElementById('fediredembedCtx');

export type ServerContext = {
	clip?: Fedired.entities.Clip;
	note?: Fedired.entities.Note;
	user?: Fedired.entities.UserLite;
} | null;

// NOTE: devモードのときしか embedCtx が null になることは無い
export const serverContext: ServerContext = (providedContextEl && providedContextEl.textContent) ? JSON.parse(providedContextEl.textContent) : null;

export function assertServerContext<K extends keyof NonNullable<ServerContext>>(ctx: ServerContext, entity: K): ctx is Required<Pick<NonNullable<ServerContext>, K>> {
	if (ctx == null) return false;
	return entity in ctx;
}
