import { ethers } from 'ethers';
import SentryInheritanceABI from '../contracts/SentryInheritance.json';

// Contract configuration
const CONTRACT_ADDRESS = process.env.REACT_APP_INHERITANCE_CONTRACT_ADDRESS;
const BLOCKDAG_EXPLORER_BASE_URL = 'https://explorer.blockdag.network/tx/';

/**
 * Creates and returns a contract instance connected to the user's wallet
 * @param {ethers.Wallet|ethers.Signer} wallet - The user's wallet/signer instance
 * @returns {ethers.Contract} Contract instance ready for interaction
 */
export const getContractInstance = (wallet) => {
  if (!wallet) {
    throw new Error('Wallet is required to create contract instance');
  }
  
  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address not configured in environment variables');
  }
  
  try {
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      SentryInheritanceABI.abi,
      wallet
    );
    
    return contract;
  } catch (error) {
    throw new Error(`Failed to create contract instance: ${error.message}`);
  }
};

/**
 * Validates if an address is a valid Ethereum address
 * @param {string} address - The address to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const validateAddress = (address) => {
  try {
    return ethers.utils.isAddress(address);
  } catch (error) {
    return false;
  }
};

/**
 * Calculates the total shares from an array of nominees
 * @param {Array} nominees - Array of nominee objects with sharePercentage property
 * @returns {number} Total share percentage
 */
export const calculateTotalShares = (nominees) => {
  if (!Array.isArray(nominees)) {
    return 0;
  }
  
  return nominees.reduce((total, nominee) => {
    const share = parseInt(nominee.sharePercentage) || 0;
    return total + share;
  }, 0);
};

/**
 * Formats blockchain transaction errors into user-friendly messages
 * @param {Error} error - The error object from the transaction
 * @returns {string} User-friendly error message
 */
export const formatTransactionError = (error) => {
  if (!error) {
    return 'An unknown error occurred';
  }
  
  // Handle specific error codes
  if (error.code === 'INSUFFICIENT_FUNDS') {
    return 'Insufficient funds for gas fees. Please add more funds to your wallet.';
  }
  
  if (error.code === 'USER_REJECTED') {
    return 'Transaction was cancelled by user.';
  }
  
  if (error.code === 'NETWORK_ERROR') {
    return 'Network connection error. Please check your internet connection and try again.';
  }
  
  // Handle contract revert reasons
  if (error.reason) {
    return `Contract error: ${error.reason}`;
  }
  
  // Handle user rejection
  if (error.message && error.message.includes('user rejected')) {
    return 'Transaction was cancelled by user.';
  }
  
  // Handle gas estimation errors
  if (error.message && error.message.includes('gas')) {
    return 'Transaction failed due to gas estimation error. Please try again.';
  }
  
  // Default error message
  return error.message || 'An unexpected error occurred. Please try again.';
};

/**
 * Generates a BlockDAG explorer URL for a transaction hash
 * @param {string} txHash - The transaction hash
 * @returns {string} Full explorer URL
 */
export const getExplorerUrl = (txHash) => {
  if (!txHash) {
    return '';
  }
  return `${BLOCKDAG_EXPLORER_BASE_URL}${txHash}`;
};

// ==================== CORE CONTRACT INTERACTION FUNCTIONS ====================

/**
 * Fetches the current list of nominees from the smart contract
 * @param {ethers.Wallet|ethers.Signer} wallet - The user's wallet/signer instance
 * @returns {Promise<Array>} Array of nominee objects with address and sharePercentage
 */
export const fetchNominees = async (wallet) => {
  try {
    if (!wallet) {
      throw new Error('Wallet is required to fetch nominees');
    }

    const contract = getContractInstance(wallet);
    
    // Call the getNominees() view function on the smart contract
    const nominees = await contract.getNominees();
    
    // Transform the contract response into a more usable format
    const formattedNominees = nominees.map(nominee => ({
      address: nominee.nominee,
      sharePercentage: parseInt(nominee.sharePercentage.toString())
    }));
    
    return formattedNominees;
  } catch (error) {
    console.error('Error fetching nominees:', error);
    throw new Error(`Failed to fetch nominees: ${formatTransactionError(error)}`);
  }
};

/**
 * Adds or updates a nominee on the smart contract
 * @param {ethers.Wallet|ethers.Signer} wallet - The user's wallet/signer instance
 * @param {string} nomineeAddress - The Ethereum address of the nominee
 * @param {number} sharePercentage - The share percentage (1-100)
 * @returns {Promise<Object>} Transaction receipt upon successful confirmation
 */
export const addNominee = async (wallet, nomineeAddress, sharePercentage) => {
  try {
    if (!wallet) {
      throw new Error('Wallet is required to add nominee');
    }

    if (!validateAddress(nomineeAddress)) {
      throw new Error('Invalid nominee address provided');
    }

    const share = parseInt(sharePercentage);
    if (isNaN(share) || share < 1 || share > 100) {
      throw new Error('Share percentage must be between 1 and 100');
    }

    const contract = getContractInstance(wallet);
    
    // Call the setNominee() function on the smart contract
    const tx = await contract.setNominee(nomineeAddress, share);
    
    // Wait for the transaction to be confirmed by the network
    const receipt = await tx.wait();
    
    return {
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      status: receipt.status,
      receipt
    };
  } catch (error) {
    console.error('Error adding nominee:', error);
    throw new Error(`Failed to add nominee: ${formatTransactionError(error)}`);
  }
};

/**
 * Removes a nominee from the smart contract
 * @param {ethers.Wallet|ethers.Signer} wallet - The user's wallet/signer instance
 * @param {string} nomineeAddress - The Ethereum address of the nominee to remove
 * @returns {Promise<Object>} Transaction receipt upon successful confirmation
 */
export const removeNominee = async (wallet, nomineeAddress) => {
  try {
    if (!wallet) {
      throw new Error('Wallet is required to remove nominee');
    }

    if (!validateAddress(nomineeAddress)) {
      throw new Error('Invalid nominee address provided');
    }

    const contract = getContractInstance(wallet);
    
    // Call the removeNominee() function on the smart contract
    const tx = await contract.removeNominee(nomineeAddress);
    
    // Wait for the transaction to be confirmed by the network
    const receipt = await tx.wait();
    
    return {
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      status: receipt.status,
      receipt
    };
  } catch (error) {
    console.error('Error removing nominee:', error);
    throw new Error(`Failed to remove nominee: ${formatTransactionError(error)}`);
  }
};