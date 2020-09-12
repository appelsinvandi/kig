import { prompt } from 'enquirer'

export type GeneratorArgValue = string | boolean
export type GeneratorArgs = { [key: string]: GeneratorArgValue }
type PromptOptions = Omit<Parameters<typeof prompt>[0], 'name'>
type PromptOptionsFunction = (args: GeneratorArgs) => PromptOptions

export interface ArgValidationObject {
  /**
   * Describes wether or not the arg value is valid.
   */
  isValid: boolean
  /**
   * If the arg is invalid, this reason will be supplied to the user.
   */
  reason?: string
}

export interface GeneratorArgConfigEntry {
  /**
   * The arg name, that you'll use to refer to the arg in the templates. When used in the CLI, it will be converted to dash-case.
   */
  name: string
  /**
   * A short description to show in the commands help page.
   */
  description?: string
  /**
   * Default value for tge argument, to be used if the argument is missing.
   */
  default?: GeneratorArgValue
  /**
   * Options for showing a prompt if the arg is invalid or missing.
   */
  promptOptions?: PromptOptions | PromptOptionsFunction
  /**
   * A function to validate the supplied value of the arg.
   */
  validate?: (arg: GeneratorArgValue, args: GeneratorArgs) => boolean | ArgValidationObject
}
