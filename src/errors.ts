export enum ErrorType {
  API_ERROR = 'API_ERROR',
  RATE_LIMIT = 'RATE_LIMIT', 
  NOT_FOUND = 'NOT_FOUND',
  INVALID_INPUT = 'INVALID_INPUT',
  NETWORK_ERROR = 'NETWORK_ERROR'
}

export class NFTCheckerError extends Error {
  public type: ErrorType;
  public originalError?: any;

  constructor(message: string, type: ErrorType, originalError?: any) {
    super(message);
    this.type = type;
    this.originalError = originalError;
    this.name = 'NFTCheckerError';
  }
}

export function parseAPIError(error: any): NFTCheckerError {
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || error.message;
    
    switch (status) {
      case 404:
        return new NFTCheckerError(
          'Collection or asset not found',
          ErrorType.NOT_FOUND,
          error
        );
      case 429:
        return new NFTCheckerError(
          'Rate limit exceeded. Please wait and try again',
          ErrorType.RATE_LIMIT,
          error
        );
      case 400:
        return new NFTCheckerError(
          `Invalid request: ${message}`,
          ErrorType.INVALID_INPUT,
          error
        );
      default:
        return new NFTCheckerError(
          `API error (${status}): ${message}`,
          ErrorType.API_ERROR,
          error
        );
    }
  }
  
  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
    return new NFTCheckerError(
      'Network connection failed. Check your internet connection',
      ErrorType.NETWORK_ERROR,
      error
    );
  }
  
  return new NFTCheckerError(
    `Unexpected error: ${error.message}`,
    ErrorType.API_ERROR,
    error
  );
}

export function handleError(error: NFTCheckerError) {
  console.error(`❌ ${error.message}`);
  
  switch (error.type) {
    case ErrorType.RATE_LIMIT:
      console.log('\\n💡 Tips:');
      console.log('- Add OPENSEA_API_KEY to your .env file to increase rate limits');
      console.log('- Wait 30-60 seconds before trying again');
      break;
      
    case ErrorType.NOT_FOUND:
      console.log('\\n💡 Tips:');
      console.log('- Check if the collection slug or contract address is correct');
      console.log('- Try searching on OpenSea first to verify the collection exists');
      break;
      
    case ErrorType.NETWORK_ERROR:
      console.log('\\n💡 Tips:');
      console.log('- Check your internet connection');
      console.log('- Try again in a few moments');
      break;
      
    case ErrorType.INVALID_INPUT:
      console.log('\\n💡 Tips:');
      console.log('- Verify the contract address format (should start with 0x)');
      console.log('- Check that the token ID is a valid number');
      break;
      
    default:
      console.log('\\n💡 Tips:');
      console.log('- Try again in a few moments');
      console.log('- Check the OpenSea status page for any ongoing issues');
  }
}