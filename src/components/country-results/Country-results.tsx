import React, { useEffect, useMemo, useState } from 'react';
import CountryRegionFilter from '../country-region-filter/Country-region-filter';
import ICountry from '../../utilits/models/ICountry';

import './country-results.scss';
import { Link, Outlet } from 'react-router-dom';
import { PATH_DEFAULT_RATE } from '../../utilits/constants/path';

interface CountryResultsProps {
  countries: ICountry[];
  regions: string[];
}

const CountryResults = ({ countries, regions }: CountryResultsProps) => {
  const [filterdResults, setFilterdResults] = useState<ICountry[]>(countries);
  const [checkedRegions, setCheckedRegions] = useState<string[]>([]);
  const renderFilterdResults = useMemo(() => {
    return filterdResults.sort((prevCountry, nextCountry) => {
      if (prevCountry.rating - nextCountry.rating === 0) {
        return prevCountry.name > nextCountry.name ? 1 : -1;
      } else {
        return prevCountry.rating - nextCountry.rating < 0 ? 1 : -1;
      }
    });
  }, [filterdResults]);

  useEffect(() => {
    let newFilteredCountries: ICountry[] = [];

    if (checkedRegions.length === 0) {
      newFilteredCountries = [...countries];
    } else {
      newFilteredCountries = countries.filter((country: ICountry) =>
        checkedRegions.includes(country.region)
      );
    }

    setFilterdResults(newFilteredCountries);
  }, [countries, checkedRegions]);

  return (
    <section className="country-results-container">
      <CountryRegionFilter
        regions={regions}
        onRegionsChecked={regions => setCheckedRegions(regions)}
      ></CountryRegionFilter>
      <div>
        <Outlet />
      </div>
      <ul className="country-results">
        {renderFilterdResults.map(country => (
          <li key={country.id}>
            <Link
              to={`${PATH_DEFAULT_RATE}/${country.path}`}
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
