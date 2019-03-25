## /api/user
| Method | Url | Body | Query | Return |
|---|---|---|---|---|
| post | **/create** | [UserModel](#UserModel) |  |  |
| get | **/get-users** |  | ```limit {number}```, ```skip {number}```, ```order {ASC | DESC}: ASC``` |  |
| get | **/get-user/id/:userId** |  |  |  |
| get | **/get-user/login/:login** |  | ```strict {boolean}``` |  |
| post | **/update-user/:userId** | [UserModel](#UserModel) |  |  |
| post | **/check-user-password** | ```login {string}```, ```password {string}``` |  |  |
| delete | **/delete-user/:userId** |  |  |  |

## /api/sport
| Method | Url | Body | Query | Return |
|---|---|---|---|---|
| post | **/update-user-sport/:actionType** | [LinkUserSportModel](#LinkUserSportModel) |  |  |
| get | **/get-sports** |  |  |  |
| get | **/get-users/:sportId** |  | ```limit {number}```, ```skip {number}```, ```order {ASC | DESC}: ASC``` |  |
| get | **/get-sports/:userId** |  |  |  |

## /api/country
| Method | Url | Body | Query | Return |
|---|---|---|---|---|
| get | **/get-countries** |  |  | [CountryModel[]](#CountryModel) |
| get | **/get-users/:countryId** |  | ```limit {number}```, ```skip {number}```, ```order {ASC | DESC}: ASC``` | [UserModel[]](#UserModel) |

## /api/difficulty-level
| Method | Url | Body | Query | Return |
|---|---|---|---|---|
| get | **/get-difficulty-levels** |  |  |  |

## UserModel
```json
{"id":"string","login":"string","name":"string","password":"string","email":"string","isAthlete":"boolean","gender":"boolean","selfInfo":"string","weight":"number","growth":"number","countryId":"number","birthDate":"Date","isBanned":"boolean","instagram":"string","phone":"string","registeredDate":"Date"}
```

## LinkUserSportModel
```json
{"id":"string","userId":"string","sportId":"number"}
```

## DifficultyLevelModel
```json
{"id":"number","level":"number","name":"string"}
```

## CountryModel
```json
{"id":"number","name":"string","alpha2":"string","alpha3":"string","unCode":"string"}
```