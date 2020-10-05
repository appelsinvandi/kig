import { PromptOptions } from './GeneratorPromptOptions'

export type GeneratorArgValue = string | boolean
export type GeneratorArgs = { [key: string]: GeneratorArgValue }

type CustomPromptFunction = (args: GeneratorArgs) => GeneratorArgValue | Promise<GeneratorArgValue>
type ArgValidationFunction = (
  arg: GeneratorArgValue,
  args: GeneratorArgs
) => boolean | ArgValidationObject | Promise<boolean | ArgValidationObject>

/**
 * Function that returns the arg config entry.
 * @param args The arguments that has been determined so far.
 */
export type GeneratorArgConfigEntryFunction = (
  args: GeneratorArgs
) => GeneratorArgConfigEntry | Promise<GeneratorArgConfigEntry>
export interface GeneratorArgConfigEntry {
  /**
   * The arg name, that you'll use to refer to the arg in the templates.
   */
  name: string
  /**
   * A short description to show in the commands help page.
   */
  description?: string
  /**
   * Default value for the argument, to be used if the argument is missing.
   */
  default?: GeneratorArgValue
  /**
   * Options for showing a prompt if the arg is invalid or missing.
   */
  prompt?: PromptOptions | CustomPromptFunction
  /**
   * A function to validate the supplied value of the arg.
   */
  validate?: ArgValidationFunction
}

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
