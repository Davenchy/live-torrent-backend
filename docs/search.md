# Search API

use **The Search API** to find torrent files

The Endpoint -> `/search`

The HTTP Method always **GET**

- Parameters

| Parameter | Type   | Required | Default | alias | Description                                  | Example      |
| --------- | ------ | -------- | ------- | ----- | -------------------------------------------- | ------------ |
| query     | String | true     |         | q     | keyword to be used in the search             | Shazam       |
| provider  | String | false    | All     | p     | supported torrent tracker name as a provider | ExtraTorrent |
| category  | String | false    | All     | c     | supported category name                      | Movies       |
| limit     | Number | false    | 10      | l     | limit search results to a number             | 100          |

## Search Results

The results for `/search?query=shazam&provider=ExtraTorrent&limit=1`

- Result Object

```json
{
  "title": "Shazam!.2019.1080p.BluRay.DD+7.1.x264-DON[EtHD]",
  "peers": 23,
  "seeds": 50,
  "time": "2 mo",
  "size": "16.80 GB",
  "magnet": "magnet:?xt=urn:btih:9CA94E4FDF8732ECE17CDD9BA31AC9060E41AA99&dn=Shazam%21.2019.1080p.BluRay.DD%2B7.1.x264-DON%5BEtHD%5D&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce;tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce;tr=udp%3A%2F%2Fipv4.tracker.harry.lu%3A80%2Fannounce;tr=udp%3A%2F%2Ftracker.pirateparty.gr%3A6969%2Fannounce;tr=udp%3A%2F%2Fexplodie.org%3A6969%2Fannounce;tr=udp%3A%2F%2Ftracker.tiny-vps.com%3A6969%2Fannounce;tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce;tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451;tr=udp%3A%2F%2Fopen.demonii.si%3A1337%2Fannounce",
  "desc": "http://extratorrent.ag/torrent/7783621/Shazam%21.2019.1080p.BluRay.DD%2B7.1.x264-DON%5BEtHD%5D.html",
  "provider": "ExtraTorrent",
  "hash": "9CA94E4FDF8732ECE17CDD9BA31AC9060E41AA99"
}
```

> Note: sometimes result object keys be different from provider to another

## Providers

Gives a list of supported providers

The Endpoint -> `/search/providers`

The HTTP Method is **GET**

- Provider Object

```json
{
  "name": "ExtraTorrent",
  "categories": ["All", "Movies", "TV", "Music", "Apps", "Anime", "Books"]
}
```
