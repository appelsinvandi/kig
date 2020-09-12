import joi from 'joi'

export function getTrimSchema() {
  const schema = joi.string().valid('leading', 'trailing').messages({
    'string.base': 'Unknown trim action. Use one of the following: leading, trailing',
    'any.only': 'Unknown trim action. Use one of the following: leading, trailing',
  })

  return joi.array().items(schema).messages({
    'array.includesRequiredUnknowns': 'Missing at least one trim action. Valid values: leading, trailing',
  })
}
