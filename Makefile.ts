import {spawn, ChildProcess} from 'child_process';
import fs from 'fs';
import {terminal} from 'terminal-kit';

import consoleLogger from 'src/lib/logger/console-logger';
import {getAbsolutePath} from 'src/utils/fs';

const getBin = (name: string): string => {
	return getAbsolutePath('./node_modules/.bin/' + name);
};

const getEnv = (overrides: ISimpleObject = {}): ISimpleObject => {
	return Object.assign({}, process.env, overrides);
};

const OUT_DIR = 'build';
const TZ = 'UTC';
const TSNODE_ARGS = ['--files=true', '-r', 'tsconfig-paths/register'];

const DOCKER_IMAGE_VERSION = JSON.parse(fs.readFileSync(getAbsolutePath('./package.json'), 'utf-8')).version;
const DOCKER_HUB = 'motivationzone/dbservice'
const DOCKER_TAG = `${DOCKER_HUB}:${DOCKER_IMAGE_VERSION}`;
const DOCKER_TAG__STRESS = `${DOCKER_HUB}-stress:${DOCKER_IMAGE_VERSION}`
const DOCKER_NAME = 'mz-db-service';

interface ISimpleObject {
	[key: string]: string;
}

interface ICommandProperties {
	cmd: string;
	args: string[];
	env: ISimpleObject;
	background?: boolean;
}

interface ICommand {
	[key: string]: ICommandProperties | ICommandProperties[];
}

