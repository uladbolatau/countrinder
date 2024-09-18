import { createContext } from 'react';

/**
 * Context to control state of Loader component.
 *
 * @type boolean
 * @default false
 */
const LoaderContext = createContext(() => {});

export default LoaderContext;
