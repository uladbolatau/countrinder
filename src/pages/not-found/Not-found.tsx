import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PATH from '../../utilities/constants/path';
import onLoadContext from '../../components/UI/loader/loader-context';

import './not-found.scss';
import Header from '../../components/header/Header';

const NotFound = () => {
  const setLoading = useContext(onLoadContext);

  useEffect(() => {
    setLoading();
  }, [setLoading]);

  return (
    <>
      <Header></Header>
      <section className="not-found">
        <h1 className="not-found__title">Page not found</h1>
        <Link className="not-found__back" to={`${PATH.root}`}>
          Go home
        </Link>
      </section>
    </>
  );
};

export default NotFound;
