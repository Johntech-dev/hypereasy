/**
 * HyperEasy SDK Usage Examples
 * These examples show how developers can integrate the HyperEasy API wrapper
 */

// Example 1: Fetch market data
export async function fetchMarketDataExample() {
  try {
    const response = await fetch("/api/market-data?asset=BTC")
    const marketData = await response.json()

    if (response.ok) {
      console.log("BTC Price:", marketData.price)
      console.log("24h Change:", marketData.change24h + "%")
      return marketData
    } else {
      console.error("Error:", marketData.error)
    }
  } catch (error) {
    console.error("Network error:", error)
  }
}

// Example 2: Place a market buy order
export async function placeBuyOrderExample() {
  try {
    const orderData = {
      asset: "BTC",
      amount: 100, // $100 worth
      isBuy: true,
      orderType: "market",
    }

    const response = await fetch("/api/place-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    })

    const result = await response.json()

    if (response.ok) {
      console.log("Order placed successfully:", result.orderId)
      return result
    } else {
      console.error("Order failed:", result.error)
    }
  } catch (error) {
    console.error("Network error:", error)
  }
}

// Example 3: Place a limit sell order
export async function placeLimitOrderExample() {
  try {
    const orderData = {
      asset: "ETH",
      amount: 50, // $50 worth
      price: 3500, // Limit price
      isBuy: false,
      orderType: "limit",
    }

    const response = await fetch("/api/place-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Network error:", error)
  }
}

// Example 4: Deposit to vault
export async function depositToVaultExample() {
  try {
    const vaultData = {
      action: "deposit",
      amount: 1000, // $1000
    }

    const response = await fetch("/api/manage-vault", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vaultData),
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Network error:", error)
  }
}

// Example 5: Call a smart contract
export async function callContractExample() {
  try {
    const contractData = {
      contractAddress: "0x1234567890123456789012345678901234567890",
      functionName: "balanceOf",
      params: ["0xUserAddress"],
    }

    const response = await fetch("/api/call-contract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contractData),
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Network error:", error)
  }
}

// Example 6: Node.js server integration
export const nodeJSExample = `
// Install: npm install axios
const axios = require('axios');

async function integrateHyperEasy() {
  const baseURL = 'https://your-hypereasy-app.vercel.app';
  
  // Get market data
  const marketData = await axios.get(\`\${baseURL}/api/market-data?asset=BTC\`);
  console.log('BTC Price:', marketData.data.price);
  
  // Place order
  const order = await axios.post(\`\${baseURL}/api/place-order\`, {
    asset: 'BTC',
    amount: 100,
    isBuy: true,
    orderType: 'market'
  });
  
  console.log('Order result:', order.data);
}
`
