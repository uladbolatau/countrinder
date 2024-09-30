console.clear();

import React, { useContext, useEffect, useState } from 'react';

import './country-selectors.scss';

import useFetch from '../../utilities/hooks/use-fetch';
import {
  API_DOMAIN_URL,
  API_ALL_COUNTRIES,
} from '../../utilities/constants/api';
import ICountry from '../../utilities/models/ICountry';
import CountryCard from '../../components/country-card/Country-card';
import CountryResults from '../../components/country-results/Country-results';
import EloRatingSystem from '../../utilities/elo-rating-system';
import ApiCountryData from '../../utilities/types/api-cCountry-data';
import { CountryToModel } from '../../utilities/Country-helpers';
import onLoadContext from '../../components/UI/loader/loader-context';

/**
 * Country selectors.
 * @param props
 */
const CountrySelector = () => {
  const elo = new EloRatingSystem();
  const setLoading = useContext(onLoadContext);
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [regions, setRegion] = useState<string[]>([]);
  const [countriesPair, setCountriesPair] = useState<ICountry[]>([]);
  const pathToAllCountries = `${API_DOMAIN_URL}/${API_ALL_COUNTRIES}`;

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
    pathToAllCountries,
    (data: ApiCountryData[]) => {
      console.log('CountrySelector.useFetch');

      const regions = new Set<string>();
      const counties: ICountry[] = [];

      data.forEach(countryData => {
        try {
          const country = CountryToModel(countryData);

          regions.add(countryData.region);
          counties.push(country);
        } catch (error) {
          console.error(error);
        }
      });

      setCountries(counties);
      setRegion(Array.from(regions));
      setLoading();
    },
    error => {
      console.error(error);
      setLoading();
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
