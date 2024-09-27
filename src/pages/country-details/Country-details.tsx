import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ICountry from '../../utilities/models/ICountry';
import useFetch from '../../utilities/hooks/use-fetch';
import {
  API_COUNTRY_NAME,
  API_DOMAIN_URL,
} from '../../utilities/constants/api';
import ApiCountryData from '../../utilities/types/api-cCountry-data';
import { DEFAULT_ELO_RATE } from '../../utilities/constants/elo-rating';

import './country-details.scss';

interface CountryDetailsProps {
  /**
   * Mark component as loaded.
   */
  onLoaded(): void;
}

const CountryDetails = ({ onLoaded }: CountryDetailsProps) => {
  const { countryId } = useParams();
  const [country, setCountry] = useState<ICountry>();

  useFetch(
    `${API_DOMAIN_URL}/${API_COUNTRY_NAME}/${countryId?.replaceAll(
      '-',
      '%20'
    )}`,
    [],
    (countryDataArray: ApiCountryData[]) => {
      const countryData = countryDataArray[0];

      const country: ICountry = {
        capital: countryData.capital,
        flagURL: countryData.flags.svg ?? countryData.flags.png,
        id: countryData.cca3,
        isRated: false,
        mapURL: countryData.maps.googleMaps,
        name: countryData.name.common,
        path: countryData.name.common.replaceAll(' ', '-').toLocaleLowerCase(),
        rating: DEFAULT_ELO_RATE,
        region: countryData.region,
      };

      console.log(country.mapURL);

      setCountry(country);
      onLoaded();
    },
    error => {
      console.error(error);
      onLoaded();
    }
  );

  return (
    <section className="country-details">
      <div className="country-details-flag">
        <img
          className="country-details-flag__img"
          src={country?.flagURL}
          alt={country?.name}
        />
      </div>
      <h1 className="country-details__title">{countryId}</h1>
      <ul className="country-details-list">
        <li className="country-details-list__item">
          <strong>Capital:</strong> {country?.capital}
        </li>
        <li className="country-details-list__item">
          <strong>Your rate:</strong> {country?.rating}
        </li>
        <li className="country-details-list__item">
          <strong>Region: </strong> {country?.region}
        </li>
      </ul>
      <iframe
        className="country-details-map"
        height="400"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={country?.mapURL}
      ></iframe>
    </section>
  );
};

export default CountryDetails;
