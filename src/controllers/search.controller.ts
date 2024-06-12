import type { Context } from 'hono'

import { getProviders, search } from 'services/search.service'
import {
  RequiredSearchQueryError,
  UnsupportedProviderError,
} from 'src/utils/errors'

export const searchController = async (context: Context) => {
  const { q, c, l } = context.req.query()
  const { provider } = context.req.param()

  // make sure q is set
  if (!q) throw RequiredSearchQueryError()

  // make sure provider is supported
  if (
    getProviders()
      .map(p => p.name)
      .indexOf(provider) === -1
  )
    throw UnsupportedProviderError(provider)

  // search for torrent files
  return context.json(
    await search(q, provider, c || 'All', l ? Number.parseInt(l) || 10 : 10),
  )
}

export const getProvidersController = (c: Context) => c.json(getProviders())
