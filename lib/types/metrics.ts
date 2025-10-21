import { Position } from "ccxt";

export interface MetricData {
  positions: Position[];
  sharpeRatio: number | null;
  availableCash: number;
  contractValue: number;
  totalCashValue: number;
  currentTotalReturn: number | null;
  currentPositionsValue: number;
  createdAt: string;
}
