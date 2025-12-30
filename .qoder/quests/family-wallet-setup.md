# Buki Wallet - Family Digital Wallet Design

## Project Overview

**Project Name:** Buki Wallet (ארנק בוקי)

**Repository:** https://github.com/UvixStudio/Buki_Wallet.git

**Primary Goal:** Early deployment to Vercel with working mockup UI and elegant access separation mechanism, before full development begins.

**Current Phase:** Vercel Connection Test - Verify GitHub → Vercel deployment pipeline works before building full POC.

**Next Phase:** POC Development - Create functional UI mockup with placeholders after successful Vercel connection test.

**Development Strategy:**
1. **PHASE 0 (NOW):** Vercel Connection Test - Deploy minimal Next.js app with test message
2. **PHASE 1:** Build initial POC with UI mockup (placeholders only, no real data)
3. **PHASE 2:** Implement functional interface interactions (expand/collapse, add/edit modals)
4. **PHASE 3:** Parent mode simulation (no real authentication yet, just UI toggle)
5. **PHASE 4:** Full implementation after POC approval (authentication, database, persistence)

---

## Core Objectives

### Phase 1 - Proof of Concept (Current Focus)

The most critical objectives at this stage are NOT feature completion, but early validation:

1. **Functional UI Mockup** - Visual interface that looks like the real app
2. **Interactive Elements** - Expand/collapse works, buttons clickable, modals open
3. **Parent Mode Simulation** - Toggle between view-only and parent mode (UI only, no real auth)
4. **Add/Edit Mockup** - Forms appear and can be filled, but data is just placeholders
5. **Deploy to Vercel** - Verify everything loads and works correctly
6. **Mobile Verification** - Confirm responsive design works on actual phones

### What POC Includes (Placeholders)

- **Hardcoded sample data** - Jonathan and Amir with fake transactions
- **Local state only** - No database, data resets on refresh
- **Simulated parent mode** - Simple toggle button (no password yet)
- **Mock add/edit forms** - Forms work but don't persist data permanently
- **Visual interactions** - Expand/collapse, open/close modals
- **Proper styling** - Colors, layout, responsive design all correct

### What Is NOT Required in POC

- Real authentication system
- Database integration
- Persistent data storage
- Session management
- Password protection
- Real balance calculations (just display placeholder numbers)
- Full CRUD operations

### Decision Point

**After POC deployment succeeds** → Stakeholder reviews live link → If approved → Then proceed to full implementation with real authentication, database, and data persistence.

---

## Technical Architecture Recommendation

### Recommended Technology Stack

| Component | Recommendation | Rationale |
|-----------|---------------|-----------|
| **Framework** | Next.js 14 (App Router) | Native Vercel optimization, built-in routing, server components, easy deployment |
| **Language** | TypeScript | Type safety reduces bugs in financial calculations |
| **Styling** | Tailwind CSS | Rapid prototyping, responsive design, minimal CSS overhead |
| **UI Components** | shadcn/ui | Modern, accessible, free, banking-style aesthetics, easily customizable |
| **State Management** | React Context (initial) | Sufficient for mockup phase, can upgrade later if needed |
| **Authentication** | Next-Auth.js v5 (NextAuth) with Credentials Provider | Simple password-based admin mode, session persistence, no external services required |
| **Data Storage (Phase 1)** | LocalStorage / SessionStorage | Quick mockup data, no backend needed initially |
| **Data Storage (Future)** | Vercel Postgres or Supabase | When ready for real database |

### Why This Stack?

**Fastest Path to Vercel:**
- Next.js is Vercel's native framework - zero configuration deployment
- Single command deployment: `vercel` or automatic via GitHub integration
- No build configuration needed

**Mobile-First Ready:**
- Next.js handles responsive design naturally
- Tailwind CSS provides mobile-first utilities out of the box
- shadcn/ui components are fully responsive

**Simple Access Separation:**
- Next.js middleware can handle route protection elegantly
- NextAuth handles session persistence automatically
- Single link with conditional rendering based on auth state

---

## Access Control Architecture

### Elegant Single-Link Solution

**Strategy:** Role-based view rendering with persistent session

#### Default Behavior (View-Only Mode)

- Any user accessing the link sees View-Only interface
- No authentication required
- Read-only UI components
- Action buttons hidden or disabled

#### Parent Admin Mode

**Entry Mechanism:**
1. Floating "Parent Mode" button visible in footer or header (subtle, non-intrusive)
2. Click opens authentication modal
3. Simple password entry (single shared family password)
4. No username, no email, no registration

**Authentication Flow:**

```
User visits link
    ↓
Default: View-Only Mode displayed
    ↓
User clicks "Parent Mode" button
    ↓
Modal appears requesting password
    ↓
Password validated (NextAuth Credentials Provider)
    ↓
Session created with "admin" role
    ↓
UI re-renders with edit capabilities
    ↓
Session persists for 7-30 days (configurable)
```

**Session Persistence Strategy:**

| Mechanism | Implementation | Duration |
|-----------|----------------|----------|
| HTTP-Only Cookie | NextAuth automatic | 30 days default |
| Secure Flag | HTTPS only | Automatic on Vercel |
| SameSite | Strict | CSRF protection |
| Auto-refresh | Session extends on activity | Rolling window |

**Security Considerations:**
- Password stored as hashed environment variable in Vercel
- No password recovery needed (family context - parents know password)
- Session invalidation available via "Exit Parent Mode" button
- No PII storage required

#### UI State Management

**View-Only Mode UI:**
- All action buttons (+ Add) hidden
- Transaction items non-clickable
- Balance display only
- Expand/collapse functionality available

