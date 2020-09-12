import * as path from 'path'
import joi from 'joi'

export const historySchema = joi
  .object({
    enabled: joi.boolean().default(true),
  })
  .when(joi.object({ enabled: true }).unknown(), {
    then: joi.object({
      cacheLocation: joi
        .string()
        .custom((v, h) => (!path.isAbsolute(v) ? h.error('path.isAbsolute') : null))
        .default('.kig-cache'),
      limit: joi.number().min(1).default(5),
    }),
  })
