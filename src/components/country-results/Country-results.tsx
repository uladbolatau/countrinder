import React, { useMemo } from 'react';
import ICountry from '../../utils/models/ICountry';

import './country-results.scss';

import { Link } from 'react-router-dom';
import { sortCountriesByRating } from '../../utils/Country-helpers';
import PATH from '../../utils/constants/path';

interface CountryResultsProps {
  countries: ICountry[];
}

const CountryResults = ({ countries }: CountryResultsProps) => {
  const renderFilteredResults = useMemo(() => {
    return sortCountriesByRating(countries);
  }, [countries]);

  return (
    <section className="country-results-container">
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
