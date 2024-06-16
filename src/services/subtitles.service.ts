// @ts-expect-error this package does not include types
import OS from 'opensubtitles.com'

export interface SubtitleUploader {
  id?: string
  name?: string
  rank?: string
}

export interface Feature {
  id: string
  type: 'Movie' | 'Episode'
  year?: number
  title: string
  name: string
  imdb_id: number
  tmdb_id?: number
}

export interface EpisodeFeature extends Feature {
  season: number
  episode: number
  parent_imdb_id: number
  parent_title: string
}

export interface Subtitle {
  id: string
  type: string
  language: string
  downloads: number
  hd?: boolean
  fps?: number
  ratings?: number
  votes?: number
  points?: number
  truested: boolean
  ai_translated: boolean
  machine_translated: boolean
  url: string
  details: Feature
  uploader?: SubtitleUploader
}

export interface SearchResult {
  pages: number
  page: number
  count: number
  limit: number
  data: Subtitle[]
}

export interface SearchOptions {
  id?: string
  langs?: string[]
  ai?: boolean
  translate?: boolean
  page?: number
  query?: string
  year?: number
  imdb_id?: string
  tmdb_id?: string
  feature_id?: string
  season?: number
  episode?: number
  type?: string
}

export const client = new OS({
  apikey: process.env.OS_APIKEY || 'leSU9DMKF1ZUMvjtkrIx0BhKOYUVlv4O',
  useragent: process.env.OS_USERAGENT || 'LiveTorrent v2',
})

export const tokenStorage = (client => {
  let token: string | undefined

  return {
    async login(username: string, password: string) {
      const res = await client.login({ username, password })
      token = res.token
    },
    get token(): string | undefined {
      return token
    },
    get isLoggedIn(): boolean {
      return !!token
    },
    async logout() {
      await client.logout({ token })
      token = undefined
    },
  }
})(client)

export const translateOptions = (options: SearchOptions) => {
  const t_ops: { [key: string]: string | number | undefined } = {
    id: options.id,
    year: options.year,
    type: options.type,
    query: options.query,
    page: options.page,
    languages: options.langs ? options.langs.join(',') : undefined,
  }

  if (options.ai !== undefined)
    t_ops.ai_translated = options.ai ? 'include' : 'exclude'
  if (options.translate !== undefined)
    t_ops.machine_translated = options.translate ? 'include' : 'exclude'

  t_ops.imdb_id = options.imdb_id
  t_ops.tmdb_id = options.tmdb_id

  t_ops.season_number = options.season
  t_ops.episode_number = options.episode

  return t_ops
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const formatResults = async (results: {
  // biome-ignore lint: noExplicitAny
  [key: string]: any
}): Promise<SearchResult> => ({
  pages: results.total_pages as number,
  page: results.page as number,
  limit: results.per_page as number,
  count: results.total_count as number,
  data: results.data.map(
    // @ts-expect-error this package does not include types
    ({ id, type, attributes: attr }) => {
      const { feature_details: details } = attr
      return {
        id,
        type,
        language: attr?.language,
        downloads: attr?.download_count,
        hd: attr?.hd,
        fps: attr?.fps,
        votes: attr?.votes,
        ratings: attr?.ratings,
        points: attr?.points,
        trusted: attr?.from_trusted,
        ai_translated: attr?.ai_translated,
        machine_translated: attr?.machine_translated,
        url: attr?.url,
        uploader: attr.uploader
          ? {
              id: attr.uploader.uploader_id,
              name: attr.uploader.name,
              rank: attr.uploader.rank,
            }
          : undefined,
        details: {
          id: details.feature_id,
          type: details.feature_type,
          year: details?.year,
          title: details.title,
          name: details.movie_name,
          imdb_id: details.imdb_id,
          tmdb_id: details?.tmdb_id,
          season: details?.season_number,
          episode: details?.episode_number,
          parent_imdb_id: details?.parent_imdb_id,
          parent_title: details?.parent_title,
        },
      }
    },
  ),
})
/* eslint-enable @typescript-eslint/no-explicit-any */
