/*
 * SPDX-FileCopyrightText: Fedired
 * SPDX-License-Identifier: AGPL-3.0-only
 */


import * as Fedired from 'fedired-js';
import { $i } from '@/account.js';

export function isFollowingVisibleForMe(user: Fedired.entities.UserDetailed): boolean {
	if ($i && ($i.id === user.id || $i.isAdmin || $i.isModerator)) return true;

	if (user.followingVisibility === 'private') return false;
	if (user.followingVisibility === 'followers' && !user.isFollowing) return false;

	return true;
}
export function isFollowersVisibleForMe(user: Fedired.entities.UserDetailed): boolean {
	if ($i && ($i.id === user.id || $i.isAdmin || $i.isModerator)) return true;

	if (user.followersVisibility === 'private') return false;
	if (user.followersVisibility === 'followers' && !user.isFollowing) return false;

	return true;
}
