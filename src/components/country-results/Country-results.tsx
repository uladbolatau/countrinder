import React, { useEffect, useMemo, useRef, useState } from 'react';
import ICountry from '../../utils/models/ICountry';

import './country-results.scss';

import { Link } from 'react-router-dom';
import {
  filterResultsBySearch,
  sortCountriesByRating,
} from '../../utils/Country-helpers';
import PATH from '../../utils/constants/path';

interface CountryResultsProps {
  countries: ICountry[];
}

const CountryResults = ({ countries }: CountryResultsProps) => {
  const [filterResults, setFilterResults] = useState(countries);
  const searchRef = useRef<HTMLInputElement>(null);

  const renderFilteredResults = useMemo(() => {
    const sortedCountries = sortCountriesByRating(filterResults);

    return sortedCountries;
  }, [countries, filterResults]);

  const onSearch = (searchData: string) => {
    const filteredCountries = filterResultsBySearch(countries, searchData);

    setFilterResults(filteredCountries);
  };

  useEffect(() => {
    onSearch(searchRef.current?.value || '');
  }, [countries]);

  return (
    <section className="country-results-container">
      <div className="country-results-search">
        <input
          type="search"
          className="country-results-search__input"
          placeholder="Search country by name"
          ref={searchRef}
          onChange={event => onSearch(event.target.value)}
        />
      </div>
      <ul className="country-results">
        {renderFilteredResults.map(country => (
          <li key={country.id}>
            <Link
              to={`${PATH.country.root}/${country.path}`}
              className="country-results-item"
            >
              <h3 className="country-results-item__name">{country.name}</h3>
              <span className="country-results-item__rating">
                {country.rating}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CountryResults;
