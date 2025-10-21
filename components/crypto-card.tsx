"use client";

import { Card } from "@/components/ui/card";
import { AnimatedNumber } from "@/components/animated-number";
import { SiBitcoin, SiEthereum, SiBinance, SiDogecoin } from "react-icons/si";
import { TbCurrencySolana } from "react-icons/tb";

interface CryptoCardProps {
  symbol: string;
  name: string;
  price: string;
  change?: string;
}

const iconMap = {
  BTC: SiBitcoin,
  ETH: SiEthereum,
  SOL: TbCurrencySolana,
  BNB: SiBinance,
  DOGE: SiDogecoin,
};

const colorMap = {
  BTC: "text-orange-500",
  ETH: "text-blue-500",
  SOL: "text-purple-500",
  BNB: "text-yellow-500",
  DOGE: "text-amber-500",
};

export function CryptoCard({ symbol, name, price, change }: CryptoCardProps) {
  const Icon = iconMap[symbol as keyof typeof iconMap];
  const iconColor = colorMap[symbol as keyof typeof colorMap];

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className={`text-2xl ${iconColor}`} />}
        <div>
          <div className="font-bold">{symbol}</div>
          <div className="text-xs text-muted-foreground">{name}</div>
        </div>
      </div>
      <AnimatedNumber
        value={price}
        className="font-mono text-lg font-semibold"
      />
      {change && (
        <div
          className={`text-sm mt-1 ${
            change.startsWith("+") ? "text-green-500" : "text-red-500"
          }`}
        >
          {change}
        </div>
      )}
    </Card>
  );
}
