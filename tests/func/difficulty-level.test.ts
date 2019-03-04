import {expect} from 'chai';

import {dbActions as difficultyLevelDbActions} from 'tests/helpers/difficulty-level';
import {DIFFICULTY_LEVEL_COUNT} from 'tests/const';

const {getAllDifficultyLevels} = difficultyLevelDbActions;

describe('Difficulty-level:', () => {
    describe('Get', () => {
        it('all levels', async () => {
            const {data: levels} = await getAllDifficultyLevels();
            expect(levels.length).to.equal(DIFFICULTY_LEVEL_COUNT);

            ['beginner', 'intermediate', 'advance', 'monster'].forEach((name, i) => {
                expect(levels[i].id).to.equal(i + 1);
                expect(levels[i].level).to.equal(i + 1);
                expect(levels[i].name).to.equal(name);
            });
        });
    });
});
