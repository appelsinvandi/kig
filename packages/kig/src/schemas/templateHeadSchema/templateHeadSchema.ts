import joi from 'joi'
import { getTrimSchema } from './trimSchema'
import { getSkipSchema } from './skipSchema'
import { getLocationSchema } from './locationSchema'
import { getDestinationSchema } from './destinationSchema'
import { getEventsSchema } from './eventsSchema'
import { TemplateEvent, TemplateMode, TemplateSkipMode } from '~/constants'

const modes = Object.values(TemplateMode)

export const templateHeadSchema = joi
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
  .when(joi.object({ mode: TemplateMode.CREATE }).unknown(), {
    then: joi.object({
      destination: getDestinationSchema().required().messages({ 'any.required': 'This is a required property' }),
      skip: joi
        .alternatives()
        .try(
          getSkipSchema([TemplateSkipMode.CONDITIONAL]),
          joi.array().items(getSkipSchema([TemplateSkipMode.CONDITIONAL]))
        ),
      trim: getTrimSchema(),
      on: getEventsSchema([TemplateEvent.CONFLICT]),
      variables: joi.object().pattern(/./, joi.string()),
    }),
  })
  .when(joi.object({ mode: TemplateMode.INJECT }).unknown(), {
    then: joi.object({
      destination: getDestinationSchema().required().messages({ 'any.required': 'This is a required property' }),
      location: getLocationSchema(),
      skip: joi
        .alternatives()
        .try(
          getSkipSchema([TemplateSkipMode.CONDITIONAL, TemplateSkipMode.REGEX, TemplateSkipMode.SEARCH]),
          joi
            .array()
            .items(getSkipSchema([TemplateSkipMode.CONDITIONAL, TemplateSkipMode.REGEX, TemplateSkipMode.SEARCH]))
        ),
      trim: getTrimSchema(),
      on: getEventsSchema([TemplateEvent.DESTINATION_NOT_FOUND]),
      variables: joi.object().pattern(/./, joi.string()),
    }),
  })
