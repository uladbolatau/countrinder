import React, { useLayoutEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import './App.scss';

import Header from './components/header/Header';
import Loader from './components/UI/loader/Loader';
import onLoadContext from './components/UI/loader/loader-context';

const App = () => {
  const location = useLocation();
  const [isLoading, setLoading] = useState(true);

  const onLoaded = () => {
    setLoading(false);
  };

  useLayoutEffect(() => {
    setLoading(true);
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
