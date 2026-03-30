export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
  market_cap: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface PortfolioItem {
  coinId: string;
  symbol: string;
  name: string;
  amount: number;
  buyPrice: number;
}

export interface PriceAlert {
  coinId: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
}

export interface LivePrice {
  [symbol: string]: number;
}