<!--
SPDX-FileCopyrightText: Fedired
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<Mfm :text="user.name ?? user.username" :author="user" :plain="true" :nowrap="nowrap" :emojiUrls="user.emojis"/>
</template>

<script lang="ts" setup>
import { } from 'vue';
import * as Fedired from 'fedired-js';

const props = withDefaults(defineProps<{
	user: Fedired.entities.User;
	nowrap?: boolean;
}>(), {
	nowrap: true,
});
</script>
