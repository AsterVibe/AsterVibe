"use client";

import { useEffect, useState, useCallback } from "react";
import { MetricsChart } from "@/components/metrics-chart";
import { CryptoCard } from "@/components/crypto-card";
import { ModelsView } from "@/components/models-view";
import { Card } from "@/components/ui/card";
import { MarketState } from "@/lib/trading/current-market-state";
import { MetricData } from "@/lib/types/metrics";

interface CryptoPricing {
  btc: MarketState;
  eth: MarketState;
  sol: MarketState;
  doge: MarketState;
  bnb: MarketState;
}

interface MetricsResponse {
  data: {
    metrics: MetricData[];
    totalCount: number;
    model: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  success: boolean;
}

interface PricingResponse {
  data: {
    pricing: CryptoPricing;
  };
  success: boolean;
}

export default function Home() {
  const [metricsData, setMetricsData] = useState<MetricData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pricing, setPricing] = useState<CryptoPricing | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  // 获取图表数据
  const fetchMetrics = useCallback(async () => {
    try {
      const response = await fetch("/api/metrics");
      if (!response.ok) return;

      const data: MetricsResponse = await response.json();
      if (data.success && data.data) {
        setMetricsData(data.data.metrics || []);
        setTotalCount(data.data.totalCount || 0);
        setLastUpdate(new Date().toLocaleTimeString());
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching metrics:", err);
      setLoading(false);
    }
  }, []);

  // 获取价格数据
  const fetchPricing = useCallback(async () => {
    try {
      const response = await fetch("/api/pricing");
      if (!response.ok) return;

      const data: PricingResponse = await response.json();
      if (data.success && data.data.pricing) {
        setPricing(data.data.pricing);
      }
    } catch (err) {
      console.error("Error fetching pricing:", err);
    }
  }, []);

  useEffect(() => {
    // 初始加载
    fetchMetrics();
    fetchPricing();

    const metricsInterval = setInterval(fetchMetrics, 10000);

    const pricingInterval = setInterval(fetchPricing, 10000);

    return () => {
      clearInterval(metricsInterval);
      clearInterval(pricingInterval);
    };
  }, [fetchMetrics, fetchPricing]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <img 
              src="/vibe-logo.jpg" 
              alt="Aster Vibe Logo" 
              className="h-40 w-40 object-contain"
            />
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Aster Vibe
                <span className="text-muted-foreground text-sm ml-2">
                  powered by AsterDEX
                </span>
              </h1>
              <p className="text-muted-foreground mt-2">
                Real-time trading metrics and performance on AsterDEX
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {lastUpdate && (
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Last updated</div>
                <div className="text-lg font-mono">{lastUpdate}</div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <a 
                href="https://github.com/AsterVibe/AsterVibe" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="font-medium">GitHub</span>
              </a>
              <a 
                href="https://x.com/Aster_Vibe" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span className="font-medium">Follow @Aster_Vibe</span>
              </a>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-8 border-b pb-4">
          <button className="text-sm font-medium border-b-2 border-primary pb-2">
            LIVE
          </button>
        </div>

        {/* Crypto Ticker */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {pricing ? (
            <>
              <CryptoCard
                symbol="BTC"
                name="Bitcoin"
                price={`$${pricing.btc.current_price.toLocaleString()}`}
              />
              <CryptoCard
                symbol="ETH"
                name="Ethereum"
                price={`$${pricing.eth.current_price.toLocaleString()}`}
              />
              <CryptoCard
                symbol="SOL"
                name="Solana"
                price={`$${pricing.sol.current_price.toLocaleString()}`}
              />
              <CryptoCard
                symbol="BNB"
                name="BNB"
                price={`$${pricing.bnb.current_price.toLocaleString()}`}
              />
              <CryptoCard
                symbol="DOGE"
                name="Dogecoin"
                price={`$${pricing.doge.current_price.toFixed(4)}`}
              />
            </>
          ) : (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="p-4 animate-pulse">
                <div className="h-20 bg-muted rounded"></div>
              </Card>
            ))
          )}
        </div>

        {/* Main Content - Chart and Models Side by Side */}
        <div className="flex flex-row gap-6">
          {/* Left: Chart */}
          <div className="flex-[2]">
            <MetricsChart
              metricsData={metricsData}
              loading={loading}
              lastUpdate={lastUpdate}
              totalCount={totalCount}
            />
          </div>

          {/* Right: Models View */}
          <div className="flex-1">
            <ModelsView />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-8 border-t">
          <p>HIGHEST: 🏆 DEEPSEEK CHAT</p>
          <p className="mt-2">Aster Vibe - Real-time AI Trading Platform on AsterDEX</p>
        </div>
      </div>
    </div>
  );
}
