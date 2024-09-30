import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import './App.scss';

import Loader from './components/UI/loader/Loader';
import CountrySelector from './pages/country-selectors/Country-selectors';
import Header from './components/header/Header';
import PATH from './utilities/constants/path';
import About from './pages/about/About';
import CountryDetails from './pages/country-details/Country-details';
import NotFound from './pages/not-found/Not-found';
import onLoadContext from './components/UI/loader/loader-context';

const App = () => {
  const location = useLocation();
  const [isLoading, setLoading] = useState(true);

  const onLoaded = () => {
    console.log('set false to loading', isLoading);
    setLoading(false);
  };

  useEffect(() => {
    console.log('set true to loading', isLoading, location);
    // TODO: Need to be fixed issue with order of useEffect hook and onLoaded function
    // setLoading(true);
  }, [location]);

  return (
    <>
      <Header></Header>
      <Loader isLoading={isLoading}></Loader>
      <main className="main">
        <onLoadContext.Provider value={onLoaded}>
          <Routes>
            <Route
              path={`${PATH.rate.root}`}
              element={<CountrySelector></CountrySelector>}
            />
            <Route
              path={`${PATH.rate.root}/${PATH.rate.details}`}
              element={<CountryDetails></CountryDetails>}
            />
            <Route path={`${PATH.about}`} element={<About></About>} />
            <Route
              path={`${PATH.not_found}`}
              element={<NotFound></NotFound>}
            ></Route>
            <Route
              path="*"
              element={<Navigate to={`${PATH.not_found}`} />}
            ></Route>
          </Routes>
        </onLoadContext.Provider>
      </main>
    </>
  );
};

export default App;
