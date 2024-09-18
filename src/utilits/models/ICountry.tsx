/**
 *
 */
interface ICountry {
  /**
   *
   */
  id: string;
  /**
   *
   */
  name: string;
  /**
   *
   */
  flagURL: string;
  /**
   *
   */
  capital: string[];
  /**
   *
   */
  mapURL: string;
  /**
   *
   */
  rating: number;
  /**
   *
   */
  isRated: boolean;
  /**
   *
   */
  region: string;
}

export default ICountry;
