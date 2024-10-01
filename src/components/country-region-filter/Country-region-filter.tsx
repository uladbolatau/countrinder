import React, { useEffect, useState } from 'react';

import './country-region-filter.scss';

import { changeRegionsList } from '../../utilities/Country-helpers';

interface CountryRegionFilterProps {
  regions: string[];
  onRegionsChecked(regions: string[]): void;
}

const CountryRegionFilter = ({
  regions,
  onRegionsChecked,
}: CountryRegionFilterProps) => {
  const [checkedRegions, setCheckedRegions] = useState<string[]>([]);

  const changeRegions = (regionName: string) => {
    const newRegions = changeRegionsList(checkedRegions, regionName);

    setCheckedRegions(newRegions);
  };

  useEffect(() => {
    onRegionsChecked(checkedRegions);
  }, [checkedRegions, onRegionsChecked]);

  return (
    <div className="country-region-filter-container">
      <h2 className="country-region-filter__title">
        Filter countries results on region
      </h2>
      <ul className="country-region-filter">
        {regions.map(region => (
          <li className="country-region-filter-item" key={region}>
            <label className="country-region-filter-item__label">
              <input
                type="checkbox"
                name={region}
                onChange={() => changeRegions(region)}
              />
              {region}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CountryRegionFilter;
