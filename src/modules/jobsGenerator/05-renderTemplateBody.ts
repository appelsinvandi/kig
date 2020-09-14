import ejs from 'ejs'
import * as changeCase from 'change-case'
import { GeneratorArgs, TemplateHead } from '~/types'

export function renderTemplateBody(templateHead: TemplateHead, templateBody: string, args: GeneratorArgs) {
  try {
    return ejs.render(templateBody, { ...args, ...(templateHead.variables ?? {}), h: { changeCase } })
  } catch (err) {
    throw new RenderTemplateBodyError(RenderTemplateBodyErrorCode.MISSING_ARG)
  }
}

export enum RenderTemplateBodyErrorCode {
  UNKNOWN,
  MISSING_ARG,
}
export class RenderTemplateBodyError extends Error {
  readonly code: RenderTemplateBodyErrorCode

  constructor(code: RenderTemplateBodyErrorCode) {
    super()

    this.code = code
  }
}
