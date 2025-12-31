/**
 * Authentication Service
 * Handles PIN management, recovery hints, and user authentication
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

export interface RecoveryHint {
  question: string;
  answer: string; // hashed
}

export interface UserAuth {
  pin: string; // hashed
  isMainAdmin: boolean;
  canResetOthers: boolean;
  canChangeHints: boolean;
  createdAt: string;
}

export interface AuthData {
  recoveryHints?: {
    hint1: RecoveryHint;
    hint2: RecoveryHint;
  };
  users: {
    yuval?: UserAuth;
    einav?: UserAuth;
  };
}

const AUTH_STORAGE_KEY = 'buki_auth';

/**
 * Get auth data from LocalStorage
 */
export const getAuthData = (): AuthData | null => {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as AuthData;
  } catch {
    return null;
  }
};

/**
 * Save auth data to LocalStorage
 */
export const saveAuthData = (data: AuthData): void => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
};

/**
 * Check if a user exists
 */
export const userExists = (userId: 'yuval' | 'einav'): boolean => {
  const data = getAuthData();
  return !!(data?.users[userId]);
};

/**
 * Check if this is first time setup (no users at all)
 */
export const isFirstTimeSetup = (): boolean => {
  const data = getAuthData();
  return !data || (!data.users.yuval && !data.users.einav);
};

/**
 * Check if user is main admin
 */
export const isMainAdmin = (userId: 'yuval' | 'einav'): boolean => {
  const data = getAuthData();
  return data?.users[userId]?.isMainAdmin || false;
};

/**
 * Setup recovery hints (main admin only)
 */
export const setupRecoveryHints = (
  hint1Question: string,
  hint1Answer: string,
  hint2Question: string,
  hint2Answer: string
): void => {
  const data = getAuthData() || { users: {} };
  
  data.recoveryHints = {
    hint1: {
      question: hint1Question,
      answer: simpleHash(hint1Answer.toLowerCase().trim()),
    },
    hint2: {
      question: hint2Question,
      answer: simpleHash(hint2Answer.toLowerCase().trim()),
    },
  };

  saveAuthData(data);
};

/**
 * Create a new user with PIN
 */
export const createUser = (
  userId: 'yuval' | 'einav',
  pin: string,
  isMainAdmin: boolean = false
): void => {
  const data = getAuthData() || { users: {} };
  
  data.users[userId] = {
    pin: simpleHash(pin),
    isMainAdmin,
    canResetOthers: isMainAdmin,
    canChangeHints: isMainAdmin,
    createdAt: new Date().toISOString(),
  };

  saveAuthData(data);
};

/**
 * Verify PIN for a user
 */
export const verifyPIN = (userId: 'yuval' | 'einav', pin: string): boolean => {
  const data = getAuthData();
  if (!data) return false;

  const user = data.users[userId];
  if (!user) return false;

  return user.pin === simpleHash(pin);
};

/**
 * Verify recovery hints (both required - legacy, kept for compatibility)
 */
export const verifyRecoveryHints = (
  answer1: string,
  answer2: string
): boolean => {
  const data = getAuthData();
  if (!data?.recoveryHints) return false;

  const hash1 = simpleHash(answer1.toLowerCase().trim());
  const hash2 = simpleHash(answer2.toLowerCase().trim());

  return (
    data.recoveryHints.hint1.answer === hash1 &&
    data.recoveryHints.hint2.answer === hash2
  );
};

/**
 * Verify a single recovery hint by ID (hint1 or hint2)
 * Either hint is sufficient for recovery
 */
export const verifySingleHint = (
  hintId: 'hint1' | 'hint2',
  answer: string
): boolean => {
  const data = getAuthData();
  if (!data?.recoveryHints) return false;

  const hash = simpleHash(answer.toLowerCase().trim());
  return data.recoveryHints[hintId].answer === hash;
};

/**
 * Get recovery hint questions
 */
export const getRecoveryHints = (): { hint1: string; hint2: string } | null => {
  const data = getAuthData();
  if (!data?.recoveryHints) return null;

  return {
    hint1: data.recoveryHints.hint1.question,
    hint2: data.recoveryHints.hint2.question,
  };
};

/**
 * Reset user PIN (after hint verification or by main admin)
 */
export const resetUserPIN = (userId: 'yuval' | 'einav', newPin: string): boolean => {
  const data = getAuthData();
  if (!data?.users[userId]) return false;

  data.users[userId]!.pin = simpleHash(newPin);
  saveAuthData(data);
  return true;
};

/**
 * Update recovery hints (main admin only)
 */
export const updateRecoveryHints = (
  hint1Question: string,
  hint1Answer: string,
  hint2Question: string,
  hint2Answer: string
): void => {
  setupRecoveryHints(hint1Question, hint1Answer, hint2Question, hint2Answer);
};

/**
 * Clear all auth data (nuclear option)
 */
export const clearAllAuthData = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

/**
 * Export auth data for backup
 */
export const exportAuthData = (): string => {
  const data = getAuthData();
  return JSON.stringify(data, null, 2);
};
