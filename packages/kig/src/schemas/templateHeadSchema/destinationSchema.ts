import joi from 'joi'

export function getDestinationSchema() {
  const schema = joi.string().messages({
    'string.base': 'Must be a valid path, relative to the project root',
  })

  return joi.when(joi.string(), { then: schema }).when(joi.array(), { then: joi.array().items(schema) })
}
