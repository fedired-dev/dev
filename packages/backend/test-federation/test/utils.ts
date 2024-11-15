import { deepStrictEqual, strictEqual } from 'assert';
import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import * as Fedired from 'fedired-js';
import { WebSocket } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const ADMIN_PARAMS = { username: 'admin', password: 'admin' };
const ADMIN_CACHE = new Map<Host, SigninResponse>();

await Promise.all([
	fetchAdmin('a.test'),
	fetchAdmin('b.test'),
]);

type SigninResponse = Omit<Fedired.entities.SigninFlowResponse & { finished: true }, 'finished'>;

export type LoginUser = SigninResponse & {
	client: Fedired.api.APIClient;
	username: string;
	password: string;
}

/** used for avoiding overload and some endpoints */
export type Request = <
	E extends keyof Fedired.Endpoints,
	P extends Fedired.Endpoints[E]['req'],
>(
	endpoint: E,
	params: P,
	credential?: string | null,
) => Promise<Fedired.api.SwitchCaseResponseType<E, P>>;

type Host = 'a.test' | 'b.test';

export async function sleep(ms = 200): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function signin(
	host: Host,
	params: Fedired.entities.SigninFlowRequest,
): Promise<SigninResponse> {
	// wait for a second to prevent hit rate limit
	await sleep(1000);

	return await (new Fedired.api.APIClient({ origin: `https://${host}` }).request as Request)('signin-flow', params)
		.then(res => {
			strictEqual(res.finished, true);
			if (params.username === ADMIN_PARAMS.username) ADMIN_CACHE.set(host, res);
			return res;
		})
		.then(({ id, i }) => ({ id, i }))
		.catch(async err => {
			if (err.code === 'TOO_MANY_AUTHENTICATION_FAILURES') {
				await sleep(Math.random() * 2000);
				return await signin(host, params);
			}
			throw err;
		});
}

async function createAdmin(host: Host): Promise<Fedired.entities.SignupResponse | undefined> {
	const client = new Fedired.api.APIClient({ origin: `https://${host}` });
	return await client.request('admin/accounts/create', ADMIN_PARAMS).then(res => {
		ADMIN_CACHE.set(host, {
			id: res.id,
			// @ts-expect-error FIXME: openapi-typescript generates incorrect response type for this endpoint, so ignore this
			i: res.token,
		});
		return res as Fedired.entities.SignupResponse;
	}).then(async res => {
		await client.request('admin/roles/update-default-policies', {
			policies: {
				/** TODO: @see https://github.com/fedired-dev/fedired/issues/14169 */
				rateLimitFactor: 0 as never,
			},
		}, res.token);
		return res;
	}).catch(err => {
		if (err.info.e.message === 'access denied') return undefined;
		throw err;
	});
}

export async function fetchAdmin(host: Host): Promise<LoginUser> {
	const admin = ADMIN_CACHE.get(host) ?? await signin(host, ADMIN_PARAMS)
		.catch(async err => {
			if (err.id === '6cc579cc-885d-43d8-95c2-b8c7fc963280') {
				await createAdmin(host);
				return await signin(host, ADMIN_PARAMS);
			}
			throw err;
		});

	return {
		...admin,
		client: new Fedired.api.APIClient({ origin: `https://${host}`, credential: admin.i }),
		...ADMIN_PARAMS,
	};
}

export async function createAccount(host: Host): Promise<LoginUser> {
	const username = crypto.randomUUID().replaceAll('-', '').substring(0, 20);
	const password = crypto.randomUUID().replaceAll('-', '');
	const admin = await fetchAdmin(host);
	await admin.client.request('admin/accounts/create', { username, password });
	const signinRes = await signin(host, { username, password });

	return {
		...signinRes,
		client: new Fedired.api.APIClient({ origin: `https://${host}`, credential: signinRes.i }),
		username,
		password,
	};
}

export async function createModerator(host: Host): Promise<LoginUser> {
	const user = await createAccount(host);
	const role = await createRole(host, {
		name: 'Moderator',
		isModerator: true,
	});
	const admin = await fetchAdmin(host);
	await admin.client.request('admin/roles/assign', { roleId: role.id, userId: user.id });
	return user;
}

export async function createRole(
	host: Host,
	params: Partial<Fedired.entities.AdminRolesCreateRequest> = {},
): Promise<Fedired.entities.Role> {
	const admin = await fetchAdmin(host);
	return await admin.client.request('admin/roles/create', {
		name: 'Some role',
		description: 'Role for testing',
		color: null,
		iconUrl: null,
		target: 'conditional',
		condFormula: {},
		isPublic: true,
		isModerator: false,
		isAdministrator: false,
		isExplorable: true,
		asBadge: false,
		canEditMembersByModerator: false,
		displayOrder: 0,
		policies: {},
		...params,
	});
}

