import { prompt } from 'enquirer'
import { camelCase, paramCase } from 'change-case'
import { discoverGenerators } from '~/utils/discover'
import { getGeneratorJobs } from '~/modules/jobsGenerator'
import { createHistoryEntry } from '~/modules/history'
import { executeJobQueue } from '~/modules/executeJobQueue'
import { parseGeneratorArgs } from '~/modules/generatorArgsParser/generatorArgsParser'
import { GeneratorArgs, GeneratorConfig } from '~/types'

const argv = require('yargs-parser')(process.argv.slice(2))

export async function Generator_Run() {
  // Chose template
  const templateNameArg = argv._[0]
  if (templateNameArg != null) {
    const paramGenerator = await findGenerator(templateNameArg)

    if (paramGenerator != null) return paramGenerator
    else console.error('Error: Supplied generator was not found, please select one from the list.')
  }
  const selectedGeneratorName = await selectGenerator()
  const [generatorDirPath, generatorConfig] = (await findGenerator(selectedGeneratorName))!
  delete argv._

  // Start
  if (generatorConfig.hooks?.onStart != null) generatorConfig.hooks?.onStart()

  // Parse args
  if (generatorConfig.hooks?.beforeArgsParser != null) await generatorConfig.hooks.beforeArgsParser(argv)
  let args: GeneratorArgs
  try {
    args = await parseGeneratorArgs(generatorConfig, argv)
  } catch (e) {
    console.log(e)
    process.exit(0)
  }
  const command = getFullCommand(generatorConfig, args)
  console.log('Running command:', command, '\n')
  if (generatorConfig.hooks?.afterArgsParser != null) args = (await generatorConfig.hooks.afterArgsParser(args)) ?? args

  // Read the templates and generate the job queue
  const jobs = await getGeneratorJobs(args, generatorDirPath, generatorConfig)

  // Create history entry if the history is enabled
  await createHistoryEntry(jobs, command)

  // Process the previously created job queue
  executeJobQueue(jobs)

  // End
  if (generatorConfig.hooks?.onEnd != null) await generatorConfig.hooks?.onEnd()
}

async function selectGenerator() {
  const answer = (await prompt({
    type: 'autocomplete',
    name: 'generators',
    message: 'Which generator do you wish to run?',
    choices: (await discoverGenerators()).map(([, gConfig]) => ({
      name: gConfig.name,
      message: gConfig.name,
    })),
  })) as any
  return answer.generators
}

async function findGenerator(generatorName: string) {
  const availableGenerators = await discoverGenerators()
  return availableGenerators.find(([, gConfig]) => camelCase(gConfig.name) === camelCase(generatorName))
}

function getFullCommand(generatorConfig: GeneratorConfig, args: GeneratorArgs) {
  const commandGeneratorName = generatorConfig.name.includes(' ') ? `"${generatorConfig.name}"` : generatorConfig.name
  const commandArgs = Object.entries(args)
    .map(([k, v]) => {
      const argKey = paramCase(k)
      const argValue = typeof v === 'string' && v.includes(' ') ? `"${v}"` : v
      return `--${argKey} ${argValue}`
    })
    .join(' ')
  const command = `kig ${commandGeneratorName} ${commandArgs}`

  return command
}
