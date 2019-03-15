import {apiUrls} from 'src/urls';
import CountryModel, {ICountryModel} from 'src/models/country';
import {IGetLimitTest} from 'tests/utils';
import UserModel, {IUserModel} from 'src/models/user';
import {formQueryString} from 'src/utils';
import {getRequest} from 'tests/helpers/common';

const urls = apiUrls.country;

interface IGetUsersByCountryParams {
    countryId?: number | null;
    limitParams: IGetLimitTest;
}

const getAllCountries = async () => {
    return await getRequest<ICountryModel>({
        url: `${urls.prefix}${urls.getCountries}`,
        ModelClass: CountryModel
    });
};

const getUsersByCountry = async ({countryId, limitParams}: IGetUsersByCountryParams) => {
    const url = [
        `${urls.prefix}${urls.getUsersByCountry.replace(':countryId', String(countryId))}`,
        `?${formQueryString({...limitParams})}`
    ].join('');

    return await getRequest<IUserModel>({
        url,
        ModelClass: UserModel
    });
};

export const dbActions = {
    getAllCountries,
    getUsersByCountry
};
