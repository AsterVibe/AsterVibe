import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ModelType } from "@prisma/client";
import { deepseekR1 } from "@/lib/ai/model";
import { exchange } from "@/lib/trading/exchange";
import { z } from "zod";
import { addSimChat, getSimChats } from "@/lib/trading/sim-history";

export const revalidate = 0;

export const GET = async (request: NextRequest) => {
  const sim = (process.env.SIM_TRADING || '').toLowerCase() === 'true';
  if (sim) {
    // Fast heuristic decisions: no waiting for structured AI output
    try {
      const symbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT"];
      const tradings: any[] = [];
      for (const s of symbols) {
        // Get current price as execution price
        const t = await exchange.fetchTicker(s);
        const price = Math.max(1e-8, Number(t.price) || 0);
        // Random target value between $100 and $1000
        const targetValue = 100 + Math.random() * 900;
        // Convert to quantity; keep 4 decimals minimum, ensure > 0
        const qty = Math.max(+(targetValue / price).toFixed(4), 0.0001);
        const r = Math.random();
        if (r < 0.34) {
          const o = await exchange.createOrder(s, 'BUY', 'MARKET', qty, price);
          tradings.push({ id: (o as any).orderId ?? String(Date.now()+Math.random()), symbol: s, opeartion: 'Buy', pricing: (o as any).price ?? price, amount: (o as any).quantity ?? qty, createdAt: new Date().toISOString() });
        } else if (r < 0.67) {
          const o = await exchange.createOrder(s, 'SELL', 'MARKET', qty, price);
          tradings.push({ id: (o as any).orderId ?? String(Date.now()+Math.random()), symbol: s, opeartion: 'Sell', pricing: (o as any).price ?? price, amount: (o as any).quantity ?? qty, createdAt: new Date().toISOString() });
        } else {
          tradings.push({ id: String(Date.now()+Math.random()), symbol: s, opeartion: 'Hold', createdAt: new Date().toISOString() });
        }
      }
      const chat = [{
        id: String(Date.now()),
        model: 'DeepSeek R1 (sim)',
        chat: tradings.map((d:any)=>`- ${d.symbol}: ${d.opeartion}${d.pricing?` @ $${d.pricing}`:''}`).join('\n'),
        reasoning: 'Heuristic simulation (per-minute)',
        userPrompt: 'Simulated per-minute run',
        tradings,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }];
      addSimChat(chat[0]);
      return NextResponse.json({ data: getSimChats(20), success: true });
    } catch (e) {
      return NextResponse.json({ data: getSimChats(20), success: true });
    }
  }
  try {
    const chat = await prisma.chat.findMany({
      where: {
        model: ModelType.Deepseek,
      },
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        tradings: {
          take: 10,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return NextResponse.json({ data: chat });
  } catch (e) {
    // DB 不可用时返回空，避免前端一直 Loading
    return NextResponse.json({ data: [] });
  }
};
