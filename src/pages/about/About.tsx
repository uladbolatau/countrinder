import React, { useContext, useEffect } from 'react';
import onLoadContext from '../../components/UI/loader/loader-context';

import './about.scss';

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
