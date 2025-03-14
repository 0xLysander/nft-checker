import { NFTCollection, NFTCollectionStats } from './types';

export function formatETH(wei: number): string {
  if (!wei) return '0 ETH';
  const eth = wei / Math.pow(10, 18);
  return `${eth.toFixed(4)} ETH`;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export function formatPercentage(num: number): string {
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
}

export function displayCollectionInfo(collection: NFTCollection, stats: NFTCollectionStats) {
  console.log('\\n📊 NFT Collection Info');
  console.log('========================');
  console.log(`Name: ${collection.name}`);
  console.log(`Description: ${collection.description || 'N/A'}`);
  console.log(`Total Supply: ${formatNumber(stats.total_supply)}`);
  console.log(`Owners: ${formatNumber(stats.num_owners)}`);
  
  console.log('\\n💰 Market Data');
  console.log('================');
  console.log(`Floor Price: ${formatETH(stats.floor_price)}`);
  console.log(`Market Cap: ${formatETH(stats.market_cap)}`);
  console.log(`Total Volume: ${formatETH(stats.total_volume)}`);
  console.log(`Average Price: ${formatETH(stats.average_price)}`);
  
  console.log('\\n📈 Volume Stats (24h)');
  console.log('======================');
  console.log(`Volume: ${formatETH(stats.one_day_volume)}`);
  console.log(`Change: ${formatPercentage(stats.one_day_change)}`);
  console.log(`Sales: ${formatNumber(stats.one_day_sales)}`);
  
  console.log('\\n📊 Volume Stats (7d)');
  console.log('=====================');
  console.log(`Volume: ${formatETH(stats.seven_day_volume)}`);
  console.log(`Change: ${formatPercentage(stats.seven_day_change)}`);
  console.log(`Sales: ${formatNumber(stats.seven_day_sales)}`);

  if (collection.external_url) {
    console.log(`\\n🔗 Website: ${collection.external_url}`);
  }
  if (collection.twitter_username) {
    console.log(`🐦 Twitter: @${collection.twitter_username}`);
  }
  if (collection.discord_url) {
    console.log(`💬 Discord: ${collection.discord_url}`);
  }
}