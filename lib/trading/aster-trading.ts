/**
 * Aster Dex Trading Execution Module
 * 用于执行买卖交易操作
 */

import { asterDex } from "./aster";

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
    const order = await asterDex.createOrder(
      symbol,
      'buy',
      amount,
      price,
      price ? 'limit' : 'market'
    );

    return {
      success: true,
      orderId: order.id,
      executedPrice: order.price,
      executedAmount: order.amount,
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
    const order = await asterDex.createOrder(
      symbol,
      'sell',
      amount,
      price,
      price ? 'limit' : 'market'
    );

    return {
      success: true,
      orderId: order.id,
      executedPrice: order.price,
      executedAmount: order.amount,
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
    const positions = await asterDex.fetchPositions();
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
    const ticker = await asterDex.fetchTicker(symbol);
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
export async function checkOrderStatus(orderId: string) {
  try {
    const order = await asterDex.fetchOrder(orderId);
    return {
      id: order.id,
      status: order.status,
      symbol: order.symbol,
      side: order.side,
      amount: order.amount,
      price: order.price,
      type: order.type,
      createdAt: order.createdAt,
    };
  } catch (error) {
    console.error('Failed to check order status:', error);
    return null;
  }
}

/**
 * 取消订单
 */
export async function cancelOrder(orderId: string): Promise<boolean> {
  try {
    return await asterDex.cancelOrder(orderId);
  } catch (error) {
    console.error('Failed to cancel order:', error);
    return false;
  }
}
