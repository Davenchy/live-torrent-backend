import type { Context } from 'hono'
import type { SearchOptions } from 'services/subtitles.service'
import {
  client,
  formatResults,
  translateOptions,
} from 'services/subtitles.service'
import { InvalidSearchError } from 'src/utils/errors'

const parseNum = (
  label: string,
  value: string | undefined,
): number | undefined => {
  if (!value) return undefined

  try {
    const parsed = Number.parseInt(value)
    if (!parsed || parsed <= 0) throw new Error()
    return parsed
  } catch (e) {
    throw InvalidSearchError(`invalid ${label} value: '${value}'`)
  }
}

export const searchRoute = async (c: Context) => {
  const {
    id,
    imdb,
    tmdb,
    langs,
    season,
    episode,
    ai,
    trans,
    page,
    feature,
    year,
    type,
    q,
    query,
  } = c.req.query()
  const lang = c.req.queries('lang')
  const options: SearchOptions = {}

  options.id = id
  options.query = q || query
  options.imdb_id = imdb
  options.tmdb_id = tmdb
  options.feature_id = feature
  options.season = parseNum('season', season)
  options.episode = parseNum('episode', episode)
  options.page = parseNum('page', page)
  options.year = parseNum('year', year)

  if (type && ['movie', 'series', 'episode'].includes(type))
    options.type = type === 'series' ? 'episode' : type

  options.ai = ai !== undefined
  options.translate = trans !== undefined

  options.langs = [
    ...(Array.isArray(lang) ? lang : langs ? langs.split(',') : []),
  ]

  const results = await client
    .subtitles(translateOptions(options))
    .then(formatResults)
  return c.json(results)
}
