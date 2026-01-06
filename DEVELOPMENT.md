# Buki Wallet - מדריך פיתוח

## סטטוס פרויקט

**Phase נוכחי:** Phase 2 - Functional Development ✅ Complete!

**Branch פעיל:** `phase-2-functional`

**🌐 Production URL:** https://buki-wallet.vercel.app

**Live URLs:**
- **Production (Phase 2):** https://buki-wallet.vercel.app ✅ **LIVE**
- **Phase 0 Test:** https://buki-wallet-mhrw.vercel.app (branch: `phase-0-vercel-test`)
- **Phase 1 POC:** https://buki-wallet-mhrw-git-phase-1-poc-mockup-yuval-cohens-projects.vercel.app ✅

---

## מבנה Branches

| Branch | מטרה | סטטוס |
|--------|------|-------|
| `main` | Production baseline | ✅ Active |
| `phase-0-vercel-test` | בדיקת חיבור Vercel | ✅ Complete |
| `phase-1-poc-mockup` | POC עם UI מלא | ✅ Complete |
| `phase-2-functional` | פיתוח פונקציונאלי + Database | 🚧 In Progress |

---

## Phase 1 - POC Mockup

### מה בנוי כרגע:

#### ✅ UI Components
- כותרת אפליקציה עם כפתור מצב הורה
- שני סקשנים לילדים (יונתן, אמיר)
- רשימת רשומות עם גלילה פנימית
- מודל הוספת רשומה (מעוצב בצבע הילד)
- כפתורי הרחבה/צמצום (⛶)

#### ✅ תכונות
- **עברית מלאה + RTL** - כל האפליקציה בעברית עם יישור ימני
- **מצב הורה/צפייה** - toggle פשוט (ללא סיסמה)
- **גלילה פנימית** - כל ילד יכול לגלול 20 רשומות
- **מודל הוספה** - טופס מעוצב (לא שומר נתונים)
- **responsive design** - Mobile-first (max-width: 448px)

#### ✅ מה בנוי (הושלם)
- פריסה ל-Vercel
- אימות במכשירים שונים (iOS/Android + Desktop)

---

## Phase 2 - פיתוח פונקציונאלי (🚧 בעבודה)

### ✅ מה הושלם:

