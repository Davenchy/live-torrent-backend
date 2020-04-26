# YTS API

use **The YTS API** to list latest movies, search a huge movies database and get high quality torrent video files.

It based on [yts.am](https://yts.mx/api) api.

The HTTP Method always **GET** for all endpoints

- Table of Contents
  [[toc]]

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

<try endpoint="/yts/search?q=shazam&limit=1"/>

```json
{
  "movie_count": 1,
  "limit": 1,
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
      "summary": "In Philadelphia, Billy Batson is an abandoned child who is proving a nuisance to Child Services and the authorities with his stubborn search for his lost mother. However, in his latest foster home, Billy makes a new friend, Freddy, and finds himself selected by the Wizard Shazam to be his new champion. Now endowed with the ability to instantly become an adult superhero by speaking the wizard's name, Billy gleefully explores his new powers with Freddy. However, Billy soon learns that he has a deadly enemy, Dr. Thaddeus Sivana, who was previously rejected by the wizard and has accepted the power of the Seven Deadly Sins instead. Now pursued by this mad scientist for his own power as well, Billy must face up to the responsibilities of his calling while learning the power of a special magic with his true family that Sivana can never understand.",
      "description_full": "In Philadelphia, Billy Batson is an abandoned child who is proving a nuisance to Child Services and the authorities with his stubborn search for his lost mother. However, in his latest foster home, Billy makes a new friend, Freddy, and finds himself selected by the Wizard Shazam to be his new champion. Now endowed with the ability to instantly become an adult superhero by speaking the wizard's name, Billy gleefully explores his new powers with Freddy. However, Billy soon learns that he has a deadly enemy, Dr. Thaddeus Sivana, who was previously rejected by the wizard and has accepted the power of the Seven Deadly Sins instead. Now pursued by this mad scientist for his own power as well, Billy must face up to the responsibilities of his calling while learning the power of a special magic with his true family that Sivana can never understand.",
      "synopsis": "In Philadelphia, Billy Batson is an abandoned child who is proving a nuisance to Child Services and the authorities with his stubborn search for his lost mother. However, in his latest foster home, Billy makes a new friend, Freddy, and finds himself selected by the Wizard Shazam to be his new champion. Now endowed with the ability to instantly become an adult superhero by speaking the wizard's name, Billy gleefully explores his new powers with Freddy. However, Billy soon learns that he has a deadly enemy, Dr. Thaddeus Sivana, who was previously rejected by the wizard and has accepted the power of the Seven Deadly Sins instead. Now pursued by this mad scientist for his own power as well, Billy must face up to the responsibilities of his calling while learning the power of a special magic with his true family that Sivana can never understand.",
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
          "seeds": 31,
          "peers": 9,
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
          "seeds": 789,
          "peers": 74,
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
          "seeds": 1006,
          "peers": 246,
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
}
```

## Movie Details

<Badge text="updated" type="warn"/>

This Endpoint -> `/yts/movie/:imdbid`

<try endpoint="/yts/movie/tt0448115"/>

```json
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
```

## Suggestions

<Badge text="updated" type="warn"/>

The Endpoint -> `/yts/movie/:imdbid/suggestions`

Get suggestions

<try endpoint="/yts/movie/tt0448115/suggestions"/>

```json
[
  {
    "id": 1578,
    "url": "https://yts.mx/movie/identity-thief-2013",
    "imdb_code": "tt2024432",
    "title": "Identity Thief",
    "title_english": "Identity Thief",
    "title_long": "Identity Thief (2013)",
    "slug": "identity-thief-2013",
    "year": 2013,
    "rating": 5.7,
    "runtime": 111,
    "genres": ["Action", "Adventure", "Comedy", "Crime", "Drama", "Thriller"],
    "summary": "Sandy Patterson (Jason Bateman) gets a nice call confirming his name and other identifying information. The next thing he knows, a spa in Florida is reminding him of his appointment and his credit cards are maxed out. With his identity stolen, Sandy leaves his wife, kids and job to literally bring the thief to justice in Colorado. Keeping tabs on the other Sandy (Melissa McCarthy) and run-ins with bounty hunters is harder than he was expecting, and ultimately the cross-country trip is going to find both Sandys learning life tips from one another.",
    "description_full": "Sandy Patterson (Jason Bateman) gets a nice call confirming his name and other identifying information. The next thing he knows, a spa in Florida is reminding him of his appointment and his credit cards are maxed out. With his identity stolen, Sandy leaves his wife, kids and job to literally bring the thief to justice in Colorado. Keeping tabs on the other Sandy (Melissa McCarthy) and run-ins with bounty hunters is harder than he was expecting, and ultimately the cross-country trip is going to find both Sandys learning life tips from one another.",
    "synopsis": "Sandy Patterson (Jason Bateman) gets a nice call confirming his name and other identifying information. The next thing he knows, a spa in Florida is reminding him of his appointment and his credit cards are maxed out. With his identity stolen, Sandy leaves his wife, kids and job to literally bring the thief to justice in Colorado. Keeping tabs on the other Sandy (Melissa McCarthy) and run-ins with bounty hunters is harder than he was expecting, and ultimately the cross-country trip is going to find both Sandys learning life tips from one another.",
    "yt_trailer_code": "uO12W35DpsQ",
    "language": "English",
    "mpa_rating": "R",
    "background_image": "https://yts.mx/assets/images/movies/Identity_Thief_2013_UNRATED/background.jpg",
    "background_image_original": "https://yts.mx/assets/images/movies/Identity_Thief_2013_UNRATED/background.jpg",
    "small_cover_image": "https://yts.mx/assets/images/movies/Identity_Thief_2013_UNRATED/small-cover.jpg",
    "medium_cover_image": "https://yts.mx/assets/images/movies/Identity_Thief_2013_UNRATED/medium-cover.jpg",
    "state": "ok",
    "torrents": [
      {
        "url": "https://yts.mx/torrent/download/752FEE82C0C28137A938A405D0A4B999AAA1A81B",
        "hash": "752FEE82C0C28137A938A405D0A4B999AAA1A81B",
        "quality": "720p",
        "seeds": 35,
        "peers": 2,
        "size": "870.84 MB",
        "size_bytes": 913141924,
        "date_uploaded": "2015-11-01 00:11:30",
        "date_uploaded_unix": 1446333090
      },
      {
        "url": "https://yts.mx/torrent/download/0E9EE082BD954D3F07ACDE2B02BDAAFA295B10F8",
        "hash": "0E9EE082BD954D3F07ACDE2B02BDAAFA295B10F8",
        "quality": "1080p",
        "seeds": 22,
        "peers": 5,
        "size": "1.85 GB",
        "size_bytes": 1986422374,
        "date_uploaded": "2015-11-01 00:11:36",
        "date_uploaded_unix": 1446333096
      }
    ],
    "date_uploaded": "2015-11-01 00:11:30",
    "date_uploaded_unix": 1446333090
  },
  ...
]
```

## Torrents and Qualities

<Badge text="new"/>

The Endpoint -> `/yts/torrents/:imdbid`

<try endpoint="/yts/torrents/tt0448115"/>

```json
[
  {
    "url": "https://yts.mx/torrent/download/04F45DF29C2AC4876227090DF72EF41D25932144",
    "hash": "04F45DF29C2AC4876227090DF72EF41D25932144",
    "quality": "3D",
    "type": "bluray",
    "seeds": 36,
    "peers": 9,
    "size": "2.11 GB",
    "size_bytes": 2265595249,
    "date_uploaded": "2019-07-18 22:04:20",
    "date_uploaded_unix": 1563480260
  },
  ...
]
```

## Stream

<Badge text="updated" type="warn"/>

The Endpoint -> `/yts/stream/:imdbid`

Stream movie by its IMDB id

- Queries

| Query   | Type   | Required | Default | alias | Description                                | Example |
| ------- | ------ | -------- | ------- | ----- | ------------------------------------------ | ------- |
| quality | String | false    | best    | q     | the movie quality [720p, 1080p, 2160p, 3D] | 3D      |
| type    | String | false    | bluray  | t     | the movie file type [bluray, web]          | bluray  |

- Examples for **Shazam** movie

<try endpoint="tt0448115" label="Movie IMDB Id:" :copyURL="false" :tryBtn="false"/>

<try endpoint="/yts/stream/tt0448115"/>

Content-Type: `video/mp4`
