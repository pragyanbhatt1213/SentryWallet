// In src/utils/localHistory.js

/**
 * Adds a new transaction object to the user-specific history log in localStorage.
 * @param {object} newTx - The transaction object to add.
 * @param {string} userId - The user's ID to create a unique storage key.
 */
export const addLocalTransaction = (newTx, userId) => {
  if (!userId) {
    console.error("Cannot save transaction history without a user ID.");
    return;
  }
  
  const HISTORY_KEY = `sentry_history_${userId}`;
  
  try {
    const existingHistory = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    const updatedHistory = [newTx, ...existingHistory];
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Failed to save transaction to local history:", error);
  }
};

/**
 * Retrieves the user-specific transaction history log from localStorage.
 * @param {string} userId - The user's ID to create a unique storage key.
 * @returns {Array} An array of transaction objects.
 */
export const getLocalHistory = (userId) => {
  if (!userId) return [];
  
  const HISTORY_KEY = `sentry_history_${userId}`;
  
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch (error) {
    console.error("Failed to retrieve local history:", error);
    return [];
  }
};