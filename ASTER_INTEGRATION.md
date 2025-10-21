# Aster Dex Integration Guide

## 🚀 将 Open-nof1.ai 集成到 Aster Dex

本项目已成功集成 Aster Dex API，用于在 Aster Dex 上进行永续合约交易。

## 📋 已完成的集成工作

### ✅ 1. Aster Dex API 客户端
- 创建了 `lib/trading/aster.ts` - 完整的 Aster Dex API 客户端
- 支持市场数据、账户管理、订单执行等功能
- 实现了标准的 REST API 调用和签名认证

### ✅ 2. 交易逻辑替换
- 更新了 `lib/trading/current-market-state.ts` - 使用 Aster Dex 获取市场数据
- 更新了 `lib/trading/account-information-and-performance.ts` - 使用 Aster Dex 获取账户信息
- 创建了 `lib/trading/aster-trading.ts` - Aster Dex 交易执行模块

### ✅ 3. 环境变量配置
- 更新了 `.env` 文件，添加了 Aster Dex API 配置
- 保留了 Binance 配置作为参考

### ✅ 4. 测试工具
- 创建了 `lib/trading/test-aster-integration.ts` - 集成测试工具

## 🔧 配置步骤

### 1. 获取 Aster Dex API 密钥
1. 访问 [Aster Dex](https://asterdex.org) 官网
2. 注册账户并完成 KYC 验证
3. 在 API 管理页面创建新的 API 密钥
4. 记录 API Key 和 Secret

### 2. 更新环境变量
编辑 `.env` 文件，填入真实的 API 密钥：

```env
# Aster Dex API Configuration
ASTER_API_KEY="your_actual_api_key_here"
ASTER_API_SECRET="your_actual_api_secret_here"
ASTER_API_BASE_URL="https://api.asterdex.org/v1"
```

### 3. 测试集成
运行集成测试：

```bash
# 使用 Node.js 运行测试
node -r ts-node/register lib/trading/test-aster-integration.ts

# 或者使用 npm script (需要先添加到 package.json)
npm run test:aster-integration
```

## 🎯 主要功能

### 市场数据获取
- ✅ 实时价格数据
- ✅ K线数据 (1分钟、4小时等)
- ✅ 24小时交易量
- ✅ 价格变化百分比
- ✅ 资金费率
- ✅ 未平仓合约

### 账户管理
- ✅ 账户余额查询
- ✅ 持仓信息获取
- ✅ 盈亏计算
- ✅ 保证金管理

### 交易执行
- ✅ 市价单和限价单
- ✅ 买入/卖出操作
- ✅ 订单状态查询
- ✅ 订单取消
- ✅ 止损止盈设置

## 🔄 API 端点映射

| 功能 | Aster Dex API | 说明 |
|------|---------------|------|
| 市场数据 | `/ticker/{symbol}` | 获取交易对价格信息 |
| K线数据 | `/klines/{symbol}` | 获取 OHLCV 数据 |
| 账户余额 | `/account/balance` | 获取账户余额 |
| 持仓信息 | `/positions` | 获取当前持仓 |
| 创建订单 | `POST /orders` | 创建买卖订单 |
| 订单状态 | `/orders/{id}` | 查询订单状态 |
| 取消订单 | `DELETE /orders/{id}` | 取消订单 |
| 资金费率 | `/funding-rate/{symbol}` | 获取资金费率 |
| 未平仓合约 | `/open-interest/{symbol}` | 获取未平仓合约 |

## 🚨 注意事项

### 1. API 限制
- Aster Dex 可能有 API 调用频率限制
- 建议实现适当的重试机制和错误处理
- 监控 API 使用量避免超出限制

### 2. 签名认证
- 当前实现使用 HMAC-SHA256 签名
- 如果 Aster Dex 使用不同的签名算法，需要相应调整
- 确保时间戳同步正确

### 3. 错误处理
- 实现了基本的错误处理机制
- 建议添加更详细的错误分类和重试逻辑
- 监控 API 响应状态码

### 4. 测试环境
- 建议先在测试网络或沙盒环境测试
- 确认所有功能正常后再切换到主网
- 使用小额资金进行初始测试

## 🔍 故障排除

### 常见问题

1. **API 连接失败**
   - 检查网络连接
   - 验证 API 基础 URL
   - 确认 API 密钥正确

2. **签名验证失败**
   - 检查签名算法实现
   - 验证时间戳格式
   - 确认请求体格式

3. **订单执行失败**
   - 检查账户余额
   - 验证交易对格式
   - 确认订单参数

### 调试工具

```typescript
// 启用详细日志
process.env.DEBUG = 'aster:*';

// 测试 API 连接
import { asterDex } from './lib/trading/aster';
const tickers = await asterDex.fetchTickers();
console.log('API connection successful:', tickers.length > 0);
```

## 📚 相关文档

- [Aster Dex 官网](https://asterdex.org)
- [Aster Dex API 文档](https://github.com/asterdex/api-docs)
- [企业级 SDK](https://outposts.io/article/aster-announces-enterprise-sdk-for-perpetual-trading)

## 🤝 贡献

如果你发现任何问题或有改进建议，请：

1. 创建 Issue 描述问题
2. 提交 Pull Request 修复问题
3. 更新文档和测试用例

---

**⚠️ 风险提示**: 加密货币交易存在高风险，请谨慎投资，仅使用你能承受损失的资金。
