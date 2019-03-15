import {apiUrls} from 'src/urls';
import DifficultyLevelModel, {IDifficultyLevelModel} from 'src/models/difficulty-level';
import {getRequest} from 'tests/helpers/common';

const urls = apiUrls.difficultyLevel;

const getAllDifficultyLevels = async () => {
    return await getRequest<IDifficultyLevelModel>({
        url: `${urls.prefix}${urls.getDifficultyLevels}`,
        ModelClass: DifficultyLevelModel
    });
};

export const dbActions = {
    getAllDifficultyLevels
};
