import { createPool, DatabasePoolType } from 'slonik'

export const connect = (): DatabasePoolType => {
  const {
    POSTGRES_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_PORT,
    POSTGRES_HOST,
  } = process.env

  return createPool(
    `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`
  )
}
