import type { ErrorHandler } from 'hono/types'
import type { StatusCode } from 'hono/utils/http-status'

export interface HTTPExceptionOptions {
  code?: number
  error?: Error
}

export class HTTPException extends Error {
  constructor(
    message: string,
    public status: StatusCode = 500,
    public options: HTTPExceptionOptions = {},
  ) {
    super(message)
    this.stack = new Error().stack
  }

  toString() {
    const { options, status, message, name } = this
    return `\nError HTTPException(${name}):(status: ${status}, code: ${options.code ?? -1}): ${message}
${options.error ? options.error : ''}
Stack: ${this.stack}
${this.cause ? `Cause: ${this.cause}` : ''}`
  }

  toJSON() {
    return {
      code: this.options.code ?? -1,
      error: this.message,
    }
  }
}

export const HTTPExceptionErrorHandler: ErrorHandler = (err, c) => {
  let error: HTTPException
  console.log('error', err)

  if (err instanceof HTTPException) error = err
  else {
    error = new HTTPException(err.message, 500, { code: -1, error: err })
    error.name = err.name
    error.stack = err.stack
  }

  console.error(error.toString())
  return c.json(error.toJSON(), error.status)
}

export const TorrentInvalidError = (
  error: Error | undefined = undefined,
): HTTPException =>
  new HTTPException('Required valid id query or hash param', 400, {
    error,
    code: 1,
  })

export const NoSelectionError = (
  error: Error | undefined = undefined,
): HTTPException =>
  new HTTPException(
    'File selection is required, use query: q or i to select one.',
    400,
    { error, code: 2 },
  )

export const FileNotFoundError = (
  error: Error | undefined = undefined,
): HTTPException =>
  new HTTPException('File Not Found!', 404, { code: 0, error })

export const RequiredSearchQueryError = (
  error: Error | undefined = undefined,
): HTTPException =>
  new HTTPException('query is required!', 400, { error, code: 4 })

export const UnsupportedProviderError = (
  provider: string,
  error: Error | undefined = undefined,
): HTTPException =>
  new HTTPException(`Unsupported ${provider} provider`, 400, { code: 5, error })
