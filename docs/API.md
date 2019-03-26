## /api/difficulty-level
| Method | Url | Body | Query | UrlParams | Return |
|---|---|---|---|---|---|
| **get** | */get-difficulty-levels* |  |  |  | [DifficultyLevelModel[]](#DifficultyLevelModel) |

## /api/exercise-template
| Method | Url | Body | Query | UrlParams | Return |
|---|---|---|---|---|---|
| **get** | */get-user-exercise-templates/:userId* |  | ```[{"name":"sportId","type":"number"},{"name":"difficultyLevelId","type":"number"}]``` |  | [ExerciseTemplateModel[]](#ExerciseTemplateModel) |
| **post** | */create* | [ExerciseTemplateModel](#ExerciseTemplateModel) |  |  | [ExerciseTemplateModel[]](#ExerciseTemplateModel) |
| **get** | */get-exercise-template/:templateId* |  |  |  | [ExerciseTemplateModel[]](#ExerciseTemplateModel) |
| **post** | */update-exercise-template/:templateId* | [ExerciseTemplateModel](#ExerciseTemplateModel) |  |  | [ExerciseTemplateModel[]](#ExerciseTemplateModel) |
| **delete** | */delete-exercise-template/:templateId* |  |  |  | [ExerciseTemplateModel[]](#ExerciseTemplateModel) |

## /api/exercise
| Method | Url | Body | Query | UrlParams | Return |
|---|---|---|---|---|---|
| **get** | */get-user-exercises/:userId* |  | ```[{"name":"sportId","type":"number"},{"name":"templateId","type":"string"},{"name":"difficultyLevelId","type":"number"}]``` |  | [ExerciseModel[]](#ExerciseModel) |
| **post** | */create* | [ExerciseModel](#ExerciseModel) |  |  | [ExerciseModel[]](#ExerciseModel) |
| **get** | */get-exercise/:exerciseId* |  |  |  | [ExerciseModel[]](#ExerciseModel) |
| **post** | */update-exercise/:exerciseId* | [ExerciseModel](#ExerciseModel) |  |  | [ExerciseModel[]](#ExerciseModel) |
| **delete** | */delete-exercise/:exerciseId* |  |  |  | [ExerciseModel[]](#ExerciseModel) |

## /api/sport
| Method | Url | Body | Query | UrlParams | Return |
|---|---|---|---|---|---|
| **get** | */get-sports* |  |  |  | [SportModel[]](#SportModel) |
| **get** | */get-users/:sportId* |  | [LimitQueryParams](#LimitQueryParams) |  | [UserModel[]](#UserModel) |
| **get** | */get-sports/:userId* |  |  |  | [SportModel[]](#SportModel) |
| **post** | */update-user-sport/:actionType* | [LinkUserSportModel](#LinkUserSportModel) |  |  | [LinkUserSportModel[]](#LinkUserSportModel) |

## /api/user
| Method | Url | Body | Query | UrlParams | Return |
|---|---|---|---|---|---|
| **post** | */create* | [UserModel](#UserModel) |  |  | [UserModel[]](#UserModel) |
| **get** | */get-users* |  | [LimitQueryParams](#LimitQueryParams) |  | [UserModel[]](#UserModel) |
| **get** | */get-user/id/:userId* |  |  |  | [UserModel[]](#UserModel) |
| **get** | */get-user/login/:login* |  | ```[{"name":"strict","type":"boolean"}]``` |  | [UserModel[]](#UserModel) |
| **post** | */update-user/:userId* | [UserModel](#UserModel) |  |  | [UserModel[]](#UserModel) |
| **post** | */check-user-password* | ```[{"name":"login","type":"string"},{"name":"password","type":"string"}]``` |  |  | ```[{"name":"id","type":"string"}]``` |
| **delete** | */delete-user/:userId* |  |  |  | [UserModel[]](#UserModel) |

## /api/country
| Method | Url | Body | Query | UrlParams | Return |
|---|---|---|---|---|---|
| **get** | */get-countries* |  |  |  | [CountryModel[]](#CountryModel) |
| **get** | */get-users/:countryId* |  | [LimitQueryParams](#LimitQueryParams) | ```[{"name":"countryId","type":"number \| null"}]``` | [UserModel[]](#UserModel) |

## CountryModel
```{"id":"number","name":"string","alpha2":"string","alpha3":"string","unCode":"string"}```

## DifficultyLevelModel
```{"id":"number","level":"number","name":"string"}```

## ExerciseTemplateModel
```{"id":"number","title":"string","description":"string","userId":"string","sportId":"number","difficultyLevelId":"number","createdDate":"Date"}```

## ExerciseModel
```{"id":"number","exerciseTemplateId":"string","value":"number","type":"reps \| duration","createdDate":"Date","exerciseTemplate":"ExerciseTemplateModel"}```

## LinkUserSportModel
```{"id":"number","string":"undefined","sportId":"number"}```

## SportModel
```{"id":"number","name":"string"}```

## UserModel
```{"id":"number","login":"string","name":"string","password":"string","email":"string","isAthlete":"boolean","gender":"boolean","selfInfo":"string","weight":"number","growth":"number","countryId":"number","birthDate":"Date","isBanned":"boolean","instagram":"string","phone":"string","registeredDate":"Date"}```

## LimitQueryParams
```{"limit":"number","skip":"number","order":"ASC \| DESC, default: ASC"}```