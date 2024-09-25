import React from 'react';
import jss from 'jss';
import { Link } from 'react-router-dom';
import preset from 'jss-preset-default';
import { PATH_ABOUT, PATH_DEFAULT_RATE } from '../../utilits/constants/path';

jss.setup(preset());

const styles = jss.createStyleSheet({
  headerContainer: {
    padding: '8px',
    zIndex: '10000',
  },
  headerNav: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
  },
});

styles.attach();

const Header = () => {
  return (
    <header className={styles.classes.headerContainer}>
      <nav>
        <ul className={styles.classes.headerNav}>
          <li className="header-nav__item">
            <Link to={`${PATH_DEFAULT_RATE}`}>Rate</Link>
          </li>
          <li className="header-nav__item">
            <Link to={`${PATH_ABOUT}`}>About</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
