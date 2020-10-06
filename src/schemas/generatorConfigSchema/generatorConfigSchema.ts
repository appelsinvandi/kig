import joi from 'joi'
import { getGeneratorConfigPromptOptionsSchema } from './generatorConfigPromptOptionsSchema'

export const generatorConfigSchema = joi.object({
  name: joi.string().required(),
  description: joi.string(),
  args: joi.array().items(
    joi.function(),
    joi.object({
      name: joi.string().required(),
      description: joi.string(),
      default: joi.alternatives().try(joi.string(), joi.boolean()),
      prompt: joi.alternatives().try(getGeneratorConfigPromptOptionsSchema(), joi.function()),
      validate: joi.function(),
    })
  ),
  hooks: joi.object({
    onStart: joi.function(),
    beforeArgsParser: joi.function(),
    afterArgsParser: joi.function(),
    beforeDiscoverTemplates: joi.function(),
    afterDiscoverTemplates: joi.function(),
    beforeParseTemplateHead: joi.function(),
    afterParseTemplateHead: joi.function(),
    beforeParseTemplateBody: joi.function(),
    afterParseTemplateBody: joi.function(),
    beforeGenerateJobQueue: joi.function(),
    afterGenerateJobQueue: joi.function(),
    onEnd: joi.function(),
  }),
})