const MAKE_COMMANDS: ICommand = {
	prune: {
		cmd: 'npm',
		args: ['prune', '--production'],
		env: {}
	},
	build: {
		cmd: getBin('tsc'),
		args: [],
		env: {}
	},
	'build-watch': {
		cmd: getBin('tsc'),
		args: ['--watch'],
		env: {}
	},
	'clean-build': {
		cmd: 'rm',
		args: ['-rf', getAbsolutePath('./build')],
		env: {}
	},
	'lint-staged': {
		cmd: getBin('lint-staged'),
		args: ['-c', getAbsolutePath('./.lintstagedrc.json')],
		env: {}
	},
	'lint-src': {
		cmd: getBin('tslint'),
		args: ['-c', getAbsolutePath('./tslint.json'), getAbsolutePath('./src/**/*.ts')],
		env: {}
	},
	'lint-tools': {
		cmd: getBin('tslint'),
		args: ['-c', getAbsolutePath('./tslint.json'), getAbsolutePath('./tools/**/*.ts')],
		env: {}
	},
	'lint-tests': {
		cmd: getBin('tslint'),
		args: ['-c', getAbsolutePath('./tslint.tests.json'), getAbsolutePath('./tests/**/*.ts')],
		env: {}
	},
	'server-dev': {
		cmd: getBin('nodemon'),
		args: [
			'--exec',
			`"${getBin('ts-node')} ${TSNODE_ARGS.join(' ')} ${getAbsolutePath('./src/app.ts')}"`,
			'-w', `${getAbsolutePath('./src')},${getAbsolutePath('./configs')}`,
			'-e', '"ts"'
		],
		env: {}
	},
	'server-run': {
		cmd: 'node',
		args: [getAbsolutePath(`./${OUT_DIR}/src/app.js`)],
		env: getEnv({
			NODE_PATH: OUT_DIR,
			TZ: TZ
		})
	},
	'test-fill': {
		cmd: getBin('ts-node'),
		args: [
			...TSNODE_ARGS,
			getAbsolutePath(`./tests/fill/index.ts`)
		],
		env: getEnv({
			NODE_PATH: OUT_DIR,
			TZ: TZ
		})
	},
	'test-fill__func': {
		cmd: 'make',
		args: ['test-fill'],
		env: getEnv({
			TEST_TYPE: 'functional'
		})
	},
	'test-fill__stress': [
		{
			cmd: 'make',
			args: ['server-dev'],
			env: {},
			background: true
		},
		{
			cmd: 'make',
			args: ['test-fill'],
			env: getEnv({
				TEST_TYPE: 'stress'
			})
		}
	],
	'test-func': [
		{
			cmd: 'make',
			args: ['build'],
			env: {}
		},
		{
			cmd: 'make',
			args: ['server-run'],
			env: {},
			background: true
		},
		{
			cmd: 'make',
			args: ['test-fill__func'],
			env: {}
		},
		{
			cmd: getBin('mocha'),
			args: [
				getAbsolutePath(`./${OUT_DIR}/tests/**/*.test.js`),
				'--exit'
			],
			env: getEnv({
				NODE_PATH: OUT_DIR,
				TZ: TZ
			})
		},
		{
			cmd: 'make',
			args: ['clean-build'],
			env: {}
		}
	],
	'test-stress__docker-build': {
		cmd: 'docker',
		args: [
			'build',
			'-t', DOCKER_TAG__STRESS,
			'-f', getAbsolutePath('./Dockerfile.stress'),
			'.'
		],
		env: {}
	},
	'test-stress__tank-run': {
		cmd: 'docker',
		args: [
			'run',
			'-v', `${getAbsolutePath('./')}:/var/loadtest`,
			'-v', `{e{SSH_AUTH_SOCK}}:/ssh-agent`,
			'-e', 'SSH_AUTH_SOCK=/ssh-agent',
			'--net', 'host',
			'-it',
			'--entrypoint', '/bin/bash',
			'direvius/yandex-tank'
		],
		env: getEnv()
	},
	'test-stress__ammo-generate': [
		{
			cmd: 'make',
			args: ['server-dev'],
			env: {},
			background: true
		},
		{
			cmd: getBin('ts-node'),
			args: [
				...TSNODE_ARGS,
				getAbsolutePath('./tests/stress/ammo-generator.ts')
			],
			env: {}
		}
	],
	'test-stress__dump': {
		cmd: 'pg_dump',
		args: ['motivation_zone', '>', 'motivation_zone.bak'],
		env: {}
	},
	'tools-generate-api-doc': {
		cmd: getBin('ts-node'),
		args: [
			...TSNODE_ARGS,
			getAbsolutePath('./tools/api-generator/generate.ts')
		],
		env: {}
	},
	'tools-generate-token': {
		cmd: getBin('ts-node'),
		args: [
			...TSNODE_ARGS,
			getAbsolutePath('./tools/generate-token.ts')
		],
		env: {}
	},
	'tools-migration-concat': {
		cmd: getBin('ts-node'),
		args: [
			...TSNODE_ARGS,
			getAbsolutePath('./tools/database/pgsql-concat.ts')
		],
		env: {}
	},
	'deploy-testing': {
		cmd: getBin('ts-node'),
		args: [
			...TSNODE_ARGS,
			getAbsolutePath('./deploy/deploy-testing.ts')
		],
		env: getEnv()
	},
	'deploy-production': {
		cmd: getBin('ts-node'),
		args: [
			...TSNODE_ARGS,
			getAbsolutePath('./tools/deploy-production.ts')
		],
		env: getEnv()
	},
	'docker-build': {
		cmd: 'docker',
		args: [
			'build',
			'-t', DOCKER_TAG,
			'.'
		],
		env: {}
	},
	'docker-login': {
		cmd: 'docker',
		args: [
			'login',
			'-u', '{e{MZ_DB_SERVICE_DOCKER_USER}}',
			'-p', '{e{MZ_DB_SERVICE_DOCKER_PASS}}'
		],
		env: getEnv()
	},
	'docker-push': {
		cmd: 'docker',
		args: ['push', DOCKER_TAG],
		env: {}
	},
	'docker-pull': {
		cmd: 'docker',
		args: ['pull', DOCKER_TAG],
		env: {}
	},
	'docker-run': [
		{
			cmd: 'docker',
			args: [
				'rm', '-f',
				`$(docker ps --filter "name=${DOCKER_NAME}" -q -a)`,
				'||', 'true'
			],
			env: getEnv()
		},
		{
			cmd: 'docker',
			args: [
				'run', '-d',
				'-e', `"NODEJS_ENV={e{NODEJS_ENV}}"`,
				'-e', `"MZ_DB_SERVICE_PRIVATE_KEY={e{MZ_DB_SERVICE_PRIVATE_KEY}}"`,
				'--name', DOCKER_NAME,
				'-v', '/usr/share/motivation-zone/db/db.yaml:/usr/local/app/configs/db/db.yaml',
				'-p', '5000:80',
				'{{image}}'
			],
			env: getEnv()
		}
	],
	'docker-run-dev': {
		cmd: 'docker',
		args: [
			'run', '-it',
			'--memory={e{DOCKER_MEMORY}}',
			'--cpus={e{DOCKER_CPU}}',
			'-e', `"NODEJS_ENV={e{NODEJS_ENV}}"`,
			'-e', `"MZ_DB_SERVICE_PRIVATE_KEY={e{MZ_DB_SERVICE_PRIVATE_KEY}}"`,
			'-e', `"MZ_DB_SERVICE_TOKEN={e{MZ_DB_SERVICE_TOKEN}}"`,
			'-v', `${getAbsolutePath('./configs/db/db.yaml')}:/usr/local/app/configs/db/db.yaml`,
			'-v', `${getAbsolutePath('./stress-logs')}:/usr/local/app/logs`,
			'-p', '5000:80',
			'{{image}}'
		],
		env: getEnv({
			NODEJS_ENV: 'development',
			DOCKER_MEMORY: '4G',
			DOCKER_CPU: '2'
		})
	},
	'docker-run-testing': {
		cmd: 'make',
		args: ['docker-run'],
		env: getEnv({
			NODEJS_ENV: 'testing'
		})
	},
	'docker-run-production': {
		cmd: 'make',
		args: ['docker-run'],
		env: getEnv({
			NODEJS_ENV: 'production'
		})
	},
	'docker-run-stress-dev': {
		cmd: 'make',
		args: ['docker-run-dev'],
		env: getEnv({
			NODEJS_ENV: 'stress',
		})
	}
};

