import { NextResponse } from "next/server";
import { exchange } from "@/lib/trading/exchange";

export const revalidate = 0;

export const GET = async () => {
  try {
    const positions = await exchange.fetchPositions();
    return NextResponse.json({ data: positions, success: true });
  } catch (e) {
    return NextResponse.json({ data: [], success: true });
  }
};


