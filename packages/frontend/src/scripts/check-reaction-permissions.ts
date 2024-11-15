/*
 * SPDX-FileCopyrightText: Fedired
 * SPDX-License-Identifier: AGPL-3.0-only
 */


import * as Fedired from 'fedired-js';
import { UnicodeEmojiDef } from '@@/js/emojilist.js';

export function checkReactionPermissions(me: Fedired.entities.MeDetailed, note: Fedired.entities.Note, emoji: Fedired.entities.EmojiSimple | UnicodeEmojiDef | string): boolean {
	if (typeof emoji === 'string') return true; // UnicodeEmojiDefにも無い絵文字であれば文字列で来る。Unicode絵文字であることには変わりないので常にリアクション可能とする;
	if ('char' in emoji) return true; // UnicodeEmojiDefなら常にリアクション可能

	const roleIdsThatCanBeUsedThisEmojiAsReaction = emoji.roleIdsThatCanBeUsedThisEmojiAsReaction ?? [];
	return !(emoji.localOnly && note.user.host !== me.host)
      && !(emoji.isSensitive && (note.reactionAcceptance === 'nonSensitiveOnly' || note.reactionAcceptance === 'nonSensitiveOnlyForLocalLikeOnlyForRemote'))
      && (roleIdsThatCanBeUsedThisEmojiAsReaction.length === 0 || me.roles.some(role => roleIdsThatCanBeUsedThisEmojiAsReaction.includes(role.id)));
}
