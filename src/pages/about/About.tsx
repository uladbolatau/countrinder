import React, { useContext, useEffect } from 'react';

import './about.scss';

import onLoadContext from '../../components/UI/loader/loader-context';

const About = () => {
  const setLoading = useContext(onLoadContext);

  useEffect(() => {
    setLoading();
  }, []);

  return (
    <section className="about">
      <h1 className="about__title">About Countrinder</h1>
    </section>
  );
};

export default About;
