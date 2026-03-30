'use client';

import { useState, useEffect, useRef } from 'react';
import { LivePrice } from '../types';

const SYMBOLS = ['btcusdt', 'ethusdt', 'bnbusdt', 'solusdt', 'xrpusdt', 'adausdt', 'dogeusdt', 'avaxusdt'];

export function useLivePrices() {
  const [prices, setPrices] = useState<LivePrice>({});
  const [prevPrices, setPrevPrices] = useState<LivePrice>({});
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const streams = SYMBOLS.map(s => `${s}@ticker`).join('/');
    const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const ticker = data.data;
      const symbol = ticker.s.replace('USDT', '');
      const price = parseFloat(ticker.c);

      setPrevPrices(prev => ({ ...prev, [symbol]: prices[symbol] || price }));
      setPrices(prev => ({ ...prev, [symbol]: price }));
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  return { prices, prevPrices };
}