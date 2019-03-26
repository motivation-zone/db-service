## /api/difficulty-level
| Method | Url | Body | Query | UrlParams | Return |
|---|---|---|---|---|---|
| **get** | */get-difficulty-levels* | null | null | null | [DifficultyLevelModel[]](#DifficultyLevelModel) |

## /api/exercise-template
| Method | Url | Body | Query | UrlParams | Return |
|---|---|---|---|---|---|
| **get** | */get-user-exercise-templates/:userId* | null | ```[{"name":"sportId","type":"number"},{"name":"difficultyLevelId","type":"number"}]``` | null | [ExerciseTemplateModel[]](#ExerciseTemplateModel) |
| **post** | */create* | [ExerciseTemplateModel](#ExerciseTemplateModel) | null | null | [ExerciseTemplateModel[]](#ExerciseTemplateModel) |
| **get** | */get-exercise-template/:templateId* | null | null | null | [ExerciseTemplateModel[]](#ExerciseTemplateModel) |
| **post** | */update-exercise-template/:templateId* | [ExerciseTemplateModel](#ExerciseTemplateModel) | null | null | [ExerciseTemplateModel[]](#ExerciseTemplateModel) |
| **delete** | */delete-exercise-template/:templateId* | null | null | null | [ExerciseTemplateModel[]](#ExerciseTemplateModel) |

## /api/exercise
| Method | Url | Body | Query | UrlParams | Return |
|---|---|---|---|---|---|
| **get** | */get-user-exercises/:userId* | null | ```[{"name":"sportId","type":"number"},{"name":"templateId","type":"string"},{"name":"difficultyLevelId","type":"number"}]``` | null | [ExerciseModel[]](#ExerciseModel) |
| **post** | */create* | [ExerciseModel](#ExerciseModel) | null | null | [ExerciseModel[]](#ExerciseModel) |
| **get** | */get-exercise/:exerciseId* | null | null | null | [ExerciseModel[]](#ExerciseModel) |
| **post** | */update-exercise/:exerciseId* | [ExerciseModel](#ExerciseModel) | null | null | [ExerciseModel[]](#ExerciseModel) |
| **delete** | */delete-exercise/:exerciseId* | null | null | null | [ExerciseModel[]](#ExerciseModel) |

## /api/sport
| Method | Url | Body | Query | UrlParams | Return |
|---|---|---|---|---|---|
| **get** | */get-sports* | null | null | null | [SportModel[]](#SportModel) |
| **get** | */get-users/:sportId* | null | [LimitQueryParams](#LimitQueryParams) | null | [UserModel[]](#UserModel) |
| **get** | */get-sports/:userId* | null | null | null | [SportModel[]](#SportModel) |
| **post** | */update-user-sport/:actionType* | [LinkUserSportModel](#LinkUserSportModel) | null | null | [LinkUserSportModel[]](#LinkUserSportModel) |

## /api/user
| Method | Url | Body | Query | UrlParams | Return |
|---|---|---|---|---|---|
| **post** | */create* | [UserModel](#UserModel) | null | null | [UserModel[]](#UserModel) |
| **get** | */get-users* | null | [LimitQueryParams](#LimitQueryParams) | null | [UserModel[]](#UserModel) |
| **get** | */get-user/id/:userId* | null | null | null | [UserModel[]](#UserModel) |
| **get** | */get-user/login/:login* | null | ```[{"name":"strict","type":"boolean"}]``` | null | [UserModel[]](#UserModel) |
| **post** | */update-user/:userId* | [UserModel](#UserModel) | null | null | [UserModel[]](#UserModel) |
| **post** | */check-user-password* | ```[{"name":"login","type":"string"},{"name":"password","type":"string"}]``` | null | null | ```[{"name":"id","type":"string"}]``` |
| **delete** | */delete-user/:userId* | null | null | null | [UserModel[]](#UserModel) |

## /api/country
| Method | Url | Body | Query | UrlParams | Return |
|---|---|---|---|---|---|
| **get** | */get-countries* | null | null | null | [CountryModel[]](#CountryModel) |
| **get** | */get-users/:countryId* | null | [LimitQueryParams](#LimitQueryParams) | ```[{"name":"countryId","type":"number \| null"}]``` | [UserModel[]](#UserModel) |

## CountryModel
```{"id":"number","name":"string","alpha2":"string","alpha3":"string","unCode":"string"}```

## DifficultyLevelModel
```{"id":"number","level":"number","name":"string"}```

## ExerciseTemplateModel
```{"id":"number","title":"string","description":"string","userId":"string","sportId":"number","difficultyLevelId":"number","createdDate":"Date"}```

## ExerciseModel
```{"id":"number","exerciseTemplateId":"string","value":"number","type":"reps | duration","createdDate":"Date","exerciseTemplate":"ExerciseTemplateModel"}```

## LinkUserSportModel
```{"id":"number","string":"undefined","sportId":"number"}```

## SportModel
```{"id":"number","name":"string"}```

## UserModel
```{"id":"number","login":"string","name":"string","password":"string","email":"string","isAthlete":"boolean","gender":"boolean","selfInfo":"string","weight":"number","growth":"number","countryId":"number","birthDate":"Date","isBanned":"boolean","instagram":"string","phone":"string","registeredDate":"Date"}```

## LimitQueryParams
```{"limit":"number","skip":"number","order":"ASC | DESC, default: ASC"}```