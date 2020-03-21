# Captions API

use **The Captions API** to find captions information

The HTTP Method always **GET** for all endpoints

It based on [OpenSubtitles.org](https://www.opensubtitles.org) project.

## Search

The Endpoint -> `/captions/search`

- Parameters

| Parameter | Type          | Required | Default | alias | Description                              | Example  |
| --------- | ------------- | -------- | ------- | ----- | ---------------------------------------- | -------- |
| query     | String        | \*       |         | q     | keyword to be used in the search process | shazam   |
| lang      | String        | false    | all     | ln    | language id of captions                  | ara      |
| limit     | String/Number | false    | best    | l     | limit results for quality or number      | best     |
| imdbid    | String/Number | \*       |         | im    | find captions with movie's IMDBID        | tt528809 |
| fps       | String        | false    |         | f     | number of frames per sec in the video    | 23.96    |
| season    | Number        | false    |         | s     | find captions for series's season        | 2        |
| episode   | Number        | false    |         | e     | find captions for series's episode       | 3        |

> Required one of two parameters 'query' or 'imdbid'

> Based on [OpenSubtitles.org](https://www.npmjs.com/package/opensubtitles-api)

The **Lang** param is a [3 letters langcode](http://www.loc.gov/standards/iso639-2/php/code_list.php) (ISO 639-2 based)

You will need to assign an OpenSubtitles user agent to the env variable **OSUA** for more information visit the [OpenSubtitles Docs](https://trac.opensubtitles.org/projects/opensubtitles)

- Caption Object Example

Endpoint `/captions/search?q=shazam&ln=ara&l=1`

```json
{
  "ar": [
    {
      "url": "...",
      "langcode": "ar",
      "downloads": 48488,
      "lang": "Arabic",
      "encoding": "UTF-8",
      "id": "1956328649",
      "filename": "Shazam.2019.1080p.V2.HC.HDRip.X264-EVO.srt",
      "date": "2019-05-15 23:27:34",
      "score": 0.5,
      "fps": 30,
      "format": "srt",
      "utf8": "...",
      "vtt": "..."
    }
  ]
}
```

## Movie

The Endpoint -> `/captions/movie/:imdbid`

Get caption for a movie by its IMDBID in vtt format

- Parameters

| Parameter | Type    | Required | Default | alias | Description                                        | Example |
| --------- | ------- | -------- | ------- | ----- | -------------------------------------------------- | ------- |
| lang      | String  | false    | eng     | l     | language id of captions                            | ara     |
| fps       | String  | false    |         | f     | number of frames per sec in the video              | 23.96   |
| allow_srt | Boolean | false    | false   | s     | if caption format srt then don't convert it to vtt | true    |

The result type can be `application/x-subrip` for `.srt` files or `text/vtt` for `.vtt` files
