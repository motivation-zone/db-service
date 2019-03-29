const API_PREFIX = '/api';
const PREFIXES = {
    user: `${API_PREFIX}/user`,
    country: `${API_PREFIX}/country`,
    sport: `${API_PREFIX}/sport`,
    difficultyLevel: `${API_PREFIX}/difficulty-level`,
    exerciseTemplate: `${API_PREFIX}/exercise-template`,
    exercise: `${API_PREFIX}/exercise`
};

export interface IApiUrls {
    user: any;
    country: any;
    sport: any;
    difficultyLevel: any;
    exerciseTemplate: any;
    exercise: any;
}

export const apiUrls = {
    user: {
        prefix: PREFIXES.user,
        createUser: '/create',
        getUsers: '/get-users',
        getUserById: '/get-user/id/:userId',
        getUserByLogin: '/get-user/login/:login',
        updateUserById: '/update-user/:userId',
        checkUserPassword: '/check-user-password',
        deleteUserById: '/delete-user/:userId'
    },
    country: {
        prefix: PREFIXES.country,
        getCountries: '/get-countries',
        getUsersByCountry: '/get-users/:countryId'
    },
    sport: {
        prefix: PREFIXES.sport,
        getSports: '/get-sports',
        getUsersBySport: '/get-users/:sportId',
        getUserSports: '/get-sports/:userId',
        updateUserSport: '/update-user-sport/:actionType'
    },
    difficultyLevel: {
        prefix: PREFIXES.difficultyLevel,
        getDifficultyLevels: '/get-difficulty-levels'
    },
    exerciseTemplate: {
        prefix: PREFIXES.exerciseTemplate,
        createExerciseTemplate: '/create',
        getUserExerciseTemplates: '/get-user-exercise-templates/:userId',
        getExerciseTemplateById: '/get-exercise-template/:templateId',
        deleteExerciseTemplateById: '/delete-exercise-template/:templateId',
        updateExerciseTemplateById: '/update-exercise-template/:templateId'
    },
    exercise: {
        prefix: PREFIXES.exercise,
        createExercise: '/create',
        getUserExercises: '/get-user-exercises/:userId',
        getExerciseById: '/get-exercise/:exerciseId',
        updateExerciseById: '/update-exercise/:exerciseId',
        deleteExerciseById: '/delete-exercise/:exerciseId'
    }
};
