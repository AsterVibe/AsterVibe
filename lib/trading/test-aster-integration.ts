/**
 * Aster Dex Integration Test
 * 测试 Aster Dex API 集成是否正常工作
 */

import { asterDex } from './aster';

async function testAsterDexIntegration() {
  console.log('🧪 Testing Aster Dex Integration...\n');

  try {
    // 测试 1: 获取市场数据
    console.log('1️⃣ Testing market data fetch...');
    const tickers = await asterDex.fetchTickers();
    console.log(`✅ Successfully fetched ${tickers.length} tickers`);
    
    if (tickers.length > 0) {
      console.log(`   Sample ticker: ${tickers[0].symbol} - $${tickers[0].price}`);
    }

    // 测试 2: 获取特定交易对数据
    console.log('\n2️⃣ Testing specific ticker fetch...');
    try {
      const btcTicker = await asterDex.fetchTicker('BTC/USDT');
      console.log(`✅ BTC/USDT: $${btcTicker.price}`);
    } catch (error) {
      console.log(`⚠️  BTC/USDT fetch failed (expected if API keys not configured)`);
    }

    // 测试 3: 获取 K线数据
    console.log('\n3️⃣ Testing OHLCV data fetch...');
    try {
      const ohlcv = await asterDex.fetchOHLCV('BTC/USDT', '1m', 10);
      console.log(`✅ Successfully fetched ${ohlcv.length} OHLCV candles`);
      if (ohlcv.length > 0) {
        console.log(`   Latest candle: O:${ohlcv[ohlcv.length-1][0]}, H:${ohlcv[ohlcv.length-1][1]}, L:${ohlcv[ohlcv.length-1][2]}, C:${ohlcv[ohlcv.length-1][3]}, V:${ohlcv[ohlcv.length-1][4]}`);
      }
    } catch (error) {
      console.log(`⚠️  OHLCV fetch failed (expected if API keys not configured)`);
    }

    // 测试 4: 获取账户信息 (需要 API 密钥)
    console.log('\n4️⃣ Testing account balance fetch...');
    try {
      const balance = await asterDex.fetchBalance();
      console.log(`✅ Successfully fetched ${balance.length} balance entries`);
      balance.forEach(b => {
        console.log(`   ${b.asset}: ${b.free} (free), ${b.total} (total)`);
      });
    } catch (error) {
      console.log(`⚠️  Balance fetch failed (expected if API keys not configured)`);
    }

    // 测试 5: 获取持仓信息 (需要 API 密钥)
    console.log('\n5️⃣ Testing positions fetch...');
    try {
      const positions = await asterDex.fetchPositions();
      console.log(`✅ Successfully fetched ${positions.length} positions`);
      positions.forEach(p => {
        console.log(`   ${p.symbol}: ${p.side} ${p.size} @ $${p.entryPrice}`);
      });
    } catch (error) {
      console.log(`⚠️  Positions fetch failed (expected if API keys not configured)`);
    }

    console.log('\n🎉 Aster Dex integration test completed!');
    console.log('\n📝 Next steps:');
    console.log('   1. Configure ASTER_API_KEY and ASTER_API_SECRET in .env file');
    console.log('   2. Test with real API credentials');
    console.log('   3. Verify trading functionality');

  } catch (error) {
    console.error('❌ Integration test failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check if ASTER_API_BASE_URL is correct');
    console.log('   2. Verify network connectivity');
    console.log('   3. Check Aster Dex API documentation for any changes');
  }
}

// 如果直接运行此文件，执行测试
if (require.main === module) {
  testAsterDexIntegration();
}

export { testAsterDexIntegration };
