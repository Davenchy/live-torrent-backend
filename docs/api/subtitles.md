# Subtitles API

use **The Subtitles API** to find subtitles information

The HTTP Method always **GET** for all endpoints

It based on [OpenSubtitles.org](https://www.opensubtitles.org) project.

- Table of Contents
  [[toc]]

## Search

<try label="The Endpoint:" endpoint="/subtitles/search" :tryBtn="false" :copyURL="false"/>

- Parameters

| Parameter | Type          | Required | Default | alias | Description                              | Example   |
| --------- | ------------- | -------- | ------- | ----- | ---------------------------------------- | --------- |
| query     | String        | true     |         | q     | keyword to be used in the search process | shazam    |
| lang      | String        | false    | all     | ln    | subtitles language id                    | ara       |
| limit     | String/Number | false    | best    | l     | limit results for quality or number      | best      |
| imdbid    | String/Number | true     |         | im    | find subtitles with movie's IMDBID       | tt0448115 |
| fps       | String        | false    |         | f     | number of frames per sec in the video    | 23.96     |
| season    | Number        | false    |         | s     | find subtitles for series's season       | 2         |
| episode   | Number        | false    |         | e     | find subtitles for series's episode      | 3         |

> Required one of two parameters 'query' or 'imdbid'

> Based on [OpenSubtitles.org](https://www.npmjs.com/package/opensubtitles-api)

The **Lang** param is a [3 letters langcode](http://www.loc.gov/standards/iso639-2/php/code_list.php) (ISO 639-2 based)

You will need to assign an OpenSubtitles user agent to the env variable **OSUA** for more information visit the [OpenSubtitles Docs](https://trac.opensubtitles.org/projects/opensubtitles)

- Subtitle Object Example

<try endpoint="/subtitles/search?q=shazam&ln=ara&l=1"/>

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

<try label="The Endpoint:" endpoint="/subtitles/movie/:imdbid" :tryBtn="false" :copyURL="false"/>

Get subtitle for a movie by its IMDBID in vtt format

<try endpoint="/subtitles/movie/tt0448115?lang=ara"/>

- Parameters

| Parameter | Type   | Required | Default | alias | Description                           | Example |
| --------- | ------ | -------- | ------- | ----- | ------------------------------------- | ------- |
| lang      | String | false    | eng     | l     | subtitles language id                 | ara     |
| fps       | String | false    |         | f     | number of frames per sec in the video | 23.96   |
| format    | string | false    | vtt     | ft    | subtitle format [vtt or srt]          | srt     |

The result type can be `application/x-subrip` for `.srt` files or `text/vtt` for `.vtt` files

## Languages

<try label="The Endpoint:" endpoint="/subtitles/movie/:imdbid/langs" :tryBtn="false" :copyURL="false"/>

Get all exist subtitle languages of a movie by its IMDBID

<try endpoint="/subtitles/movie/tt0448115/langs"/>

Returns an **Array** of objects

- The Object

```json
{
  "name": "English",
  "code": "en",
  "iso": "eng"
}
```
