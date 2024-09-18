import { useEffect } from 'react';

const useFetch = <T,>(
  endpoint: string,
  variablesArray: unknown[],
  resolve: (data: T) => void,
  reject: (data: Error) => void
) => {
  useEffect(() => {
    /**
     * TODO: Test does it works.
     */
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(endpoint, { signal })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      })
      .then((data: T) => {
        resolve(data);
      })
      .catch(error => {
        console.error(error);
        reject(error);
      });

    return () => {
      controller.abort();
    };
  }, variablesArray);
};

export default useFetch;
