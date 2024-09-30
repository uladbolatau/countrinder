import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import './country-details.scss';
import {
  API_COUNTRY_NAME,
  API_DOMAIN_URL,
} from '../../utilities/constants/api';
import PATH from '../../utilities/constants/path';
import ApiCountryData from '../../utilities/types/api-cCountry-data';
import { CountryToModel } from '../../utilities/Country-helpers';
import ICountry from '../../utilities/models/ICountry';
import useFetch from '../../utilities/hooks/use-fetch';
import onLoadContext from '../../components/UI/loader/loader-context';

const CountryDetails = () => {
  const setLoading = useContext(onLoadContext);

  const navigate = useNavigate();
  const { countryId } = useParams();
  const [country, setCountry] = useState<ICountry>();
  const getCountryDataURL = `${API_DOMAIN_URL}/${API_COUNTRY_NAME}/${countryId?.replaceAll(
    '-',
    '%20'
  )}`;

  useFetch(
    getCountryDataURL,
    (countryDataArray: ApiCountryData[]) => {
      const country = CountryToModel(countryDataArray[0]);
      setCountry(country);
      setLoading();
    },
    error => {
      console.error('CountryDetails.useFetch', error);
      navigate(`${PATH.not_found}`);
      setLoading();
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
    </section>
  );
};

export default CountryDetails;
