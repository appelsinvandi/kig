import joi from 'joi'
import { TemplateSkipMode } from '~/constants'

export function getSkipSchema(modes: TemplateSkipMode[]) {
  let schema = joi.object({
    mode: joi
      .string()
      .valid(...modes)
      .required()
      .messages({
        'string.base': `Unknown mode. Use one of the following: ${modes.join(', ')}`,
        'any.only': `Unknown mode. Use one of the following: ${modes.join(', ')}`,
        'any.required': 'This property is required',
      }),
  })

  if (modes.includes(TemplateSkipMode.CONDITIONAL)) {
    schema = schema.when(joi.object({ mode: TemplateSkipMode.CONDITIONAL }).unknown(), {
      then: joi.object({
        shouldSkip: joi.boolean().required().messages({
          'boolean.base': 'Must be a boolean',
          'any.required': 'This property is required',
        }),
      }),
    })
  }
  if (modes.includes(TemplateSkipMode.REGEX)) {
    schema = schema.when(joi.object({ mode: TemplateSkipMode.REGEX }).unknown(), {
      then: joi.object({
        pattern: joi.string().required().messages({
          'string.base': 'Must be a regex pattern',
          'any.required': 'This property is required',
        }),
        flags: joi
          .string()
          .pattern(/^[smiu]+$/)
          .messages({
            'string.base': 'Must be a set of regex flags',
            'string.pattern.base': 'Can only contain valid regex flags: s, m, i, u',
          }),
      }),
    })
  }
  if (modes.includes(TemplateSkipMode.SEARCH)) {
    schema = schema.when(joi.object({ mode: TemplateSkipMode.SEARCH }).unknown(), {
      then: joi.object({
        text: joi.string().required().messages({
          'string.base': 'Must a string',
          'any.required': 'This property is required',
        }),
      }),
    })
  }

  return joi.when(joi.object(), { then: schema }).when(joi.array(), { then: joi.array().items(schema) })
}
