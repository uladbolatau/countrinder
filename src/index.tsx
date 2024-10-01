import React from 'react';
import ReactDOM from 'react-dom/client';

import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';

import './index.scss';
import App from './App';
import router from './App-routing';
import NotFound from './pages/not-found/Not-found';
import PATH from './utils/constants/path';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const browserRouter = createBrowserRouter([
  {
    path: `${PATH.root}`,
    element: <App />,
    errorElement: <Navigate to={PATH.not_found} />,
    children: router,
  },
  {
    path: `${PATH.not_found}`,
    element: <NotFound />,
  },
]);

root.render(<RouterProvider router={browserRouter} />);
