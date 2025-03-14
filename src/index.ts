#!/usr/bin/env node

import { Command } from 'commander';
import * as dotenv from 'dotenv';
import { OpenSeaClient } from './opensea';
import { displayCollectionInfo } from './utils';

dotenv.config();

const program = new Command();

program
  .name('nft-checker')
  .description('CLI tool to check NFT rarity and floor prices')
  .version('0.1.0');

program
  .command('check')
  .description('Check NFT collection data')
  .argument('<contract>', 'NFT contract address or collection slug')
  .action(async (contract) => {
    try {
      console.log(`🔍 Checking NFT collection: ${contract}`);
      
      const client = new OpenSeaClient(process.env.OPENSEA_API_KEY);
      
      let collectionSlug = contract;
      if (contract.startsWith('0x')) {
        const assets = await client.getAssets(contract, 1);
        if (assets.assets.length === 0) {
          console.error('❌ No assets found for this contract address');
          return;
        }
        collectionSlug = assets.assets[0].collection.slug;
      }
      
      console.log(`📥 Fetching data for collection: ${collectionSlug}`);
      
      const [collectionData, statsData] = await Promise.all([
        client.getCollection(collectionSlug),
        client.getCollectionStats(collectionSlug)
      ]);
      
      displayCollectionInfo(collectionData.collection, statsData.stats);
      
    } catch (error) {
      console.error(`❌ Error: ${error}`);
      console.log('\\n💡 Tips:');
      console.log('- Make sure the contract address or collection slug is correct');
      console.log('- Set OPENSEA_API_KEY in your .env file for better rate limits');
      console.log('- Try again in a few seconds if you hit rate limits');
    }
  });

program.parse();