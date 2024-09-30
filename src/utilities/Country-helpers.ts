import { DEFAULT_ELO_RATE } from './constants/elo-rating';
import EloRatingSystem from './elo-rating-system';
import ICountry from './models/ICountry';
import ApiCountryData from './types/api-cCountry-data';

class CountryHelper {
  private countries: ICountry[] = [];
  private countriesPair: ICountry[] = [];
  private elo: EloRatingSystem;
  private regions: string[] = [];

  constructor() {
    this.elo = new EloRatingSystem();
  }

  getCountiesFromRaw(
    countriesRawData: ApiCountryData[]
  ): [ICountry[], string[]] {
    const regions = new Set<string>();
    const counties: ICountry[] = [];

    countriesRawData.forEach(countryRawData => {
      try {
        const country = CountryHelper.getCountryFromRaw(countryRawData);

        regions.add(countryRawData.region);
        counties.push(country);
      } catch (error) {
        console.error(error);
      }
    });

    return [counties, Array.from(regions)];
  }

  getCountries(): ICountry[] {
    return this.countries;
  }

  getCountriesPair() {
    this.selectCountriesPair();
    return this.countriesPair;
  }

  getRegions() {
    return this.regions;
  }

  static getCountryFromRaw(countryRawData: ApiCountryData): ICountry {
    try {
      const country: ICountry = {
        capital: countryRawData.capital,
        flagURL: countryRawData.flags.svg ?? countryRawData.flags.png,
        id: countryRawData.cca3,
        isRated: false,
        name: countryRawData.name.common,
        path: countryRawData.name.common
          .replaceAll(' ', '-')
          .toLocaleLowerCase(),
        rating: DEFAULT_ELO_RATE,
        region: countryRawData.region,
      };

      return country;
    } catch (error) {
      throw new Error(`Country can be transferred to ICountry model.`, {
        cause: error,
      });
    }
  }

  private getUniqueCountry(preSelectedCountry?: ICountry): ICountry {
    const index = Math.floor(Math.random() * this.countries.length);
    const country: ICountry = this.countries[index];
    const isNotSame = preSelectedCountry?.id !== country.id;

    if (isNotSame) {
      return country;
    } else {
      return this.getUniqueCountry(preSelectedCountry);
    }
  }

  rateCountry(selectedCountry: ICountry): ICountry[] {
    const updatedCountries = [...this.countries];
    const country = updatedCountries.find(
      country => selectedCountry.id === country.id
    );
    const opponentRating = this.countriesPair.find(
      value => selectedCountry.id !== value.id
    );

    if (!country || !opponentRating) {
      throw new Error('Somehow country not found.');
    }

    const currentRate = country.rating;
    const opponentRate = opponentRating.rating;

    opponentRating.rating = this.elo.updateRating(opponentRate, currentRate, 0);
    country.rating = this.elo.updateRating(currentRate, opponentRate, 1);

    this.countries = updatedCountries;

    return this.countries;
  }

  selectCountriesPair(): [ICountry, ICountry] {
    const leftCountry: ICountry = this.getUniqueCountry();
    const rightCountry: ICountry = this.getUniqueCountry(leftCountry);

    this.countriesPair = [leftCountry, rightCountry];

    return [leftCountry, rightCountry];
  }

  setCountries(countriesRawData: ApiCountryData[]) {
    [this.countries, this.regions] = this.getCountiesFromRaw(countriesRawData);
  }
}

export default CountryHelper;
