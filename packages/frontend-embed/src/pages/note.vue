<!--
SPDX-FileCopyrightText: Fedired
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div :class="$style.noteEmbedRoot">
	<EmNoteDetailed v-if="note && !prohibited" :note="note"/>
	<XNotFound v-else/>
</div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import * as Fedired from 'fedired-js';
import EmNoteDetailed from '@/components/EmNoteDetailed.vue';
import XNotFound from '@/pages/not-found.vue';
import { DI } from '@/di.js';
import { fediredApi } from '@/fedired-api.js';
import { assertServerContext } from '@/server-context';

const props = defineProps<{
	noteId: string;
}>();

const serverContext = inject(DI.serverContext)!;

const note = ref<Fedired.entities.Note | null>(null);

const prohibited = ref(false);

if (assertServerContext(serverContext, 'note')) {
	note.value = serverContext.note;
} else {
	note.value = await fediredApi('notes/show', {
		noteId: props.noteId,
	}).catch(() => {
		return null;
	});
}

if (note.value?.url != null || note.value?.uri != null) {
	// リモートサーバーのノートは弾く
	prohibited.value = true;
}
</script>

<style lang="scss" module>
.noteEmbedRoot {
	background-color: var(--MI_THEME-panel);
}
</style>
