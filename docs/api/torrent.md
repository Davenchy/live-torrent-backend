# Torrent API

use **The Torrent API** to load torrent information, serve torrent file, get a **.m3u** playlist of a torrent file or get a torrent file from its hash

The Endpoint -> <try endpoint="/torrent" :tryBtn="false" :copyURL="false"/>

The HTTP Method always **GET**

It based on [Webtorrent](https://github.com/webtorrent/webtorrent) project.

- Table of Contents
  [[toc]]

## Steps

- Three easy steps to use the api

1. select [method](#methods)

2. add [torrent id](#torrent-id)

3. add [selectors](#selectors)

## Methods

Live torrent Torrent API supports 4 methods

1. [info](#get-torrent-information) `Get information about the torrent or any file(s) it contains`

2. [serve](#serve-torrent) `Serve file from inside the torrent`

3. [playlist](#get-torrent-playlist) `Download(.m3u) playlist file for all the files or some of them`

4. [torrentfile](#get-torrent-file) `Download(.torrent) file`

See [tables](#tables) for more information

See [Aliases](#aliases) section for shortcuts

## Torrent ID

Torrent id can be **torrent info hash**, **magnet uri** or **http/https torrent file url**.

The endpoint can be:

1. `/torrent/{method}/{info-hash}`

2. `/torrent/{method}?torrentId={torrent-id}`

## Selectors

Selectors can be a **Parameters** or an **Endpoint**

- Using Parameters:

> Note you can use multi params

| Parameter | Type   | Description                 | Example                                                                           |
| --------- | ------ | --------------------------- | --------------------------------------------------------------------------------- |
| fileIndex | number | get file with its index     | /torrent/serve/08ada5a7a6183aae1e09d831df6748d566095a10?fileIndex=0               |
| filePath  | string | get file with its path      | /torrent/serve/08ada5a7a6183aae1e09d831df6748d566095a10/filePath=subtitles.en.vtt |
| fileType  | string | get file with its type      | /torrent/serve/08ada5a7a6183aae1e09d831df6748d566095a10/fileType=video            |
| fileType  | string | get file with its mime type | /torrent/serve/08ada5a7a6183aae1e09d831df6748d566095a10/fileType=.mp4             |

- Using Endpoint:

| Name       | Description                 | Endpoint                                                                          |
| ---------- | --------------------------- | --------------------------------------------------------------------------------- |
| file index | get file with its index     | /torrent/serve/08ada5a7a6183aae1e09d831df6748d566095a10/0                         |
| file path  | get file with its path      | /torrent/serve/08ada5a7a6183aae1e09d831df6748d566095a10/subtitles/subtitle.en.vtt |
| file type  | get file with its type      | /torrent/serve/08ada5a7a6183aae1e09d831df6748d566095a10/:video                    |
| file type  | get file with its mime type | /torrent/serve/08ada5a7a6183aae1e09d831df6748d566095a10/:.mp4                     |

## Examples

- Directory Structure

```
.
|-[0]- /poster.jpg
|-[1]- /movie.mp4
|-[2]- /subtitles/subtitle.en.srt
|-[3]- /subtitles/subtitle.en.vtt
|-[4]- /subtitles/subtitle.ar.srt
|-[5]- /subtitles/subtitle.ar.vtt
|-[6]- /subtitles/subtitle.fr.srt
|-[7]- /subtitles/subtitle.fr.vtt
|-[8]- /subtitles/subtitle.de.srt
|-[9]- /subtitles/subtitle.de.vtt
`
```

o get info of the movie and the english (.vtt) subtitle files [using indexes only]

`/torrent/info/{infoHash}?fileIndex=1&fileIndex=3`

OR

`/torrent/info/{infoHash}/1,3`

To get info of the movie and the english (.vtt) subtitle files [using paths only]

`/torrent/info/{infoHash}?filePath=movie.mp4&filePath=subtitles/subtitle.en.vtt`

OR

`/torrent/info/{infoHash}/movie.mp4,subtitles/subtitle.en.vtt`

To serve the first video in the torrent

`/torrent/serve/{infoHash}?fileType=video`

OR

`/torrent/serve/{infoHash}?fileType=.mp4`

OR

`/torrent/serve/{infoHash}/:video`

OR

`/torrent/serve/{infoHash}/:.mp4`

## Real Examples

torrent info hash: <try endpoint="08ada5a7a6183aae1e09d831df6748d566095a10" :copyURL="false" :tryBtn="false"/>

torrent id: <try endpoint="magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel" :copyURL="false" :tryBtn="false"/>

> both gives the same results

you can use them like this

<try endpoint="/torrent/info/08ada5a7a6183aae1e09d831df6748d566095a10"/>

OR

<try endpoint="/torrent/info?torrentId=08ada5a7a6183aae1e09d831df6748d566095a10"/>

OR

<try endpoint="/torrent/info?torrentId=magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel"/>

---

- Directory Structure

```
.
|-[0]- /Sintel.de.srt
|-[1]- /Sintel.en.srt
|-[2]- /Sintel.es.srt
|-[3]- /Sintel.fr.srt
|-[4]- /Sintel.it.srt
|-[5]- /Sintel.mp4
|-[6]- /Sintel.nl.srt
|-[7]- /Sintel.pl.srt
|-[8]- /Sintel.pt.srt
|-[9]- /Sintel.ru.srt
|-[10]- /poster.jpg
`
```

- Serve files

> Note: Serve method doesn't support multi file selectors

<try endpoint="/torrent/serve?torrentId=08ada5a7a6183aae1e09d831df6748d566095a10&filePath=Sintel.en.srt"/>

<try endpoint="/torrent/serve/08ada5a7a6183aae1e09d831df6748d566095a10/poster.jpg"/>

<try endpoint="/torrent/serve/08ada5a7a6183aae1e09d831df6748d566095a10/Sintel.mp4"/>

- Get Info

<try endpoint="/torrent/info?torrentId=08ada5a7a6183aae1e09d831df6748d566095a10&filePath=Sintel.en.srt"/>

<try endpoint="/torrent/info?torrentId=08ada5a7a6183aae1e09d831df6748d566095a10&filePath=poster.jpg"/>

<try endpoint="/torrent/info/08ada5a7a6183aae1e09d831df6748d566095a10/Sintel.mp4"/>

OR

<try endpoint="/torrent/info/08ada5a7a6183aae1e09d831df6748d566095a10/1,5,10"/>

OR

<try endpoint="/torrent/info/08ada5a7a6183aae1e09d831df6748d566095a10/Sintel.en.srt,Sintel.mp4,poster.jpg"/>

- Download playlist (.m3u)

<try endpoint="/torrent/playlist/08ada5a7a6183aae1e09d831df6748d566095a10"/>

- Download torrent file (.torrent)

<try endpoint="/torrent/torrentfile/08ada5a7a6183aae1e09d831df6748d566095a10"/>

OR

<try endpoint="/torrent/torrentfile?torrentId=08ada5a7a6183aae1e09d831df6748d566095a10"/>

## Tables

### Get Torrent Information

| Method | path                    | query     |
| ------ | ----------------------- | --------- |
| GET    | /torrent/info           | torrentId |
| GET    | /torrent/info/:infoHash |

> Content-Type: `application/json`

response:

```json
{
  "name": String,
  "infoHash": String,
  "size": Number,
  "peers": Number,
  "files": [Object]
}
```

The File Object:

```json
[
  {
    "name": String,
    "index": Number,
    "path": String,
    "size": Number,
    "downloaded": Number,
    "type": String // file mime type e.g.: video/mp4 image/jpg
  }
]
```

### Serve Torrent

| Method | path                                 | query                             |
| ------ | ------------------------------------ | --------------------------------- |
| GET    | /torrent/serve/:infoHash             | fileIndex or filePath or fileType |
| GET    | /torrent/serve/:infoHash/{selectors} |                                   |

> Content-Type: depends on selected file type

> supports ranges

### Get Torrent Playlist

| Method | path                        | query     |
| ------ | --------------------------- | --------- |
| GET    | /torrent/playlist           | torrentId |
| GET    | /torrent/playlist/:infoHash |

> Content-Type: `application/mpegurl` [.m3u]

> NOTE: you can use selectors too

### Get Torrent File

| Method | path                   | query     |
| ------ | ---------------------- | --------- |
| GET    | /torrentfile           | torrentId |
| GET    | /torrentfile/:infoHash |

> Content-Type: `application/x-bittorrent` [.torrent]

## Aliases

| Method      | Alias |
| ----------- | ----- |
| serve       | s     |
| info        | i     |
| playlist    | pl    |
| torrentfile | tf    |
