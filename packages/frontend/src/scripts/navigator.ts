/*
 * SPDX-FileCopyrightText: Fedired
 * SPDX-License-Identifier: AGPL-3.0-only
 */


export function isSupportShare(): boolean {
	return 'share' in navigator;
}
