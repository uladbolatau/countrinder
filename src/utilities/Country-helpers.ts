import { DEFAULT_ELO_RATE } from './constants/elo-rating';
import ICountry from './models/ICountry';
import ApiCountryData from './types/api-cCountry-data';

/**
 * Map data from country data API response to ICountry model.
 *
 * @param {ApiCountryData} countryData Country data from API.
 * @returns {ICountry} ICountry model.
 */
const CountryToModel = (countryData: ApiCountryData) => {
  try {
    const country: ICountry = {
      capital: countryData.capital,
      flagURL: countryData.flags.svg ?? countryData.flags.png,
      id: countryData.cca3,
      isRated: false,
      name: countryData.name.common,
      path: countryData.name.common.replaceAll(' ', '-').toLocaleLowerCase(),
      rating: DEFAULT_ELO_RATE,
      region: countryData.region,
    };

    return country;
  } catch (error) {
    throw new Error(`Country can be transferred to ICountry model.`, {
      cause: error,
    });
  }
};

export { CountryToModel };
