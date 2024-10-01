import React from 'react';
import { Navigate } from 'react-router-dom';

import About from './pages/about/About';
import CountryDetails from './pages/country-details/Country-details';
import CountrySelector from './pages/country-selectors/Country-selectors';
import PATH from './utilities/constants/path';

const router = [
  {
    path: `${PATH.root}`,
    element: <Navigate to={PATH.countries.root} />,
  },
  {
    path: `${PATH.about}`,
    element: <About />,
  },
  {
    path: `${PATH.countries.root}${PATH.countries.paramName}`,
    element: <CountrySelector />,
  },
  {
    path: `${PATH.country.root}${PATH.country.paramName}`,
    element: <CountryDetails />,
  },
];

export default router;
