import { createHash } from 'crypto'

export function hashFileBody(body: string) {
  return createHash('sha256').update(body).digest('base64')
}
