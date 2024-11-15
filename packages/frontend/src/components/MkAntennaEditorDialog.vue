<!--
SPDX-FileCopyrightText: Fedired
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<MkModalWindow
	ref="dialog"
	:withOkButton="false"
	:width="500"
	:height="550"
	@close="close()"
	@closed="emit('closed')"
>
	<template #header>{{ antenna == null ? i18n.ts.createAntenna : i18n.ts.editAntenna }}</template>
	<XAntennaEditor
		:antenna="antenna"
		@created="onAntennaCreated"
		@updated="onAntennaUpdated"
		@deleted="onAntennaDeleted"
	/>
</MkModalWindow>
</template>

<script lang="ts" setup>
import { shallowRef } from 'vue';
import * as Fedired from 'fedired-js';
import MkModalWindow from '@/components/MkModalWindow.vue';
import XAntennaEditor from '@/components/MkAntennaEditor.vue';
import { i18n } from '@/i18n.js';

defineProps<{
	antenna?: Fedired.entities.Antenna;
}>();

const emit = defineEmits<{
	(ev: 'created', newAntenna: Fedired.entities.Antenna): void,
	(ev: 'updated', editedAntenna: Fedired.entities.Antenna): void,
	(ev: 'deleted'): void,
	(ev: 'closed'): void,
}>();

const dialog = shallowRef<InstanceType<typeof MkModalWindow>>();

function onAntennaCreated(newAntenna: Fedired.entities.Antenna) {
	emit('created', newAntenna);
	dialog.value?.close();
}

function onAntennaUpdated(editedAntenna: Fedired.entities.Antenna) {
	emit('updated', editedAntenna);
	dialog.value?.close();
}

function onAntennaDeleted() {
	emit('deleted');
	dialog.value?.close();
}

function close() {
	dialog.value?.close();
}
</script>
