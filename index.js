const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");


const { initRepo } = require("./controllers/init");
const { addFiles } = require("./controllers/add");
const { commitFiles } = require("./controllers/commit");
const { revertFiles } = require("./controllers/revert");
const { pushFiles } = require("./controllers/push");
const { pullFiles } = require("./controllers/pull");

yargs(hideBin(process.argv))
  .command(
    'init',
    'this initializes git',
    () => {},
    initRepo
  )
  .command(
    'add <file>',
    'this adds files to git',
    (yargs) => {
        yargs.positional('file', {
            describe: 'File to add',
            type: 'string',
            demandOption: true,
        })
    },
    addFiles
  )
  .command(
    'commit <message>',
    'this commits files to git',
    (yargs) => {
        yargs.positional('message', {
            describe: 'Commit message',
            type: 'string',
            demandOption: true,
        })
    },
    commitFiles
  )
  .command(
    'revert <commit>',
    'this reverts files to git',
    (yargs) => {
        yargs.positional('commit', {
            describe: 'Commit to revert',
            type: 'string',
            demandOption: true,
        })
    },
    revertFiles
  )
  .command(
    'push',
    'this pushes files to git',
    () => {},
    pushFiles
  )
  .command(
    'pull',
    'this pulls files from git',
    () => {},
    pullFiles
  )
  .demandCommand(1, 'You need at least one command')
  .help()
  .argv;
  


