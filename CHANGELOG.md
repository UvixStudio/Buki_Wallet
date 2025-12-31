# Changelog - Buki Wallet

All notable changes to this project will be documented in this file.

---

## [Phase 3 - Authentication] - 2025-12-31 🔐 בפיתוח

### Added ✨
- **מסך Welcome**: 2 כפתורים - כניסת ילדים / כניסת הורים
- **מסך PIN**: 4 עיגולים + מקלדת מספרים + אימות
- **בחירת פרופיל**: יובל/עינב + אימוג'ים
- **Session Management**: שמירה אוטומטית של מצב התחברות
- **תפריט Hamburger (☰)**: פרופיל אדמין + 4 אופציות
- **תיוג רשומות**: שדה createdBy בכל רשומה
- **תצוגת יוצר**: "נוסף ע"י: יובל" בכל רשומה

### Changed 🔄
- **הדר**: כפתור האמבורגר + פרופיל אדמין
- **Flow**: Welcome → PIN → Main App
- **מצב ילדים**: רק צפייה (ללא עריכה)
- **מצב הורים**: כל האופציות + תפריט

### Technical 🔧
- 3 קומפוננטות חדשות: WelcomeScreen, PINScreen, SideMenu
- Session persistence ב-LocalStorage
- AuthState management: welcome | pin | child | parent
- Parent profiles: yuval/einav + emoji icons
- Transaction author tracking

---

## [Phase 2 - Functional] - 2025-12-31 🔄 הושלם

### Added ✨
- **LocalStorage ניהול נתונים**: שמירה אוטומטית של כל השינויים
- **Context API**: ניהול State מרכזי עם WalletContext
- **הוספת רשומה אמיתית**: טופס מלא עם validation + שמירה
- **עריכת רשומה**: לחיצה על רשומה פותחת מודל עריכה
- **מחיקת רשומה**: כפתור מחק + אישור "האם אתה בטוח?"
- **חישוב יתרות אוטומטי**: יתרה = יתרה התחלתית + סכום כל הרשומות
- **כפתור Refresh (⟳)**: עיגול מושלם עם אנימציית סיבוב
- **כפתור איפוס**: מחיקה מלאה של LocalStorage (לבדיקות)
- **אנימציות חזותיות**: כפתור מסתובב + הבהוב ירוק של היתרה

### Changed 🔄
- **עיצוב כפתורים**: כל הכפתורים `rounded-full` (קפסולות עגולות)
- **כפתורים איקוניים**: w-8 h-8 (עיגולים מושלמים)
- **שדות קלט**: גם עם `rounded-full`
- **כפתור "הצג"**: שונה מטקסט לאייקון ▼
- **מודל עריכה**: כפתורים "עדכן", "מחק", "ביטול"

### Technical 🔧
- WalletContext עם כל ה-CRUD operations
- LocalStorage אוטומטי (save + load)
- TypeScript interfaces: Child, Transaction, TransactionType
- פונקציות: addTransaction, updateTransaction, deleteTransaction, resetAllData

### Design System 🎨
- **עקביות ואחידות**: כל הכפתורים עיגולים
- **עיגולים מושלמים**: כפתורים איקוניים (w-8 h-8 rounded-full)
- **קפסולות**: כפתורים טקסטואליים עם rounded-full
- **אנימציות עדינות**: spin + pulse + ring effects

---

## [Phase 1 - POC] - 2025-12-31 ✅ הושלם!

### Added ✨
- UI מלא עם שני סקשנים לילדים (יונתן, אמיר)
- כפתור מצב הורה/צפייה בכותרת העליונה
- מודל הוספת רשומה מעוצב (כותרת בצבע הילד + טקסט לבן)
- כפתורי הרחבה/צמצום (⛶) לכל ילד
- גלילה פנימית ברשומות - כל ילד יכול לגלול את כל 20 הרשומות שלו
- תמיכה מלאה ב-RTL (Right-to-Left)
- תרגום מלא לעברית - כל הטקסטים, תאריכים, ותיאורי רשומות
- 20 רשומות מזויפות לכל ילד (נתונים רנדומליים)

### Changed 🔄
- כותרת מודל: עברה לצבע של הילד עם טקסט לבן (Navy ליונתן, Orange לאמיר)
- סדר כפתורים במודל: שמירה (ימין), ביטול (שמאל) - RTL
- סדר רדיו באטונים: הכנסה (ימין), הוצאה (שמאל) - RTL
- סדר עמודות ברשומות: סכום+תיאור (ימין), תאריך (שמאל) - RTL
- תצוגה ממורכזת mobile-first (max-width: 448px)
- רשומות: הוחלף מ-5 רשומות קבועות לכל 20 רשומות עם גלילה
- כפתור מצב הורה: הועבר מה-footer לכותרת העליונה

### Design Decisions 🎨
- **כל ילד מקבל צבע ייחודי**: Navy Blue (#1E3A8A) ליונתן, Orange (#EA580C) לאמיר
- **כותרות על רקע צבעוני**: טקסט לבן על רקע צבע הילד לזיהוי מיידי
- **RTL מלא**: יישור ימני, היפוך סדר אלמנטים, תמיכה בעברית
- **גלילה פנימית**: מאפשר מבט זריז על הרשומות האחרונות ללא הרחבה

### Technical 🔧
- Next.js 16.1.1 (Turbopack)
- TypeScript 5
- Tailwind CSS 3.3.0
- React 18
- RTL support: `<html lang="he" dir="rtl">`
- Mobile-first: `max-w-md` (448px)

### Deployed 🚀
- **Live URL:** https://buki-wallet-mhrw-git-phase-1-poc-mockup-yuval-cohens-projects.vercel.app
- **Branch:** phase-1-poc-mockup  
- **Status:** ✅ Working on mobile and desktop
- **Verified:** iOS/Android mobile browsers, Desktop Chrome

---

## [Phase 0 - Vercel Test] - 2025-12-30 ✅

### Added ✨
- Next.js 14 project initialization
- Basic test page: "THIS IS A VERCEL TEST"
- Vercel deployment configuration
- GitHub → Vercel connection

### Fixed 🐛
- Vercel build error: Added `vercel.json` with framework config

### Deployed 🚀
- Live URL: https://buki-wallet-mhrw.vercel.app
- Branch: `phase-0-vercel-test`

---

## Git Workflow הסטוריה

### Branches Created
1. `main` - Production baseline (2025-12-30)
2. `phase-0-vercel-test` - Vercel connection test (2025-12-30)
3. `phase-1-poc-mockup` - POC UI development (2025-12-31)

### Commits Summary
- Initial Next.js setup
- Add vercel.json configuration
- Phase 1: Complete UI mockup with Hebrew RTL
- Add modal with child-specific colors
- Add internal scrolling for transactions

---

## Upcoming - Phase 2 (מתוכנן)

### Planned Features 📅
- [ ] LocalStorage data persistence
- [ ] Real transaction add/edit/delete
- [ ] Automatic balance calculation
- [ ] Parent authentication (password)
- [ ] Session management
- [ ] Toast notifications
- [ ] Error handling
- [ ] Loading states

---

## Version History

| Version | Date | Phase | Status |
|---------|------|-------|--------|
| 0.3.0 | 2025-12-31 | Phase 1 | 🔄 In Progress |
| 0.2.0 | 2025-12-30 | Phase 0 | ✅ Complete |
| 0.1.0 | 2025-12-30 | Init | ✅ Complete |
