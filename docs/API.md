## /api/country
| Method | Url | Body | Query | Return |
|---|---|---|---|---|
| **get** | */get-countries* | null | null | [CountryModel[]](#CountryModel) |
| **get** | */get-users/:countryId* | null | [LimitQueryParams](#LimitQueryParams) | [UserModel[]](#UserModel) |

## CountryModel
```json
{"id":"number","string":"undefined","alpha2":"string","alpha3":"string","unCode":"string"}
```

## LimitQueryParams
```json
{"limit":"number","skip":"number","order":"ASC | DESC, default: ASC"}
```