import ejs from 'ejs'
import * as changeCase from 'change-case'
import { GeneratorArgs } from '~/types'

export function renderTemplateHead(templateHead: string, args: GeneratorArgs) {
  try {
    return ejs.render(templateHead, { ...args, h: { changeCase } })
  } catch (err) {
    throw new RenderTemplateHeadError(RenderTemplateHeadErrorCode.MISSING_ARG)
  }
}

export enum RenderTemplateHeadErrorCode {
  UNKNOWN,
  MISSING_ARG,
}
export class RenderTemplateHeadError extends Error {
  readonly code: RenderTemplateHeadErrorCode

  constructor(code: RenderTemplateHeadErrorCode) {
    super()

    this.code = code
  }
}