**Admin Mode UI:**
- Action buttons visible and enabled
- Transaction items clickable for editing
- Modal forms for add/edit operations
- Visual indicator of admin mode (e.g., subtle badge in header)

---

## Application Structure

### Single-Screen Architecture

**Core Principle:** One main screen with dynamic layout, no navigation to separate pages initially.

### Screen Layout - Mobile-First

#### Header (Fixed Top)

| Element | Description | Admin Mode | View Mode |
|---------|-------------|------------|-----------|
| App Icon | Piggy bank / wallet icon (temporary placeholder OK) | Visible | Visible |
| App Name | "ארנק בוקי" (Buki Wallet) | Visible | Visible |
| Admin Badge | "Parent Mode" indicator | Visible when authenticated | Hidden |
| Menu Button | Hamburger (optional, future) | Visible | Hidden |

#### Main Content Area (Split View)

**Default State: Half-Half Layout**

```
┌─────────────────────────┐
│       Header            │
├─────────────────────────┤
│  Jonathan Section       │
│  - Name header (Navy)   │
│  - Balance display      │
│  - + Button (admin only)│
│  - Expand button        │
│  - 3-5 recent rows      │
├─────────────────────────┤
│  Amir Section           │
│  - Name header (Orange) │
│  - Balance display      │
│  - + Button (admin only)│
│  - Expand button        │
│  - 3-5 recent rows      │
└─────────────────────────┘
```

**Expanded State: Full Screen**

When user clicks expand button on any child's section:
- Selected child section expands to ~90% of viewport
- Other child section collapses to single header row (name + collapse button)
- "Return to split view" button appears
- Shows full transaction history (scrollable)

**Interaction Flow:**

```
Half-Half View
    ↓ (Click Expand on Jonathan)
Jonathan Full Screen View
    ↓ (Click Return or Click Amir header)
Half-Half View
    ↓ (Click Expand on Amir)
Amir Full Screen View
```

### Visual Design System

#### Color Palette

