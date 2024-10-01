import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import './country-details.scss';

import { API_COUNTRY_NAME, API_DOMAIN_URL } from '../../utils/constants/api';
import PATH from '../../utils/constants/path';
import ApiCountryData from '../../utils/types/api-cCountry-data';
import { getCountryFromData } from '../../utils/Country-helpers';
import ICountry from '../../utils/models/ICountry';
import useFetch from '../../utils/hooks/use-fetch';
import onLoadContext from '../../components/UI/loader/loader-context';

const CountryDetails = () => {
  const setLoading = useContext(onLoadContext);
  const navigate = useNavigate();
  const { countryId } = useParams();
  const getCountryDataURL = `${API_DOMAIN_URL}/${API_COUNTRY_NAME}/${countryId?.replaceAll(
    '-',
    '%20'
  )}`;

  const [isDataLoaded, setDataLoaded] = useState(false);
  const [isImageLoaded, setImageLoaded] = useState(false);
  const [country, setCountry] = useState<ICountry>();

  useFetch(
    getCountryDataURL,
    (countryDataArray: ApiCountryData[]) => {
      const country = getCountryFromData(countryDataArray[0]);

      setCountry(country);
      setDataLoaded(true);
    },
    error => {
      console.error('CountryDetails.useFetch', error);
      navigate(`${PATH.not_found}`);
      setLoading();
    }
  );

  useEffect(() => {
    if (isDataLoaded && isImageLoaded) {
      setLoading();
    }
  }, [isDataLoaded, isImageLoaded]);

  return (
    <section className="country-details">
      <div className="country-details-flag">
        <img
          onLoad={() => {
            setImageLoaded(true);
          }}
          className="country-details-flag__img"
          src={country?.flagURL}
          alt={country?.name}
        />
      </div>
      <h1 className="country-details__title">{countryId}</h1>
      <ul className="country-details-list">
        <li className="country-details-list__item">
          <strong>Capital:</strong> {country?.capital ?? '-'}
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
