import joi from 'joi'

export function getGeneratorConfigPromptOptionsSchema() {
  const promptTypes = ['confirm', 'input', 'select', 'multi-select']
  let schema = joi.object({
    type: joi
      .string()
      .valid(...promptTypes)
      .required()
      .messages({
        'string.base': `Unknown type. Use one of the following: ${promptTypes.join(', ')}`,
        'any.only': `Unknown type. Use one of the following: ${promptTypes.join(', ')}`,
        'any.required': 'This property is required',
      }),
    message: joi.string().required().messages({
      'string.base': `Must be a descriptive message to be shown to the user`,
      'any.required': 'This property is required',
    }),
  })

  schema = schema.when(joi.object({ type: 'select' }).unknown(), {
    then: joi.object({
      choices: joi.array().required().messages({
        'any.required': 'This property is required',
      }),
    }),
  })
  schema = schema.when(joi.object({ type: 'multi-select' }).unknown(), {
    then: joi.object({
      choices: joi.array().required().messages({
        'any.required': 'This property is required',
      }),
    }),
  })

  return schema
}
