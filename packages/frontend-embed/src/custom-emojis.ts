/*
 * SPDX-FileCopyrightText: Fedired
 * SPDX-License-Identifier: AGPL-3.0-only
 */


import { shallowRef, watch } from 'vue';
import * as Fedired from 'fedired-js';
import { fediredApi, fediredApiGet } from '@/fedired-api.js';

function get(key: string) {
	const value = localStorage.getItem(key);
	if (value === null) return null;
	return JSON.parse(value);
}

function set(key: string, value: any) {
	localStorage.setItem(key, JSON.stringify(value));
}

const storageCache = await get('emojis');
export const customEmojis = shallowRef<Fedired.entities.EmojiSimple[]>(Array.isArray(storageCache) ? storageCache : []);

export const customEmojisMap = new Map<string, Fedired.entities.EmojiSimple>();
watch(customEmojis, emojis => {
	customEmojisMap.clear();
	for (const emoji of emojis) {
		customEmojisMap.set(emoji.name, emoji);
	}
}, { immediate: true });

export async function fetchCustomEmojis(force = false) {
	const now = Date.now();

	let res;
	if (force) {
		res = await fediredApi('emojis', {});
	} else {
		const lastFetchedAt = await get('lastEmojisFetchedAt');
		if (lastFetchedAt && (now - lastFetchedAt) < 1000 * 60 * 60) return;
		res = await fediredApiGet('emojis', {});
	}

	customEmojis.value = res.emojis;
	set('emojis', res.emojis);
	set('lastEmojisFetchedAt', now);
}

let cachedTags;
export function getCustomEmojiTags() {
	if (cachedTags) return cachedTags;

	const tags = new Set();
	for (const emoji of customEmojis.value) {
		for (const tag of emoji.aliases) {
			tags.add(tag);
		}
	}
	const res = Array.from(tags);
	cachedTags = res;
	return res;
}
