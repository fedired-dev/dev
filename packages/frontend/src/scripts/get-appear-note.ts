/*
 * SPDX-FileCopyrightText: Fedired
 * SPDX-License-Identifier: AGPL-3.0-only
 */


import * as Fedired from 'fedired-js';

export function getAppearNote(note: Fedired.entities.Note) {
	return Fedired.note.isPureRenote(note) ? note.renote : note;
}
