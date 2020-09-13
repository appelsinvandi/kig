import { prompt } from 'enquirer'
import { camelCase } from 'change-case'
import { discoverGenerators } from '~/utils/discover'
import { getGeneratorJobs } from '~/modules/jobsGenerator'
import { createHistoryEntry } from '~/modules/history'
import { executeJobQueue } from '~/modules/executeJobQueue'
import { GeneratorArgs } from '~/types'

const argv = require('yargs-parser')(process.argv.slice(2))

export async function Generator_Run() {
  const [generatorDirPath, generatorConfig] = await (async () => {
    const modelNameArg = argv._[0]
    if (modelNameArg != null) {
      const paramGenerator = await findGenerator(modelNameArg)

      if (paramGenerator != null) return paramGenerator
      else console.error('Error: Supplied generator was not found, please select one from the list.')
    }
    const selectedGeneratorName = await selectGenerator()
    return (await findGenerator(selectedGeneratorName))!
  })()
  delete argv._

  // Hook
  if (generatorConfig.hooks?.onStart != null) generatorConfig.hooks?.onStart()

  // Hook
  if (generatorConfig.hooks?.beforeArgsParser != null) await generatorConfig.hooks.beforeArgsParser(argv)

  let args: GeneratorArgs = {}
  if (Array.isArray(generatorConfig.args)) {
    for (const argConfig of generatorConfig.args) {
      if (
        argv[argConfig.name] == null ||
        (typeof argConfig.validate === 'function' && argConfig.validate(argv[argConfig.name], argv))
      ) {
        if (argConfig.promptOptions != null) {
          const answer = await prompt({
            name: argConfig.name,
            ...(typeof argConfig.promptOptions === 'function'
              ? argConfig.promptOptions(argv)
              : argConfig.promptOptions),
          }) // TODO: Handle error
          args[argConfig.name] = answer[argConfig.name]
        }
        // TODO: Error
      } else {
        args[argConfig.name] = argv[argConfig.name]
      }
    }
  }

  // Hook
  if (generatorConfig.hooks?.afterArgsParser != null) args = (await generatorConfig.hooks.afterArgsParser(args)) ?? args

  const command =
    'kig' +
    ' ' +
    generatorConfig.name +
    ' ' +
    Object.entries(args)
      .map(([k, v]) => (typeof v === 'string' && v.includes(' ') ? `--${k} "${v}"` : `--${k} ${v}`))
      .join(' ')

  const jobs = await getGeneratorJobs(args, generatorDirPath, generatorConfig)

  createHistoryEntry(jobs, command)
  executeJobQueue(jobs)

  // Hook
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
