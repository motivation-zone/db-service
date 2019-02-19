const API_PREFIX = '/api';

export const API_URLS = {
    user: {
        prefix: `${API_PREFIX}/user`,
        create: '/create',
        get: '/get',
        getById: '/get/id/:id',
        getByLogin: '/get/login/:login',
        updateById: '/update/:id',
        checkPassword: '/check/password',
        deleteById: '/delete/:id'
    },
    country: {
        prefix: `${API_PREFIX}/country`,
        get: '/get',
        getUsers: '/get-users/:id'
    },
    sport: {
        prefix: `${API_PREFIX}/sport`,
        get: '/get',
        getUsers: '/get-users/:id',
        updateUserSport: '/update-user/:actionType'
    },
    difficultyLevel: {
        prefix: `${API_PREFIX}/difficulty-level`,
        get: '/get'
    },
    exercise: {
        prefix: `${API_PREFIX}/exercise`,
        template: {
            getMany: '/template/many/:userId/get',
            create: '/template/create',
            get: '/template/:templateId/get',
            delete: '/template/:templateId/delete',
            update: '/template/:templateId/update'
        },
        getMany: '/many/:userId/get',
        get: '/:exerciseId/get',
        create: '/create',
        update: '/:exerciseId/update',
        delete: '/:exerciseId/delete'
    },
    program: {
        prefix: `${API_PREFIX}/program`,
        get: '/get'
    },
    trainingType: {
        prefix: `${API_PREFIX}/training-type`,
        get: '/get'
    },
    training: {
        prefix: `${API_PREFIX}/training`,
        get: '/get'
    }
};
