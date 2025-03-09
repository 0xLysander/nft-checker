#!/usr/bin/env node

import { Command } from 'commander';
import * as dotenv from 'dotenv';

dotenv.config();

const program = new Command();

program
  .name('nft-checker')
  .description('CLI tool to check NFT rarity and floor prices')
  .version('0.1.0');

program
  .command('check')
  .description('Check NFT collection data')
  .argument('<contract>', 'NFT contract address')
  .action(async (contract) => {
    console.log(`Checking NFT collection: ${contract}`);
    console.log('Feature coming soon...');
  });

program.parse();