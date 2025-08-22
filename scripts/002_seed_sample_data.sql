-- Sample data for testing and demonstration
-- This script adds sample transactions to showcase the transaction history feature

INSERT INTO transactions (id, asset, amount, price, isBuy, orderType, status, orderId, timestamp) VALUES
('tx_001', 'BTC', 100.00, 45000.00, 1, 'market', 'completed', 'order_12345', datetime('now', '-2 days')),
('tx_002', 'ETH', 250.00, 3200.00, 0, 'limit', 'completed', 'order_12346', datetime('now', '-1 day')),
('tx_003', 'SOL', 75.00, 180.00, 1, 'market', 'completed', 'order_12347', datetime('now', '-12 hours')),
('tx_004', 'BTC', 500.00, 46000.00, 0, 'limit', 'pending', 'order_12348', datetime('now', '-6 hours')),
('tx_005', 'AVAX', 150.00, 35.00, 1, 'market', 'failed', NULL, datetime('now', '-3 hours'));

INSERT INTO vault_operations (id, action, amount, status, timestamp) VALUES
('vault_001', 'deposit', 1000.00, 'completed', datetime('now', '-3 days')),
('vault_002', 'withdraw', 200.00, 'completed', datetime('now', '-1 day')),
('vault_003', 'deposit', 500.00, 'pending', datetime('now', '-2 hours'));

INSERT INTO api_usage (id, endpoint, method, status, timestamp) VALUES
('api_001', '/api/market-data', 'GET', 200, datetime('now', '-1 hour')),
('api_002', '/api/place-order', 'POST', 200, datetime('now', '-30 minutes')),
('api_003', '/api/place-order', 'POST', 400, datetime('now', '-15 minutes')),
('api_004', '/api/transactions', 'GET', 200, datetime('now', '-5 minutes'));
