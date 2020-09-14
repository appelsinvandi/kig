import { prompt } from 'enquirer'

// @ts-ignore
const argv = require('yargs-parser')(process.argv.slice(2))

export async function Generator_Init() {
  try {
    // @ts-ignore
    const args = (await prompt({
      name: 'generatorName',
      type: 'input',
      message: 'Please provide the desired name of the generator:',
    })) as { generatorName: string }
  } catch (err) {}

  // WIP
}
