import { sql } from '@vercel/postgres';
import { Child, Transaction } from '../context/WalletContext';

/**
 * Database Service for Buki Wallet
 * Manages all database operations using Vercel Postgres (Neon)
 */

// Initialize database tables
export async function initializeDatabase() {
  try {
    // Create users table for authentication
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        pin_hash TEXT NOT NULL,
        recovery_hint TEXT,
        recovery_id TEXT,
        is_main_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create children table
    await sql`
      CREATE TABLE IF NOT EXISTS children (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        color TEXT NOT NULL,
        initial_balance DECIMAL(10, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create transactions table
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
        type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
        amount DECIMAL(10, 2) NOT NULL,
        description TEXT NOT NULL,
        timestamp TIMESTAMP NOT NULL,
        created_by TEXT,
        last_modified_by TEXT,
        last_modified_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create index on child_id for faster queries
    await sql`
      CREATE INDEX IF NOT EXISTS idx_transactions_child_id ON transactions(child_id)
    `;

    // Create index on timestamp for sorting
    await sql`
      CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(timestamp DESC)
    `;

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

// Get all children with their transactions
export async function getAllChildren(): Promise<Child[]> {
  try {
    const { rows: childrenRows } = await sql`
      SELECT * FROM children ORDER BY name
    `;

    if (childrenRows.length === 0) {
      // If no children exist, create default ones
      await createDefaultChildren();
      return getAllChildren();
    }

    const children: Child[] = [];

    for (const childRow of childrenRows) {
      const { rows: transactionRows } = await sql`
        SELECT * FROM transactions 
        WHERE child_id = ${childRow.id}
        ORDER BY timestamp DESC
      `;

      const transactions: Transaction[] = transactionRows.map((row: any) => ({
        id: row.id,
        childId: row.child_id,
        type: row.type,
        amount: parseFloat(row.amount),
        description: row.description,
        timestamp: row.timestamp,
        createdBy: row.created_by,
        lastModifiedBy: row.last_modified_by,
        lastModifiedAt: row.last_modified_at,
      }));

      children.push({
        id: childRow.id,
        name: childRow.name,
        color: childRow.color,
        initialBalance: parseFloat(childRow.initial_balance),
        transactions,
      });
    }

    return children;
  } catch (error) {
    console.error('❌ Error fetching children:', error);
    throw error;
  }
}

// Create default children (Jonathan and Amir)
async function createDefaultChildren() {
  try {
    await sql`
      INSERT INTO children (id, name, color, initial_balance)
      VALUES 
        ('jonathan', 'יונתן', '#1E3A8A', 0),
        ('amir', 'אמיר', '#EA580C', 0)
      ON CONFLICT (id) DO NOTHING
    `;
    console.log('✅ Default children created');
  } catch (error) {
    console.error('❌ Error creating default children:', error);
    throw error;
  }
}

// Add a new transaction
export async function addTransaction(transaction: Transaction): Promise<void> {
  try {
    await sql`
      INSERT INTO transactions (
        id, child_id, type, amount, description, timestamp, 
        created_by, last_modified_by, last_modified_at
      )
      VALUES (
        ${transaction.id},
        ${transaction.childId},
        ${transaction.type},
        ${transaction.amount},
        ${transaction.description},
        ${transaction.timestamp},
        ${transaction.createdBy || null},
        ${transaction.lastModifiedBy || null},
        ${transaction.lastModifiedAt || null}
      )
    `;
    console.log('✅ Transaction added:', transaction.id);
  } catch (error) {
    console.error('❌ Error adding transaction:', error);
    throw error;
  }
}

// Update an existing transaction
export async function updateTransaction(
  transactionId: string,
  updates: Partial<Transaction>
): Promise<void> {
  try {
    const setClauses: string[] = [];
    const values: any[] = [];

    if (updates.type !== undefined) {
      setClauses.push('type = $' + (values.length + 1));
      values.push(updates.type);
    }
    if (updates.amount !== undefined) {
      setClauses.push('amount = $' + (values.length + 1));
      values.push(updates.amount);
    }
    if (updates.description !== undefined) {
      setClauses.push('description = $' + (values.length + 1));
      values.push(updates.description);
    }
    if (updates.lastModifiedBy !== undefined) {
      setClauses.push('last_modified_by = $' + (values.length + 1));
      values.push(updates.lastModifiedBy);
    }
    if (updates.lastModifiedAt !== undefined) {
      setClauses.push('last_modified_at = $' + (values.length + 1));
      values.push(updates.lastModifiedAt);
    }

    if (setClauses.length === 0) {
      return; // Nothing to update
    }

    await sql.query(
      `UPDATE transactions SET ${setClauses.join(', ')} WHERE id = $${values.length + 1}`,
      [...values, transactionId]
    );

    console.log('✅ Transaction updated:', transactionId);
  } catch (error) {
    console.error('❌ Error updating transaction:', error);
    throw error;
  }
}

// Delete a transaction
export async function deleteTransaction(transactionId: string): Promise<void> {
  try {
    await sql`
      DELETE FROM transactions WHERE id = ${transactionId}
    `;
    console.log('✅ Transaction deleted:', transactionId);
  } catch (error) {
    console.error('❌ Error deleting transaction:', error);
    throw error;
  }
}

// Update child's initial balance
export async function updateInitialBalance(childId: string, balance: number): Promise<void> {
  try {
    await sql`
      UPDATE children 
      SET initial_balance = ${balance}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${childId}
    `;
    console.log('✅ Initial balance updated for child:', childId);
  } catch (error) {
    console.error('❌ Error updating initial balance:', error);
    throw error;
  }
}

// Reset all data (delete all transactions and reset balances)
export async function resetAllData(): Promise<void> {
  try {
    await sql`DELETE FROM transactions`;
    await sql`UPDATE children SET initial_balance = 0, updated_at = CURRENT_TIMESTAMP`;
    console.log('✅ All data reset');
  } catch (error) {
    console.error('❌ Error resetting data:', error);
    throw error;
  }
}

// ========================================
// Authentication Functions
// ========================================

export interface UserData {
  id: string;
  pinHash: string;
  recoveryHint?: string;
  recoveryId?: string;
  isMainAdmin: boolean;
}

// Check if any users exist (for first-time setup)
export async function isFirstTimeSetup(): Promise<boolean> {
  try {
    const { rows } = await sql`SELECT COUNT(*) as count FROM users`;
    return parseInt(rows[0].count) === 0;
  } catch (error) {
    console.error('❌ Error checking first-time setup:', error);
    return true; // Assume first time if error
  }
}

// Check if a specific user exists
export async function userExists(userId: string): Promise<boolean> {
  try {
    const { rows } = await sql`
      SELECT id FROM users WHERE id = ${userId}
    `;
    return rows.length > 0;
  } catch (error) {
    console.error('❌ Error checking user existence:', error);
    return false;
  }
}

// Get user data
export async function getUser(userId: string): Promise<UserData | null> {
  try {
    const { rows } = await sql`
      SELECT * FROM users WHERE id = ${userId}
    `;
    if (rows.length === 0) return null;
    
    const row = rows[0];
    return {
      id: row.id,
      pinHash: row.pin_hash,
      recoveryHint: row.recovery_hint,
      recoveryId: row.recovery_id,
      isMainAdmin: row.is_main_admin,
    };
  } catch (error) {
    console.error('❌ Error getting user:', error);
    return null;
  }
}

// Create new user
export async function createUser(
  userId: string,
  pinHash: string,
  recoveryHint: string,
  recoveryId: string,
  isMainAdmin: boolean = false
): Promise<void> {
  try {
    await sql`
      INSERT INTO users (id, pin_hash, recovery_hint, recovery_id, is_main_admin)
      VALUES (${userId}, ${pinHash}, ${recoveryHint}, ${recoveryId}, ${isMainAdmin})
    `;
    console.log('✅ User created:', userId);
  } catch (error) {
    console.error('❌ Error creating user:', error);
    throw error;
  }
}

// Update user PIN
export async function updateUserPIN(
  userId: string,
  newPinHash: string
): Promise<void> {
  try {
    await sql`
      UPDATE users 
      SET pin_hash = ${newPinHash}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
    `;
    console.log('✅ PIN updated for user:', userId);
  } catch (error) {
    console.error('❌ Error updating PIN:', error);
    throw error;
  }
}

// Update recovery info
export async function updateRecoveryInfo(
  userId: string,
  recoveryHint: string,
  recoveryId: string
): Promise<void> {
  try {
    await sql`
      UPDATE users 
      SET recovery_hint = ${recoveryHint}, recovery_id = ${recoveryId}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
    `;
    console.log('✅ Recovery info updated for user:', userId);
  } catch (error) {
    console.error('❌ Error updating recovery info:', error);
    throw error;
  }
}
