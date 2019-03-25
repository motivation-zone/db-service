import {IApiInterface, limitQueryParams} from 'tools/api-doc';
import {apiUrls} from 'src/urls';
import LinkUserSportModelInterface from 'src/models/link/user-sport.interface';

const urls = apiUrls.sport;

export default {
    prefix: urls.prefix,
    methods: [
        {
            url: urls.updateUserSport,
            method: 'post',
            body: LinkUserSportModelInterface.name
        },
        {
            url: urls.getSports,
            method: 'get'
        },
        {
            url: urls.getUsersBySport,
            method: 'get',
            query: limitQueryParams
        },
        {
            url: urls.getUserSports,
            method: 'get'
        }
    ]
} as IApiInterface;
