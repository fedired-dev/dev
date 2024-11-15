
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execa } from 'execa';

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

await execa('pnpm', ['clean'], {
	cwd: _dirname + '/../',
	stdout: process.stdout,
	stderr: process.stderr,
});

await Promise.all([
	execa('pnpm', ['build-pre'], {
		cwd: _dirname + '/../',
		stdout: process.stdout,
		stderr: process.stderr,
	}),
	execa('pnpm', ['build-assets'], {
		cwd: _dirname + '/../',
		stdout: process.stdout,
		stderr: process.stderr,
	}),
	execa('pnpm', ['--filter', 'fedired-js', 'build'], {
		cwd: _dirname + '/../',
		stdout: process.stdout,
		stderr: process.stderr,
	}),
]);

await Promise.all([
	execa('pnpm', ['--filter', 'fedired-reversi', 'build'], {
		cwd: _dirname + '/../',
		stdout: process.stdout,
		stderr: process.stderr,
	}),
	execa('pnpm', ['--filter', 'fedired-bubble-game', 'build'], {
		cwd: _dirname + '/../',
		stdout: process.stdout,
		stderr: process.stderr,
	}),
]);

execa('pnpm', ['build-pre', '--watch'], {
	cwd: _dirname + '/../',
	stdout: process.stdout,
	stderr: process.stderr,
});

execa('pnpm', ['build-assets', '--watch'], {
	cwd: _dirname + '/../',
	stdout: process.stdout,
	stderr: process.stderr,
});

execa('pnpm', ['--filter', 'backend', 'dev'], {
	cwd: _dirname + '/../',
	stdout: process.stdout,
	stderr: process.stderr,
});

execa('pnpm', ['--filter', 'frontend-shared', 'watch'], {
	cwd: _dirname + '/../',
	stdout: process.stdout,
	stderr: process.stderr,
});

execa('pnpm', ['--filter', 'frontend', process.env.MK_DEV_PREFER === 'backend' ? 'watch' : 'dev'], {
	cwd: _dirname + '/../',
	stdout: process.stdout,
	stderr: process.stderr,
});

execa('pnpm', ['--filter', 'frontend-embed', process.env.MK_DEV_PREFER === 'backend' ? 'watch' : 'dev'], {
	cwd: _dirname + '/../',
	stdout: process.stdout,
	stderr: process.stderr,
});

execa('pnpm', ['--filter', 'sw', 'watch'], {
	cwd: _dirname + '/../',
	stdout: process.stdout,
	stderr: process.stderr,
});

execa('pnpm', ['--filter', 'fedired-js', 'watch'], {
	cwd: _dirname + '/../',
	stdout: process.stdout,
	stderr: process.stderr,
});

execa('pnpm', ['--filter', 'fedired-reversi', 'watch'], {
	cwd: _dirname + '/../',
	stdout: process.stdout,
	stderr: process.stderr,
});

execa('pnpm', ['--filter', 'fedired-bubble-game', 'watch'], {
	cwd: _dirname + '/../',
	stdout: process.stdout,
	stderr: process.stderr,
});
