import React, { useEffect, useState } from "react";
import CountryRegionFilter from "../country-region-filter/Country-region-filter";
import ICountry from "../../utilits/models/ICountry";

import "./country-results.scss";

interface CountryResultsProps {
  countries: ICountry[];
  regions: string[];
}

const CountryResults = ({ countries, regions }: CountryResultsProps) => {
  const [filterdResults, setFilterdResults] = useState<ICountry[]>(countries);
  const [checkedRegions, setCheckedRegions] = useState<string[]>([]);

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
        onRegionsChecked={(regions) => setCheckedRegions(regions)}
      ></CountryRegionFilter>
      <ul className="country-results">
        {filterdResults
          .sort((a, b) => {
            if (a.rating - b.rating === 0) {
              return a.name > b.name ? 1 : -1;
            } else {
              return a.rating - b.rating < 0 ? 1 : -1;
            }
          })
          .map((country) => (
            <li key={country.id} className="country-results-item">
              <h3 className="country-results-item__name">{country.name}</h3>
              <span className="country-results-item__rating">
                {country.rating}
              </span>
            </li>
          ))}
      </ul>
    </section>
  );
};

export default CountryResults;
