import { expectType } from 'tsd';
import * as Fedired from '../src/index.js';

describe('API', () => {
	test('success', async () => {
		const cli = new Fedired.api.APIClient({
			origin: 'https://fedired.test',
			credential: 'TOKEN'
		});
		const res = await cli.request('meta', { detail: true });
		expectType<Fedired.entities.MetaResponse>(res);
	});

	test('conditional response type (meta)', async () => {
		const cli = new Fedired.api.APIClient({
			origin: 'https://fedired.test',
			credential: 'TOKEN'
		});

		const res = await cli.request('meta', { detail: true });
		expectType<Fedired.entities.MetaResponse>(res);

		const res2 = await cli.request('meta', { detail: false });
		expectType<Fedired.entities.MetaResponse>(res2);

		const res3 = await cli.request('meta', { });
		expectType<Fedired.entities.MetaResponse>(res3);

		const res4 = await cli.request('meta', { detail: true as boolean });
		expectType<Fedired.entities.MetaResponse>(res4);
	});

	test('conditional response type (users/show)', async () => {
		const cli = new Fedired.api.APIClient({
			origin: 'https://fedired.test',
			credential: 'TOKEN'
		});

		const res = await cli.request('users/show', { userId: 'xxxxxxxx' });
		expectType<Fedired.entities.UserDetailed>(res);

		const res2 = await cli.request('users/show', { userIds: ['xxxxxxxx'] });
		expectType<Fedired.entities.UserDetailed[]>(res2);
	});
});
