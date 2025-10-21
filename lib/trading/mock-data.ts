/**
 * 临时市场数据获取方案
 * 使用公开的 CoinGecko API 获取加密货币价格
 */

interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

export async function getCryptoPrices(): Promise<Record<string, CryptoPrice>> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,dogecoin,binancecoin&order=market_cap_desc&per_page=5&page=1&sparkline=false'
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: CryptoPrice[] = await response.json();
    
    // 转换为项目需要的格式
    const result: Record<string, CryptoPrice> = {};
    data.forEach(coin => {
      const symbol = coin.symbol.toUpperCase();
      if (symbol === 'BTC') result.btc = coin;
      if (symbol === 'ETH') result.eth = coin;
      if (symbol === 'SOL') result.sol = coin;
      if (symbol === 'DOGE') result.doge = coin;
      if (symbol === 'BNB') result.bnb = coin;
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    throw error;
  }
}

/**
 * 生成模拟的市场状态数据
 */
export function generateMockMarketState(symbol: string, price: number) {
  const now = Date.now();
  const prices = [];
  
  // 生成过去10个时间点的价格数据
  for (let i = 9; i >= 0; i--) {
    const time = now - (i * 60000); // 每分钟一个点
    const variation = (Math.random() - 0.5) * price * 0.02; // ±1% 变化
    prices.push(price + variation);
  }
  
  const currentPrice = prices[prices.length - 1];
  const ema20 = prices.slice(-20).reduce((a, b) => a + b, 0) / Math.min(prices.length, 20);
  
  return {
    current_price: currentPrice,
    current_ema20: ema20,
    current_macd: (Math.random() - 0.5) * 100,
    current_rsi: 30 + Math.random() * 40, // RSI 30-70
    open_interest: {
      latest: Math.random() * 1000000,
      average: Math.random() * 1000000,
    },
    funding_rate: (Math.random() - 0.5) * 0.01, // ±0.5%
    intraday: {
      mid_prices: prices,
      ema_20: prices.map(p => p * (0.98 + Math.random() * 0.04)),
      macd: prices.map(() => (Math.random() - 0.5) * 100),
      rsi_7: prices.map(() => 30 + Math.random() * 40),
      rsi_14: prices.map(() => 30 + Math.random() * 40),
    },
    longer_term: {
      ema_20: ema20,
      ema_50: ema20 * (0.95 + Math.random() * 0.1),
      atr_3: price * 0.02,
      atr_14: price * 0.03,
      current_volume: Math.random() * 1000000,
      average_volume: Math.random() * 1000000,
      macd: Array(10).fill(0).map(() => (Math.random() - 0.5) * 100),
      rsi_14: Array(10).fill(0).map(() => 30 + Math.random() * 40),
    },
  };
}
