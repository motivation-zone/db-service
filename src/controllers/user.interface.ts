/* import {IApiInterface, limitQueryParams} from 'tools/api-doc';
import {apiUrls} from 'src/urls';
import UserModelInterface from 'src/models/user.interface';

const urls = apiUrls.user;

export default {
    prefix: urls.prefix,
    methods: [
        {
            url: urls.createUser,
            method: 'post',
            body: UserModelInterface.name
        },
        {
            url: urls.getUsers,
            method: 'get',
            query: limitQueryParams
        },
        {
            url: urls.getUserById,
            method: 'get'
        },
        {
            url: urls.getUserByLogin,
            method: 'get',
            query: [{
                name: 'strict',
                type: 'boolean'
            }]
        },
        {
            url: urls.updateUserById,
            method: 'post',
            body: 'UserModel'
        },
        {
            url: urls.checkUserPassword,
            method: 'post',
            body: [{
                name: 'login',
                type: 'string'
            }, {
                name: 'password',
                type: 'string'
            }]
        },
        {
            url: urls.deleteUserById,
            method: 'delete'
        }
    ]
} as IApiInterface;
 */