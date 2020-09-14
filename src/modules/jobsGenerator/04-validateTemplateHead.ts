import { templateHeadSchema } from '~/schemas/templateHeadSchema'
import { TemplateHead } from '~/types'

export function validateTemplateHead(templateHead: TemplateHead) {
  const validationResult = templateHeadSchema.validate(templateHead, { abortEarly: false })

  if (validationResult.error != null) {
    throw new ValidateTemplateHeadError(ValidateTemplateHeadErrorCode.INVALID_TEMPLATE_HEAD_SCHEMA)
  }
}

export enum ValidateTemplateHeadErrorCode {
  INVALID_TEMPLATE_HEAD_SCHEMA,
}
export class ValidateTemplateHeadError extends Error {
  readonly code: ValidateTemplateHeadErrorCode

  constructor(code: ValidateTemplateHeadErrorCode) {
    super()

    this.code = code
  }
}
