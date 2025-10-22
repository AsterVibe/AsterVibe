// Facade to switch between real AsterDEX client and in-memory simulator
// based on the environment variable SIM_TRADING=true

import { asterDex } from './aster';
import { simulator } from './simulator';

const useSimulator = () => (process.env.SIM_TRADING || '').toLowerCase() === 'true';

export const exchange = {
  // Market data always uses real endpoints for realism (safe read-only)
  fetchTicker: (symbol: string) => asterDex.fetchTicker(symbol),
  fetchTickers: () => asterDex.fetchTickers(),
  fetchOHLCV: (symbol: string, timeframe: string, limit?: number) =>
    asterDex.fetchOHLCV(symbol, timeframe, limit),
  fetchFundingRate: (symbol: string) => asterDex.fetchFundingRate(symbol),
  fetchOpenInterest: (symbol: string) => asterDex.fetchOpenInterest(symbol),

  // Account and trading routes to simulator when enabled
  fetchBalance: async () => {
    if (useSimulator()) {
      return simulator.getBalance();
    }
    return asterDex.fetchBalance();
  },
  fetchPositions: async () => {
    // Always use simulator for now
    return simulator.getPositions();
  },
  createOrder: async (
    symbol: string,
    side: 'BUY' | 'SELL',
    type: 'LIMIT' | 'MARKET',
    quantity: number,
    price?: number
  ) => {
    // Always use simulator for now
    const order = simulator.createOrder(symbol, side, type, quantity, price);
    return {
      orderId: order.orderId,
      symbol: order.symbol,
      side: order.side,
      type: order.type,
      quantity: order.quantity,
      price: order.price,
      status: order.status,
    };
  },
  cancelOrder: async (symbol: string, orderId: string) => {
    if (useSimulator()) {
      return simulator.cancelOrder(symbol, orderId);
    }
    return asterDex.cancelOrder(symbol, orderId);
  },
  fetchOrder: async (symbol: string, orderId: string) => {
    if (useSimulator()) {
      const order = simulator.getOrder(symbol, orderId);
      if (!order) return null;
      return {
        orderId: order.orderId,
        symbol: order.symbol,
        side: order.side,
        type: order.type,
        quantity: order.quantity,
        price: order.price,
        status: order.status,
      };
    }
    return asterDex.fetchOrder(symbol, orderId);
  },
  fetchOrders: async (symbol: string) => {
    if (useSimulator()) {
      return simulator.getOrders(symbol).map(o => ({
        orderId: o.orderId,
        symbol: o.symbol,
        side: o.side,
        type: o.type,
        quantity: o.quantity,
        price: o.price,
        status: o.status,
      }));
    }
    return asterDex.fetchOrders(symbol);
  },
};


