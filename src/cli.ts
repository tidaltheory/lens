import ora from 'ora'
import sade from 'sade'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../package.json')

sade('lens')
    .version(version)
    .describe('Process and store image metadata')
    .command('add <src>')
    .action(async (src, dest, opts) => {
        let spinner = ora().start()

        console.log({ src, dest, opts })

        spinner.stop()
    })
    .parse(process.argv)
