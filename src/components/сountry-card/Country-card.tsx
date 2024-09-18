import React, { useState } from "react";

import ICountry from "../../utilits/models/ICountry";

import "./сountry-card.scss";
import Loader from "../UI/loader/Loader";

interface CountryCardProps {
  /**
   *
   */
  country: ICountry;
  /**
   *
   */
  onClick?: any; //(country: ICountry) => void;
}

/**
 *
 * @param param0
 */
const CountryCard = ({ country, onClick }: CountryCardProps) => {
  const [isImageLoading, setImageLoading] = useState(true);
  const click = (country: ICountry) => {
    onClick(country);
  };

  return (
    <div className="country-card-container">
      <Loader isLoading={isImageLoading}></Loader>
      <button
        className="country-card"
        type="button"
        onClick={() => click(country)}
      >
        <img
          onLoad={() => setImageLoading(false)}
          className="country-card__flag"
          src={country.flagURL}
          alt={`Flag of ${country.name}`}
          loading="lazy"
          height="130"
          width="250"
        />
        <h2 className="country-card__name">{country.name}</h2>
      </button>
    </div>
  );
};

export default CountryCard;
