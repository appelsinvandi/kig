import * as fs from 'fs'

export function parseTemplate(templateFilePath: string) {
  const templateFileContents = fs.readFileSync(templateFilePath).toString()
  const splitTemplateMatch = /^--- *$(.+?)^--- *$\r?\n?(.*)/gims.exec(templateFileContents)
  if (splitTemplateMatch == null) throw new ParseTemplateError(ParseTemplateErrorCode.INVALID_TEMPLATE_FORMAT)

  return {
    templateHead: splitTemplateMatch[1].trim(),
    templateBody: splitTemplateMatch[2],
  }
}

export enum ParseTemplateErrorCode {
  INVALID_TEMPLATE_FORMAT,
}
export class ParseTemplateError extends Error {
  readonly code: ParseTemplateErrorCode

  constructor(code: ParseTemplateErrorCode) {
    super()

    this.code = code
  }
}
