import type { ErrorHandler } from 'hono/types'
import type { StatusCode } from 'hono/utils/http-status'

export class HTTPException extends Error {
  constructor(
    public status: StatusCode,
    message: string,
    public error: Error | undefined = undefined,
  ) {
    super(message)
  }

  static fromGeneral(error: Error): HTTPException {
    const e = new HTTPException(500, `GeneralError: ${error.message}`, error)
    e.name = error.name
    return e
  }

  toString() {
    return `HTTPException:${this.name}(${this.status}): ${this.message}

Error: ${this.error}

Stack: ${this.stack}

Cause: ${this.cause}`
  }

  toJSON() {
    return {
      status: 'error',
      statusCode: this.status,
      message: this.message,
    }
  }
}

export const HTTPExceptionErrorHandler: ErrorHandler = (err, c) => {
  let error: HTTPException

  if (err instanceof HTTPException) error = err
  else error = HTTPException.fromGeneral(err)

  console.error(error.toString())
  return c.json(error.toJSON(), error.status)
}
