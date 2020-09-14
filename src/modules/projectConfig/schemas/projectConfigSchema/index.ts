import joi from 'joi'
import { historySchema } from './history'

export const projectConfigSchema = joi
  .object({
    history: historySchema.default(),
  })
  .default()
