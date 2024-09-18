import React from 'react';

import './loader.scss';

interface LoaderProps {
  /**
   * Flag does component still loading.
   * @type {boolean}
   */
  isLoading: boolean;
}

/**
 * Loader component.
 * @param {LoaderProps} props
 */
const Loader = ({ isLoading }: LoaderProps) => {
  return (
    <>
      {isLoading && (
        <div className="loader-container">
          <span className="loader">Loading...</span>
        </div>
      )}
    </>
  );
};

export default Loader;
