import YAML from 'js-yaml'
import { TemplateHead } from '~/types'

export function parseTemplateHead(templateHead: string) {
  try {
    return YAML.safeLoad(templateHead) as TemplateHead
  } catch (err) {
    throw new ParseTemplateHeadError(ParseTemplateHeadErrorCode.INVALID_TEMPLATE_HEAD_FORMAT)
  }
}

export enum ParseTemplateHeadErrorCode {
  INVALID_TEMPLATE_HEAD_FORMAT,
}
export class ParseTemplateHeadError extends Error {
  readonly code: ParseTemplateHeadErrorCode

  constructor(code: ParseTemplateHeadErrorCode) {
    super()

    this.code = code
  }
}
