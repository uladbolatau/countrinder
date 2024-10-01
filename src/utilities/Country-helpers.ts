import { DEFAULT_ELO_RATE } from './constants/elo-rating';
import EloRatingSystem from './elo-rating-system';
import ICountry from './models/ICountry';
import ApiCountryData from './types/api-cCountry-data';

const elo = new EloRatingSystem();

/**
 * Toggles a region's presence in the selection list; adds it if missing, removes it if present.
 * @param {string[]} checkedRegions - The current list of selected regions.
 * @param {string} regionName - The name of the region to toggle in the list.
 * @returns {string[]} A new list of regions modified based on the presence of the specified region.
 */
const changeRegionsList = (checkedRegions: string[], regionName: string) => {
  const regionIndex = checkedRegions.findIndex(region => regionName === region);
  const newRegions: string[] = [...checkedRegions];

  if (regionIndex === -1) {
    newRegions.push(regionName);
  } else {
    newRegions.splice(regionIndex, 1);
  }

  return newRegions;
};

/**
 * Filters an array of countries based on a selection of regions.
 * @param {ICountry[]} countries - The array of countries to filter.
 * @param {string[]} checkedRegions - The array of selected regions to filter by.
 * @returns {ICountry[]} A new array containing countries that match the selected regions.
 */
const filterCountriesByRegions = (
  countries: ICountry[],
  checkedRegions: string[]
) => {
  let newFilteredCountries: ICountry[] = [];

  if (checkedRegions.length === 0) {
    newFilteredCountries = [...countries];
  } else {
    newFilteredCountries = countries.filter((country: ICountry) =>
      checkedRegions.includes(country.region)
    );
  }

  return newFilteredCountries;
};

/**
 * Extracts countries and their regions from raw API data.
 * @param {ApiCountryData[]} countryRawData - Raw country data from an API.
 * @returns {Object} An object containing two arrays: one for countries (ICountry objects), and one for unique regions in string format.
 */
const getCountriesAndRegionsFromData = (countryRawData: ApiCountryData[]) => {
  const regions = new Set<string>();
  const counties: ICountry[] = [];

  countryRawData.forEach(countryData => {
    try {
      const country = getCountryFromData(countryData);

      regions.add(countryData.region);
      counties.push(country);
    } catch (error) {
      console.error(error);
    }
  });

  return {
    counties: counties,
    regions: Array.from(regions),
  };
};

/**
 * Selects a pair of unique countries from a filtered list.
 * @param {ICountry[]} filteredResults - The filtered list of countries.
 * @returns {ICountry[]} An array containing two unique countries.
 */
const getCountriesPair = (filteredResults: ICountry[]) => {
  const leftCountry: ICountry = getUniqueCountry(filteredResults);
  const rightCountry: ICountry = getUniqueCountry(filteredResults, leftCountry);

  return [leftCountry, rightCountry];
};

/**
 * Converts raw country data into an ICountry object.
 * @param {ApiCountryData} countryData - The raw API data of a country.
 * @returns {ICountry} The formatted country object.
 * @throws {Error} If the data transformation fails, throwing an error detailing the cause.
 */
const getCountryFromData = (countryData: ApiCountryData) => {
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

/**
 * Selects a unique random country from a list of countries, optionally ensuring it is not the same as another selected country.
 * @param {ICountry[]} filteredResults - The filtered list of countries from which to select.
 * @param {ICountry} [preSelectedCountry] - An optional country that the selected country must not match.
 * @returns {ICountry} A unique country from the filteredResults.
 */
const getUniqueCountry = (
  filteredResults: ICountry[],
  preSelectedCountry?: ICountry
): ICountry => {
  const index = Math.floor(Math.random() * filteredResults.length);
  const country: ICountry = filteredResults[index];
  const isNotSame = preSelectedCountry?.id !== country.id;

  if (isNotSame) {
    return country;
  } else {
    return getUniqueCountry(filteredResults, preSelectedCountry);
  }
};

/**
 * Updates the Elo ratings for a pair of countries where one is selected by a user.
 * @param {ICountry[]} countries - The original list of all countries.
 * @param {ICountry[]} countriesPair - An array containing two countries where one of which is selected by a user.
 * @param {ICountry} selectedCountry - The country selected by the user.
 * @returns {ICountry[]} Updated array of countries with new ratings.
 * @throws {Error} If the selected country or its opponent isn't found in the provided lists.
 */
const setCountriesPairRate = (
  countries: ICountry[],
  countriesPair: ICountry[],
  selectedCountry: ICountry
) => {
  const updatedCountries = [...countries];
  const country = updatedCountries.find(
    country => selectedCountry.id === country.id
  );
  const opponentRating = countriesPair.find(
    value => selectedCountry.id !== value.id
  );

  if (!country || !opponentRating) {
    throw new Error('Somehow country not found.');
  }

  const currentRate = country.rating;
  const opponentRate = opponentRating.rating;

  opponentRating.rating = elo.updateRating(opponentRate, currentRate, 0);
  country.rating = elo.updateRating(currentRate, opponentRate, 1);

  return updatedCountries;
};

/**
 * Sorts an array of countries by their ratings, using the country name as a secondary sort if ratings are equal.
 * @param {ICountry[]} countries - The array of countries to sort.
 * @returns {ICountry[]} A new array of countries sorted primarily by rating in descending order, and secondarily by name in ascending order.
 */
const sortCountriesByRating = (countries: ICountry[]) => {
  const sortedCountries = countries.sort((prevCountry, nextCountry) => {
    if (prevCountry.rating - nextCountry.rating === 0) {
      return prevCountry.name > nextCountry.name ? 1 : -1;
    } else {
      return prevCountry.rating - nextCountry.rating < 0 ? 1 : -1;
    }
  });

  return sortedCountries;
};

export {
  changeRegionsList,
  getCountryFromData,
  sortCountriesByRating,
  filterCountriesByRegions,
  setCountriesPairRate,
  getCountriesPair,
  getCountriesAndRegionsFromData,
};
