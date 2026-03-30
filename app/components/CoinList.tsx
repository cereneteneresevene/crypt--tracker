'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Coin } from '../types';
import CoinCard from './CoinCard';

export default function CoinList() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCoins();
    const interval = setInterval(fetchCoins, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchCoins = async () => {
    try {
      const res = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 20,
            page: 1,
            sparkline: false,
          },
        }
      );
      setCoins(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const filtered = coins.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Coin ara... (BTC, Ethereum...)"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm mb-6 focus:outline-none focus:border-indigo-500 placeholder-gray-500"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map(coin => (
          <CoinCard key={coin.id} coin={coin} />
        ))}
      </div>
    </div>
  );
}