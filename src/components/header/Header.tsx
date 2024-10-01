import React from 'react';
import jss from 'jss';
import { Link } from 'react-router-dom';
import preset from 'jss-preset-default';
import PATH from '../../utils/constants/path';

jss.setup(preset());

const styles = jss.createStyleSheet({
  headerContainer: {
    padding: '16px',
    zIndex: '10000',
  },
  headerNav: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
  },
  headerNavLink: {
    textDecoration: 'none',
    fontWeight: 300,
  },
});

styles.attach();

const Header = () => {
  const navigation = [
    {
      path: PATH.countries.root,
      name: 'Rate countries',
    },
    {
      path: PATH.about,
      name: 'About',
    },
  ];
  return (
    <header className={styles.classes.headerContainer}>
      <nav>
        <ul className={styles.classes.headerNav}>
          {navigation.map(item => (
            <li key={item.path} className="header-nav-item">
              <Link
                className={styles.classes.headerNavLink}
                to={`${item.path}`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
