# HyperEasy API Documentation

Complete API reference for HyperEasy SDK wrapper.

## Base URL
- **Production**: `https://your-hypereasy-app.vercel.app`
- **Development**: `http://localhost:3000`

## Authentication
All API endpoints require a valid Hyperliquid API key set in environment variables. No additional authentication is needed for API calls.

## Rate Limiting
- **Market Data**: 100 requests per minute
- **Trading**: 50 requests per minute
- **Analytics**: 20 requests per minute

## Error Handling
All endpoints return consistent error responses:

\`\`\`json
{
  "error": "Error message",
  "code": 400,
  "details": "Additional error details"
}
\`\`\`

## Endpoints

### Market Data

#### Get Market Data
Fetch real-time market data for a specific asset.

**Endpoint**: `GET /api/market-data`

**Parameters**:
- `asset` (string, required): Asset symbol (BTC, ETH, SOL, etc.)

**Response**:
\`\`\`json
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

**Example**:
\`\`\`javascript
const response = await fetch('/api/market-data?asset=BTC');
const data = await response.json();
\`\`\`

#### Get User State
Fetch user's trading positions and account state.

**Endpoint**: `GET /api/user-state`

**Parameters**:
- `user` (string, required): User wallet address

**Response**:
\`\`\`json
{
  "assetPositions": [...],
  "marginSummary": {...},
  "crossMaintenanceMarginUsed": "0"
}
\`\`\`

### Trading

#### Place Order
Place a market or limit order on Hyperliquid.

**Endpoint**: `POST /api/place-order`

**Request Body**:
\`\`\`json
{
  "asset": "BTC",
  "amount": 100,
  "price": 45000,
  "isBuy": true,
  "orderType": "limit"
}
\`\`\`

**Parameters**:
- `asset` (string): Asset symbol
- `amount` (number): Order amount in USD
- `price` (number, optional): Limit price (required for limit orders)
- `isBuy` (boolean): true for buy, false for sell
- `orderType` (string): "market" or "limit"

**Response**:
\`\`\`json
{
  "success": true,
  "orderId": "order_12345",
  "message": "Limit order placed successfully",
  "timestamp": 1703123456789
}
\`\`\`

**Example**:
\`\`\`javascript
const response = await fetch('/api/place-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    asset: 'BTC',
    amount: 100,
    isBuy: true,
    orderType: 'market'
  })
});
\`\`\`

#### Manage Vault
Deposit or withdraw funds from Hyperliquid vault.

**Endpoint**: `POST /api/manage-vault`

**Request Body**:
\`\`\`json
{
  "action": "deposit",
  "amount": 1000
}
\`\`\`

**Parameters**:
- `action` (string): "deposit" or "withdraw"
- `amount` (number): Amount in USD

**Response**:
\`\`\`json
{
  "success": true,
  "message": "Vault deposit of $1000 completed",
  "timestamp": 1703123456789
}
\`\`\`

### HyperEVM

#### Call Contract
Interact with smart contracts on HyperEVM.

**Endpoint**: `POST /api/call-contract`

**Request Body**:
\`\`\`json
{
  "contractAddress": "0x1234567890123456789012345678901234567890",
  "functionName": "balanceOf",
  "params": ["0xUserAddress"]
}
\`\`\`

**Parameters**:
- `contractAddress` (string): Contract address
- `functionName` (string): Function to call
- `params` (array): Function parameters

**Response**:
\`\`\`json
{
  "success": true,
  "result": "1000000000000000000",
  "timestamp": 1703123456789
}
\`\`\`

### Analytics

#### Get Transactions
Fetch transaction history with optional filtering.

**Endpoint**: `GET /api/transactions`

**Parameters**:
- `limit` (number, optional): Number of transactions (default: 10, max: 100)
- `userId` (string, optional): Filter by user ID
- `stats` (boolean, optional): Include statistics

**Response**:
\`\`\`json
{
  "transactions": [...],
  "stats": {
    "totalTransactions": 50,
    "completedTransactions": 45,
    "totalVolume": 10000,
    "successRate": 90
  },
  "pagination": {
    "limit": 10,
    "count": 10
  }
}
\`\`\`

#### Get Analytics
Fetch comprehensive analytics data.

**Endpoint**: `GET /api/analytics`

**Parameters**:
- `period` (string, optional): "24h", "7d", or "30d" (default: "24h")
- `userId` (string, optional): Filter by user ID

**Response**:
\`\`\`json
{
  "period": "24h",
  "timeRange": {
    "start": "2023-12-01T00:00:00.000Z",
    "end": "2023-12-02T00:00:00.000Z"
  },
  "transactions": {
    "total": 25,
    "byStatus": {
      "completed": 20,
      "pending": 3,
      "failed": 2
    },
    "volume": {
      "total": 5000,
      "average": 200
    },
    "byAsset": [...],
    "byOrderType": {
      "market": 15,
      "limit": 10
    }
  },
  "vault": {
    "operations": [...]
  },
  "api": {
    "calls": [...]
  }
}
\`\`\`

### Discord Integration

#### Test Webhook
Test Discord webhook connection.

**Endpoint**: `POST /api/discord/test`

**Request Body** (optional):
\`\`\`json
{
  "webhookUrl": "https://discord.com/api/webhooks/..."
}
\`\`\`

**Response**:
\`\`\`json
{
  "success": true,
  "message": "Discord webhook connection successful",
  "timestamp": "2023-12-01T12:00:00.000Z"
}
\`\`\`

#### Send Alerts
Send custom Discord alerts.

**Endpoint**: `POST /api/discord/alerts`

**Request Body**:
\`\`\`json
{
  "type": "daily_summary",
  "data": {
    "pnl": 150.75
  }
}
\`\`\`

**Alert Types**:
- `daily_summary`: Daily trading summary
- `market_alert`: Market price alerts
- `system_alert`: System notifications

## SDK Usage

### JavaScript/Node.js

\`\`\`javascript
// ES6 Modules
import { HyperliquidClient } from './lib/hyperliquid-client';

// CommonJS
const { HyperliquidClient } = require('./lib/hyperliquid-client');

// Initialize client
const client = new HyperliquidClient(process.env.HYPERLIQUID_API_KEY);

// Use client methods
const marketData = await client.getMarketData('BTC');
const order = await client.placeOrder({
  asset: 'BTC',
  amount: 100,
  isBuy: true,
  orderType: 'market'
});
\`\`\`

### TypeScript

\`\`\`typescript
import { HyperliquidClient } from './lib/hyperliquid-client';
import type { OrderRequest, MarketData } from './lib/types';

const client = new HyperliquidClient(process.env.HYPERLIQUID_API_KEY!);

const order: OrderRequest = {
  asset: 'BTC',
  amount: 100,
  isBuy: true,
  orderType: 'market'
};

const result = await client.placeOrder(order);
\`\`\`

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid API key |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Endpoint not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |
| 502 | Bad Gateway - Hyperliquid API error |
| 503 | Service Unavailable - Temporary outage |

## Best Practices

1. **Error Handling**: Always handle API errors gracefully
2. **Rate Limiting**: Respect rate limits to avoid being blocked
3. **Validation**: Validate all inputs before sending requests
4. **Security**: Never expose API keys in client-side code
5. **Caching**: Cache market data to reduce API calls
6. **Monitoring**: Monitor API usage and performance

## Support

For API support:
- Check this documentation
- Review example code
- Create GitHub issue
- Join Discord community
