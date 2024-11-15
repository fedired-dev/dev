/*
 * SPDX-FileCopyrightText: Fedired
 * SPDX-License-Identifier: AGPL-3.0-only
 */


import { shallowRef, computed, markRaw, watch } from 'vue';
import * as Fedired from 'fedired-js';
import { fediredApi, fediredApiGet } from '@/scripts/fedired-api.js';
import { get, set } from '@/scripts/idb-proxy.js';

const storageCache = await get('emojis');
export const customEmojis = shallowRef<Fedired.entities.EmojiSimple[]>(Array.isArray(storageCache) ? storageCache : []);
export const customEmojiCategories = computed<[ ...string[], null ]>(() => {
	const categories = new Set<string>();
	for (const emoji of customEmojis.value) {
		if (emoji.category && emoji.category !== 'null') {
			categories.add(emoji.category);
		}
	}
	return markRaw([...Array.from(categories), null]);
});

export const customEmojisMap = new Map<string, Fedired.entities.EmojiSimple>();
watch(customEmojis, emojis => {
	customEmojisMap.clear();
	for (const emoji of emojis) {
		customEmojisMap.set(emoji.name, emoji);
	}
}, { immediate: true });

export function addCustomEmoji(emoji: Fedired.entities.EmojiSimple) {
	customEmojis.value = [emoji, ...customEmojis.value];
	set('emojis', customEmojis.value);
}

export function updateCustomEmojis(emojis: Fedired.entities.EmojiSimple[]) {
	customEmojis.value = customEmojis.value.map(item => emojis.find(search => search.name === item.name) ?? item);
	set('emojis', customEmojis.value);
}

export function removeCustomEmojis(emojis: Fedired.entities.EmojiSimple[]) {
	customEmojis.value = customEmojis.value.filter(item => !emojis.some(search => search.name === item.name));
	set('emojis', customEmojis.value);
}

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
