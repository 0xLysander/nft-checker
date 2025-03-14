import axios from 'axios';
import { NFTCollection, NFTCollectionStats, NFTAsset } from './types';

export class OpenSeaClient {
  private baseURL = 'https://api.opensea.io/api/v1';
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    
    if (this.apiKey) {
      headers['X-API-KEY'] = this.apiKey;
    }
    
    return headers;
  }

  async getCollection(slug: string): Promise<{ collection: NFTCollection }> {
    try {
      const response = await axios.get(`${this.baseURL}/collection/${slug}`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch collection: ${error}`);
    }
  }

  async getCollectionStats(slug: string): Promise<{ stats: NFTCollectionStats }> {
    try {
      const response = await axios.get(`${this.baseURL}/collection/${slug}/stats`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch collection stats: ${error}`);
    }
  }

  async getAssets(
    contractAddress: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ assets: NFTAsset[] }> {
    try {
      const response = await axios.get(`${this.baseURL}/assets`, {
        headers: this.getHeaders(),
        params: {
          asset_contract_address: contractAddress,
          limit,
          offset,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch assets: ${error}`);
    }
  }

  async getAsset(contractAddress: string, tokenId: string): Promise<NFTAsset> {
    try {
      const response = await axios.get(`${this.baseURL}/asset/${contractAddress}/${tokenId}`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch asset: ${error}`);
    }
  }
}