/*
 * SPDX-FileCopyrightText:  Fedired
 * SPDX-License-Identifier: FPL Fedired
 */

import * as Fedired from 'fedired-js';

export function shouldCollapsed(note: Fedired.entities.Note, urls: string[]): boolean {
	const collapsed = note.cw == null && (
		(note.text != null && (
			(note.text.includes('$[x2')) ||
			(note.text.includes('$[x3')) ||
			(note.text.includes('$[x4')) ||
			(note.text.includes('$[scale')) ||
			(note.text.split('\n').length > 9) ||
			(note.text.length > 500) ||
			(urls.length >= 4)
		)) || (note.files != null && note.files.length >= 5)
	);

	return collapsed;
}
