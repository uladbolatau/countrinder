console.clear();

import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './country-selectors.scss';

import { API_DOMAIN_URL, API_ALL_COUNTRIES } from '../../utils/constants/api';
import ApiCountryData from '../../utils/types/api-cCountry-data';
import CountryCard from '../../components/country-card/Country-card';
import CountryRegionFilter from '../../components/country-region-filter/Country-region-filter';
import CountryResults from '../../components/country-results/Country-results';
import {
  filterCountriesByRegions,
  getCountriesAndRegionsFromData,
  getCountriesPair,
  setCountriesPairRate,
} from '../../utils/Country-helpers';
import ICountry from '../../utils/models/ICountry';
import onLoadContext from '../../components/UI/loader/loader-context';
import PATH from '../../utils/constants/path';
import useFetch from '../../utils/hooks/use-fetch';

const CountrySelector = () => {
  const setLoading = useContext(onLoadContext);
  const navigate = useNavigate();
  const pathToAllCountries = `${API_DOMAIN_URL}/${API_ALL_COUNTRIES}`;

  const [checkedRegions, setCheckedRegions] = useState<string[]>([]);
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [countriesPair, setCountriesPair] = useState<ICountry[]>([]);
  const [filteredResults, setFilteredResults] = useState<ICountry[]>([]);
  const [regions, setRegion] = useState<string[]>([]);

  /**
   *
   */
  const onClick = (selectedCountry: ICountry) => {
    const updatedCountries = setCountriesPairRate(
      countries,
      countriesPair,
      selectedCountry
    );

    setCountries(updatedCountries);
  };

  /**
   * Get countries data.
   */
  useFetch<ApiCountryData[]>(
    pathToAllCountries,
    (data: ApiCountryData[]) => {
      console.log('CountrySelector.useFetch');
      const { counties, regions } = getCountriesAndRegionsFromData(data);

      setCountries(counties);
      setRegion(regions);
      setLoading();
    },
    error => {
      console.error(error);
      navigate(`${PATH.not_found}`);
    }
  );

  /**
   * Generate countries pair to rate.
   */
  useEffect(() => {
    console.log('useEffect.filteredResults', countries);

    if (countries.length !== 0) {
      const countriesPair = getCountriesPair(filteredResults);

      setCountriesPair(countriesPair);
    }
  }, [filteredResults]);

  /**
   * Filter countries with regions.
   */
  useEffect(() => {
    const newFilteredCountries = filterCountriesByRegions(
      countries,
      checkedRegions
    );

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
