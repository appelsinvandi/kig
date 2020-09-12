import { GeneratorArgConfigEntry } from './GeneratorArg'
import { GeneratorHooks } from './GeneratorHooks'

export interface GeneratorConfig {
  /**
   * The name of the generator,
   */
  name: string
  /**
   * A short description of the generator, to be shown on the help page.
   */
  description?: string
  /**
   * List of generator arguments required of the user.
   */
  args?: GeneratorArgConfigEntry[]
  /**
   * Used for hooking into the generator lifecycle.
   */
  hooks?: GeneratorHooks
}