#### 1. **Database Integration - Postgres (Neon)**
- ✅ חיבור ל-Vercel Postgres (Neon) דרך Marketplace
- ✅ יצירת [`dbService.ts`](file:///app/services/dbService.ts) - ניהול כל פעולות הדאטהבייס
- ✅ טבלאות:
  - `children` - מידע על יונתן ואמיר
  - `transactions` - כל הטרנזקציות (הכנסות/הוצאות)
  - Indexes לביצועים טובים

#### 2. **API Routes**
- ✅ [`/api/wallet/route.ts`](file:///app/api/wallet/route.ts) - ממשק לדאטהבייס
  - GET - קריאת כל הדאטה
  - POST - הוספה/עדכון/מחיקה של טרנזקציות
  - אתחול אוטומטי של הדאטהבייס

#### 3. **State Management**
- ✅ עדכון [`WalletContext.tsx`](file:///app/context/WalletContext.tsx)
  - מעבר מ-localStorage לדאטהבייס
  - Optimistic Updates (עדכון מיידי בUI)
  - סנכרון עם שרת ברקע
  - Loading States (`isLoading`, `isSyncing`)

#### 4. **Loading & Sync Indicators**
- ✅ אנימציות טעינה עדינות
- ✅ אינדיקטור סנכרון (אייקון ⟳ מסתובב)
- ✅ Shimmer effect על יתרות בזמן סנכרון

#### 5. **Configuration**
- ✅ [`vercel.json`](file:///vercel.json) - הגדרות Build
- ✅ [`.env.local`](file:///.env.local) - משתני סביבה (Postgres credentials)

---

### 🚧 בתהליך:

#### 6. **Authentication Migration**
- 🚧 טבלת `users` בדאטהבייס (PIN + Recovery Info)
- 🚧 עדכון [`authService.ts`](file:///app/services/authService.ts) לעבוד עם DB
- 🚧 API Route `/api/auth` לאימות
- 📅 עדכון קומפוננטות PIN/Recovery

---

## Phase 2 - תכונות מתוכננות (המקורי)

### תכונות מתוכננות:

1. **שכבת נתונים**
   - LocalStorage לשמירת נתונים
   - State management עם React Context
   - סכמת נתונים: Children + Transactions

2. **CRUD מלא**
   - הוספת רשומה (שמירה אמיתית)
   - עריכת רשומה קיימת
   - מחיקת רשומה עם אישור

3. **חישובים אוטומטיים**
   - יתרה מחושבת מרשומות
   - מיון רשומות לפי תאריך
   - validation של סכומים

4. **אימות הורים**
   - סיסמה פשוטה (משפחתית)
   - Session management
   - הגנה על פעולות עריכה

5. **שיפורי UX**
   - Toast notifications
   - Loading states
   - Error handling

---

## הרצת הפרויקט

### התקנה
```bash
npm install
```

### הרצה מקומית
```bash
npm run dev
```
הפרויקט יעלה ב: http://localhost:3000

### Build לייצור
```bash
npm run build
npm run start
```

---

## טכנולוגיות

| טכנולוגיה | גרסה | שימוש |
|-----------|------|-------|
| Next.js | 16.1.1 | Framework |
| React | 18 | UI Library |
| TypeScript | 5 | Type Safety |
| Tailwind CSS | 3.3.0 | Styling |
| **@vercel/postgres** | **Latest** | **Database Client** |
| **Neon (Postgres)** | **-** | **Cloud Database** |
| Vercel | - | Deployment |

---

## מבנה קבצים

```
Buki_Wallet/
├── app/
│   ├── api/
│   │   └── wallet/
│   │       └── route.ts      # API endpoint לדאטהבייס
│   ├── components/       # UI Components
│   │   ├── WelcomeScreen.tsx
│   │   ├── PINScreen.tsx
│   │   ├── SetupPINScreen.tsx
│   │   ├── RecoveryScreen.tsx
│   │   ├── SideMenu.tsx
│   │   └── ResetDataModal.tsx
│   ├── context/
│   │   └── WalletContext.tsx # State Management
│   ├── services/
│   │   ├── dbService.ts      # Database operations
│   │   ├── authService.ts    # Authentication
│   │   ├── excelService.ts   # Export to Excel
│   │   └── firebaseService.ts # (Deprecated)
│   ├── layout.tsx        # Root layout (RTL + Hebrew)
│   ├── page.tsx          # Main app component
│   └── globals.css       # Tailwind styles
├── public/               # Static assets
├── .env.local            # Environment variables (Postgres)
├── .qoder/               # Quest documentation
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── tailwind.config.ts    # Tailwind config
├── next.config.mjs       # Next.js config
├── vercel.json           # Vercel deployment config
├── DEVELOPMENT.md        # זה המסמך
└── CHANGELOG.md          # היסטוריית שינויים
```

---

## Deployment Workflow

### Deploy ל-Vercel

1. **Push לגיט**
   ```bash
   git add .
   git commit -m "הודעה"
   git push origin phase-1-poc-mockup
   ```

2. **Vercel Auto-Deploy**
   - Vercel מזהה push אוטומטית
   - בונה ופורס תוך 1-2 דקות
   - מייצר preview URL

3. **Merge ל-main**
   ```bash
   git checkout main
   git merge phase-1-poc-mockup
   git push origin main
   ```

---

## העדפות עיצוב

### צבעים

| אלמנט | צבע | HEX |
|-------|-----|-----|
| יונתן - ראשי | Navy Blue | #1E3A8A |
| אמיר - ראשי | Orange | #EA580C |
| הכנסה | Green | #16A34A |
| הוצאה | Red | #DC2626 |

### טיפוגרפיה
- **כותרות:** Bold, 18-20px
- **יתרות:** Bold, 24-28px
- **רשומות:** Regular, 14px
- **תאריכים:** Regular, 12px

---

## שאלות ותשובות

**ש: האם הנתונים נשמרים?**
ת: לא בPhase 1. רק ב-Phase 2 יהיה LocalStorage.

**ש: איך לבדוק במובייל?**
ת: פתח Chrome DevTools → Toggle device toolbar (Ctrl+Shift+M)

**ש: מה קורה ב-refresh?**
ת: הנתונים חוזרים למצב ברירת המחדל (20 רשומות מזויפות).

---

## Database Setup (Postgres/Neon)

### איך הגדרנו את הדאטהבייס:

1. **יצירת Database ב-Vercel:**
   - Vercel Dashboard → Storage → Create Database
   - בחרנו **Neon (Postgres)** מה-Marketplace
   - Region: Washington D.C., USA (East)
   - Plan: Free (256MB + 10,000 rows)

2. **חיבור לפרויקט:**
   - Connect Project → Buki_Wallet
   - אוטומטי נוספו Environment Variables

3. **Environment Variables** (`.env.local`):
   ```bash
   POSTGRES_URL=postgresql://...
   POSTGRES_PRISMA_URL=postgresql://...
   POSTGRES_URL_NO_SSL=postgresql://...
   POSTGRES_URL_NON_POOLING=postgresql://...
   POSTGRES_USER=...
   POSTGRES_HOST=...
   POSTGRES_PASSWORD=...
   POSTGRES_DATABASE=...
   ```

### מבנה הדאטהבייס:

#### טבלאות:

**1. `children`** - מידע על הילדים
```sql
CREATE TABLE children (
  id TEXT PRIMARY KEY,              -- 'jonathan', 'amir'
  name TEXT NOT NULL,               -- 'יונתן', 'אמיר'
  color TEXT NOT NULL,              -- '#1E3A8A', '#EA580C'
  initial_balance DECIMAL(10, 2),   -- יתרה ראשונית
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**2. `transactions`** - כל הטרנזקציות
```sql
CREATE TABLE transactions (
  id TEXT PRIMARY KEY,              -- 'tx_1234567890_abc'
  child_id TEXT REFERENCES children(id),
  type TEXT CHECK (type IN ('income', 'expense')),
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  created_by TEXT,                  -- 'yuval', 'einav', 'guest'
  last_modified_by TEXT,
  last_modified_at TIMESTAMP,
  created_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_transactions_child_id ON transactions(child_id);
CREATE INDEX idx_transactions_timestamp ON transactions(timestamp DESC);
```

**3. `users`** (🚧 בתהליך) - אימות הורים
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,              -- 'yuval', 'einav'
  pin_hash TEXT NOT NULL,           -- Hashed PIN
  recovery_hint TEXT,
  recovery_id TEXT,
  is_main_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### איך לצפות בדאטה:

**אפשרות 1: Neon Console**
1. לך ל-Neon Dashboard
2. בחר את ה-database
3. SQL Editor → רוץ queries

**אפשרות 2: Vercel Dashboard**
1. Storage → Buki_Wallet_DB
2. Data → ראה את הטבלאות

**אפשרות 3: Local SQL Client**
השתמש ב-`POSTGRES_URL` מ-`.env.local`

---

## קישורים

- **GitHub:** https://github.com/UvixStudio/Buki_Wallet
- **Vercel Dashboard:** https://vercel.com
- **מסמך אפיון:** `.qoder/quests/family-wallet-setup.md`
