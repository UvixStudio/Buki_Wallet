/**
 * Authentication Service
 * Handles PIN management, recovery hints, and user authentication
 * Now uses Postgres Database for centralized data storage
 */

// Simple hash function (for demo - in production use bcrypt or similar)
const simpleHash = (text: string): string => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

/**
 * Check if a user exists
 */
export const userExists = async (userId: 'yuval' | 'einav'): Promise<boolean> => {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'userExists', userId }),
    });
    const result = await response.json();
    return result.exists || false;
  } catch (error) {
    console.error('Error checking user existence:', error);
    return false;
  }
};

/**
 * Check if this is first time setup (no users at all)
 */
export const isFirstTimeSetup = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'isFirstTimeSetup' }),
    });
    const result = await response.json();
    return result.isFirstTime || false;
  } catch (error) {
    console.error('Error checking first time setup:', error);
    return true; // Assume first time on error
  }
};

/**
 * Create a new user with PIN and recovery info
 */
export const createUser = async (
  userId: 'yuval' | 'einav',
  pin: string,
  recoveryHint: string,
  recoveryId: string,
  isMainAdmin: boolean = false
): Promise<void> => {
  const pinHash = simpleHash(pin);
  
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'createUser',
        userId,
        pinHash,
        recoveryHint,
        recoveryId,
        isMainAdmin,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create user');
    }
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Verify PIN for a user
 */
export const verifyPIN = async (userId: 'yuval' | 'einav', pin: string): Promise<boolean> => {
  const pinHash = simpleHash(pin);
  
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verifyPIN', userId, pinHash }),
    });
    const result = await response.json();
    return result.valid || false;
  } catch (error) {
    console.error('Error verifying PIN:', error);
    return false;
  }
};

/**
 * Get recovery hint for a user
 */
export const getRecoveryHint = async (userId: 'yuval' | 'einav'): Promise<string | null> => {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'getRecoveryHint', userId }),
    });
    const result = await response.json();
    return result.hint || null;
  } catch (error) {
    console.error('Error getting recovery hint:', error);
    return null;
  }
};

/**
 * Verify recovery info (hint + ID)
 */
export const verifyRecovery = async (
  userId: 'yuval' | 'einav',
  recoveryId: string
): Promise<boolean> => {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verifyRecovery', userId, recoveryId }),
    });
    const result = await response.json();
    return result.valid || false;
  } catch (error) {
    console.error('Error verifying recovery:', error);
    return false;
  }
};

/**
 * Reset user PIN (after recovery verification)
 */
export const resetUserPIN = async (userId: 'yuval' | 'einav', newPin: string): Promise<boolean> => {
  const pinHash = simpleHash(newPin);
  
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'resetPIN', userId, pinHash }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error resetting PIN:', error);
    return false;
  }
};

/**
 * Update recovery info for a user
 */
export const updateRecoveryInfo = async (
  userId: 'yuval' | 'einav',
  recoveryHint: string,
  recoveryId: string
): Promise<void> => {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'updateRecovery',
        userId,
        recoveryHint,
        recoveryId,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update recovery info');
    }
  } catch (error) {
    console.error('Error updating recovery info:', error);
    throw error;
  }
};
