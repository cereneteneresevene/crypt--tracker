'use client';

import { Coin } from '../types';
import { useLivePrices } from '../hooks/useLivePrices';

interface Props {
  coin: Coin;
}

export default function CoinCard({ coin }: Props) {
  const { prices, prevPrices } = useLivePrices();

  const livePrice = prices[coin.symbol.toUpperCase()] || coin.current_price;
  const prevPrice = prevPrices[coin.symbol.toUpperCase()] || livePrice;
  const isUp = livePrice >= prevPrice;
  const change = coin.price_change_percentage_24h;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-600 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={coin.image} alt={coin.name} className="w-9 h-9 rounded-full" />
          <div>
            <p className="font-semibold text-white text-sm">{coin.name}</p>
            <p className="text-gray-500 text-xs uppercase">{coin.symbol}</p>
          </div>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
          change >= 0
            ? 'bg-emerald-500/10 text-emerald-400'
            : 'bg-red-500/10 text-red-400'
        }`}>
          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
        </span>
      </div>

      <div className={`text-2xl font-bold transition-colors duration-300 ${
        isUp ? 'text-emerald-400' : 'text-red-400'
      }`}>
        ${livePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>

      <div className="mt-3 flex justify-between text-xs text-gray-500">
        <span>Hacim: ${(coin.total_volume / 1e9).toFixed(2)}B</span>
        <span>Mkt: ${(coin.market_cap / 1e9).toFixed(2)}B</span>
      </div>
    </div>
  );
}