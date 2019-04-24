const isStress = process.env.TEST_TYPE === 'stress';
export const CREATED_USERS_COUNT = isStress ? 10000 : 20;
export const EXERCISE_TEMPLATES_PER_USER_COUNT = isStress ? 20 : 5;
export const EXERCISE_PER_TEMPLATE_COUNT = isStress ? 20 : 10;
export const COUNTRIES_COUNT = 247;
export const SPORTS_COUNT = 2;
export const DIFFICULTY_LEVEL_COUNT = 4;
