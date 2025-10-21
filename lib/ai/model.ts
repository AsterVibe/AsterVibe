import { createDeepSeek } from "@ai-sdk/deepseek";

// 使用反代地址配置 DeepSeek
const deepseekModel = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_API_BASE_URL || "https://www.chataiapi.com/v1",
});

// 直接使用 DeepSeek API，移除 OpenRouter 依赖
export const deepseek = deepseekModel("deepseek-chat");
export const deepseekThinking = deepseekModel("deepseek-reasoner");
export const deepseekR1 = deepseekModel("deepseek-reasoner"); // 使用 reasoner 作为 R1 替代
