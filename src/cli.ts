import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'

import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync.js'
import ora from 'ora'
import sade from 'sade'
import { PackageJson } from 'type-fest'

const require = createRequire(import.meta.url)

interface Options {
	/** Path to JSON file in which to store the image data. */
	store?: string
}

/**
 * Basic CLI setup.
 *
 * @see https://github.com/lukeed/sade
 * @see https://github.com/sindresorhus/ora
 */
const prog = sade('lens')
const { version } = require('../package.json') as PackageJson

prog.version(version)

prog.command('add <src>')
	.describe('Process and store image metadata')
	.action(async (source: string, options: Options) => {
		let spinner = ora().start()
		let store = options.store || 'src/imagemeta.json'
		let adapter = new FileSync(path.resolve(store))
		let database = low(adapter)

		database.defaults({ library: [] })

		console.log({ source, options })

		spinner.stop()
	})

prog.parse(process.argv)
