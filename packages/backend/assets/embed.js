/*
 * SPDX-FileCopyrightText: Fedired * SPDX-License-Identifier: MIT
 */
//@ts-check
(() => {
	/** @type {NodeListOf<HTMLIFrameElement>} */
	const els = document.querySelectorAll('iframe[data-fedired-embed-id]');

	window.addEventListener('message', function (event) {
		els.forEach((el) => {
			if (event.source !== el.contentWindow) {
				return;
			}

			const id = el.dataset.fediredEmbedId;

			if (event.data.type === 'fedired:embed:ready') {
				el.contentWindow?.postMessage({
					type: 'fedired:embedParent:registerIframeId',
					payload: {
						iframeId: id,
					}
				}, '*');
			}
			if (event.data.type === 'fedired:embed:changeHeight' && event.data.iframeId === id) {
				el.style.height = event.data.payload.height + 'px';
			}
		});
	});
})();
