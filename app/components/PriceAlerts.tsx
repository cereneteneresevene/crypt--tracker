'use client';

import { useState, useEffect } from 'react';
import { PriceAlert } from '../types';
import { useLivePrices } from '../hooks/useLivePrices';

export default function PriceAlerts() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [form, setForm] = useState({ symbol: '', targetPrice: '', condition: 'above' as 'above' | 'below' });
  const [showForm, setShowForm] = useState(false);
  const { prices } = useLivePrices();

  useEffect(() => {
    const saved = localStorage.getItem('alerts');
    if (saved) setAlerts(JSON.parse(saved));
  }, []);

  useEffect(() => {
    alerts.forEach(alert => {
      const livePrice = prices[alert.symbol];
      if (!livePrice) return;
      if (alert.condition === 'above' && livePrice >= alert.targetPrice) {
        new Notification(`🚀 ${alert.symbol} $${alert.targetPrice} üzerine çıktı!`);
      }
      if (alert.condition === 'below' && livePrice <= alert.targetPrice) {
        new Notification(`📉 ${alert.symbol} $${alert.targetPrice} altına düştü!`);
      }
    });
  }, [prices]);

  const save = (items: PriceAlert[]) => {
    setAlerts(items);
    localStorage.setItem('alerts', JSON.stringify(items));
  };

  const addAlert = () => {
    if (!form.symbol || !form.targetPrice) return;
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    save([...alerts, {
      coinId: form.symbol.toLowerCase(),
      symbol: form.symbol.toUpperCase(),
      targetPrice: parseFloat(form.targetPrice),
      condition: form.condition,
    }]);
    setForm({ symbol: '', targetPrice: '', condition: 'above' });
    setShowForm(false);
  };

  const removeAlert = (index: number) => {
    save(alerts.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h2 className="text-white font-semibold text-lg mb-6">Fiyat Alarmları</h2>

      {alerts.length === 0 && !showForm && (
        <p className="text-gray-500 text-sm text-center py-6">Henüz alarm kurulmadı</p>
      )}

      <div className="space-y-3 mb-4">
        {alerts.map((alert, i) => {
          const livePrice = prices[alert.symbol];
          return (
            <div key={i} className="flex items-center justify-between bg-gray-800 rounded-xl px-4 py-3">
              <div>
                <p className="text-white text-sm font-medium">{alert.symbol}</p>
                <p className="text-gray-500 text-xs">
                  {alert.condition === 'above' ? '↑ Üzerine çıkınca' : '↓ Altına düşünce'}: ${alert.targetPrice.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs">Şu an</p>
                <p className="text-white text-sm">${livePrice?.toLocaleString() || '—'}</p>
              </div>
              <button onClick={() => removeAlert(i)} className="text-gray-600 hover:text-red-400 text-xs ml-4">✕</button>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="bg-gray-800 rounded-xl p-4 mb-4 space-y-3">
          <input
            type="text"
            placeholder="Sembol (BTC, ETH...)"
            value={form.symbol}
            onChange={e => setForm({ ...form, symbol: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-gray-500"
          />
          <input
            type="number"
            placeholder="Hedef fiyat ($)"
            value={form.targetPrice}
            onChange={e => setForm({ ...form, targetPrice: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-gray-500"
          />
          <select
            value={form.condition}
            onChange={e => setForm({ ...form, condition: e.target.value as 'above' | 'below' })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
          >
            <option value="above">Üzerine çıkınca bildir</option>
            <option value="below">Altına düşünce bildir</option>
          </select>
          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-600 text-gray-400 py-2 rounded-lg text-sm hover:bg-gray-700">İptal</button>
            <button onClick={addAlert} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700">Kaydet</button>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowForm(true)}
        className="w-full border border-gray-700 text-gray-400 py-2.5 rounded-xl text-sm hover:border-indigo-500 hover:text-indigo-400 transition-all"
      >
        + Alarm Ekle
      </button>
    </div>
  );
}