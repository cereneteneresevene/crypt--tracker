import CoinList from './components/CoinList';
import Portfolio from './components/Portfolio';
import PriceAlerts from './components/PriceAlerts';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">₿</div>
            <div>
              <h1 className="text-white font-bold text-lg">CryptoTrack</h1>
              <p className="text-gray-500 text-xs">Canlı kripto takip paneli</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-gray-400 text-xs">Canlı</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Coin Listesi */}
        <div className="mb-8">
          <h2 className="text-gray-400 text-sm font-medium mb-4 uppercase tracking-wider">Piyasa</h2>
          <CoinList />
        </div>

        {/* Portföy + Alarmlar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Portfolio />
          <PriceAlerts />
        </div>
      </div>
    </main>
  );
}