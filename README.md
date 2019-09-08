# live-torrent-backend

This project is the backend server for [The Live Torrent](https://github.com/Davenchy/live-torrent) project.

Explore, serve and share torrent files online.

This project is based on **webtorrent**.

## How to use

### Environment Variables

> Note: you can use .env file to setup vars

| Var  | Default            | Desc                         |
| ---- | ------------------ | ---------------------------- |
| PORT | 3000               | server listening port        |
| OSUA | TemporaryUserAgent | Opensubtitles.org User Agent |

### For Users

```bash
# install dependencies
npm install

# start server
npm start
# OR you can add OSUA or PORT env var
PORT=3000 OSUA=SOME_USER_AGENT npm start
```

### For Developers

```bash
# install devDependencies
npm install -D

# then start the dev server
npm run dev
```

## Torrent API

The Endpoint `/torrent`

Use Torrent API in 3 easy steps

1. select method

2. add torrent id

3. add selectors

### Torrent API Methods

There are 5 methods

1. info `// Get information about the torrent or any file(s) inside it`

2. serve `// Serve file from inside the torrent`

3. download `// Download(.zip) all the files or some of them from inside the torrent`

4. playlist `// Download(.m3u) playlist file for all the files or some of them from inside the torrent`

5. torrentfile `// Download(.torrent) file`

### Add Torrent Id

> torrent id can be an info hash or magnet uri or http/https torrent url

the end point can be:

1. `/torrent/{the selected method}/{info hash}`

2. `/torrent/{the selected method}?torrentId={the torrent id}`

### Add Selectors

Query keywords:

1. fileIndex -> the file index in the torrent
2. filePath -> the file path in the torrent
3. fileType -> file(s) type can be (video, audio, text, ...etc) or (.mp3, .mp4, .txt, .jpg, .vtt, .srt, ...etc)

Or you can just write it as a normal string

Like this -> `/{fileIndex}` or `/{filePath}` or `:{fileType}`

> NOTE: We are adding ':' before the file type if we are not going to use the query keyword 'fileType'

Some Examples:

```
Files Tree

\
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
/
```

To get info of the movie and the english (.vtt) subtitle files [using indexes only]

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

### Real Examples

torrent info hash: `08ada5a7a6183aae1e09d831df6748d566095a10`
torrent id: `magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel`

> both gives the same results

you can use them like this

`/torrent/info/08ada5a7a6183aae1e09d831df6748d566095a10`

OR

`/torrent/info?torrentId=08ada5a7a6183aae1e09d831df6748d566095a10`

OR

`/torrent/info?torrentId=magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel`

---

```
Files Tree

\
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
/
```

- Serve files

`/torrent/info?torrentId=08ada5a7a6183aae1e09d831df6748d566095a10/Sintel.en.srt`

`/torrent/info?torrentId=08ada5a7a6183aae1e09d831df6748d566095a10/Sintel.mp4`

`/torrent/info?torrentId=08ada5a7a6183aae1e09d831df6748d566095a10/poster.jpg`

- Get Info

`/torrent/info/08ada5a7a6183aae1e09d831df6748d566095a10/1,5,10`

OR

`/torrent/info/08ada5a7a6183aae1e09d831df6748d566095a10/Sintel.en.srt,Sintel.mp4,poster.jpg`

- Download all (.srt) files in torrent as a (.zip) file

`/torrent/download/08ada5a7a6183aae1e09d831df6748d566095a10/:.srt`

OR

`/torrent/download/08ada5a7a6183aae1e09d831df6748d566095a10?fileType=.srt`

OR

`/torrent/download?torrentId=08ada5a7a6183aae1e09d831df6748d566095a10&fileType=.srt`

- Download playlist (.m3u)

`/torrent/playlist/08ada5a7a6183aae1e09d831df6748d566095a10`

- Download torrent file (.torrent)

`/torrent/torrentfile/08ada5a7a6183aae1e09d831df6748d566095a10`

OR

`/torrent/torrentfile?torrentId=08ada5a7a6183aae1e09d831df6748d566095a10`

## Get torrent info

| Method | path                    | query                |
| ------ | ----------------------- | -------------------- |
| GET    | /torrent/info           | torrentId [required] |
| GET    | /torrent/info/:infoHash |

response:

```javascript
{
  name: String,
  infoHash: String,
  size: Number,
  peers: Number,
  files: [Object]
}

```

The File Object:

```javascript

[
  {
    name: String,
    index: Number,
    path: String,
    size: Number,
    downloaded: Number,
    type: String // file mime type e.g.: video/mp4 image/jpg
  },
  ...
]

```

---

## Serving Files

| Method | path                                             | query                 |
| ------ | ------------------------------------------------ | --------------------- |
| GET    | /torrent/serve/:infoHash                         | fileIndex or filePath |
| GET    | /torrent/serve/:infoHash/{fileIndex or filePath} |                       |

> supports ranges

## Download torrent as zip archive

> Note this is a **BETA** version
> It doesn't support ranges or download resume and sometimes download fails

| Method | path                                    | query                                                      | Desc                                                                                                                                                                    |
| ------ | --------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | /torrent/download/                      | torrentId [required], fullPath [default=true]              | download all the files                                                                                                                                                  |
| GET    | /torrent/download/:infoHash             | fullPath [default=true]                                    | download all the files                                                                                                                                                  |
| GET    | /torrent/download/:infoHash/{selectors} | filePath or fileIndex or fileType, fullPath [default=true] | you can add selectors [file index or file path or file type separated with a comma] as much as you need or use fileType to download all files with a specific file type |

examples on file types:

`/torrent/download?torrentId={...}&fileType=video`

`/torrent/download/:infoHash/fileType=.vtt`

`/torrent/download/:infoHash/fileType=.mp3`

### Download torrent as playlist [.m3u]

| Method | path                        | query                |
| ------ | --------------------------- | -------------------- |
| GET    | /torrent/playlist           | torrentId [required] |
| GET    | /torrent/playlist/:infoHash |

> NOTE: you can use selectors too

### Download torrent file [.torrent]

| Method | path                   | query                |
| ------ | ---------------------- | -------------------- |
| GET    | /torrentFile           | torrentId [required] |
| GET    | /torrentFile/:infoHash |

### Torrent Search Engine

| Method | path              | query                                                                  |
| ------ | ----------------- | ---------------------------------------------------------------------- |
| GET    | /search           | query[required], provider, category[default="All"], limit[default=100] |
| GET    | /search/providers |

> if no provider will search using all providers [takes too long time]

### Captions

| Method | path             | query                                       | desc                                     |
| ------ | ---------------- | ------------------------------------------- | ---------------------------------------- |
| GET    | /captions/search | query, lang, limit, imdbid, season, episode | for more info check opensubtitle.org api |

the first endpoint returns array of objects contains subtitle info and url

```javascript
[
  {
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
  },
  ...
]
```
