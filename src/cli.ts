import * as path from 'path'

import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import ora from 'ora'
import sade from 'sade'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../package.json')

/**
 * Basic CLI setup.
 *
 * @see https://github.com/lukeed/sade
 * @see https://github.com/sindresorhus/ora
 */
const prog = sade('lens')

prog.version(version)

prog.command('add <src>')
    .describe('Process and store image metadata')
    .action(async (src, opts) => {
        let spinner = ora().start()
        let store = opts.store || 'src/imagemeta.json'
        let adapter = new FileSync(path.resolve(store))
        let db = low(adapter)

        db.defaults({ library: [] })

        console.log({ src, opts })

        spinner.stop()
    })

prog.parse(process.argv)
