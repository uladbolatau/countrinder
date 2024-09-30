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
import ApiCountryData from '../../utilities/types/api-cCountry-data';
import CountryHelper from '../../utilities/Country-helpers';
import onLoadContext from '../../components/UI/loader/loader-context';

/**
 * Country selectors.
 * @param props
 */
const CountrySelector = () => {
  const countryHelper = new CountryHelper();
  const setLoading = useContext(onLoadContext);
  const pathToAllCountries = `${API_DOMAIN_URL}/${API_ALL_COUNTRIES}`;
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [regions, setRegion] = useState<string[]>([]);
  const [countriesPair, setCountriesPair] = useState<ICountry[]>([]);
  const onClick = (selectedCountry: ICountry) => {
    const updatedCountries = countryHelper.rateCountry(selectedCountry);

    setCountries(updatedCountries);
  };

  useFetch<ApiCountryData[]>(
    pathToAllCountries,
    (data: ApiCountryData[]) => {
      console.log('CountrySelector.useFetch');

      countryHelper.setCountries(data);

      setCountries(countryHelper.getCountries());
      setRegion(countryHelper.getRegions());
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
      const countriesPair = countryHelper.getCountriesPair();

      setCountriesPair(countriesPair);
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
