import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ModelType } from "@prisma/client";

export const GET = async (request: NextRequest) => {
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

  return NextResponse.json({
    data: chat,
  });
};
