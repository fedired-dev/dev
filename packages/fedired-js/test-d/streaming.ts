import { expectType } from 'tsd';
import * as Fedired from '../src/index.js';

describe('Streaming', () => {
	test('emit type', async () => {
		const stream = new Fedired.Stream('https://fedired.test', { token: 'TOKEN' });
		const mainChannel = stream.useChannel('main');
		mainChannel.on('notification', notification => {
			expectType<Fedired.entities.Notification>(notification);
		});
	});
});
