## /api/user
| Method | Url | Body | Query |
|---|---|---|---|
| post | **/create** | [UserModel](#UserModel) |  |
| get | **/get-users** |  | ```limit {number}```, ```skip {number}```, ```order {ASC | DESC}: ASC``` |
| get | **/get-user/id/:userId** |  |  |
| get | **/get-user/login/:login** |  | ```strict {boolean}``` |
| post | **/update-user/:userId** | [UserModel](#UserModel) |  |
| post | **/check-user-password** | ```login {string}```, ```password {string}``` |  |
| delete | **/delete-user/:userId** |  |  |

## /api/sport
| Method | Url | Body | Query |
|---|---|---|---|
| post | **/update-user-sport/:actionType** | [LinkUserSportModel](#LinkUserSportModel) |  |
| get | **/get-sports** |  |  |
| get | **/get-users/:sportId** |  | ```limit {number}```, ```skip {number}```, ```order {ASC | DESC}: ASC``` |
| get | **/get-sports/:userId** |  |  |

## UserModel
```json
{"id":"string","login":"string","name":"string","password":"string","email":"string","isAthlete":"boolean","gender":"boolean","selfInfo":"string","weight":"number","growth":"number","countryId":"number","birthDate":"Date","isBanned":"boolean","instagram":"string","phone":"string","registeredDate":"Date"}```

## LinkUserSportModel
```json
{"id":"string","userId":"string","sportId":"number"}```