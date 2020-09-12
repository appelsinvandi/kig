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
    beforeArgsParser: joi.function(),
    afterArgsParser: joi.function(),
    beforeArgsHandler: joi.function(),
    afterArgsHandler: joi.function(),
    beforeTemplateConfigValidation: joi.function(),
    afterTemplateConfigValidation: joi.function(),
    beforeRender: joi.function(),
    afterRender: joi.function(),
  }),
})
