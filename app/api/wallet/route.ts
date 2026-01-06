import { NextRequest, NextResponse } from 'next/server';
import {
  getAllChildren,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  updateInitialBalance,
  resetAllData,
  initializeDatabase,
} from '@/app/services/dbService';
import { Transaction } from '@/app/context/WalletContext';

// Initialize database on first request
let isInitialized = false;

async function ensureInitialized() {
  if (!isInitialized) {
    await initializeDatabase();
    isInitialized = true;
  }
}

/**
 * GET /api/wallet
 * Fetch all children with their transactions
 */
export async function GET() {
  try {
    await ensureInitialized();
    const children = await getAllChildren();
    return NextResponse.json({ success: true, data: children });
  } catch (error: any) {
    console.error('Error in GET /api/wallet:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/wallet
 * Handle various wallet operations
 */
export async function POST(request: NextRequest) {
  try {
    await ensureInitialized();
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'addTransaction': {
        const { transaction } = body as { transaction: Transaction };
        await addTransaction(transaction);
        const children = await getAllChildren();
        return NextResponse.json({ success: true, data: children });
      }

      case 'updateTransaction': {
        const { transactionId, updates } = body as {
          transactionId: string;
          updates: Partial<Transaction>;
        };
        await updateTransaction(transactionId, updates);
        const children = await getAllChildren();
        return NextResponse.json({ success: true, data: children });
      }

      case 'deleteTransaction': {
        const { transactionId } = body as { transactionId: string };
        await deleteTransaction(transactionId);
        const children = await getAllChildren();
        return NextResponse.json({ success: true, data: children });
      }

      case 'updateInitialBalance': {
        const { childId, balance } = body as { childId: string; balance: number };
        await updateInitialBalance(childId, balance);
        const children = await getAllChildren();
        return NextResponse.json({ success: true, data: children });
      }

      case 'resetAllData': {
        await resetAllData();
        const children = await getAllChildren();
        return NextResponse.json({ success: true, data: children });
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Error in POST /api/wallet:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Operation failed' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/wallet
 * Update child information (name, color)
 */
export async function PUT(request: NextRequest) {
  try {
    await ensureInitialized();
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'updateChild': {
        const { childId, name, color } = body as { childId: string; name: string; color: string };
        const { sql } = await import('@vercel/postgres');
        await sql`
          UPDATE children
          SET name = ${name}, color = ${color}, updated_at = NOW()
          WHERE id = ${childId}
        `;
        const children = await getAllChildren();
        return NextResponse.json({ success: true, data: children });
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Error in PUT /api/wallet:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Operation failed' },
      { status: 500 }
    );
  }
}
