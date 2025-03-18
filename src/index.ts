#!/usr/bin/env node

import { Command } from 'commander';
import * as dotenv from 'dotenv';
import { OpenSeaClient } from './opensea';
import { displayCollectionInfo } from './utils';
import { NFTCheckerError, handleError } from './errors';

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
      if (error instanceof NFTCheckerError) {
        handleError(error);
      } else {
        console.error(`❌ Unexpected error: ${error}`);
      }
    }
  });

program
  .command('asset')
  .description('Inspect individual NFT asset')
  .argument('<contract>', 'NFT contract address')
  .argument('<tokenId>', 'Token ID')
  .action(async (contract, tokenId) => {
    try {
      console.log(`🔍 Checking NFT: ${contract}/${tokenId}`);
      
      const client = new OpenSeaClient(process.env.OPENSEA_API_KEY);
      const asset = await client.getAsset(contract, tokenId);
      
      console.log('\\n🎨 NFT Asset Details');
      console.log('====================');
      console.log(`Name: ${asset.name || 'Unnamed'}`);
      console.log(`Collection: ${asset.collection.name}`);
      console.log(`Token ID: ${asset.token_id}`);
      console.log(`Contract: ${asset.asset_contract.address}`);
      
      if (asset.description) {
        console.log(`Description: ${asset.description.substring(0, 100)}...`);
      }
      
      if (asset.traits && asset.traits.length > 0) {
        console.log('\\n✨ Traits');
        console.log('==========');
        asset.traits.forEach(trait => {
          console.log(`${trait.trait_type}: ${trait.value}`);
        });
      }
      
      if (asset.last_sale) {
        console.log('\\n💰 Last Sale');
        console.log('=============');
        const price = asset.last_sale.total_price;
        const token = asset.last_sale.payment_token;
        if (price && token) {
          const ethPrice = parseFloat(price) / Math.pow(10, token.decimals);
          console.log(`Price: ${ethPrice.toFixed(4)} ${token.symbol}`);
          console.log(`Date: ${new Date(asset.last_sale.created_date).toLocaleDateString()}`);
        }
      }
      
      if (asset.permalink) {
        console.log(`\\n🔗 OpenSea: ${asset.permalink}`);
      }
      
    } catch (error) {
      if (error instanceof NFTCheckerError) {
        handleError(error);
      } else {
        console.error(`❌ Unexpected error: ${error}`);
      }
    }
  });

program
  .command('batch')
  .description('Check multiple collections from a file')
  .argument('<file>', 'File containing collection slugs or contract addresses (one per line)')
  .option('-d, --delay <ms>', 'delay between requests in milliseconds', '1000')
  .action(async (file, options) => {
    try {
      const fs = await import('fs');
      const collections = fs.readFileSync(file, 'utf8')
        .split('\\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      
      if (collections.length === 0) {
        console.log('❌ No collections found in file');
        return;
      }
      
      console.log(`🔍 Processing ${collections.length} collections...`);
      const client = new OpenSeaClient(process.env.OPENSEA_API_KEY);
      const delay = parseInt(options.delay);
      
      for (let i = 0; i < collections.length; i++) {
        const contract = collections[i];
        console.log(`\\n[${i + 1}/${collections.length}] Processing: ${contract}`);
        
        try {
          let collectionSlug = contract;
          if (contract.startsWith('0x')) {
            const assets = await client.getAssets(contract, 1);
            if (assets.assets.length === 0) {
              console.error('❌ No assets found for this contract address');
              continue;
            }
            collectionSlug = assets.assets[0].collection.slug;
          }
          
          const [collectionData, statsData] = await Promise.all([
            client.getCollection(collectionSlug),
            client.getCollectionStats(collectionSlug)
          ]);
          
          console.log(`\\n📊 ${collectionData.collection.name}`);
          console.log(`Floor Price: ${(statsData.stats.floor_price / Math.pow(10, 18)).toFixed(4)} ETH`);
          console.log(`Total Volume: ${(statsData.stats.total_volume / Math.pow(10, 18)).toFixed(2)} ETH`);
          console.log(`Owners: ${statsData.stats.num_owners.toLocaleString()}`);
          
        } catch (error) {
          if (error instanceof NFTCheckerError) {
            console.error(`❌ ${error.message}`);
          } else {
            console.error(`❌ Unexpected error: ${error}`);
          }
        }
        
        if (i < collections.length - 1) {
          console.log(`⏳ Waiting ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      
      console.log('\\n✅ Batch processing complete!');
      
    } catch (error) {
      console.error(`❌ Error reading file: ${error}`);
    }
  });

program.parse();