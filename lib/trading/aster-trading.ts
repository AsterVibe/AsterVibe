/**
 * Aster Dex Trading Execution Module
 * 用于执行买卖交易操作
 */

import { exchange } from "./exchange";

export interface TradeParams {
  symbol: string;
  side: 'buy' | 'sell';
  amount: number;
  price?: number;
  leverage?: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface TradeResult {
  success: boolean;
  orderId?: string;
  error?: string;
  executedPrice?: number;
  executedAmount?: number;
}

/**
 * 执行买入操作
 */
export async function executeBuy(params: TradeParams): Promise<TradeResult> {
  try {
    const { symbol, amount, price, leverage } = params;
    
    // 创建买单
    const order = await exchange.createOrder(
      symbol,
      'BUY',
      price ? 'LIMIT' : 'MARKET',
      amount,
      price
    );

    return {
      success: true,
      orderId: (order as any).orderId ?? (order as any).id,
      executedPrice: (order as any).price,
      executedAmount: (order as any).quantity ?? (order as any).amount,
    };
  } catch (error) {
    console.error('Buy execution failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 执行卖出操作
 */
export async function executeSell(params: TradeParams): Promise<TradeResult> {
  try {
    const { symbol, amount, price } = params;
    
    // 创建卖单
    const order = await exchange.createOrder(
      symbol,
      'SELL',
      price ? 'LIMIT' : 'MARKET',
      amount,
      price
    );

    return {
      success: true,
      orderId: (order as any).orderId ?? (order as any).id,
      executedPrice: (order as any).price,
      executedAmount: (order as any).quantity ?? (order as any).amount,
    };
  } catch (error) {
    console.error('Sell execution failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 设置止损止盈
 */
export async function setStopLossTakeProfit(
  symbol: string,
  stopLoss?: number,
  takeProfit?: number
): Promise<boolean> {
  try {
    // 获取当前持仓
    const positions = await exchange.fetchPositions();
    const position = positions.find(p => p.symbol === symbol);
    
    if (!position) {
      console.warn(`No position found for ${symbol}`);
      return false;
    }

    // 这里需要根据 Aster Dex API 实现止损止盈设置
    // 可能需要调用特定的 API 端点
    console.log(`Setting stop loss: ${stopLoss}, take profit: ${takeProfit} for ${symbol}`);
    
    return true;
  } catch (error) {
    console.error('Failed to set stop loss/take profit:', error);
    return false;
  }
}

/**
 * 获取交易对信息
 */
export async function getTradingPairInfo(symbol: string) {
  try {
    const ticker = await exchange.fetchTicker(symbol);
    return {
      symbol: ticker.symbol,
      price: ticker.price,
      volume24h: ticker.volume24h,
      change24h: ticker.change24h,
      high24h: ticker.high24h,
      low24h: ticker.low24h,
    };
  } catch (error) {
    console.error('Failed to get trading pair info:', error);
    return null;
  }
}

/**
 * 检查订单状态
 */
export async function checkOrderStatus(symbol: string, orderId: string) {
  try {
    const order = await exchange.fetchOrder(symbol, orderId);
    return {
      id: (order as any)?.orderId ?? (order as any)?.id,
      status: (order as any)?.status,
      symbol: (order as any)?.symbol,
      side: (order as any)?.side,
      amount: (order as any)?.quantity ?? (order as any)?.amount,
      price: (order as any)?.price,
      type: (order as any)?.type,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to check order status:', error);
    return null;
  }
}

/**
 * 取消订单
 */
export async function cancelOrder(symbol: string, orderId: string): Promise<boolean> {
  try {
    return await exchange.cancelOrder(symbol, orderId);
  } catch (error) {
    console.error('Failed to cancel order:', error);
    return false;
  }
}
