import { exchange } from "./exchange";

export interface AccountInformationAndPerformance {
  currentPositionsValue: number;
  contractValue: number;
  totalCashValue: number;
  availableCash: number;
  currentTotalReturn: number;
  positions: any[]; // Using any[] instead of Position[] from ccxt
  sharpeRatio: number;
}

export async function getAccountInformationAndPerformance(
  initialCapital: number
): Promise<AccountInformationAndPerformance> {
  const positions = await exchange.fetchPositions();
  const currentPositionsValue = positions.reduce((acc, position) => {
    return acc + (position.margin || 0);
  }, 0);
  const contractValue = positions.reduce((acc, position) => {
    return acc + (position.size || 0);
  }, 0);
  const currentCashValue = await exchange.fetchBalance();
  // Portfolio value = available cash + margin + PnL
  const totalCashValue = currentCashValue.usdtBalance + currentPositionsValue;
  const availableCash = currentCashValue.usdtBalance;
  const currentTotalReturn = (totalCashValue - initialCapital) / initialCapital;
  const sharpeRatio =
    currentTotalReturn /
    (positions.reduce((acc, position) => {
      return acc + (position.pnl || 0);
    }, 0) /
      initialCapital);

  return {
    currentPositionsValue,
    contractValue,
    totalCashValue,
    availableCash,
    currentTotalReturn,
    positions,
    sharpeRatio,
  };
}

export function formatAccountPerformance(
  accountPerformance: AccountInformationAndPerformance
) {
  const { currentTotalReturn, availableCash, totalCashValue, positions } =
    accountPerformance;

  const output = `## HERE IS YOUR ACCOUNT INFORMATION & PERFORMANCE
Current Total Return (percent): ${currentTotalReturn * 100}%
Available Cash: ${availableCash}
Current Account Value: ${totalCashValue}
Positions: ${positions
    .map((position) =>
      JSON.stringify({
        symbol: position.symbol,
        quantity: position.size,
        entry_price: position.entryPrice,
        current_price: position.markPrice,
        liquidation_price: position.liquidationPrice || 0,
        unrealized_pnl: position.pnl,
        leverage: position.leverage,
        notional_usd: position.size * position.markPrice,
        side: position.side,
        stopLoss: position.stopLossPrice || 0,
        takeProfit: position.takeProfitPrice || 0,
      })
    )
    .join("\n")}`;
  return output;
}
