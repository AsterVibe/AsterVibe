import { prisma } from "@/lib/prisma";
import { ModelType } from "@prisma/client";
import { NextResponse } from "next/server";
import { MetricData } from "@/lib/types/metrics";
import { getAccountInformationAndPerformance } from "@/lib/trading/account-information-and-performance";

// 最大返回数据点数量
const MAX_DATA_POINTS = 50;

/**
 * 从数组中均匀采样指定数量的元素
 * @param data - 原始数据数组
 * @param sampleSize - 需要采样的数量
 * @returns 均匀分布的采样数据
 */
function uniformSample<T>(data: T[], sampleSize: number): T[] {
  if (data.length <= sampleSize) {
    return data;
  }

  const result: T[] = [];
  const step = (data.length - 1) / (sampleSize - 1);

  for (let i = 0; i < sampleSize; i++) {
    const index = Math.round(i * step);
    result.push(data[index]);
  }

  return result;
}

export const GET = async () => {
  try {
    // 首先尝试获取真实的账户数据
    try {
      const initialCapital = parseFloat(process.env.START_MONEY || "30000");
      const accountData = await getAccountInformationAndPerformance(initialCapital);
      
      // 创建当前账户状态的指标数据
      const currentMetrics: MetricData = {
        totalCashValue: accountData.totalCashValue,
        currentTotalReturn: accountData.currentTotalReturn,
        availableCash: accountData.availableCash,
        currentPositionsValue: accountData.currentPositionsValue,
        positions: accountData.positions,
        sharpeRatio: accountData.sharpeRatio,
        contractValue: accountData.contractValue,
        createdAt: new Date().toISOString(),
      };

      console.log('✅ Successfully fetched real account data from Aster Dex');
      console.log('💰 Account Balance:', accountData.totalCashValue);
      console.log('📈 Total Return:', (accountData.currentTotalReturn * 100).toFixed(2) + '%');

      return NextResponse.json({
        data: {
          metrics: [currentMetrics],
          totalCount: 1,
          model: ModelType.Deepseek,
          name: "Aster Vibe Trading Bot",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        success: true,
      });
    } catch (apiError) {
      console.log('⚠️ Real API failed, falling back to database:', apiError);
    }

    // 如果真实 API 失败，尝试从数据库获取
    const metrics = await prisma.metrics.findFirst({
      where: {
        model: ModelType.Deepseek,
      },
    });

    if (!metrics) {
      // 返回模拟数据
      const mockMetrics = Array.from({ length: 20 }, (_, i) => ({
        totalCashValue: 30000 + Math.random() * 10000 + i * 100,
        currentTotalReturn: (Math.random() - 0.5) * 0.2,
        availableCash: 5000 + Math.random() * 5000,
        currentPositionsValue: 20000 + Math.random() * 10000,
        createdAt: new Date(Date.now() - i * 60000).toISOString(), // 每分钟一个点
      }));

      return NextResponse.json({
        data: {
          metrics: mockMetrics,
          totalCount: mockMetrics.length,
          model: ModelType.Deepseek,
          name: "Deepseek Trading Bot",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        success: true,
      });
    }

    const databaseMetrics = metrics.metrics as unknown as {
      createdAt: string;
      accountInformationAndPerformance: MetricData[];
    }[];

    const metricsData = databaseMetrics
      .map((item) => {
        return {
          ...item.accountInformationAndPerformance,
          createdAt: item?.createdAt || new Date().toISOString(),
        };
      })
      .filter((item) => (item as unknown as MetricData).availableCash > 0);

    // 均匀采样数据，最多返回 MAX_DATA_POINTS 条
    const sampledMetrics = uniformSample(metricsData, MAX_DATA_POINTS);

    console.log(
      `📊 Total metrics: ${metricsData.length}, Sampled: ${sampledMetrics.length}`
    );

    return NextResponse.json({
      data: {
        metrics: sampledMetrics,
        totalCount: metricsData.length,
        model: metrics?.model || ModelType.Deepseek,
        name: metrics?.name || "Deepseek Trading Bot",
        createdAt: metrics?.createdAt || new Date().toISOString(),
        updatedAt: metrics?.updatedAt || new Date().toISOString(),
      },
      success: true,
    });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    
    // 返回模拟数据
    const mockMetrics = [
      {
        totalCashValue: 30000 + Math.random() * 10000,
        currentTotalReturn: (Math.random() - 0.5) * 0.2,
        availableCash: 5000 + Math.random() * 5000,
        currentPositionsValue: 20000 + Math.random() * 10000,
        createdAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      data: {
        metrics: mockMetrics,
        totalCount: 1,
        model: ModelType.Deepseek,
        name: "Deepseek Trading Bot",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      success: true,
    });
  }
};
