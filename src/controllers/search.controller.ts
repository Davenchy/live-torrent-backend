import type { Context } from 'hono'

import type { ProviderName, SearchOptions } from 'services/search.service'

import { getProviders, search } from 'services/search.service'
import { HTTPException } from 'src/utils/errors'
import { firstAvailable, flatten } from 'src/utils/general'

export interface ProcessQueryOptions {
  query: string[]
  category: string[]
  limit: string[]
  provider: (string | string[])[]
}

export const processQuery = (
  queryOptions: ProcessQueryOptions,
): SearchOptions => {
  const options: SearchOptions = {
    query: firstAvailable<string>(queryOptions.query, ''),
    category: firstAvailable<string>(queryOptions.category, 'All'),
    limit: Number.parseInt(firstAvailable<string>(queryOptions.limit, '10')),
  }

  const provider = flatten<string>(queryOptions.provider)
  if (provider.length > 0) options.provider = provider as ProviderName[]

  return options
}

export const searchController = async (context: Context) => {
  const { q, c, l, query, providers, category, limit } = context.req.query()
  const { p, provider } = context.req.queries()

  // make sure q or query is set
  if (!q && !query) throw new HTTPException(400, 'query is required!')

  // process query
  const options: SearchOptions = processQuery({
    query: [q, query],
    limit: [l, limit],
    category: [c, category],
    provider: [p, provider, providers],
  })

  // try to search for results
  try {
    const results = await search(options)
    return context.json(results)
  } catch (_) {
    throw new HTTPException(500, 'search failed')
  }
}

export const getProvidersController = (c: Context) => c.json(getProviders())
