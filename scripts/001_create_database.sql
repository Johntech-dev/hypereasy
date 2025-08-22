-- HyperEasy Database Setup Script
-- This script creates the initial database tables for transaction logging

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    asset TEXT NOT NULL,
    amount REAL NOT NULL,
    price REAL NOT NULL,
    isBuy INTEGER NOT NULL, -- SQLite uses INTEGER for boolean
    orderType TEXT DEFAULT 'market',
    status TEXT DEFAULT 'pending',
    orderId TEXT,
    userId TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create vault_operations table
CREATE TABLE IF NOT EXISTS vault_operations (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    userId TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create api_usage table for analytics
CREATE TABLE IF NOT EXISTS api_usage (
    id TEXT PRIMARY KEY,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    status INTEGER NOT NULL,
    userId TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(timestamp);
CREATE INDEX IF NOT EXISTS idx_transactions_asset ON transactions(asset);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_vault_operations_timestamp ON vault_operations(timestamp);
CREATE INDEX IF NOT EXISTS idx_api_usage_timestamp ON api_usage(timestamp);
CREATE INDEX IF NOT EXISTS idx_api_usage_endpoint ON api_usage(endpoint);
