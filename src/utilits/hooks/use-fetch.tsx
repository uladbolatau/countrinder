import { useEffect } from "react";

/**
 *
 * @param endpoint
 * @param resolve
 * @param reject
 */
const useFetch = (
  endpoint: string,
  variablesArray: unknown[],
  resolve: any,
  reject?: any
) => {
  useEffect(() => {
    // TODO: Test does it works.
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(endpoint, { signal })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      })
      .then((data: unknown[]) => {
        resolve(data);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });

    return () => {
      controller.abort();
    };
  }, variablesArray);
};

export default useFetch;
