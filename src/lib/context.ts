import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import url from 'node:url'

import { isPlainObject } from 'is-plain-object'
import { packageConfig, packageJsonPath } from 'pkg-conf'

import type { LensConfig } from '../../types'

const NO_SUCH_FILE = 'no lens.config.js file'
const MISSING_DEFAULT_EXPORT = 'missing default export'

async function importConfig({
	configFile,
	fileForErrorMessage,
}: {
	configFile: string
	fileForErrorMessage: string
}) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	let { default: config = MISSING_DEFAULT_EXPORT } = await import(
		String(url.pathToFileURL(configFile))
	)

	if (config === MISSING_DEFAULT_EXPORT) {
		throw new Error(`${fileForErrorMessage} must have a default export`)
	}

	return config as LensConfig
}

async function loadConfigFile({
	projectDirectory,
	configFile,
}: {
	projectDirectory: string
	configFile: string
}) {
	if (!fs.existsSync(configFile)) {
		return null
	}

	let fileForErrorMessage = path.relative(projectDirectory, configFile)
	try {
		return {
			config: await importConfig({ configFile, fileForErrorMessage }),
			configFile,
			fileForErrorMessage,
		}
	} catch (error: unknown) {
		throw Object.assign(
			// @ts-expect-error - This actually works.
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			new Error(`Error loading ${fileForErrorMessage}: ${error.message}`),
			{ parent: error }
		)
	}
}

function resolveConfigFile(configFile: string) {
	if (configFile) {
		configFile = path.resolve(configFile) // Relative to CWD

		if (
			!configFile.endsWith('.js') &&
			!configFile.endsWith('.cjs') &&
			!configFile.endsWith('.mjs')
		) {
			throw new Error(
				'Config files must have .js, .cjs or .mjs extensions'
			)
		}
	}

	return configFile
}

const gitScmFile = '.git'

async function findRepoRoot(fromDirectory: string) {
	let { root } = path.parse(fromDirectory)
	let directory = fromDirectory
	while (root !== directory) {
		try {
			// eslint-disable-next-line no-await-in-loop
			let stat = await fs.promises.stat(path.join(directory, gitScmFile))
			if (stat.isFile() || stat.isDirectory()) {
				return directory
			}
		} catch {}

		directory = path.dirname(directory)
	}

	return root
}

interface LoadConfigParameters {
	configFile?: string
	resolveFrom?: string
	defaults?: Record<string, unknown>
}

export async function loadConfig({
	configFile,
	resolveFrom = process.cwd(),
	defaults = {},
}: LoadConfigParameters = {}) {
	let packageConfig_ = await packageConfig('lens', { cwd: resolveFrom })
	let filepath = packageJsonPath(packageConfig_)
	let projectDirectory =
		filepath === undefined ? resolveFrom : path.dirname(filepath)

	let repoRoot = await findRepoRoot(projectDirectory)

	// Conflicts are only allowed when an explicit config file is provided.
	let allowConflictWithPackageJson = Boolean(configFile)
	configFile = resolveConfigFile(configFile)

	let fileConfig: LensConfig | typeof NO_SUCH_FILE = NO_SUCH_FILE
	let fileForErrorMessage: string
	let conflicting = []
	if (configFile) {
		let loaded = await loadConfigFile({ projectDirectory, configFile })
		if (loaded !== null) {
			;({ config: fileConfig, fileForErrorMessage } = loaded)
		}
	} else {
		let searchDirectory = projectDirectory
		let stopAt = path.dirname(repoRoot)
		do {
			// eslint-disable-next-line no-await-in-loop
			let results = await Promise.all([
				loadConfigFile({
					projectDirectory,
					configFile: path.join(searchDirectory, 'lens.config.js'),
				}),
				loadConfigFile({
					projectDirectory,
					configFile: path.join(searchDirectory, 'lens.config.cjs'),
				}),
				loadConfigFile({
					projectDirectory,
					configFile: path.join(searchDirectory, 'lens.config.mjs'),
				}),
			])

			;[
				{ config: fileConfig, fileForErrorMessage, configFile } = {
					config: NO_SUCH_FILE,
					fileForErrorMessage: undefined,
					configFile: undefined,
				},
				...conflicting
			] = results.filter((result) => result !== null)

			searchDirectory = path.dirname(searchDirectory)
		} while (fileConfig === NO_SUCH_FILE && searchDirectory !== stopAt)
	}

	// eslint-disable-next-line etc/prefer-less-than
	if (conflicting.length > 0) {
		throw new Error(
			`Conflicting configuration in ${fileForErrorMessage} and ${conflicting
				.map(({ fileForErrorMessage }) => fileForErrorMessage)
				.join(' & ')}`
		)
	}

	if (fileConfig !== NO_SUCH_FILE) {
		if (allowConflictWithPackageJson) {
			packageConfig_ = {}
			// eslint-disable-next-line etc/prefer-less-than
		} else if (Object.keys(packageConfig_).length > 0) {
			throw new Error(
				`Conflicting configuration in ${fileForErrorMessage} and package.json`
			)
		}

		if (!isPlainObject(fileConfig) && typeof fileConfig !== 'function') {
			throw new TypeError(
				`${fileForErrorMessage} must export a plain object or factory function`
			)
		}

		if ('lens' in fileConfig) {
			throw new Error(
				`Encountered 'lens' property in ${fileForErrorMessage}; avoid wrapping the configuration`
			)
		}
	}

	return {
		...defaults,
		...(fileConfig as LensConfig),
		...packageConfig_,
		projectDirectory,
		configFile,
	}
}
