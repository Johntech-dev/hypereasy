# HyperEasy 🚀

**Open-source Hyperliquid SDK Wrapper for Developers and Traders**

HyperEasy is a comprehensive, production-ready SDK wrapper that simplifies interaction with Hyperliquid's trading APIs and HyperEVM. Built for the Hyperliquid Community Hackathon's Public Goods Track, it serves both technical developers (via modular API wrapper) and non-technical users (via intuitive no-code interface).

## 🌟 Features

### For Developers
- **Complete API Wrapper**: TypeScript SDK for all Hyperliquid trading operations
- **HyperEVM Integration**: Smart contract interactions via Lava Network RPC
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Error Handling**: Robust error handling and validation
- **Rate Limiting**: Built-in protection against API limits
- **Extensible**: Modular architecture for easy customization

### For Non-Technical Users
- **No-Code Trading Interface**: Intuitive web UI for placing orders
- **Real-Time Market Data**: Live price feeds and market information
- **Vault Management**: Easy deposit/withdraw operations
- **Transaction History**: Complete trading activity tracking
- **Discord Notifications**: Real-time alerts for trading activity
- **Mobile Responsive**: Works seamlessly on all devices

### Core Capabilities
- **Market Data**: Real-time price feeds, volume, and market statistics
- **Order Management**: Market and limit orders with full validation
- **Vault Operations**: Deposit and withdraw funds from Hyperliquid vaults
- **Smart Contracts**: Interact with HyperEVM contracts
- **Analytics**: Comprehensive trading statistics and performance metrics
- **Notifications**: Discord integration for trade alerts and summaries

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Hyperliquid API key
- Discord webhook URL (optional)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/hypereasy.git
   cd hypereasy
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your API keys
   \`\`\`

4. **Initialize the database**
   \`\`\`bash
   npm run db:push
   \`\`\`

5. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 Usage Guide

### For Non-Technical Users

1. **Trading Interface** (`/`)
   - Select your asset (BTC, ETH, SOL, etc.)
   - Choose Buy or Sell
   - Enter amount in USD
   - Select Market or Limit order
   - Click "Place Order"

2. **Dashboard** (`/dashboard`)
   - View transaction history
   - Manage vault deposits/withdrawals
   - Monitor trading performance

3. **Discord Integration** (`/integrations`)
   - Set up webhook URL
   - Configure notification preferences
   - Test alerts and summaries

### For Developers

#### Basic API Usage

\`\`\`javascript
// Fetch market data
const response = await fetch('/api/market-data?asset=BTC');
const marketData = await response.json();
console.log('BTC Price:', marketData.price);

// Place a market order
const orderResponse = await fetch('/api/place-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    asset: 'BTC',
    amount: 100,
    isBuy: true,
    orderType: 'market'
  })
});
const result = await orderResponse.json();
\`\`\`

#### SDK Integration

\`\`\`javascript
import { HyperliquidClient } from './lib/hyperliquid-client';

const client = new HyperliquidClient(process.env.HYPERLIQUID_API_KEY);

// Get market data
const marketData = await client.getMarketData('BTC');

// Place order
const order = await client.placeOrder({
  asset: 'BTC',
  amount: 100,
  isBuy: true,
  orderType: 'market'
});
\`\`\`

#### Node.js Integration

\`\`\`javascript
const axios = require('axios');

async function integrateHyperEasy() {
  const baseURL = 'https://your-hypereasy-app.vercel.app';
  
  // Get market data
  const marketData = await axios.get(`${baseURL}/api/market-data?asset=BTC`);
  console.log('BTC Price:', marketData.data.price);
  
  // Place order
  const order = await axios.post(`${baseURL}/api/place-order`, {
    asset: 'BTC',
    amount: 100,
    isBuy: true,
    orderType: 'market'
  });
  
  console.log('Order result:', order.data);
}
\`\`\`

## 🔧 API Reference

### Endpoints

#### Market Data
- **GET** `/api/market-data?asset={ASSET}` - Get real-time market data
- **GET** `/api/user-state?user={ADDRESS}` - Get user positions and state

#### Trading
- **POST** `/api/place-order` - Place market or limit orders
- **POST** `/api/manage-vault` - Deposit or withdraw from vault

#### HyperEVM
- **POST** `/api/call-contract` - Interact with smart contracts

#### Analytics
- **GET** `/api/transactions` - Get transaction history
- **GET** `/api/analytics` - Get trading analytics

#### Discord
- **POST** `/api/discord/test` - Test webhook connection
- **POST** `/api/discord/alerts` - Send custom alerts

### Request/Response Examples

#### Place Order
\`\`\`json
// Request
{
  "asset": "BTC",
  "amount": 100,
  "price": 45000,
  "isBuy": true,
  "orderType": "limit"
}

// Response
{
  "success": true,
  "orderId": "order_12345",
  "message": "Limit order placed successfully",
  "timestamp": 1703123456789
}
\`\`\`

#### Market Data
\`\`\`json
// Response
{
  "asset": "BTC",
  "price": 45000.00,
  "volume24h": 1200000000,
  "change24h": 2.5,
  "high24h": 46000.00,
  "low24h": 44000.00,
  "timestamp": 1703123456789
}
\`\`\`

## 🧪 Testing

### Run Tests
\`\`\`bash
npm test
\`\`\`

### Test with Hyperliquid Testnet
1. Set `HYPERLIQUID_API_URL` to testnet endpoint
2. Use testnet API keys
3. Fund testnet account with mock USDC
4. Test all trading operations

### Manual Testing Checklist
- [ ] Place market buy order
- [ ] Place limit sell order
- [ ] Check transaction history
- [ ] Test vault deposit/withdraw
- [ ] Verify Discord notifications
- [ ] Test error handling
- [ ] Validate input sanitization

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **One-Click Deploy**
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/hypereasy)

2. **Manual Deployment**
   \`\`\`bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   \`\`\`

3. **Environment Variables**
   Set these in Vercel dashboard:
   - `HYPERLIQUID_API_KEY`
   - `HYPERVM_RPC_URL`
   - `DISCORD_WEBHOOK_URL`
   - `DATABASE_URL`

### Other Platforms
- **Netlify**: Use `npm run build` and deploy `dist/` folder
- **Railway**: Connect GitHub repo and deploy
- **Docker**: Use provided Dockerfile

## 🔒 Security

- **API Key Protection**: Never expose API keys in client-side code
- **Input Validation**: All inputs are sanitized and validated
- **Rate Limiting**: Built-in protection against abuse
- **HTTPS Only**: All API calls use secure connections
- **Error Handling**: Sensitive information is never leaked in errors

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Style
- Use TypeScript for all new code
- Follow existing naming conventions
- Add JSDoc comments for public APIs
- Ensure all tests pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Hackathon Submission

**Hyperliquid Community Hackathon - Public Goods Track**

### Submission Details
- **Category**: Public Goods Track
- **Deadline**: August 22, 2025
- **Demo Video**: [2-minute demo showcasing both developer and no-code usage]
- **Live Demo**: [https://your-hypereasy-app.vercel.app]

### Key Features for Judging
- ✅ Open-source (MIT License)
- ✅ Serves both technical and non-technical users
- ✅ Production-ready and scalable
- ✅ Comprehensive documentation
- ✅ Accessible design
- ✅ Full Hyperliquid integration
- ✅ HyperEVM support via Lava Network

## 📞 Support

- **Documentation**: [https://your-hypereasy-app.vercel.app/docs]
- **Issues**: [GitHub Issues](https://github.com/yourusername/hypereasy/issues)
- **Discord**: [Join our community](https://discord.gg/hypereasy)
- **Email**: support@hypereasy.dev

## 🙏 Acknowledgments

- **Hyperliquid Team** for the amazing trading platform
- **Lava Network** for HyperEVM RPC access
- **Vercel** for hosting and deployment
- **Open Source Community** for the tools and libraries

---

**Built with ❤️ for the Hyperliquid Community**
