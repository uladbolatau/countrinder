console.clear();

import React, { useEffect, useState } from 'react';

import useFetch from '../../utilits/hooks/use-fetch';

import { API_DOMAIN_URL, API_ALL_COUNTRIES } from '../../utilits/constants/api';
import ICountry from '../../utilits/models/ICountry';
import CountryCard from '../../components/country-card/Country-card';
import { DEFAULT_ELO_RATE, K_FACTOR } from '../../utilits/constants/elo-rating';
import CountryResults from '../../components/country-results/Country-results';
import EloRatingSystem from '../../utilits/elo-rating-system';

import './country-selectors.scss';
import ApiCountryData from '../../utilits/types/api-cCountry-data';

interface CountrySelectorProps {
  /**
   * Mark component as loaded.
   */
  onLoaded(): void;
}

/**
 * Country selectors.
 * @param props
 */
const CountrySelector = ({ onLoaded }: CountrySelectorProps) => {
  const elo = new EloRatingSystem(K_FACTOR);
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [regions, setRegion] = useState<string[]>([]);
  const [countriesPair, setCountriesPair] = useState<ICountry[]>([]);

  const selectCountriesPair = () => {
    const leftCountry: ICountry = getUniqueCountry();
    const rightCountry: ICountry = getUniqueCountry(leftCountry);

    setCountriesPair([leftCountry, rightCountry]);
  };

  const getUniqueCountry = (preSelectedCountry?: ICountry): ICountry => {
    const index = Math.floor(Math.random() * countries.length);
    const country: ICountry = countries[index];
    const isNotSame = preSelectedCountry?.id !== country.id;

    if (isNotSame) {
      return country;
    } else {
      return getUniqueCountry(preSelectedCountry);
    }
  };

  const onClick = (selectedCountry: ICountry) => {
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

    setCountries(updatedCountries);
  };

  useFetch<ApiCountryData[]>(
    `${API_DOMAIN_URL}/${API_ALL_COUNTRIES}`,
    [],
    (data: ApiCountryData[]) => {
      console.log('useFetch');

      const regions = new Set<string>();
      const counties: ICountry[] = [];
      data.forEach(countryData => {
        const country: ICountry = {
          capital: countryData.capital,
          flagURL: countryData.flags.svg ?? countryData.flags.png,
          id: countryData.cca3,
          isRated: false,
          mapURL: countryData.maps.googleMaps,
          name: countryData.name.common,
          path: countryData.name.common
            .replaceAll(' ', '-')
            .toLocaleLowerCase(),
          rating: DEFAULT_ELO_RATE,
          region: countryData.region,
        };

        regions.add(countryData.region);
        counties.push(country);
      });

      setCountries(counties);
      setRegion(Array.from(regions));
      onLoaded();
    },
    error => {
      console.error(error);
      onLoaded();
    }
  );

  useEffect(() => {
    console.log('useEffect.countries', countries);

    if (countries.length !== 0) {
      selectCountriesPair();
    }
  }, [countries]);

  return (
    <section className="country-selector">
      <h1 className="country-selector__title">
        Choose the country <br />
        you want to visit the most.
      </h1>
      <div className="countries-container">
        {countriesPair.map(country => (
          <CountryCard
            key={country.id}
            country={country}
            onClick={onClick}
          ></CountryCard>
        ))}
      </div>
      <CountryResults countries={countries} regions={regions}></CountryResults>
    </section>
  );
};

export default CountrySelector;
