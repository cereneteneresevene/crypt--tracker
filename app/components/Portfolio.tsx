'use client';

import { useState, useEffect } from 'react';
import { PortfolioItem } from '../types';
import { useLivePrices } from '../hooks/useLivePrices';

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [form, setForm] = useState({ coinId: '', symbol: '', name: '', amount: '', buyPrice: '' });
  const [showForm, setShowForm] = useState(false);
  const { prices } = useLivePrices();

  useEffect(() => {
    const saved = localStorage.getItem('portfolio');
    if (saved) setPortfolio(JSON.parse(saved));
  }, []);

  const save = (items: PortfolioItem[]) => {
    setPortfolio(items);
    localStorage.setItem('portfolio', JSON.stringify(items));
  };

  const addCoin = () => {
    if (!form.symbol || !form.amount || !form.buyPrice) return;
    const newItem: PortfolioItem = {
      coinId: form.symbol.toLowerCase(),
      symbol: form.symbol.toUpperCase(),
      name: form.name || form.symbol.toUpperCase(),
      amount: parseFloat(form.amount),
      buyPrice: parseFloat(form.buyPrice),
    };
    save([...portfolio, newItem]);
    setForm({ coinId: '', symbol: '', name: '', amount: '', buyPrice: '' });
    setShowForm(false);
  };

  const removeCoin = (index: number) => {
    save(portfolio.filter((_, i) => i !== index));
  };

  const totalValue = portfolio.reduce((acc, item) => {
    const livePrice = prices[item.symbol] || item.buyPrice;
    return acc + livePrice * item.amount;
  }, 0);

  const totalCost = portfolio.reduce((acc, item) => acc + item.buyPrice * item.amount, 0);
  const totalPnl = totalValue - totalCost;
  const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-white font-semibold text-lg">Portföyüm</h2>
          <p className="text-gray-500 text-sm mt-0.5">Toplam değer:
            <span className="text-white font-semibold ml-1">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </p>
        </div>
        <div className="text-right">
          <p className={`text-lg font-bold ${totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
          </p>
          <p className={`text-xs ${totalPnlPct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {totalPnlPct >= 0 ? '+' : ''}{totalPnlPct.toFixed(2)}%
          </p>
        </div>
      </div>

      {portfolio.length === 0 && !showForm && (
        <p className="text-gray-500 text-sm text-center py-6">Henüz coin eklenmedi</p>
      )}

      <div className="space-y-3 mb-4">
        {portfolio.map((item, i) => {
          const livePrice = prices[item.symbol] || item.buyPrice;
          const value = livePrice * item.amount;
          const pnl = (livePrice - item.buyPrice) * item.amount;
          const pnlPct = ((livePrice - item.buyPrice) / item.buyPrice) * 100;
          return (
            <div key={i} className="flex items-center justify-between bg-gray-800 rounded-xl px-4 py-3">
              <div>
                <p className="text-white text-sm font-medium">{item.symbol}</p>
                <p className="text-gray-500 text-xs">{item.amount} adet</p>
              </div>
              <div className="text-right">
                <p className="text-white text-sm">${value.toFixed(2)}</p>
                <p className={`text-xs ${pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {pnl >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%
                </p>
              </div>
              <button onClick={() => removeCoin(i)} className="text-gray-600 hover:text-red-400 text-xs ml-4">✕</button>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="bg-gray-800 rounded-xl p-4 mb-4 space-y-3">
          {[
            { key: 'symbol', placeholder: 'Sembol (BTC, ETH...)' },
            { key: 'name', placeholder: 'İsim (Bitcoin...)' },
            { key: 'amount', placeholder: 'Miktar (0.5)' },
            { key: 'buyPrice', placeholder: 'Alış fiyatı ($)' },
          ].map(f => (
            <input
              key={f.key}
              type="text"
              placeholder={f.placeholder}
              value={form[f.key as keyof typeof form]}
              onChange={e => setForm({ ...form, [f.key]: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-gray-500"
            />
          ))}
          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-600 text-gray-400 py-2 rounded-lg text-sm hover:bg-gray-700">İptal</button>
            <button onClick={addCoin} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700">Ekle</button>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowForm(true)}
        className="w-full border border-gray-700 text-gray-400 py-2.5 rounded-xl text-sm hover:border-indigo-500 hover:text-indigo-400 transition-all"
      >
        + Coin Ekle
      </button>
    </div>
  );
}