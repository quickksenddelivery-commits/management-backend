/**
 * FanConnectPro settles ALL payments in cryptocurrency.
 * Supported coins, indicative USD rates, and fiat→USD conversion helpers.
 * Mirrors the frontend's src/lib/crypto.ts. Rates are static/indicative for
 * Stage 1 — a live rate feed replaces these in Stage 2.
 */

const COINS = [
  { symbol: 'USDT', name: 'Tether',   usdPrice: 1,     color: '#26A17B', network: 'TRC-20 · Tron',     address: 'TFcpGtvFanConnectPro9xKq7vN2mB4tZ8wL5sD', stable: true, recommended: true },
  { symbol: 'USDC', name: 'USD Coin', usdPrice: 1,     color: '#2775CA', network: 'ERC-20 · Ethereum', address: '0x7C3AeD9b2E4c8D6a05Fe3b71C9d2A48ReDc', stable: true },
  { symbol: 'BTC',  name: 'Bitcoin',  usdPrice: 68000, color: '#F7931A', network: 'Bitcoin',           address: 'bc1qfcprofanconnecteventtckt5p2y8gtv0n9rsdkmq3' },
  { symbol: 'ETH',  name: 'Ethereum', usdPrice: 3500,  color: '#627EEA', network: 'ERC-20 · Ethereum', address: '0xE7h3FanConnectPro1f9b2E4c8D6a05Fe3b71C9d2A48' },
  { symbol: 'BNB',  name: 'BNB',      usdPrice: 600,   color: '#F3BA2F', network: 'BEP-20 · BNB Chain', address: '0xBnbFanConnectPro5sD6gtv0n9rsKmq3p2y8x7k2acFE' },
];

/** 1 unit of fiat = X USD (indicative) */
const FIAT_USD = {
  USD: 1,
  GBP: 1.27,
  CAD: 0.73,
  AUD: 0.66,
};

const getCoin = (symbol) => COINS.find((c) => c.symbol === String(symbol).toUpperCase());

const toUSD = (amount, currency) => amount * (FIAT_USD[currency] ?? 1);

const toCrypto = (usd, coin) => usd / coin.usdPrice;

/** Round crypto amount to a sensible number of decimals for the coin. */
const roundCrypto = (amount, coin) => {
  const decimals = coin.stable ? 2 : amount < 1 ? 6 : 4;
  return Number(amount.toFixed(decimals));
};

module.exports = { COINS, FIAT_USD, getCoin, toUSD, toCrypto, roundCrypto };
