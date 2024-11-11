import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

/*
 demandOption: true → yargs will show help message in the console if the argument is not provided.
 */
export const testArgs = () => {
  return yargs(hideBin(process.argv)).options({
    m: {type: 'string', demandOption: true}
  }).parseSync()
};

export const createArgs = () => {
  return yargs(hideBin(process.argv)).options({
    skeleton: {type: 'string', demandOption: true},
    displayName: {type: 'string', demandOption: true},
    finalName: {type: 'string', demandOption: true},
    shortName: {type: 'string', demandOption: true},
    capitalCamel: {type: 'string', demandOption: true},
    underscore: {type: 'string', demandOption: true},
    moduleName: {type: 'string', demandOption: false},
  }).parseSync()
};

export const deployCompiledSftpArgs = () => {
  return yargs(hideBin(process.argv)).options({
    server: {type: 'string', demandOption: true}
  }).parseSync()
};
