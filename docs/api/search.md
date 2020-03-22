# Search API

use **The Search API** to find torrent files

The Endpoint -> `/search`

The HTTP Method always **GET**

- Parameters

| Parameter | Type   | Required | Default | alias | Description                                  | Example         |
| --------- | ------ | -------- | ------- | ----- | -------------------------------------------- | --------------- |
| query     | String | true     |         | q     | keyword to be used in the search             | Shazam          |
| provider  | String | false    | All     | p     | supported torrent tracker name as a provider | KickassTorrents |
| category  | String | false    | All     | c     | supported category name                      | Movies          |
| limit     | Number | false    | 10      | l     | limit search results to a number             | 100             |

## Search Results

<try endpoint="/search?query=shazam&provider=1337x&limit=1"/>

- Result Object

```json
{
  "title": "Shazam! (2019) [BluRay] [1080p] [YTS] [YIFY]",
  "time": "Jun. 27th '19",
  "seeds": 13958,
  "peers": 11211,
  "size": "2.1 GB",
  "desc": "http://www.1337x.to/torrent/3850009/Shazam-2019-BluRay-1080p-YTS-YIFY/",
  "provider": "1337x",
  "magnet": "...",
  "hash": "97F58867E989E0DA30CFC56522B08A01646F27D1"
}
```

> Note: sometimes result object keys be different from provider to another

## Providers

Get a list of supported providers and their categories

<try endpoint="/search/providers"/>

The HTTP Method is **GET**

- Provider Object

```json
{
  "name": "KickassTorrents",
  "categories": [
    "All",
    "Movies",
    "TV",
    "Music",
    "Games",
    "Books",
    "Applications",
    "Anime"
  ]
}
```
