<!--
SPDX-FileCopyrightText: Fedired
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div :class="$style.root">
	<MkNote v-if="note && !block.detailed" :key="note.id + ':normal'" :note="note"/>
	<MkNoteDetailed v-if="note && block.detailed" :key="note.id + ':detail'" :note="note"/>
</div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import * as Fedired from 'fedired-js';
import MkNote from '@/components/MkNote.vue';
import MkNoteDetailed from '@/components/MkNoteDetailed.vue';
import { fediredApi } from '@/scripts/fedired-api.js';

const props = defineProps<{
	block: Fedired.entities.PageBlock,
	page: Fedired.entities.Page,
}>();

const note = ref<Fedired.entities.Note | null>(null);

onMounted(() => {
	if (props.block.note == null) return;
	fediredApi('notes/show', { noteId: props.block.note })
		.then(result => {
			note.value = result;
		});
});
</script>

<style lang="scss" module>
.root {
	border: 1px solid var(--MI_THEME-divider);
	border-radius: var(--MI-radius);
}
</style>
