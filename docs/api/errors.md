# Errors

- Table of Contents
  [[toc]]

## Structure

| property | type   | isRequired | example                    | description                          |
| -------- | ------ | ---------- | -------------------------- | ------------------------------------ |
| status   | string | true       | error                      | to detect errors                     |
| label    | string | false      | BadRequest                 | to group errors of the same type     |
| code     | number | true       | 404                        | a code to describe the error         |
| message  | string | true       | movie not found            | error description                    |
| extra    | object | false      | { "userId": "sd4g56sg5d" } | extra information to debug the error |

## Examples

- By using the search endpoint it is required to provide a search query

<try endpoint="/search"/>

```json
{
  "status": "error",
  "code": 400,
  "message": "invalid query"
}
```
