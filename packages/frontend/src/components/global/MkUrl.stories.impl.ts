/*
 * SPDX-FileCopyrightText: Fedired
 * SPDX-License-Identifier: AGPL-3.0-only
 */


/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { StoryObj } from '@storybook/vue3';
import { HttpResponse, http } from 'msw';
import { commonHandlers } from '../../../.storybook/mocks.js';
import MkUrl from './MkUrl.vue';
export const Default = {
	render(args) {
		return {
			components: {
				MkUrl,
			},
			setup() {
				return {
					args,
				};
			},
			computed: {
				props() {
					return {
						...this.args,
					};
				},
			},
			template: '<MkUrl v-bind="props">Text</MkUrl>',
		};
	},
	async play({ canvasElement }) {
		const canvas = within(canvasElement);
		const a = canvas.getByRole<HTMLAnchorElement>('link');
		await expect(a).toHaveAttribute('href', 'https://joinfedired.org/');
		await waitFor(() => userEvent.hover(a));
		/*
		await tick(); // FIXME: wait for network request
		const anchors = canvas.getAllByRole<HTMLAnchorElement>('link');
		const popup = anchors.find(anchor => anchor !== a)!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
		await expect(popup).toBeInTheDocument();
		await expect(popup).toHaveAttribute('href', 'https://joinfedired.org/');
		await expect(popup).toHaveTextContent('Fedired Hub');
		await expect(popup).toHaveTextContent('Fediredはオープンソースの分散型ソーシャルネットワーキングプラットフォームです。');
		await expect(popup).toHaveTextContent('joinfedired.org');
		const icon = within(popup).getByRole('img');
		await expect(icon).toBeInTheDocument();
		await expect(icon).toHaveAttribute('src', 'https://joinfedired.org/favicon.ico');
		 */
		await waitFor(() => userEvent.unhover(a));
	},
	args: {
		url: 'https://joinfedired.org/',
	},
	parameters: {
		layout: 'centered',
		msw: {
			handlers: [
				...commonHandlers,
				http.get('/url', () => {
					return HttpResponse.json({
						title: 'Fedired Hub',
						icon: 'https://joinfedired.org/favicon.ico',
						description: 'Fediredはオープンソースの分散型ソーシャルネットワーキングプラットフォームです。',
						thumbnail: null,
						player: {
							url: null,
							width: null,
							height: null,
							allow: [],
						},
						sitename: 'joinfedired.org',
						sensitive: false,
						url: 'https://joinfedired.org/',
					});
				}),
			],
		},
	},
} satisfies StoryObj<typeof MkUrl>;