| Element | Color | Usage |
|---------|-------|-------|
| Jonathan Primary | Navy Blue (#1E3A8A) | Header background, borders |
| Jonathan Light | Navy 5% opacity | Alternating row background |
| Amir Primary | Orange (#EA580C) | Header background, borders |
| Amir Light | Orange 5% opacity | Alternating row background |
| Income | Green (#16A34A) | Positive amounts, income transactions |
| Expense | Red (#DC2626) | Negative amounts, expense transactions |
| Neutral Background | White (#FFFFFF) | Alternating row background |
| Text Primary | Slate 900 (#0F172A) | Main text |
| Text Secondary | Slate 500 (#64748B) | Descriptions, timestamps |

#### Transaction Row Design

**Alternating Pattern:**
- Row 1: White background
- Row 2: Child's color at 5% opacity
- Row 3: White background
- Row 4: Child's color at 5% opacity
- (continues alternating)

**Row Structure:**

| Column | Content | Style |
|--------|---------|-------|
| Icon | Income (↑) or Expense (↓) | Green or Red circular badge |
| Description | Transaction text | Primary text, 14px |
| Date/Time | Timestamp | Secondary text, 12px, below description |
| Amount | ±₪XX.XX | Green (income) or Red (expense), bold, 16px |

#### Typography Hierarchy

| Element | Font Size | Weight | Color |
|---------|-----------|--------|-------|
| App Name | 20px | Bold | Slate 900 |
| Child Name Header | 18px | Semibold | White (on colored bg) |
| Balance Amount | 28px | Bold | Green/Red based on value |
| Transaction Amount | 16px | Semibold | Green/Red based on type |
| Description | 14px | Regular | Slate 900 |
| Timestamp | 12px | Regular | Slate 500 |
| Button Text | 14px | Medium | Context-dependent |

---

## User Interactions

### Admin Mode Interactions

#### Adding a Transaction

**Trigger:** Click + button in child's section (admin mode only)

**Flow:**
1. Modal opens centered on screen
2. Child is pre-selected (based on which + was clicked)
3. Form fields appear

**Form Structure:**

| Field | Type | Validation | Default |
|-------|------|------------|---------|
| Child | Disabled text (pre-filled) | N/A | Auto-selected |
| Type | Radio buttons: Income / Expense | Required | Income |
| Amount | Number input (₪) | Required, positive number, max 2 decimals | Empty |
| Description | Text input | Required, max 100 characters | Empty |
| Date/Time | Disabled text (auto) | N/A | Current timestamp |

**Modal Actions:**
- **Save:** Validates form, adds transaction, updates balance, closes modal
- **Cancel:** Closes modal without saving

#### Editing a Transaction

**Trigger:** Click on transaction row (admin mode only)

**Flow:**
1. Modal opens with pre-filled data
2. User can modify amount and description
3. Date/time remains locked (display only)
4. Type (Income/Expense) can be changed

**Modal Actions:**
- **Save:** Updates transaction, recalculates balance, closes modal
- **Delete:** Confirms deletion, removes transaction, updates balance, closes modal
- **Cancel:** Closes modal without changes

#### View-Only Mode Interactions

**Allowed:**
- View all transaction history
- Expand/collapse child sections
- Scroll through transactions

**Disabled/Hidden:**
- + buttons (hidden completely)
- Edit functionality on transaction click (rows non-interactive)
- Delete options

---

## Data Model (Placeholder for Phase 1)

### Child Entity

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| id | string | Unique identifier | "jonathan" / "amir" |
| name | string | Display name | "Jonathan" / "Amir" |
| color | string | Theme color (hex) | "#1E3A8A" / "#EA580C" |
| balance | number | Current balance in ₪ | 150.50 |

### Transaction Entity

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| id | string | Unique identifier | "tx_001" |
| childId | string | Associated child | "jonathan" |
| type | enum | "income" or "expense" | "income" |
| amount | number | Transaction amount (₪) | 50.00 |
| description | string | User-provided text | "Weekly allowance" |
| timestamp | ISO string | Auto-generated | "2024-01-15T14:30:00Z" |

### Placeholder Data Structure (Phase 1)

For initial mockup, hardcode sample data in component:

**Jonathan Sample Data:**
- Balance: ₪150.00
- Transactions:
  - Income: ₪50.00, "Weekly allowance", Today 14:30
  - Expense: -₪20.00, "Candy store", Yesterday 16:45
  - Income: ₪100.00, "Birthday gift", 3 days ago
  - Expense: -₪15.00, "Ice cream", 4 days ago

**Amir Sample Data:**
- Balance: ₪85.50
- Transactions:
  - Expense: -₪10.00, "Toys", Today 11:20
  - Income: ₪75.00, "Chores completed", 2 days ago
  - Income: ₪25.00, "Gift from grandma", 5 days ago
  - Expense: -₪4.50, "Stickers", 6 days ago

---

## Phase 0: Vercel Connection Test (CURRENT)

### Objective

Verify that the complete deployment pipeline works **before** investing time in building the full POC:
- GitHub repository → Vercel connection
- Successful build
- Live URL accessible
- Confirm infrastructure is working

### What to Deploy

Minimal Next.js application with a single test page displaying:

**"THIS IS A VERCEL TEST FOR THE FAMILY BUKI WALLET"**

### Success Criteria

- ✅ Next.js project initializes successfully
- ✅ Code pushes to GitHub without errors
- ✅ Vercel detects and builds the project
- ✅ Live URL is generated
- ✅ Test message displays correctly in browser
- ✅ Page loads on mobile device

### Timeline

**Estimated: 10-15 minutes**

### Steps

1. Initialize Next.js 14 project with App Router
2. Create simple homepage with test message
3. Push to GitHub repository
4. Connect repository to Vercel
5. Trigger deployment
6. Verify live link works

### Complete File Structure for Phase 0

Here are ALL the files needed for the Vercel connection test. These files will be created in your project root:

#### File 1: `package.json`

Location: Root directory

Content:
```json
{
  "name": "buki-wallet",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "next": "14.2.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "eslint": "^8",
    "eslint-config-next": "14.2.0"
  }
}
```

#### File 2: `tsconfig.json`

Location: Root directory

Content:
```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### File 3: `next.config.mjs`

Location: Root directory

Content:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
```

#### File 4: `tailwind.config.ts`

Location: Root directory

Content:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
```

#### File 5: `postcss.config.mjs`

Location: Root directory

Content:
```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
```

#### File 6: `.eslintrc.json`

Location: Root directory

Content:
```json
{
  "extends": "next/core-web-vitals"
}
```

#### File 7: `.gitignore`

Location: Root directory

Content:
```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

#### File 8: `app/layout.tsx`

Location: `app/layout.tsx`

Content:
```typescript
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Buki Wallet - Vercel Test",
  description: "Family wallet application - Testing Vercel deployment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

#### File 9: `app/page.tsx`

Location: `app/page.tsx`

Content:
```typescript
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-orange-50">
      <div className="text-center p-8 max-w-2xl">
        <h1 className="text-6xl font-bold mb-6 text-blue-900">
          THIS IS A VERCEL TEST
        </h1>
        <h2 className="text-4xl font-semibold text-orange-600 mb-8">
          BUKI WALLET
        </h2>
        <div className="space-y-4">
          <p className="text-2xl text-gray-700">
            ✅ GitHub → Vercel Connection Successful!
          </p>
          <p className="text-lg text-gray-600">
            Phase 0: Infrastructure test complete
          </p>
          <p className="text-sm text-gray-500 mt-8">
            Ready to proceed with POC development
          </p>
        </div>
      </div>
    </main>
  );
}
```

#### File 10: `app/globals.css`

Location: `app/globals.css`

Content:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### File 11: `README.md`

Location: Root directory

Content:
```markdown
# Buki Wallet - Family Digital Wallet

## Phase 0: Vercel Connection Test

This is the initial deployment test to verify GitHub → Vercel pipeline.

### Status
- ✅ Next.js 14 initialized
- ✅ TypeScript configured
- ✅ Tailwind CSS ready
- 🔄 Vercel deployment pending

### Live URL
(Will be updated after first deployment)

### Next Steps
After successful deployment:
1. Proceed to Phase 1: POC UI Development
2. Build full mockup interface
3. Add interactive components
```

### After Success

Once Vercel connection is confirmed working:
→ Proceed to **Phase 1: Full POC Development** with confidence that deployment infrastructure is solid

---

## POC Requirements - Phase 1 (UI Mockup with Functional Interface)

### Must Have (POC Essentials)

1. **Basic UI for main screen**
   - Two child sections (half-half layout)
   - Proper colors (navy/orange)
   - Placeholder transaction lists (3-5 hardcoded items per child)
   - Placeholder balance displays (static numbers)

2. **Expand/Collapse Functionality** ✅ MUST WORK
   - Click expand button → child section goes full screen
   - Other section collapses to single header row
   - Click return → back to half-half layout
   - Smooth animation/transition

3. **Parent Mode Toggle** ✅ MUST WORK (Simulated)
   - Button to switch between "View Only" and "Parent Mode"
   - Can be simple toggle button (no password required in POC)
   - UI changes when toggled:
     - View Mode: No + buttons, transactions not clickable
     - Parent Mode: + buttons visible, transactions clickable

4. **Add Transaction Form** ✅ MUST WORK (Mockup)
   - Click + button → modal opens
   - Form fields appear:
     - Child name (pre-selected, disabled)
     - Type: Income / Expense (radio buttons)
     - Amount input field
     - Description input field
     - Date/time (auto-filled, disabled)
   - Save button → modal closes (data NOT saved, just closes)
   - Cancel button → modal closes

5. **Edit Transaction Form** ✅ MUST WORK (Mockup)
   - Click on transaction row (in parent mode) → edit modal opens
   - Form pre-filled with transaction data
   - Can change amount, description
   - Save button → modal closes (changes NOT saved, just closes)
   - Cancel button → modal closes

6. **Vercel Deployment** ✅ MUST SUCCEED
   - GitHub repo connected to Vercel
   - Successful build and deployment
   - Live link accessible
   - Loads correctly on mobile and desktop browsers
   - No errors in browser console

### Important Notes for POC

**Data Behavior:**
- All data is hardcoded placeholders
- Adding/editing transactions doesn't actually save anything
- Page refresh resets to original placeholder data
- Balance is static number, doesn't recalculate
- This is intentional - we're testing UI/UX only

**Parent Mode Behavior:**
- Simple toggle (button or switch)
- No password entry in POC
- State can be local (loses on refresh, that's OK)
- Just demonstrates the UI difference between modes

**Success Criteria:**
- ✅ App looks professional and complete
- ✅ All interactions feel smooth and responsive
- ✅ Mobile layout works perfectly
- ✅ Stakeholder can "play" with the interface
- ✅ Demonstrates full user experience flow
- ✅ Vercel deployment successful

### Won't Have (POC Phase)

- Real authentication (NextAuth not needed yet)
- Database or any backend
- Persistent data storage
- Real balance calculations
- Session cookies
- Environment variables
- API routes
- Data validation
- Error handling

### After POC Approval → Phase 2

Once stakeholder confirms POC works and looks good:
- Implement real NextAuth authentication
- Add database (Vercel Postgres or Supabase)
- Make add/edit actually save data
- Implement real balance calculations
- Add session persistence
- Full CRUD operations

---

## Deployment Strategy

### Vercel Deployment Workflow

#### Step 1: Repository Setup (Already Done)
- GitHub repo: https://github.com/UvixStudio/Buki_Wallet.git
- Ensure repo is public or Vercel has access permissions

#### Step 2: Initialize Next.js Project

**Command sequence:**
```
npx create-next-app@latest buki-wallet
  - TypeScript: Yes
  - ESLint: Yes
  - Tailwind CSS: Yes
  - src/ directory: Yes
  - App Router: Yes
  - Import alias: Yes (@/*)
```

#### Step 3: Install Dependencies - POC Version

**Required packages:**
- shadcn/ui components (UI library)
- lucide-react (icons)
- date-fns (date formatting, optional)

**NOT needed for POC:**
- next-auth (will add in Phase 2)
- database packages (will add in Phase 2)

#### Step 4: Connect to Vercel

**Option A - Via Vercel Dashboard (Recommended for first time):**
1. Visit vercel.com
2. Import Git Repository
3. Select GitHub → UvixStudio/Buki_Wallet
4. Framework Preset: Next.js (auto-detected)
5. Root Directory: ./ (if Next.js is in root)
6. Environment Variables: Add PASSWORD_HASH if needed
7. Click Deploy

**Option B - Via Vercel CLI:**
```
npm i -g vercel
vercel login
vercel (from project root)
```

#### Step 5: Environment Variables - POC Version

**For POC:** No environment variables needed!

**Phase 2 will add:**

| Variable | Purpose | Example Value | Where to Set |
|----------|---------|---------------|--------------||
| NEXTAUTH_SECRET | Session encryption | (auto-generated) | Vercel Dashboard |
| NEXTAUTH_URL | App URL | https://buki-wallet.vercel.app | Vercel Dashboard |
| ADMIN_PASSWORD_HASH | Hashed parent password | (bcrypt hash) | Vercel Dashboard |

#### Step 6: Verify Deployment - POC Version

**Checklist:**
- [ ] Build completes without errors
- [ ] Live URL is accessible
- [ ] Mobile responsive design works
- [ ] Desktop view renders correctly
- [ ] Placeholder data displays for both children
- [ ] Parent mode toggle button works
- [ ] Add/Edit modals open and close
- [ ] Expand/collapse functionality works
- [ ] No errors in browser console

### Continuous Deployment

- Every push to `main` branch triggers automatic deployment
- Preview deployments for other branches
- Rollback capability via Vercel dashboard

---

## Recommended UI Component Library

### Primary Recommendation: shadcn/ui

**Why shadcn/ui?**

| Criteria | shadcn/ui Advantage |
|----------|-------------------|
| Cost | Completely free, MIT license |
| Style | Modern, clean, banking-app aesthetic |
| Customization | Copy code into project, full control |
| Accessibility | WCAG compliant, keyboard navigation |
| Integration | Built for Next.js + Tailwind CSS |
| Components Needed | Button, Dialog (Modal), Card, Badge, Input |
| Mobile Support | Fully responsive |
| Maintenance | Active community, regular updates |

**Specific Components for Buki Wallet:**

| Feature | shadcn/ui Component | Usage |
|---------|-------------------|-------|
| Transaction Modal | Dialog | Add/Edit forms |
| Child Sections | Card | Jonathan/Amir containers |
| Add Button | Button (with icon) | Floating action button |
| Admin Badge | Badge | "Parent Mode" indicator |
| Form Inputs | Input, Label | Amount, description fields |
| Radio Buttons | RadioGroup | Income/Expense selection |
| Toast Notifications | Toast (optional) | Success/error messages |

**Installation:**
```
npx shadcn-ui@latest init
npx shadcn-ui@latest add button dialog card badge input label
```

### Alternative Options (If shadcn/ui doesn't fit)

| Library | Pros | Cons |
|---------|------|------|
| **Material-UI (MUI)** | Comprehensive, well-documented | Heavier bundle, less banking-style |
| **Ant Design** | Enterprise-grade | Too corporate for family app |
| **Chakra UI** | Easy theming | Different design philosophy |
| **Headless UI** | Unstyled flexibility | More work to style |

**Verdict:** shadcn/ui is optimal for this project's needs.

---

## Risk Assessment and Potential Pitfalls

### High-Risk Areas - POC Version

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|-------------------|
| **Vercel Build Failure** | Blocks deployment | Low | Use create-next-app template, test build locally first |
| **Mobile Layout Breaking** | Poor UX on phones | Medium | Test on real devices early, use mobile-first Tailwind |
| **State Management Issues** | UI bugs, lost toggle state | Low | Keep state simple, use React useState |

### Medium-Risk Areas - POC Version

| Risk | Impact | Mitigation |
|------|--------|------------|
| Slow load times | User frustration | Optimize images, use Next.js Image component, monitor bundle size |
| Browser compatibility | Doesn't work on older devices | Test on Safari iOS, Chrome Android; use modern but stable features |
| Modal UX on small screens | Hard to use | Test modal on small devices, ensure proper scrolling |

### Low-Risk Areas

| Risk | Mitigation |
|------|------------|
| Git merge conflicts | Work in feature branches, commit frequently |
| Color contrast issues | Use WCAG contrast checker, test in light/dark environments |
| Icon not loading | Use reliable CDN or embed SVG directly |

---

## Recommended Step-by-Step Workflow - POC Version

### Phase 1: Project Initialization (Day 1)

**Goal:** Get basic Next.js app deployed to Vercel

1. **Initialize Next.js Project**
   - Run create-next-app with TypeScript and Tailwind
   - Commit initial scaffold to GitHub repo

2. **Connect Vercel**
   - Import repository in Vercel dashboard
   - Deploy initial template
   - Verify live link works

3. **Install UI Library**
   - Set up shadcn/ui
   - Add basic components (Button, Card, Dialog)
   - Test component rendering

**Checkpoint:** Live link displays Next.js welcome page

---

### Phase 2: Basic Layout (Day 2)

**Goal:** Half-half layout with placeholder data

4. **Create Main Screen Structure**
   - Header component with app name and icon
   - Two child section components (Jonathan, Amir)
   - Apply color theming (navy, orange)

5. **Add Placeholder Data**
   - Hardcode sample transactions in component state
   - Display balance and transaction list
   - Style alternating row colors

6. **Deploy and Test**
   - Push to GitHub
   - Verify auto-deployment
   - Test on mobile browser

**Checkpoint:** Split-view layout visible on live link, mobile responsive

---

### Phase 3: Expand/Collapse (Day 3)

**Goal:** Interactive layout switching

7. **Implement Expand Logic**
   - Add expand button to each section
   - Create state to track which section is expanded
   - Conditional rendering for full-screen mode

8. **Add Transitions**
   - Smooth animation for expand/collapse
   - Return button in expanded mode

9. **Deploy and Test**
   - Verify interaction works on mobile
   - Test transition smoothness

**Checkpoint:** Users can expand/collapse sections

---

### Phase 4: Authentication Setup (Day 4)

**Goal:** Basic admin mode toggle with session persistence

10. **Install NextAuth**
    - Configure NextAuth with Credentials provider
    - Set up session strategy (JWT)
    - Create API route for authentication

11. **Create Parent Mode UI**
    - "Parent Mode" button in footer/header
    - Password entry modal (Dialog component)
    - Admin state indicator

12. **Implement Session Persistence**
    - Configure cookie maxAge (30 days)
    - Add middleware to protect routes/features
    - Test session survives browser restart

13. **Environment Variables**
    - Add NEXTAUTH_SECRET to Vercel
    - Add ADMIN_PASSWORD_HASH to Vercel
    - Redeploy with environment variables

**Checkpoint:** Admin mode activates with password, persists between sessions

---

### Phase 5: Conditional UI (Day 5)

**Goal:** Show/hide edit features based on auth state

14. **View-Only vs Admin Mode**
    - Hide + buttons in view-only mode
    - Disable transaction clicks in view-only mode
    - Show admin badge when authenticated

15. **Add/Edit Modals (Non-Functional)**
    - Create modal UI for adding transactions
    - Create modal UI for editing transactions
    - Wire up open/close behavior (no data saving yet)

16. **Deploy and Test**
    - Verify view-only mode is default
    - Verify admin mode shows edit features
    - Test on mobile and desktop

**Checkpoint:** Complete UI mockup with authentication working, ready for review

---

### Phase 6: Polish and Review (Day 6)

**Goal:** Prepare for stakeholder review

17. **Visual Polish**
    - Verify color consistency
    - Check spacing and alignment
    - Test on multiple devices

18. **Performance Check**
    - Run Lighthouse audit
    - Optimize images if needed
    - Check bundle size

19. **Documentation**
    - Update README with deployment link
    - Document how to access admin mode
    - List known limitations of Phase 1

20. **Final Deployment**
    - Tag release as v0.1.0-mockup
    - Share live link for review

**Checkpoint:** Production-ready mockup deployed and accessible

---

## Success Criteria for Phase 1

### Technical Success

- [ ] Application builds without errors
- [ ] Deploys to Vercel successfully
- [ ] Live URL loads in under 3 seconds
- [ ] Mobile responsive (320px to 768px width)
- [ ] Desktop functional (768px+ width)
- [ ] No console errors in browser
- [ ] Lighthouse performance score > 80

### Functional Success

- [ ] Default view-only mode works
- [ ] Parent mode authentication works
- [ ] Session persists for at least 24 hours
- [ ] Expand/collapse works smoothly
- [ ] Colors match specification (navy/orange)
- [ ] Placeholder data displays correctly
- [ ] Modals open and close properly

### UX Success

- [ ] Interface is intuitive without instructions
- [ ] Buttons are clearly labeled
- [ ] Spacing is comfortable on mobile
- [ ] Text is readable without zooming
- [ ] Interactions feel responsive
- [ ] Visual hierarchy is clear

---

## Future Phases (Post-Review)

### Phase 2: Data Persistence (After Approval)

- Integrate database (Vercel Postgres or Supabase)
- Implement actual add/edit/delete functionality
- Real-time balance calculations
- Transaction history persistence

### Phase 3: Enhanced Features

- Transaction categories
- Search and filter
- Export to CSV
- Monthly reports
- Notifications for low balance

### Phase 4: Multi-Family Support (Optional)

- Multiple family accounts
- Secure authentication per family
- Data isolation

---

## Architecture Review & Recommendations

### 1. Access Separation Solution

**Recommended Approach:** NextAuth Credentials Provider with Session Cookies

**Why this is elegant:**
- Single link serves both modes
- No separate URLs needed
- No external OAuth dependencies
- No paid services required
- Session persistence built-in
- Industry-standard security

**Implementation Simplicity:**
- Configure NextAuth in 1 file
- Add password check in credentials callback
- Set session cookie maxAge to 30 days
- Use `useSession()` hook to conditionally render UI

**User Experience:**
- Parents click "Parent Mode" once
- Enter simple password
- Stay logged in for weeks
- Children never see the button action

**Security Level:** Appropriate for family use (not banking-grade, but sufficient)

---

### 2. Early Vercel Deployment Validation

**Strategy:** Deploy empty shell first, add features incrementally

**Recommended Steps:**
1. Deploy Next.js template immediately (Day 1, Hour 1)
2. Verify live link before writing custom code
3. Add features in small increments with frequent deploys
4. Test on real mobile devices via live link early

**Why this works:**
- Identifies deployment issues before investing in development
- Builds confidence that infrastructure is sound
- Allows mobile testing on actual hardware immediately
- Provides live demo link for stakeholders early

**Monitoring:**
- Use Vercel Analytics (free tier)
- Watch build logs for errors
- Check deployment duration (should be under 2 minutes)

---

### 3. Recommended Tech Stack (Fastest Path)

**Optimal Stack for Speed:**

| Layer | Technology | Time to Productivity |
|-------|------------|---------------------|
| Framework | Next.js 14 App Router | Immediate (template ready) |
| Language | TypeScript | Day 1 (familiar syntax) |
| Styling | Tailwind CSS | Day 1 (utility-first, fast) |
| UI Components | shadcn/ui | Day 1 (copy-paste components) |
| Auth | NextAuth.js | Day 2 (one config file) |
| State | React Context | Day 1 (built-in) |
| Deployment | Vercel | Hour 1 (one-click) |

**Total Time to Working Mockup:** 5-6 days

**Why not alternatives:**

| Alternative | Why Not (for Phase 1) |
|-------------|---------------------|
| Vue/Nuxt | Less Vercel optimization, learning curve |
| Svelte/SvelteKit | Smaller ecosystem, fewer UI libraries |
| Plain React (CRA) | No SSR, slower deployment, deprecated |
| Angular | Too heavy for simple mockup |
| Backend framework (Express, etc.) | Unnecessary complexity for mockup phase |
| WordPress/No-code | Not suitable for custom financial app |

---

### 4. UI Kit Recommendation

**Winner: shadcn/ui**

**Modern, Clean, Banking-Style Characteristics:**
- Minimalist design language (Radix UI foundation)
- Subtle shadows and borders (not flat, not skeuomorphic)
- Clear typography hierarchy
- Excellent form components (critical for financial input)
- Professional color system integration

**Cost:** Free (MIT License)

**Recognition:** Used by Vercel, Supabase, Cal.com, and many fintech apps

**Component Availability:**

| Needed Component | shadcn/ui Component | Ready to Use |
|------------------|-------------------|--------------|
| Transaction modal | Dialog | ✓ |
| Add/Edit forms | Form + Input + Label | ✓ |
| Child sections | Card | ✓ |
| Action buttons | Button | ✓ |
| Admin indicator | Badge | ✓ |
| Amount display | Custom with Typography | ✓ |
| Success/Error messages | Toast | ✓ |

**Customization Example:**
- Default theme is neutral
- Override colors with Tailwind classes
- Navy and Orange can be added to Tailwind config
- Component styles remain consistent while matching brand

**Accessibility:**
- ARIA labels built-in
- Keyboard navigation works
- Screen reader compatible
- High contrast ratios

---

### 5. Risks and Pitfalls

#### Critical Risks (Must Address Immediately)

**Risk 1: Session Cookie Not Persisting on Mobile Safari**

| Issue | Mobile Safari has strict cookie policies |
|-------|------------------------------------------|
| **Symptom** | Parents logged out after closing browser |
| **Cause** | Intelligent Tracking Prevention (ITP) blocks some cookies |
| **Solution** | Ensure SameSite=Lax (not Strict), test on real iPhone |
| **Test** | Login on iPhone Safari, close browser, reopen next day |

**Risk 2: Vercel Build Timeout with Large Dependencies**

| Issue | Build exceeds Vercel free tier limits |
|-------|----------------------------------------|
| **Symptom** | Deployment fails during build |
| **Cause** | Too many heavy npm packages |
| **Solution** | Keep dependencies minimal in Phase 1, use dynamic imports |
| **Prevention** | Monitor bundle size, avoid large icon libraries |

**Risk 3: Balance Calculation Errors Due to Floating Point**

| Issue | JavaScript floating point arithmetic inaccuracies |
|-------|---------------------------------------------------|
| **Symptom** | ₪10.10 - ₪0.01 = ₪10.089999999 |
| **Cause** | Binary floating point representation |
| **Solution** | Store amounts as integers (cents/agorot), divide by 100 for display |
| **Formula** | `balance = transactions.reduce((sum, t) => sum + t.amount, 0)` where amount is in agorot |

#### Medium Risks (Monitor and Mitigate)

**Risk 4: Modal Unusable on Small Screens**

- **Mitigation:** Use shadcn Dialog with proper responsive sizing, test on 320px width
- **Fallback:** Consider full-screen modal on mobile if needed

**Risk 5: Slow Initial Load Time**

- **Mitigation:** Use Next.js Image optimization, minimize JavaScript bundle, enable caching
- **Target:** First Contentful Paint under 1.5 seconds

**Risk 6: Password Stored Insecurely**

- **Mitigation:** Never commit password to git, use environment variables, hash with bcrypt
- **Verification:** Audit environment variable security in Vercel dashboard

#### Low Risks (Awareness Sufficient)

- Color contrast insufficient: Use WebAIM contrast checker
- Git conflicts: Use feature branches
- Icons not loading: Embed SVGs or use reliable CDN

---

### 6. Step-by-Step Recommended Workflow

**Optimized for Speed and Confidence**

#### Sprint 1: Infrastructure (Day 1, ~4 hours)

**Objective:** Live link on Vercel with template

1. **Initialize Project** (30 min)
   - `npx create-next-app@latest` with TypeScript, Tailwind, App Router
   - Initialize git, commit
   - Push to GitHub repo

2. **Deploy to Vercel** (15 min)
   - Connect GitHub repo in Vercel dashboard
   - Deploy default template
   - Verify live link loads

3. **Set Up Tooling** (45 min)
   - Install shadcn/ui: `npx shadcn-ui@latest init`
   - Add components: `npx shadcn-ui@latest add button card dialog input label badge`
   - Install date-fns: `npm install date-fns`
   - Test dev server: `npm run dev`

4. **First Custom Deploy** (30 min)
   - Modify homepage to show "Buki Wallet" heading
   - Add temporary piggy bank emoji icon
   - Commit, push, verify auto-deploy works

**Checkpoint:** Live URL shows custom heading

---

#### Sprint 2: Layout Skeleton (Day 2, ~6 hours)

**Objective:** Half-half layout with placeholder data visible on mobile

5. **Create Component Structure** (2 hours)
   - `components/Header.tsx` - App header with icon and name
   - `components/ChildSection.tsx` - Reusable child wallet section
   - `app/page.tsx` - Main page with two ChildSection instances
   - Apply Tailwind layout: flex column on mobile

6. **Add Placeholder Data** (1 hour)
   - Create `lib/mockData.ts` with sample transactions
   - Define TypeScript interfaces (Child, Transaction)
   - Pass data to ChildSection components as props

7. **Style Child Sections** (2 hours)
   - Jonathan section: Navy blue theme
   - Amir section: Orange theme
   - Transaction rows: Alternating white / color 5% opacity
   - Balance display: Large, bold, green/red based on value
   - Income/Expense icons: ↑ green / ↓ red

8. **Mobile Testing** (1 hour)
   - Deploy to Vercel
   - Open on real phone
   - Verify layout doesn't break
   - Check font sizes are readable
   - Adjust spacing if needed

**Checkpoint:** Split view works on mobile, colors correct

---

#### Sprint 3: Expand/Collapse (Day 3, ~5 hours)

**Objective:** Interactive layout switching

9. **Implement State Management** (1 hour)
   - Add useState for expanded child ID (null | "jonathan" | "amir")
   - Create expand/collapse handler functions

10. **Conditional Rendering** (2 hours)
    - If expanded === null: show both sections 50/50
    - If expanded === "jonathan": Jonathan full screen, Amir minimized
    - If expanded === "amir": Amir full screen, Jonathan minimized
    - Add expand button to each section header
    - Add return button when expanded

11. **Styling and Transitions** (1 hour)
    - Use Tailwind transition classes
    - Smooth height animations
    - Ensure scrolling works in expanded mode

12. **Testing** (1 hour)
    - Test expand → collapse flow
    - Verify both children can expand
    - Check mobile usability
    - Deploy and test on live link

**Checkpoint:** Expand/collapse interactive and smooth

---

#### Sprint 4: Parent Mode Toggle (Day 4, ~3 hours) - POC VERSION

**Objective:** Simple parent mode toggle (NO real authentication in POC)

13. **Create Parent Mode Toggle** (1 hour)
    - Add toggle switch or button in header/footer
    - Use React useState to track mode: "view" | "parent"
    - Button labeled "Parent Mode" or "View Mode" depending on state
    - Simple onClick handler to toggle state

14. **Build Parent Mode Indicator** (1 hour)
    - When in parent mode, show badge or indicator in header
    - Visual feedback that mode changed
    - Use different color or icon to distinguish modes

15. **Test Mode Switching** (1 hour)
    - Click toggle → UI changes appropriately
    - + buttons appear/disappear
    - Transaction rows become clickable/non-clickable
    - Verify on mobile and desktop
    - Deploy to Vercel and test

**Checkpoint:** Parent mode toggle works, UI responds correctly

**Note:** Real authentication (NextAuth, password, session persistence) will be added in Phase 2 after POC approval

---

#### Sprint 5: Add/Edit Modals (Day 5, ~5 hours) - POC VERSION

**Objective:** Working forms that open/close (no data saving)

18. **Create Add Transaction Modal** (2 hours)
    - Use shadcn Dialog component
    - Triggered by + button click (only visible in parent mode)
    - Form fields:
      - Child name (pre-filled, disabled)
      - Type selector: Income / Expense (radio buttons or toggle)
      - Amount input (number field with ₪ symbol)
      - Description input (text field)
      - Date/time display (current time, disabled)
    - Save button → just closes modal (no data saved)
    - Cancel button → closes modal

19. **Create Edit Transaction Modal** (2 hours)
    - Triggered by clicking transaction row (only in parent mode)
    - Same form as Add, but pre-filled with transaction data
    - Save button → just closes modal (changes not saved)
    - Cancel button → closes modal
    - Optional: Add Delete button (shows confirmation, then closes)

20. **Test All Modals** (1 hour)
    - Open/close add modal from each child section
    - Open/close edit modal from different transactions
    - Verify form fields display correctly
    - Test on mobile (modal should be responsive)
    - Deploy and verify on Vercel

**Checkpoint:** All modals work, forms look professional, ready for POC review

**Note:** Actual data saving/editing will be implemented in Phase 2 after POC approval

---

#### Sprint 6: Polish and Review (Day 6, ~4 hours)

**Objective:** Production-ready mockup

21. **Visual QA** (1 hour)
    - Check all colors match spec
    - Verify spacing consistency
    - Test on multiple devices
    - Fix any alignment issues

22. **Performance Audit** (1 hour)
    - Run Lighthouse in Chrome DevTools
    - Optimize images if score low
    - Check mobile performance score
    - Aim for 80+ on all metrics

23. **Documentation** (1 hour)
    - Update README.md:
      - Live link URL
      - Admin mode credentials (test password)
      - Known limitations
      - Next steps
    - Add comments to complex code

24. **Final Deployment** (1 hour)
    - Create git tag: `v0.1.0-mockup`
    - Push tag to GitHub
    - Verify Vercel deployment
    - Test one more time on mobile
    - Prepare review presentation

**Checkpoint:** Mockup complete, ready for stakeholder review and approval

---

## Total Estimated Timeline - POC Version

| Sprint | Duration | Cumulative |
|--------|----------|------------|
| 1. Infrastructure | 4 hours | Day 1 |
| 2. Layout Skeleton | 6 hours | Day 2 |
| 3. Expand/Collapse | 5 hours | Day 3 |
| 4. Parent Mode Toggle (simple) | 3 hours | Day 4 |
| 5. Add/Edit Modals (mockup) | 5 hours | Day 4-5 |
| 6. Polish and Review | 4 hours | Day 5 |
| **Total** | **27 hours** | **~4-5 work days** |

**POC is faster because:**
- No real authentication setup
- No database configuration
- No environment variables
- No session management
- Just UI and interactions

**Buffer:** Add 20% for unexpected issues = ~32 hours total = 5 work days maximum

---

## Post-Review Next Steps

After stakeholder approval of Phase 1 mockup:

1. **Decision Point:** Approve transition to Phase 2 (data persistence)
2. **Database Selection:** Choose between Vercel Postgres, Supabase, or other
3. **API Design:** Plan CRUD endpoints for transactions
4. **Migration Strategy:** Move from placeholder data to real data
5. **Testing Strategy:** Add unit tests for balance calculations
6. **Feature Prioritization:** Decide which Phase 3 features to build next

---

## Conclusion and Recommendation

### Professional Assessment

This project is **feasible and well-scoped** for a Phase 1 mockup with Vercel deployment.

**Confidence Level: High**

**Confidence Basis:**
- Requirements are clear and specific
- Chosen tech stack (Next.js + Vercel) is proven and stable
- Mockup scope is realistic (no database complexity yet)
- Access control solution is straightforward (NextAuth Credentials)
- UI design is simple and achievable with shadcn/ui
- Timeline is reasonable (6 days for experienced developer)

### Key Success Factors

1. **Deploy Early:** Get Vercel link on Day 1
2. **Test on Real Devices:** Use live link on actual phones throughout
3. **Keep It Simple:** Resist adding features beyond mockup scope
4. **Focus on UX:** Family app must be intuitive, not feature-rich
5. **Document Decisions:** Track why choices were made for future reference

### Recommended Immediate Action

**Phase 1 Priority:** Prove the deployment and access control mechanisms work

**First 3 Steps:**
1. Initialize Next.js project and push to GitHub (30 min)
2. Connect to Vercel and deploy template (15 min)
3. Verify live link on mobile phone (5 min)

If these succeed, confidence in full mockup completion is very high.

### Final Architecture Recommendation

**Stack:** Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui + NextAuth

**Deployment:** Vercel (GitHub integration, auto-deploy on push)

**Access Control:** NextAuth Credentials Provider with 30-day session cookies

**UI Library:** shadcn/ui (free, modern, banking-style)

**Timeline:** 6 working days to production-ready mockup

**Risk Level:** Low (if workflow followed sequentially)

This design provides a solid foundation for the Buki Wallet family app with clear path from mockup to full implementation.
This design provides a solid foundation for the Buki Wallet family app with clear path from mockup to full implementation.