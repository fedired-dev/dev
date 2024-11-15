/*
 * SPDX-FileCopyrightText: Fedired
 * SPDX-License-Identifier: AGPL-3.0-only
 */


import * as Fedired from 'fedired-js';
import { Cache } from '@/scripts/cache.js';
import { fediredApi } from '@/scripts/fedired-api.js';

export const clipsCache = new Cache<Fedired.entities.Clip[]>(1000 * 60 * 30, () => fediredApi('clips/list'));
export const rolesCache = new Cache(1000 * 60 * 30, () => fediredApi('admin/roles/list'));
export const userListsCache = new Cache<Fedired.entities.UserList[]>(1000 * 60 * 30, () => fediredApi('users/lists/list'));
export const antennasCache = new Cache<Fedired.entities.Antenna[]>(1000 * 60 * 30, () => fediredApi('antennas/list'));
export const favoritedChannelsCache = new Cache<Fedired.entities.Channel[]>(1000 * 60 * 30, () => fediredApi('channels/my-favorites', { limit: 100 }));
