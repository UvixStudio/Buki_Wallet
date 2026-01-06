import { NextRequest, NextResponse } from 'next/server';
import {
  isFirstTimeSetup,
  userExists,
  getUser,
  createUser,
  updateUserPIN,
  updateRecoveryInfo,
} from '@/app/services/dbService';

/**
 * POST /api/auth
 * Handle authentication operations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'isFirstTimeSetup': {
        const isFirstTime = await isFirstTimeSetup();
        return NextResponse.json({ isFirstTime });
      }

      case 'userExists': {
        const { userId } = body;
        const exists = await userExists(userId);
        return NextResponse.json({ exists });
      }

      case 'createUser': {
        const { userId, pinHash, recoveryHint, recoveryId, isMainAdmin } = body;
        await createUser(userId, pinHash, recoveryHint, recoveryId, isMainAdmin);
        return NextResponse.json({ success: true });
      }

      case 'verifyPIN': {
        const { userId, pinHash } = body;
        const user = await getUser(userId);
        
        if (!user) {
          return NextResponse.json({ valid: false });
        }
        
        const valid = user.pinHash === pinHash;
        return NextResponse.json({ valid });
      }

      case 'getRecoveryHint': {
        const { userId } = body;
        const user = await getUser(userId);
        
        if (!user || !user.recoveryHint) {
          return NextResponse.json({ hint: null });
        }
        
        return NextResponse.json({ hint: user.recoveryHint });
      }

      case 'verifyRecovery': {
        const { userId, recoveryId } = body;
        const user = await getUser(userId);
        
        if (!user || !user.recoveryId) {
          return NextResponse.json({ valid: false });
        }
        
        const valid = user.recoveryId === recoveryId;
        return NextResponse.json({ valid });
      }

      case 'resetPIN': {
        const { userId, pinHash } = body;
        await updateUserPIN(userId, pinHash);
        return NextResponse.json({ success: true });
      }

      case 'updateRecovery': {
        const { userId, recoveryHint, recoveryId } = body;
        await updateRecoveryInfo(userId, recoveryHint, recoveryId);
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Error in POST /api/auth:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Operation failed' },
      { status: 500 }
    );
  }
}
