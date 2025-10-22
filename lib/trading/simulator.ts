/*
 * Simple in-memory trading simulator used when SIM_TRADING=true.
 * Not persisted across server restarts. Intended for local/dev usage.
 */

type Side = 'BUY' | 'SELL';
type OrderType = 'LIMIT' | 'MARKET';

export interface SimOrder {
  orderId: string;
  symbol: string;
  side: Side;
  type: OrderType;
  quantity: number;
  price: number;
  status: 'NEW' | 'FILLED' | 'CANCELED' | 'PARTIALLY_FILLED';
  createdAt: string;
}

export interface SimPosition {
  symbol: string;
  side: 'LONG' | 'SHORT';
  size: number;
  margin: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
}

class Simulator {
  private static instance: Simulator | null = null;

  private usdtBalance: number;
  private orders: SimOrder[] = [];
  private positions: Map<string, SimPosition> = new Map();
  private nextOrderId = 1;

  private constructor(startBalance: number) {
    this.usdtBalance = startBalance;
  }

  static getInstance(): Simulator {
    if (!Simulator.instance) {
      const start = parseFloat(process.env.SIM_START_MONEY || '10000');
      Simulator.instance = new Simulator(start);
    }
    return Simulator.instance;
  }

  getBalance() {
    return { usdtBalance: this.usdtBalance, totalBalance: this.usdtBalance };
  }

  getPositions(): SimPosition[] {
    return Array.from(this.positions.values());
  }

  getOrders(symbol: string): SimOrder[] {
    return this.orders.filter(o => o.symbol === symbol);
  }

  getOrder(symbol: string, orderId: string): SimOrder | null {
    return this.orders.find(o => o.symbol === symbol && o.orderId === orderId) || null;
  }

  updateMarkPrice(symbol: string, markPrice: number) {
    const pos = this.positions.get(symbol);
    if (!pos) return;
    pos.markPrice = markPrice;
    const direction = pos.side === 'LONG' ? 1 : -1;
    pos.pnl = (markPrice - pos.entryPrice) * direction * pos.size;
  }

  createOrder(symbol: string, side: Side, type: OrderType, quantity: number, price?: number): SimOrder {
    const execPrice = type === 'MARKET' ? (price ?? this.estimatePrice(symbol)) : (price ?? this.estimatePrice(symbol));
    const notional = execPrice * quantity;
    // Random leverage 3x or 5x
    const leverage = Math.random() < 0.5 ? 3 : 5;
    const marginRequired = notional / leverage;

    if (side === 'BUY') {
      if (this.usdtBalance < marginRequired) {
        throw new Error('Insufficient simulated balance');
      }
      this.usdtBalance -= marginRequired;
      this.openOrIncreasePosition(symbol, 'LONG', quantity, execPrice, marginRequired);
    } else {
      if (this.usdtBalance < marginRequired) {
        throw new Error('Insufficient simulated balance');
      }
      this.usdtBalance -= marginRequired;
      this.openOrIncreasePosition(symbol, 'SHORT', quantity, execPrice, marginRequired);
    }

    const order: SimOrder = {
      orderId: String(this.nextOrderId++),
      symbol,
      side,
      type,
      quantity,
      price: execPrice,
      status: 'FILLED',
      createdAt: new Date().toISOString(),
    };
    this.orders.push(order);

    // refresh mark price for PnL
    this.updateMarkPrice(symbol, execPrice);

    return order;
  }

  cancelOrder(symbol: string, orderId: string): boolean {
    const idx = this.orders.findIndex(o => o.symbol === symbol && o.orderId === orderId);
    if (idx === -1) return false;
    const o = this.orders[idx];
    if (o.status === 'FILLED') return false;
    o.status = 'CANCELED';
    return true;
  }

  private openOrIncreasePosition(symbol: string, side: 'LONG' | 'SHORT', size: number, price: number, marginDelta: number) {
    const existing = this.positions.get(symbol);
    if (!existing) {
      this.positions.set(symbol, {
        symbol,
        side,
        size,
        margin: marginDelta,
        entryPrice: price,
        markPrice: price,
        pnl: 0,
      });
      return;
    }

    // If same direction, average price; if opposite, reduce/flip
    if (existing.side === side) {
      const totalSize = existing.size + size;
      existing.entryPrice = (existing.entryPrice * existing.size + price * size) / totalSize;
      existing.size = totalSize;
      existing.margin += marginDelta;
    } else {
      if (size < existing.size) {
        // Partial close
        existing.size -= size;
        existing.margin = Math.max(0, existing.margin - marginDelta);
        this.usdtBalance += marginDelta; // release margin
      } else if (size === existing.size) {
        // Close entirely
        this.usdtBalance += existing.margin; // release margin
        this.positions.delete(symbol);
      } else {
        // Flip
        const remain = size - existing.size;
        this.positions.set(symbol, {
          symbol,
          side,
          size: remain,
          margin: marginDelta,
          entryPrice: price,
          markPrice: price,
          pnl: 0,
        });
      }
    }
  }

  private estimatePrice(_symbol: string): number {
    // Fallback when no price provided; use a constant as placeholder
    return 100;
  }
}

export const simulator = Simulator.getInstance();


