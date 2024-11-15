/*
 * SPDX-FileCopyrightText: Fedired
 * SPDX-License-Identifier: AGPL-3.0-only
 */


import * as assert from 'assert';
import { Test } from '@nestjs/testing';

import { CoreModule } from '@/core/CoreModule.js';
import { ApMfmService } from '@/core/activitypub/ApMfmService.js';
import { GlobalModule } from '@/GlobalModule.js';
import { MiNote } from '@/models/Note.js';

describe('ApMfmService', () => {
	let apMfmService: ApMfmService;

	beforeAll(async () => {
		const app = await Test.createTestingModule({
			imports: [GlobalModule, CoreModule],
		}).compile();
		apMfmService = app.get<ApMfmService>(ApMfmService);
	});

	describe('getNoteHtml', () => {
		test('Do not provide _fedired_content for simple text', () => {
			const note = {
				text: 'テキスト #タグ @mention 🍊 :emoji: https://example.com',
				mentionedRemoteUsers: '[]',
			};

			const { content, noFediredContent } = apMfmService.getNoteHtml(note);

			assert.equal(noFediredContent, true, 'noFediredContent');
			assert.equal(content, '<p>テキスト <a href="http://fedired.local/tags/タグ" rel="tag">#タグ</a> <a href="http://fedired.local/@mention" class="u-url mention">@mention</a> 🍊 ​:emoji:​ <a href="https://example.com">https://example.com</a></p>', 'content');
		});

		test('Provide _fedired_content for MFM', () => {
			const note = {
				text: '$[tada foo]',
				mentionedRemoteUsers: '[]',
			};

			const { content, noFediredContent } = apMfmService.getNoteHtml(note);

			assert.equal(noFediredContent, false, 'noFediredContent');
			assert.equal(content, '<p><i>foo</i></p>', 'content');
		});
	});
});
