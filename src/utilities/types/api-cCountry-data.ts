type ApiCountryData = {
  cca3: string;
  name: {
    common: string;
  };
  flags: {
    svg: string;
    png: string;
  };
  capital: string[];
  region: string;
};

export default ApiCountryData;
