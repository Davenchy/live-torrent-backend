# Captions API

use **The Captions API** to find captions information

The Endpoint -> `/captions`

The HTTP Method always **GET**

It based on [OpenSubtitles.org](https://www.opensubtitles.org) project.

- Parameters

| Parameter | Type          | Required | Default | alias | Description                              | Example  |
| --------- | ------------- | -------- | ------- | ----- | ---------------------------------------- | -------- |
| query     | String        | true     |         | q     | keyword to be used in the search process | shazam   |
| lang      | String        | false    | all     | ln    | language id of captions                  | ara      |
| limit     | String/Number | false    | best    | l     | limit results for quality or number      | best     |
| imdbid    | String/Number | false    |         | im    | find captions with movie's IMDBID        | tt528809 |
| season    | Number        | false    |         | s     | find captions for series's season        | 2        |
| episode   | Number        | false    |         | e     | find captions for series's episode       | 3        |

> Based on [OpenSubtitles.org](https://www.npmjs.com/package/opensubtitles-api)

The **Lang** param is a [3 letters langcode](http://www.loc.gov/standards/iso639-2/php/code_list.php) (ISO 639-2 based)

You will need to assign an OpenSubtitles user agent to the env variable **OSUA** for more information visit the [OpenSubtitles Docs](https://trac.opensubtitles.org/projects/opensubtitles)

- Caption Object Example

```json
{
  "en": {
    "url": "...",
    "langcode": "en",
    "downloads": 105677,
    "lang": "English",
    "encoding": "UTF-8",
    "id": "1954422981",
    "filename": "X-Men.Days.of.Future.Past.2014.720p.BluRay.X264-AMIABLE.srt",
    "date": "2014-10-04 16:22:07",
    "score": 0.5,
    "fps": 23.976,
    "format": "srt",
    "utf8": "...",
    "vtt": "..."
  }
}
```