const run = async (command: ICommandProperties, isBackground?: boolean): Promise<void> => {
	const cmdName = `${command.cmd} ${command.args.join(' ').trim()}`;
	consoleLogger.ok('Command start:');
	consoleLogger.info(cmdName);

	return await new Promise((resolve) => {
		const child = spawn(command.cmd, command.args, {
			env: Object.keys(command.env).length === 0 ? undefined : command.env,
			shell: true,
			stdio: 'inherit'
		});

		if (isBackground) {
			backgroundProcess.push(child);
		}

		child.on('close', (code) => {
			const message = `Command end [${code}]:`;
			const write = code !== 0 ? consoleLogger.error : consoleLogger.ok;
			write(message);
			consoleLogger.info(cmdName);
			resolve();
		});
	});
};

interface IGetCommandsParams {
	commandName: string;
	commandArgs: Record<string, string>;
	env: ISimpleObject;
	background?: boolean;
}

const getCommands = (params: IGetCommandsParams): ICommandProperties[] => {
	const {commandName, commandArgs, env, background} = params;
	const commandProps = MAKE_COMMANDS[commandName];
	if (!commandProps) {
		throw Error('Command wasn\'t found');
	}

	const commandsProps = Array.isArray(commandProps) ? commandProps : [commandProps]

	const commands = commandsProps.reduce((res, commandProps) => {
		commandProps.env = Object.assign({}, commandProps.env, env);
		commandProps.background = background || commandProps.background;

		if (commandProps.cmd === 'make') {
			const commands = getCommands({
				commandName: commandProps.args[0],
				commandArgs,
				env: commandProps.env,
				background: commandProps.background
			});
			res.push(...commands);
		} else {
			res.push(commandProps);
		}
		return res;
	}, [] as ICommandProperties[]).map((command) => {
		command.args = command.args.map((arg) => {
			// Take args from ARGS
			Object.keys(commandArgs).forEach((key) => {
				arg = arg.replace(`{{${key}}}`, commandArgs[key]);
			});

			// Take env args from environment
			Object.keys(command.env).forEach((key) => {
				arg = arg.replace(`{e{${key}}}`, command.env[key]);
			});
			return arg;
		});
		return command;
	});

	return commands;
};

const parseCommandArgs = (args: string): Record<string, string> => {
	if (!args) {
		return {};
	}

	const pairs = args.split(',');
	return pairs.reduce((res, pair) => {
		const [key, value] = pair.split('=');
		res[key] = value;
		return res;
	}, {} as Record<string, string>);
};

const backgroundProcess: ChildProcess[] = [];
(async () => {
	terminal.clear();

	const args = process.argv.slice(2);
	const commandName = args[0];
	const commandArgs = parseCommandArgs(args[1]);

	try {
		const commands = getCommands({commandName, commandArgs, env: {}});
		for (let i = 0; i < commands.length; i++) {
			const command = commands[i];
			command.background ? run(command, true) : await run(command);
		}
	} catch (err) {
		consoleLogger.error(err);
	}

	consoleLogger.info('\n\n')

	backgroundProcess.forEach((child) => child.kill('SIGINT'));
	process.exit();
})();