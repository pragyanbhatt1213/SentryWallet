/**
 * Transaction History Utility
 * Manages transaction history using browser sessionStorage
 */

const STORAGE_KEY = 'sentry_transaction_history';
const MAX_HISTORY_ITEMS = 50; // Limit to prevent storage bloat

/**
 * Adds a new transaction to the history
 * @param {string} hash - Transaction hash
 * @param {string} type - Transaction type (e.g., 'Send tBDAG', 'Nominee Update')
 */
export const addTransactionToHistory = (hash, type) => {
  try {
    if (!hash || !type) {
      console.warn('Invalid transaction data provided to history');
      return;
    }

    // Get existing history
    const existingHistory = getTransactionHistory();
    
    // Create new transaction object
    const newTransaction = {
      hash: hash,
      type: type,
      timestamp: new Date().toISOString(),
      id: `${hash}_${Date.now()}` // Unique identifier
    };

    // Add to beginning of array (most recent first)
    const updatedHistory = [newTransaction, ...existingHistory];
    
    // Limit the number of stored transactions
    const limitedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);
    
    // Save to sessionStorage
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(limitedHistory));
    
    console.log(`Transaction added to history: ${type} - ${hash}`);
  } catch (error) {
    console.error('Error adding transaction to history:', error);
  }
};

/**
 * Retrieves the transaction history from sessionStorage
 * @returns {Array} Array of transaction objects
 */
export const getTransactionHistory = () => {
  try {
    const historyData = sessionStorage.getItem(STORAGE_KEY);
    
    if (!historyData) {
      return [];
    }
    
    const parsedHistory = JSON.parse(historyData);
    
    // Validate that it's an array
    if (!Array.isArray(parsedHistory)) {
      console.warn('Invalid history data format, resetting...');
      clearTransactionHistory();
      return [];
    }
    
    // Sort by timestamp (most recent first) as a safety measure
    return parsedHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch (error) {
    console.error('Error retrieving transaction history:', error);
    return [];
  }
};

/**
 * Clears all transaction history
 */
export const clearTransactionHistory = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    console.log('Transaction history cleared');
  } catch (error) {
    console.error('Error clearing transaction history:', error);
  }
};

/**
 * Formats a transaction hash for display (shortened version)
 * @param {string} hash - Full transaction hash
 * @returns {string} Shortened hash for display
 */
export const formatTransactionHash = (hash) => {
  if (!hash || hash.length < 10) {
    return hash;
  }
  
  return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
};

/**
 * Generates the BlockDAG explorer URL for a transaction
 * @param {string} hash - Transaction hash
 * @returns {string} Full explorer URL
 */
export const getExplorerUrl = (hash) => {
  if (!hash) {
    return '';
  }
  return `https://primordial.bdagscan.com/tx/${hash}`;
};

/**
 * Formats timestamp for display
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} Formatted time string
 */
export const formatTimestamp = (timestamp) => {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  } catch (error) {
    return 'Unknown time';
  }
};