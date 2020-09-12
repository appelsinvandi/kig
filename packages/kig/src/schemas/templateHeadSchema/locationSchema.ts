import joi from 'joi'
import { TemplateLocationMode, TemplateLocationPlacement } from '~/constants'

export function getLocationSchema() {
  const modes = Object.values(TemplateLocationMode)
  const placements = Object.values(TemplateLocationPlacement)

  let schema = joi
    .object({
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
    .when(joi.object({ mode: TemplateLocationMode.PREPEND }).unknown(), {
      then: joi.object(),
    })
    .when(joi.object({ mode: TemplateLocationMode.APPEND }).unknown(), {
      then: joi.object(),
    })
    .when(
      joi
        .object({
          mode: joi.string().valid(TemplateLocationMode.LINE, TemplateLocationMode.SEARCH, TemplateLocationMode.REGEX),
        })
        .unknown(),
      {
        then: joi.object({
          placement: joi
            .string()
            .valid(...placements)
            .required()
            .messages({
              'string.base': `Unknown placement. Use one of the following: ${placements.join(', ')}`,
              'any.only': `Unknown placement. Use one of the following: ${placements.join(', ')}`,
              'any.required': 'This property is required',
            }),
        }),
      }
    )
    .when(
      joi
        .object({
          mode: joi.string().valid(TemplateLocationMode.REGEX),
        })
        .unknown(),
      {
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
      }
    )
    .when(
      joi
        .object({
          mode: joi.string().valid(TemplateLocationMode.SEARCH),
        })
        .unknown(),
      {
        then: joi.object({
          text: joi.string().required().messages({
            'string.base': 'Must a string',
            'any.required': 'This property is required',
          }),
        }),
      }
    )
    .when(
      joi
        .object({
          mode: joi.string().valid(TemplateLocationMode.LINE),
        })
        .unknown(),
      {
        then: joi.object({
          line: joi.number().min(1).required().messages({
            'number.base': 'Must a number',
            'number.min': 'Must be 1 or above',
            'any.required': 'This property is required',
          }),
        }),
      }
    )

  return schema
}
