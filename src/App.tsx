import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import './App.scss';

import Header from './components/header/Header';
import Loader from './components/UI/loader/Loader';
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
          <Outlet></Outlet>
        </onLoadContext.Provider>
      </main>
    </>
  );
};

export default App;
