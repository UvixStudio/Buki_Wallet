# Buki Wallet - מדריך פיתוח

## סטטוס פרויקט

**Phase נוכחי:** Phase 1 - POC Mockup (בפיתוח)

**Branch פעיל:** `phase-1-poc-mockup`

**Live URLs:**
- **Phase 0 Test:** https://buki-wallet-mhrw.vercel.app (branch: `phase-0-vercel-test`)
- **Phase 1 POC:** טרם פורס

---

## מבנה Branches

| Branch | מטרה | סטטוס |
|--------|------|-------|
| `main` | Production baseline | ✅ Active |
| `phase-0-vercel-test` | בדיקת חיבור Vercel | ✅ Complete |
| `phase-1-poc-mockup` | POC עם UI מלא | 🔄 In Progress |
| `phase-2-functional` | פיתוח פונקציונאלי | 📅 Planned |

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

#### ⬜ מה חסר (Phase 1)
- פריסה ל-Vercel
- אימות במכשירים שונים

---

## Phase 2 - פיתוח פונקציונאלי (מתוכנן)

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
| Vercel | - | Deployment |

---

## מבנה קבצים

```
Buki_Wallet/
├── app/
│   ├── layout.tsx       # Root layout (RTL + Hebrew)
│   ├── page.tsx         # Main app component
│   └── globals.css      # Tailwind styles
├── public/              # Static assets
├── .qoder/              # Quest documentation
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── tailwind.config.ts   # Tailwind config
├── next.config.mjs      # Next.js config
├── vercel.json          # Vercel deployment config
├── DEVELOPMENT.md       # זה המסמך
└── CHANGELOG.md         # היסטוריית שינויים
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

## קישורים

- **GitHub:** https://github.com/UvixStudio/Buki_Wallet
- **Vercel Dashboard:** https://vercel.com
- **מסמך אפיון:** `.qoder/quests/family-wallet-setup.md`
