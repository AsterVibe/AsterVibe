# Aster Vibe 🚀

**Real-time AI Trading Platform on AsterDEX**

Aster Vibe is an advanced AI-powered cryptocurrency trading platform that leverages DeepSeek R1 reasoning model to make intelligent trading decisions on AsterDEX perpetual futures markets.

## 🌟 Features

- **🤖 AI-Powered Trading**: Uses DeepSeek R1 reasoning model for intelligent market analysis
- **📊 Real-time Metrics**: Live trading performance and account balance tracking
- **💰 AsterDEX Integration**: Direct integration with AsterDEX perpetual futures API
- **📈 Performance Analytics**: Comprehensive trading metrics and performance visualization
- **🔄 Automated Execution**: Automated order placement and position management
- **📱 Modern UI**: Clean, responsive interface built with Next.js 15

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **AI Model**: DeepSeek R1 (Reasoning Model)
- **Trading API**: AsterDEX Futures API
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel-ready

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- AsterDEX API credentials
- DeepSeek API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AsterVibe/AsterVibe.git
   cd AsterVibe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   # DeepSeek AI Configuration
   DEEPSEEK_API_KEY=your_deepseek_api_key
   DEEPSEEK_API_BASE_URL=https://www.chataiapi.com/v1
   
   # AsterDEX API Configuration
   ASTER_API_KEY=your_aster_api_key
   ASTER_API_SECRET=your_aster_api_secret
   ASTER_API_BASE_URL=https://fapi.asterdex.com
   
   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/astervibe
   
   # Trading Configuration
   START_MONEY=30000
   CRON_SECRET_KEY=your_cron_secret
   ```

4. **Set up the database**
   ```bash
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Trading Features

### AI Decision Making
- **DeepSeek R1 Integration**: Advanced reasoning capabilities for market analysis
- **Real-time Market Data**: Live price feeds, volume, and technical indicators
- **Risk Management**: Automated position sizing and risk controls
- **Performance Tracking**: Comprehensive metrics and analytics

### Supported Markets
- **Perpetual Futures**: Full AsterDEX perpetual futures support
- **Multiple Assets**: BTC, ETH, SOL, BNB, DOGE and more
- **Real-time Execution**: Sub-second order placement and management

## 🔧 API Integration

### AsterDEX API
- **Market Data**: Real-time price feeds and market information
- **Account Management**: Balance and position tracking
- **Order Execution**: Automated buy/sell order placement
- **Risk Management**: Position monitoring and liquidation protection

### DeepSeek AI
- **Reasoning Engine**: Advanced market analysis and decision making
- **Prompt Engineering**: Optimized prompts for trading scenarios
- **Real-time Processing**: Fast decision making for market opportunities

## 📈 Performance Monitoring

- **Account Balance**: Real-time USDT balance tracking
- **P&L Tracking**: Profit and loss monitoring
- **Position Analytics**: Detailed position performance metrics
- **Risk Metrics**: Sharpe ratio and risk-adjusted returns

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on every push

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website**: [Aster Vibe](https://astervibe.com)
- **Twitter**: [@Aster_Vibe](https://x.com/Aster_Vibe)
- **GitHub**: [AsterVibe/AsterVibe](https://github.com/AsterVibe/AsterVibe)
- **AsterDEX**: [AsterDEX Platform](https://asterdex.com)

## ⚠️ Disclaimer

This software is for educational and research purposes only. Cryptocurrency trading involves substantial risk of loss and is not suitable for all investors. Past performance is not indicative of future results. Please trade responsibly and never invest more than you can afford to lose.

## 🙏 Acknowledgments

- **AsterDEX** for providing the trading infrastructure
- **DeepSeek** for the advanced AI reasoning capabilities
- **Next.js** team for the excellent framework
- **Open source community** for the amazing tools and libraries

---

**Built with ❤️ by the Aster Vibe team**

*Real-time trading metrics and performance on AsterDEX*