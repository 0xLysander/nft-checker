# NFT Checker

A command-line tool to check NFT collection statistics and floor prices using OpenSea API.

## Features

- Check NFT collection stats (floor price, volume, owners, etc.)
- Support for both contract addresses and collection slugs  
- Market data and trading volume analytics
- Clean, formatted console output

## Installation

```bash
npm install
npm run build
```

## Configuration

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Add your API keys (optional but recommended):

```env
OPENSEA_API_KEY=your_opensea_api_key_here
ALCHEMY_API_KEY=your_alchemy_api_key_here  
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

## Usage

### Check Collection by Slug

```bash
npm run dev check cryptopunks
npm run dev check boredapeyachtclub
```

### Check Collection by Contract Address

```bash  
npm run dev check 0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB
```

## Example Output

```
🔍 Checking NFT collection: cryptopunks
📥 Fetching data for collection: cryptopunks

📊 NFT Collection Info
========================
Name: CryptoPunks
Description: CryptoPunks launched as a fixed set of 10,000 items in mid-2017...
Total Supply: 10.0K
Owners: 3.3K

💰 Market Data  
================
Floor Price: 65.2500 ETH
Market Cap: 652500.0000 ETH
Total Volume: 987543.2100 ETH
Average Price: 98.7543 ETH

📈 Volume Stats (24h)
======================
Volume: 123.4500 ETH
Change: +5.67%
Sales: 12
```

## Development

```bash
npm run dev <command>
npm run build
npm start <command>
```

## License

MIT