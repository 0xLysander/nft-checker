export interface NFTCollection {
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  banner_image_url?: string;
  external_url?: string;
  twitter_username?: string;
  discord_url?: string;
  instagram_username?: string;
  telegram_url?: string;
  owned_asset_count: number;
}

export interface NFTCollectionStats {
  one_day_volume: number;
  one_day_change: number;
  one_day_sales: number;
  seven_day_volume: number;
  seven_day_change: number;
  seven_day_sales: number;
  thirty_day_volume: number;
  thirty_day_change: number;
  thirty_day_sales: number;
  total_volume: number;
  total_sales: number;
  total_supply: number;
  count: number;
  num_owners: number;
  average_price: number;
  num_reports: number;
  market_cap: number;
  floor_price: number;
}

export interface NFTAsset {
  id: number;
  token_id: string;
  image_url?: string;
  image_preview_url?: string;
  image_thumbnail_url?: string;
  image_original_url?: string;
  animation_url?: string;
  animation_original_url?: string;
  name?: string;
  description?: string;
  external_link?: string;
  asset_contract: {
    address: string;
    asset_contract_type: string;
    created_date: string;
    name: string;
    nft_version?: string;
    opensea_version?: string;
    owner?: number;
    schema_name: string;
    symbol: string;
    total_supply?: string;
    description?: string;
    external_link?: string;
    image_url?: string;
    default_to_fiat: boolean;
  };
  owner?: {
    user?: {
      username?: string;
    };
    profile_img_url?: string;
    address: string;
    config?: string;
  };
  permalink: string;
  collection: NFTCollection;
  decimals?: number;
  token_metadata?: string;
  sell_orders?: any[];
  creator?: {
    user?: {
      username?: string;
    };
    profile_img_url?: string;
    address: string;
    config?: string;
  };
  traits: Array<{
    trait_type: string;
    value: any;
    display_type?: string;
    max_value?: any;
    trait_count?: number;
    order?: any;
  }>;
  last_sale?: {
    asset?: {
      decimals?: number;
      token_id: string;
    };
    asset_bundle?: any;
    event_type: string;
    event_timestamp: string;
    auction_type?: any;
    total_price?: string;
    payment_token?: {
      id: number;
      symbol: string;
      address: string;
      image_url: string;
      name: string;
      decimals: number;
      eth_price: string;
      usd_price: string;
    };
    transaction?: {
      block_hash: string;
      block_number: string;
      from_account: {
        address: string;
        config: string;
        profile_img_url: string;
        user?: {
          username?: string;
        };
      };
      id: number;
      timestamp: string;
      to_account: {
        address: string;
        config: string;
        profile_img_url: string;
        user?: {
          username?: string;
        };
      };
      transaction_hash: string;
      transaction_index: string;
    };
    created_date: string;
    quantity: string;
  };
  top_bid?: any;
  listing_date?: any;
  is_presale: boolean;
  transfer_fee_payment_token?: any;
  transfer_fee?: any;
}