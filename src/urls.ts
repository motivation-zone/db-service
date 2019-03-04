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
        getUsers: '/get-users/:countryId'
    },
    sport: {
        prefix: `${API_PREFIX}/sport`,
        get: '/get',
        getUsersBySport: '/get-users/:sportId',
        getUserSports: '/get-sports/:userId',
        updateUserSport: '/update-user/:actionType'
    },
    difficultyLevel: {
        prefix: `${API_PREFIX}/difficulty-level`,
        get: '/get'
    },
    exerciseTemplate: {
        prefix: `${API_PREFIX}/exercise-template`,
        get: '/get/:userId',
        create: '/create',
        getById: '/get/id/:templateId',
        deleteById: '/delete/:templateId',
        updateById: '/update/:templateId'
    },
    exercise: {
        prefix: `${API_PREFIX}/exercise`,
        get: '/get/:userId',
        getById: '/get/id/:exerciseId',
        create: '/create',
        updateById: '/update/:exerciseId',
        deleteById: '/delete/:exerciseId'
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
