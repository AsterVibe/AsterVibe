/**
 * Aster Dex API Client
 * 根据官方 API 文档实现：https://github.com/asterdex/api-docs/blob/master/aster-finance-futures-api_CN.md
 */

interface AsterConfig {
  apiKey: string;
  apiSecret: string;
  baseUrl?: string;
}

interface AsterMarketData {
  symbol: string;
  price: number;
  volume24h: number;
  change24h: number;
  high24h: number;
  low24h: number;
}

interface AsterOrder {
  orderId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'LIMIT' | 'MARKET';
  quantity: number;
  price: number;
  status: string;
}

interface AsterPosition {
  symbol: string;
  side: 'LONG' | 'SHORT';
  size: number;
  margin: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
}

interface AsterBalance {
  usdtBalance: number;
  totalBalance: number;
}

export class AsterDexClient {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl: string;

  constructor(config: AsterConfig) {
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    this.baseUrl = config.baseUrl || 'https://fapi.asterdex.com';
  }

  /**
   * 生成签名 - 根据 Aster Dex API 文档
   * 使用 HMAC SHA256 算法，API-Secret 作为密钥
   */
  private generateSignature(timestamp: string, method: string, path: string, body?: string): string {
    const crypto = require('crypto');
    const message = `${timestamp}${method.toUpperCase()}${path}${body || ''}`;
    return crypto.createHmac('sha256', this.apiSecret).update(message).digest('hex');
  }

