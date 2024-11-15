/*
 * SPDX-FileCopyrightText: Fedired
 * SPDX-License-Identifier: AGPL-3.0-only
 */


import * as Fedired from 'fedired-js';

export interface PostFormProps {
	reply?: Fedired.entities.Note;
	renote?: Fedired.entities.Note;
	channel?: Fedired.entities.Channel; // TODO
	mention?: Fedired.entities.User;
	specified?: Fedired.entities.UserDetailed;
	initialText?: string;
	initialCw?: string;
	initialVisibility?: (typeof Fedired.noteVisibilities)[number];
	initialFiles?: Fedired.entities.DriveFile[];
	initialLocalOnly?: boolean;
	initialVisibleUsers?: Fedired.entities.UserDetailed[];
	initialNote?: Fedired.entities.Note;
	instant?: boolean;
};
