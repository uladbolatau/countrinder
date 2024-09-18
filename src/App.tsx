import React, { useState } from "react";

import Loader from "./components/UI/loader/Loader";
import CountrySelector from "./pages/country-selectors/Country-selectors";

import "./App.scss";

const App = () => {
  const test: any = "";
  const [isLoading, setLoaded] = useState(true);

  return (
    <>
      <Loader isLoading={isLoading}></Loader>
      <main className="main">
        <CountrySelector onLoaded={() => setLoaded(false)}></CountrySelector>
      </main>
    </>
  );
};

export default App;
