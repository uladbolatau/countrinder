console.clear();

import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './country-selectors.scss';

import useFetch from '../../utilities/hooks/use-fetch';
import {
  API_DOMAIN_URL,
  API_ALL_COUNTRIES,
} from '../../utilities/constants/api';
import ApiCountryData from '../../utilities/types/api-cCountry-data';
import CountryCard from '../../components/country-card/Country-card';
import CountryRegionFilter from '../../components/country-region-filter/Country-region-filter';
import CountryResults from '../../components/country-results/Country-results';
import { CountryToModel } from '../../utilities/Country-helpers';
import EloRatingSystem from '../../utilities/elo-rating-system';
import ICountry from '../../utilities/models/ICountry';
import onLoadContext from '../../components/UI/loader/loader-context';
import PATH from '../../utilities/constants/path';

/**
 * Country selectors.
 * @param props
 */
const CountrySelector = () => {
  const elo = new EloRatingSystem();
  const setLoading = useContext(onLoadContext);
  const navigate = useNavigate();
  const pathToAllCountries = `${API_DOMAIN_URL}/${API_ALL_COUNTRIES}`;

  const [checkedRegions, setCheckedRegions] = useState<string[]>([]);
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [countriesPair, setCountriesPair] = useState<ICountry[]>([]);
  const [filteredResults, setFilteredResults] = useState<ICountry[]>([]);
  const [regions, setRegion] = useState<string[]>([]);

  const selectCountriesPair = () => {
    const leftCountry: ICountry = getUniqueCountry();
    const rightCountry: ICountry = getUniqueCountry(leftCountry);

    setCountriesPair([leftCountry, rightCountry]);
  };

  const getUniqueCountry = (preSelectedCountry?: ICountry): ICountry => {
    const index = Math.floor(Math.random() * filteredResults.length);
    const country: ICountry = filteredResults[index];
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
    setFilteredResults(updatedCountries);
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
      navigate(`${PATH.not_found}`);
    }
  );

  useEffect(() => {
    console.log('useEffect.countries', countries);

    if (countries.length !== 0) {
      selectCountriesPair();
    }
  }, [filteredResults]);

  useEffect(() => {
    let newFilteredCountries: ICountry[] = [];

    if (checkedRegions.length === 0) {
      newFilteredCountries = [...countries];
    } else {
      newFilteredCountries = countries.filter((country: ICountry) =>
        checkedRegions.includes(country.region)
      );
    }

    setFilteredResults(newFilteredCountries);
  }, [countries, checkedRegions]);

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
      <CountryRegionFilter
        regions={regions}
        onRegionsChecked={regions => setCheckedRegions(regions)}
      ></CountryRegionFilter>
      <CountryResults countries={filteredResults}></CountryResults>
    </section>
  );
};

export default CountrySelector;
