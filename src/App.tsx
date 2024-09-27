import React, { useState } from 'react';

import Loader from './components/UI/loader/Loader';
import CountrySelector from './pages/country-selectors/Country-selectors';
import Header from './components/header/Header';

import './App.scss';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PATH_ABOUT, PATH_DEFAULT_RATE } from './utilities/constants/path';
import About from './pages/about/About';
import CountryDetails from './pages/country-details/Country-details';

const App = () => {
  const [isLoading, setLoaded] = useState(true);

  return (
    <>
      <Header></Header>
      <Loader isLoading={isLoading}></Loader>
      <main className="main">
        <Routes>
          <Route
            path={`${PATH_DEFAULT_RATE}`}
            element={
              <CountrySelector
                onLoaded={() => setLoaded(false)}
              ></CountrySelector>
            }
          />
          <Route path={`${PATH_ABOUT}`} element={<About></About>} />
          <Route
            path={`${PATH_DEFAULT_RATE}/:countryId`}
            element={
              <CountryDetails
                onLoaded={() => setLoaded(false)}
              ></CountryDetails>
            }
          />
          <Route path="*" element={<Navigate to={`${PATH_DEFAULT_RATE}`} />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
