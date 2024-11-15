<!--
SPDX-FileCopyrightText: Fedired
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<MkModalWindow
	ref="dialog"
	:width="800"
	:height="500"
	:withOkButton="true"
	:okButtonDisabled="(type === 'file') && (selected.length === 0)"
	@click="cancel()"
	@close="cancel()"
	@ok="ok()"
	@closed="emit('closed')"
>
	<template #header>
		{{ multiple ? ((type === 'file') ? i18n.ts.selectFiles : i18n.ts.selectFolders) : ((type === 'file') ? i18n.ts.selectFile : i18n.ts.selectFolder) }}
		<span v-if="selected.length > 0" style="margin-left: 8px; opacity: 0.5;">({{ number(selected.length) }})</span>
	</template>
	<XDrive :multiple="multiple" :select="type" @changeSelection="onChangeSelection" @selected="ok()"/>
</MkModalWindow>
</template>

<script lang="ts" setup>
import { ref, shallowRef } from 'vue';
import * as Fedired from 'fedired-js';
import XDrive from '@/components/MkDrive.vue';
import MkModalWindow from '@/components/MkModalWindow.vue';
import number from '@/filters/number.js';
import { i18n } from '@/i18n.js';

withDefaults(defineProps<{
	type?: 'file' | 'folder';
	multiple: boolean;
}>(), {
	type: 'file',
});

const emit = defineEmits<{
	(ev: 'done', r?: Fedired.entities.DriveFile[] | Fedired.entities.DriveFolder[]): void;
	(ev: 'closed'): void;
}>();

const dialog = shallowRef<InstanceType<typeof MkModalWindow>>();

const selected = ref<Fedired.entities.DriveFile[] | Fedired.entities.DriveFolder[]>([]);

function ok() {
	emit('done', selected.value);
	dialog.value?.close();
}

function cancel() {
	emit('done');
	dialog.value?.close();
}

function onChangeSelection(v: Fedired.entities.DriveFile[] | Fedired.entities.DriveFolder[]) {
	selected.value = v;
}
</script>
