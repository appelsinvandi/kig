import joi from 'joi'

export const generatorConfigSchema = joi.object({
  name: joi.string().required(),
  description: joi.string(),
  args: joi.array().items(
    joi.object({
      name: joi.string().required(),
      description: joi.string(),
      promptOptions: joi.alternatives().try(joi.function(), joi.object()),
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
