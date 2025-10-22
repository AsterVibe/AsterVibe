"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { MetricData } from "@/lib/types/metrics";
import { ArcticonsDeepseek } from "@/lib/icons";

interface MetricsChartProps {
  metricsData: MetricData[];
  loading: boolean;
  lastUpdate: string;
  totalCount?: number;
}

const chartConfig = {
  totalCashValue: {
    label: "Cash Value",
    color: "#0066FF", // Deepseek 蓝色
  },
} satisfies ChartConfig;

// Deepseek 品牌色
const DEEPSEEK_BLUE = "#0066FF";

// 自定义最后一个点的渲染（带动画）
interface CustomDotProps {
  cx?: number;
  cy?: number;
  index?: number;
  payload?: MetricData;
  dataLength: number;
}

const CustomDot = (props: CustomDotProps) => {
  const { cx, cy, index, payload, dataLength } = props;

  // 只在最后一个点显示 logo 和价格
  if (!payload || !cx || !cy || index !== dataLength - 1) {
    return null;
  }

  const price = payload.totalCashValue;
  const priceText = `$${price?.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  // CustomDot 必须返回 SVG 元素，因为它是在 recharts 的 SVG 上下文中渲染的
  // 可以使用 <g> 包裹多个 SVG 元素，或使用 <foreignObject> 嵌入 HTML
  return (
    <g>
      {/* 动画圆圈 - 纯 SVG */}
      <circle
        cx={cx}
        cy={cy}
        r={20}
        fill={DEEPSEEK_BLUE}
        opacity={0.2}
        className="animate-ping"
      />
      {/* 主圆点 - 纯 SVG */}
      <circle
        cx={cx}
        cy={cy}
        r={8}
        fill={DEEPSEEK_BLUE}
        stroke="#fff"
        strokeWidth={2}
      />

      {/* Logo 和价格容器 - 使用 foreignObject 嵌入 HTML/React 组件 */}
      <foreignObject x={cx + 15} y={cy - 30} width={180} height={60}>
        <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2 shadow-lg">
          {/* Deepseek Logo */}
          <div className="relative w-10 h-10 rounded-full bg-[#0066FF] flex items-center justify-center flex-shrink-0">
            <ArcticonsDeepseek className="w-6 h-6 text-black" />
          </div>
          {/* 价格 */}
          <div className="flex flex-col">
            <div className="text-[10px] text-muted-foreground font-medium">
              Deepseek
            </div>
            <div className="text-sm font-mono font-bold whitespace-nowrap">
              {priceText}
            </div>
          </div>
        </div>
      </foreignObject>
    </g>
  );
};

export function MetricsChart({
  metricsData,
  loading,
  totalCount,
}: MetricsChartProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[500px]">
          <div className="text-lg">Loading metrics...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Total Account Value</CardTitle>
        <CardDescription className="text-xs">
          Real-time tracking • Updates every 10s
          {metricsData.length > 0 && totalCount && (
            <div className="mt-1">
              {metricsData.length} of {totalCount.toLocaleString()} points
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-4 pb-4">
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-muted-foreground mb-2">Coming Soon</div>
            <div className="text-sm text-muted-foreground">Account value chart will be available soon</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
