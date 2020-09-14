import joi from 'joi'
import { TemplateEvent } from '~/constants'
import { getLocationSchema } from './locationSchema'

export function getEventsSchema(events: TemplateEvent[]) {
  let schema = joi.object()

  if (events.includes(TemplateEvent.CONFLICT)) {
    schema = schema.keys({
      conflict: joi.object({
        action: joi.string().valid('ask', 'override', 'skip').required().messages({
          'string.base': 'Must be one of the following string values: ask, override, skip',
          'any.only': 'Must be one of the following string values: ask, override, skip',
          'any.required': 'This is a required property',
        }),
        message: joi.string().messages({
          'string.only': 'Must be a string',
        }),
      }),
    })
  }
  if (events.includes(TemplateEvent.DESTINATION_NOT_FOUND)) {
    schema = schema.keys({
      destinationNotFound: joi.object({
        action: joi.string().valid('exit', 'skip', 'create').required().messages({
          'string.base': 'Must be one of the following string values: exit, skip, create',
          'any.only': 'Must be one of the following string values: exit, skip, create',
          'any.required': 'This is a required property',
        }),
        message: joi.string().messages({
          'string.only': 'Must be a string',
        }),
      }),
    })
  }
  if (events.includes(TemplateEvent.NO_LOCATION_MATCH)) {
    schema = schema.keys({
      noLocationMatch: joi.object({
        action: joi.string().valid('exit', 'skip', 'create').required().messages({
          'string.base': 'Must be one of the following string values: exit, skip, fallback',
          'any.only': 'Must be one of the following string values: exit, skip, fallback',
          'any.required': 'This is a required property',
        }),
        location: getLocationSchema().required().messages({
          'string.base': 'This is a required property',
        }),
        message: joi.string().messages({
          'string.only': 'Must be a string',
        }),
      }),
    })
  }

  return schema
}
