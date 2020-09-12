import { Generator_Init } from './Generator_Init'
import { Generator_Run } from './Generator_Run'
import { History_Undo } from './History_Undo'

const argv = require('yargs-parser')(process.argv.slice(2))
start()

async function start() {
  console.log()
  if (argv._[0] === 'history:undo') {
    await History_Undo()
  } else if (argv._[0] === 'generator:init') {
    await Generator_Init()
  } else {
    await Generator_Run()
  }
  console.log()
}
