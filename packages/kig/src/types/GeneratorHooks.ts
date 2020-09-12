import { ValidationResult } from 'joi'

export interface GeneratorHooks {
  beforeArgsParser?: (args: { [key: string]: string }) => { [key: string]: string | boolean }
  afterArgsParser?: (args: { [key: string]: string | boolean }) => { [key: string]: string | boolean }
  beforeArgsHandler?: (args: { [key: string]: string | boolean }) => { [key: string]: string | boolean }
  afterArgsHandler?: (args: { [key: string]: string | boolean }) => { [key: string]: string | boolean }
  beforeTemplateConfigValidation?: (args: { [key: string]: string | boolean }) => void
  afterTemplateConfigValidation?: (
    args: { [key: string]: string | boolean },
    validationResult: ValidationResult
  ) => void
  beforeRender?: (args: { [key: string]: string | boolean }) => void
  afterRender?: (args: { [key: string]: string | boolean }) => void
}