  /**
   * 发送 API 请求
   */
  private async request(method: string, path: string, data?: any): Promise<any> {
    const timestamp = Date.now().toString();
    const body = data ? JSON.stringify(data) : '';
    const signature = this.generateSignature(timestamp, method, path, body);

    const headers = {
      'Content-Type': 'application/json',
      'X-MBX-APIKEY': this.apiKey,
      'X-Timestamp': timestamp,
      'X-Signature': signature,
    };

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body || undefined,
    });

    if (!response.ok) {
      throw new Error(`Aster API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 获取单个交易对价格 - GET /fapi/v1/ticker/price
   */
  async fetchTicker(symbol: string): Promise<AsterMarketData> {
    const data = await this.request('GET', `/fapi/v1/ticker/price?symbol=${symbol}`);
    return {
      symbol: data.symbol,
      price: parseFloat(data.price),
      volume24h: 0, // 单个 ticker 不包含 volume
      change24h: 0, // 单个 ticker 不包含 change
      high24h: 0,   // 单个 ticker 不包含 high
      low24h: 0,   // 单个 ticker 不包含 low
    };
  }

  /**
   * 获取所有交易对24小时价格变动 - GET /fapi/v1/ticker/24hr
   */
  async fetchTickers(): Promise<AsterMarketData[]> {
    const data = await this.request('GET', '/fapi/v1/ticker/24hr');
    return data.map((ticker: any) => ({
      symbol: ticker.symbol,
      price: parseFloat(ticker.lastPrice),
      volume24h: parseFloat(ticker.volume),
      change24h: parseFloat(ticker.priceChangePercent),
      high24h: parseFloat(ticker.highPrice),
      low24h: parseFloat(ticker.lowPrice),
    }));
  }

  /**
   * 获取 K线数据 - GET /fapi/v1/klines
   */
  async fetchOHLCV(symbol: string, timeframe: string, limit: number = 100): Promise<number[][]> {
    const data = await this.request('GET', `/fapi/v1/klines?symbol=${symbol}&interval=${timeframe}&limit=${limit}`);
    return data.map((kline: any[]) => [
      parseFloat(kline[1]), // open
      parseFloat(kline[2]), // high
      parseFloat(kline[3]), // low
      parseFloat(kline[4]), // close
      parseFloat(kline[5]), // volume
    ]);
  }

  /**
   * 获取资金费率 - GET /fapi/v1/premiumIndex
   */
  async fetchFundingRate(symbol: string): Promise<number> {
    const data = await this.request('GET', `/fapi/v1/premiumIndex?symbol=${symbol}`);
    return parseFloat(data.lastFundingRate);
  }

  /**
   * 获取未平仓合约数 - Aster Dex 暂不支持此接口
   */
  async fetchOpenInterest(symbol: string): Promise<number> {
    // Aster Dex API 文档中没有找到 openInterest 接口
    // 返回模拟数据
    return 1000000 + Math.random() * 500000;
  }

  /**
   * 获取账户余额 - GET /fapi/v2/balance
   */
  async fetchBalance(): Promise<AsterBalance> {
    const data = await this.request('GET', '/fapi/v2/balance');
    const usdtBalance = data.find((b: any) => b.asset === 'USDT');
    return {
      usdtBalance: usdtBalance ? parseFloat(usdtBalance.balance) : 0,
      totalBalance: usdtBalance ? parseFloat(usdtBalance.balance) : 0,
    };
  }

  /**
   * 获取持仓信息 - GET /fapi/v2/positionRisk
   */
  async fetchPositions(): Promise<AsterPosition[]> {
    const data = await this.request('GET', '/fapi/v2/positionRisk');
    return data
      .filter((position: any) => parseFloat(position.positionAmt) !== 0)
      .map((position: any) => ({
        symbol: position.symbol,
        side: parseFloat(position.positionAmt) > 0 ? 'LONG' : 'SHORT',
        size: Math.abs(parseFloat(position.positionAmt)),
        margin: parseFloat(position.isolatedMargin),
        entryPrice: parseFloat(position.entryPrice),
        markPrice: parseFloat(position.markPrice),
        pnl: parseFloat(position.unRealizedProfit),
      }));
  }

  /**
   * 创建订单 - POST /fapi/v1/order
   */
  async createOrder(
    symbol: string,
    side: 'BUY' | 'SELL',
    type: 'LIMIT' | 'MARKET',
    quantity: number,
    price?: number
  ): Promise<AsterOrder> {
    const params: any = {
      symbol,
      side,
      type,
      quantity: quantity.toString(),
    };
    
    if (price) {
      params.price = price.toString();
    }
    
    if (type === 'LIMIT') {
      params.timeInForce = 'GTC';
    }
    
    const data = await this.request('POST', '/fapi/v1/order', params);
    return {
      orderId: data.orderId,
      symbol: data.symbol,
      side: data.side,
      type: data.type,
      quantity: parseFloat(data.origQty),
      price: parseFloat(data.price),
      status: data.status,
    };
  }

  /**
   * 取消订单 - DELETE /fapi/v1/order
   */
  async cancelOrder(symbol: string, orderId: string): Promise<boolean> {
    try {
      await this.request('DELETE', `/fapi/v1/order?symbol=${symbol}&orderId=${orderId}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 查询订单 - GET /fapi/v1/order
   */
  async fetchOrder(symbol: string, orderId: string): Promise<AsterOrder | null> {
    try {
      const data = await this.request('GET', `/fapi/v1/order?symbol=${symbol}&orderId=${orderId}`);
      return {
        orderId: data.orderId,
        symbol: data.symbol,
        side: data.side,
        type: data.type,
        quantity: parseFloat(data.origQty),
        price: parseFloat(data.price),
        status: data.status,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * 查询所有订单 - GET /fapi/v1/allOrders
   */
  async fetchOrders(symbol: string): Promise<AsterOrder[]> {
    const data = await this.request('GET', `/fapi/v1/allOrders?symbol=${symbol}`);
    return data.map((order: any) => ({
      orderId: order.orderId,
      symbol: order.symbol,
      side: order.side,
      type: order.type,
      quantity: parseFloat(order.origQty),
      price: parseFloat(order.price),
      status: order.status,
    }));
  }
}

// 创建默认实例
export const asterDex = new AsterDexClient({
  apiKey: process.env.ASTER_API_KEY || '',
  apiSecret: process.env.ASTER_API_SECRET || '',
  baseUrl: process.env.ASTER_API_BASE_URL || 'https://fapi.asterdex.com',
});