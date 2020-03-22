# YTS API

use **The YTS API** to list latest movies, search a huge movies database and get high quality torrent video files.

It based on [yts.am](https://yts.mx/api) api.

The HTTP Method always **GET** for all endpoints

## Response Structure

All the API endpoints return the same data structure as below

| Keys           | Description                                                                 | Example              |
| -------------- | --------------------------------------------------------------------------- | -------------------- |
| status         | The returned status for the API call, can be either 'ok' or 'error'         | ok                   |
| status_message | Either the error message or the successful message                          | Query was successful |
| data           | If 'status' is returned as 'ok' the API query results will be inside 'data' | Object               |

## Search

The Endpoint -> `/yts/search`

Search movies

- Parameters

| Parameter | Type   | Required | Default      | alias | Description                              | Example |
| --------- | ------ | -------- | ------------ | ----- | ---------------------------------------- | ------- |
| query     | String | false    |              | q     | keyword to be used in the search process | shazam  |
| page      | Number | false    | 1            | p     | the results page number                  | 1       |
| genre     | String | false    | "all"        | g     | the genre of the movie                   | Action  |
| limit     | Number | false    | 20           | l     | how many results per page                | 1       |
| rate      | Number | false    | 0            | r     | the minimum rate for the result movie    | 5       |
| sort      | String | false    | "date_added" | s     | sort results by                          | year    |
| order     | String | false    | "desc"       | o     | order results by                         | asc     |

- Results Example

<try endpoint="/yts/search?q=shazam"/>

```json
{
  "status": "ok",
  "status_message": "Query was successful",
  "data": {
    "movie_count": 1,
    "limit": 20,
    "page_number": 1,
    "movies": [
      {
        "id": 12640,
        "url": "https://yts.mx/movie/shazam-2019",
        "imdb_code": "tt0448115",
        "title": "Shazam!",
        "title_english": "Shazam!",
        "title_long": "Shazam! (2019)",
        "slug": "shazam-2019",
        "year": 2019,
        "rating": 7.1,
        "runtime": 132,
        "genres": ["Action", "Adventure", "Comedy", "Fantasy"],
        "summary": "...",
        "description_full": "...",
        "synopsis": "...",
        "yt_trailer_code": "go6GEIrcvFY",
        "language": "English",
        "mpa_rating": "PG-13",
        "background_image": "https://yts.mx/assets/images/movies/shazam_2019/background.jpg",
        "background_image_original": "https://yts.mx/assets/images/movies/shazam_2019/background.jpg",
        "small_cover_image": "https://yts.mx/assets/images/movies/shazam_2019/small-cover.jpg",
        "medium_cover_image": "https://yts.mx/assets/images/movies/shazam_2019/medium-cover.jpg",
        "large_cover_image": "https://yts.mx/assets/images/movies/shazam_2019/large-cover.jpg",
        "state": "ok",
        "torrents": [
          {
            "url": "https://yts.mx/torrent/download/04F45DF29C2AC4876227090DF72EF41D25932144",
            "hash": "04F45DF29C2AC4876227090DF72EF41D25932144",
            "quality": "3D",
            "type": "bluray",
            "seeds": 51,
            "peers": 14,
            "size": "2.11 GB",
            "size_bytes": 2265595249,
            "date_uploaded": "2019-07-18 22:04:20",
            "date_uploaded_unix": 1563480260
          },
          {
            "url": "https://yts.mx/torrent/download/77FC1E25B1B295D7827022712CB89C994A193427",
            "hash": "77FC1E25B1B295D7827022712CB89C994A193427",
            "quality": "720p",
            "type": "bluray",
            "seeds": 1180,
            "peers": 273,
            "size": "1.1 GB",
            "size_bytes": 1181116006,
            "date_uploaded": "2019-06-26 21:51:06",
            "date_uploaded_unix": 1561578666
          },
          {
            "url": "https://yts.mx/torrent/download/97F58867E989E0DA30CFC56522B08A01646F27D1",
            "hash": "97F58867E989E0DA30CFC56522B08A01646F27D1",
            "quality": "1080p",
            "type": "bluray",
            "seeds": 1547,
            "peers": 447,
            "size": "2.11 GB",
            "size_bytes": 2265595249,
            "date_uploaded": "2019-06-27 00:06:40",
            "date_uploaded_unix": 1561586800
          }
        ],
        "date_uploaded": "2019-06-26 21:51:06",
        "date_uploaded_unix": 1561578666
      }
    ]
  },
  "@meta": {
    "server_time": ...,
    "server_timezone": "CET",
    "api_version": 2,
    "execution_time": "0 ms"
  }
}
```

## Movie Details

The Endpoint -> `/yts/movie/:id`

Get movie details by its id

<try endpoint="/yts/movie/12640"/>

```json
{
  "status": "ok",
  "status_message": "Query was successful",
  "data": {
    "movie": {
      "id": 12640,
      "url": "https://yts.mx/movie/shazam-2019",
      "imdb_code": "tt0448115",
      "title": "Shazam!",
      "title_english": "Shazam!",
      "title_long": "Shazam! (2019)",
      "slug": "shazam-2019",
      "year": 2019,
      "rating": 7.1,
      "runtime": 132,
      "genres": ["Action", "Adventure", "Comedy", "Fantasy"],
      "download_count": 2937686,
      "like_count": 654,
      "description_intro": "...",
      "description_full": "...",
      "yt_trailer_code": "go6GEIrcvFY",
      "language": "English",
      "mpa_rating": "PG-13",
      "background_image": "https://yts.mx/assets/images/movies/shazam_2019/background.jpg",
      "background_image_original": "https://yts.mx/assets/images/movies/shazam_2019/background.jpg",
      "small_cover_image": "https://yts.mx/assets/images/movies/shazam_2019/small-cover.jpg",
      "medium_cover_image": "https://yts.mx/assets/images/movies/shazam_2019/medium-cover.jpg",
      "large_cover_image": "https://yts.mx/assets/images/movies/shazam_2019/large-cover.jpg",
      "medium_screenshot_image1": "https://yts.mx/assets/images/movies/shazam_2019/medium-screenshot1.jpg",
      "medium_screenshot_image2": "https://yts.mx/assets/images/movies/shazam_2019/medium-screenshot2.jpg",
      "medium_screenshot_image3": "https://yts.mx/assets/images/movies/shazam_2019/medium-screenshot3.jpg",
      "large_screenshot_image1": "https://yts.mx/assets/images/movies/shazam_2019/large-screenshot1.jpg",
      "large_screenshot_image2": "https://yts.mx/assets/images/movies/shazam_2019/large-screenshot2.jpg",
      "large_screenshot_image3": "https://yts.mx/assets/images/movies/shazam_2019/large-screenshot3.jpg",
      "cast": [
        {
          "name": "Zachary Levi",
          "character_name": "Shazam",
          "url_small_image": "https://yts.mx/assets/images/actors/thumb/nm1157048.jpg",
          "imdb_code": "1157048"
        },
        {
          "name": "Meagan Good",
          "character_name": "Super Hero Darla",
          "url_small_image": "https://yts.mx/assets/images/actors/thumb/nm0328709.jpg",
          "imdb_code": "0328709"
        },
        {
          "name": "Mark Strong",
          "character_name": "Dr. Sivana",
          "url_small_image": "https://yts.mx/assets/images/actors/thumb/nm0835016.jpg",
          "imdb_code": "0835016"
        },
        {
          "name": "Seth Green",
          "character_name": "Friend",
          "url_small_image": "https://yts.mx/assets/images/actors/thumb/nm0001293.jpg",
          "imdb_code": "0001293"
        }
      ],
      "torrents": [
        {
          "url": "https://yts.mx/torrent/download/04F45DF29C2AC4876227090DF72EF41D25932144",
          "hash": "04F45DF29C2AC4876227090DF72EF41D25932144",
          "quality": "3D",
          "type": "bluray",
          "seeds": 51,
          "peers": 14,
          "size": "2.11 GB",
          "size_bytes": 2265595249,
          "date_uploaded": "2019-07-18 22:04:20",
          "date_uploaded_unix": 1563480260
        },
        {
          "url": "https://yts.mx/torrent/download/77FC1E25B1B295D7827022712CB89C994A193427",
          "hash": "77FC1E25B1B295D7827022712CB89C994A193427",
          "quality": "720p",
          "type": "bluray",
          "seeds": 1180,
          "peers": 273,
          "size": "1.1 GB",
          "size_bytes": 1181116006,
          "date_uploaded": "2019-06-26 21:51:06",
          "date_uploaded_unix": 1561578666
        },
        {
          "url": "https://yts.mx/torrent/download/97F58867E989E0DA30CFC56522B08A01646F27D1",
          "hash": "97F58867E989E0DA30CFC56522B08A01646F27D1",
          "quality": "1080p",
          "type": "bluray",
          "seeds": 1547,
          "peers": 447,
          "size": "2.11 GB",
          "size_bytes": 2265595249,
          "date_uploaded": "2019-06-27 00:06:40",
          "date_uploaded_unix": 1561586800
        }
      ],
      "date_uploaded": "2019-06-26 21:51:06",
      "date_uploaded_unix": 1561578666
    }
  },
  "@meta": {
    "server_time": ...,
    "server_timezone": "CET",
    "api_version": 2,
    "execution_time": "0 ms"
  }
}
```

## Suggestions

The Endpoint -> `/yts/movie/:id/suggestions`

Get suggestions

<try endpoint="/yts/movie/12640/suggestions"/>

```json
{
  "status": "ok",
  "status_message": "Query was successful",
  "data": {
    "movie_count": 4,
    "movies": [...]
  },
  "@meta": {
    "server_time": ...,
    "server_timezone": "CET",
    "api_version": 2,
    "execution_time": "0 ms"
  }
}
```

## Serve

The Endpoint -> `/yts/serve/:imdbid`

Serve movie by its IMDB id

- Queries

| Query   | Type   | Required | Default | alias | Description                                                 | Example |
| ------- | ------ | -------- | ------- | ----- | ----------------------------------------------------------- | ------- |
| quality | Number | false    | 10      | q     | number represents the quality of the video in range [1, 10] | 8       |
| size    | Number | false    | 0       | s     | number represents the size of the video in range [1, 10]    | 10      |

> In ranges: 1 is the lowest and 10 is the greatest

> Size default value is zero means ignored

> If size has value then quality will be ignored

- Examples for **Shazam** movie

<try endpoint="tt0448115" label="Movie IMDB Id:" :copyURL="false" :tryBtn="false"/>

<try endpoint="/yts/serve/tt0448115" label="Movie highest quality"/>

<try endpoint="/yts/serve/tt0448115?quality=1" label="Movie lowest quality"/>

<try endpoint="/yts/serve/tt0448115?size=10" label="Movie largest size"/>

<try endpoint="/yts/serve/tt0448115?size=1" label="Movie smallest size"/>

Content-Type: `video/mp4`
