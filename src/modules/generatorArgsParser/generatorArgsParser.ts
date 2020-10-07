import { paramCase } from 'change-case'
import { prompt } from 'enquirer'
import { GeneratorArgConfigEntry, GeneratorArgs, GeneratorArgValue, GeneratorConfig } from '~/types'

export async function parseGeneratorArgs(generatorConfig: GeneratorConfig, argv: { [key: string]: string | boolean }) {
  let args = {}
  if (Array.isArray(generatorConfig.args)) {
    for (let argConfig of generatorConfig.args) {
      if (typeof argConfig === 'function') argConfig = await argConfig(args)
      if (argConfig == null) continue

      const arg = argv[paramCase(argConfig.name)]

      args[argConfig.name] = await parseGeneratorArg(argConfig, arg, args)
    }
  }

  return args
}

async function parseGeneratorArg(argConfig: GeneratorArgConfigEntry, arg: GeneratorArgValue, args: GeneratorArgs) {
  const validationResult = typeof argConfig.validate === 'function' ? await argConfig.validate(arg, args) : true

  if (
    arg == null ||
    (typeof validationResult === 'boolean' && !validationResult) ||
    (typeof validationResult === 'object' && !validationResult.isValid)
  ) {
    if (argConfig.prompt != null) {
      try {
        let answer: GeneratorArgValue
        if (typeof argConfig.prompt === 'function') {
          answer = await argConfig.prompt(args)
        } else {
          let promptOptions: Parameters<typeof prompt>[0]
          switch (argConfig.prompt.type) {
            case 'confirm':
              promptOptions = {
                type: 'confirm',
                name: argConfig.name,
                message: argConfig.prompt.message,
              }
              break

            case 'input':
              promptOptions = {
                type: 'input',
                name: argConfig.name,
                message: argConfig.prompt.message,
              }
              break

            case 'select':
              promptOptions = {
                type: 'autocomplete',
                name: argConfig.name,
                message: argConfig.prompt.message,
                choices: [...argConfig.prompt.choices],
              }
              break

            case 'multi-select':
              promptOptions = {
                type: 'autocomplete',
                name: argConfig.name,
                muliple: true,
                message: argConfig.prompt.message,
                choices: [...argConfig.prompt.choices],
              }
              break
          }

          const promptResult = await prompt({
            ...promptOptions,
            initial: argConfig.default ?? undefined,
          })
          answer = promptResult[argConfig.name]
        }

        return parseGeneratorArg(argConfig, answer, args)
      } catch (e) {
        throw new ParseGeneratorArgsPromptFailedError(argConfig.name)
      }
    }
    throw new ParseGeneratorArgsMissingArgError(argConfig.name)
  } else {
    return arg
  }
}

export class ParseGeneratorArgsPromptFailedError extends Error {
  constructor(argName: string) {
    super()

    this.argName = argName
    this.message = `The supplied value for arg: ${argName} is invalid, exiting...`
  }

  argName: string
}

export class ParseGeneratorArgsMissingArgError extends Error {
  constructor(argName: string) {
    super()

    this.argName = argName
    this.message = `No value supplied for arg: ${argName}, exiting...`
  }

  argName: string
}