export async function resolveRemoteUser(
	host: Host,
	id: string,
	from: LoginUser,
): Promise<Fedired.entities.UserDetailedNotMe> {
	const uri = `https://${host}/users/${id}`;
	return await from.client.request('ap/show', { uri })
		.then(res => {
			strictEqual(res.type, 'User');
			strictEqual(res.object.uri, uri);
			return res.object;
		});
}

export async function resolveRemoteNote(
	host: Host,
	id: string,
	from: LoginUser,
): Promise<Fedired.entities.Note> {
	const uri = `https://${host}/notes/${id}`;
	return await from.client.request('ap/show', { uri })
		.then(res => {
			strictEqual(res.type, 'Note');
			strictEqual(res.object.uri, uri);
			return res.object;
		});
}

export async function uploadFile(
	host: Host,
	user: { i: string },
	path = '../../test/resources/192.jpg',
): Promise<Fedired.entities.DriveFile> {
	const filename = path.split('/').pop() ?? 'untitled';
	const blob = new Blob([await readFile(join(__dirname, path))]);

	const body = new FormData();
	body.append('i', user.i);
	body.append('force', 'true');
	body.append('file', blob);
	body.append('name', filename);

	return await fetch(`https://${host}/api/drive/files/create`, { method: 'POST', body })
		.then(async res => await res.json());
}

export async function addCustomEmoji(
	host: Host,
	param?: Partial<Fedired.entities.AdminEmojiAddRequest>,
	path?: string,
): Promise<Fedired.entities.EmojiDetailed> {
	const admin = await fetchAdmin(host);
	const name = crypto.randomUUID().replaceAll('-', '');
	const file = await uploadFile(host, admin, path);
	return await admin.client.request('admin/emoji/add', { name, fileId: file.id, ...param });
}

export function deepStrictEqualWithExcludedFields<T>(actual: T, expected: T, excludedFields: (keyof T)[]) {
	const _actual = structuredClone(actual);
	const _expected = structuredClone(expected);
	for (const obj of [_actual, _expected]) {
		for (const field of excludedFields) {
			delete obj[field];
		}
	}
	deepStrictEqual(_actual, _expected);
}

export async function isFired<C extends keyof Fedired.Channels, T extends keyof Fedired.Channels[C]['events']>(
	host: Host,
	user: { i: string },
	channel: C,
	trigger: () => Promise<unknown>,
	type: T,
	// @ts-expect-error TODO: why getting error here?
	cond: (msg: Parameters<Fedired.Channels[C]['events'][T]>[0]) => boolean,
	params?: Fedired.Channels[C]['params'],
): Promise<boolean> {
	return new Promise<boolean>(async (resolve, reject) => {
		const stream = new Fedired.Stream(`wss://${host}`, { token: user.i }, { WebSocket });
		const connection = stream.useChannel(channel, params);
		connection.on(type as any, ((msg: any) => {
			if (cond(msg)) {
				stream.close();
				clearTimeout(timer);
				resolve(true);
			}
		}) as any);

		let timer: NodeJS.Timeout | undefined;

		await trigger().then(() => {
			timer = setTimeout(() => {
				stream.close();
				resolve(false);
			}, 500);
		}).catch(err => {
			stream.close();
			clearTimeout(timer);
			reject(err);
		});
	});
};

export async function isNoteUpdatedEventFired(
	host: Host,
	user: { i: string },
	noteId: string,
	trigger: () => Promise<unknown>,
	cond: (msg: Parameters<Fedired.StreamEvents['noteUpdated']>[0]) => boolean,
): Promise<boolean> {
	return new Promise<boolean>(async (resolve, reject) => {
		const stream = new Fedired.Stream(`wss://${host}`, { token: user.i }, { WebSocket });
		stream.send('s', { id: noteId });
		stream.on('noteUpdated', msg => {
			if (cond(msg)) {
				stream.close();
				clearTimeout(timer);
				resolve(true);
			}
		});

		let timer: NodeJS.Timeout | undefined;

		await trigger().then(() => {
			timer = setTimeout(() => {
				stream.close();
				resolve(false);
			}, 500);
		}).catch(err => {
			stream.close();
			clearTimeout(timer);
			reject(err);
		});
	});
};

export async function assertNotificationReceived(
	receiverHost: Host,
	receiver: LoginUser,
	trigger: () => Promise<unknown>,
	cond: (notification: Fedired.entities.Notification) => boolean,
	expect: boolean,
) {
	const streamingFired = await isFired(receiverHost, receiver, 'main', trigger, 'notification', cond);
	strictEqual(streamingFired, expect);

	const endpointFired = await receiver.client.request('i/notifications', {})
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		.then(([notification]) => notification != null ? cond(notification) : false);
	strictEqual(endpointFired, expect);
}
