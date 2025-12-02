# Git Workflow - Admin Orders Panel Development

## 🎯 Strategie: GitHub Flow (Trunk-Based Development)

```
main (production-ready)
  ↑
  └─ feature/orders-api (backend guy)
  └─ feature/orders-ui (you + frontend guy)
  └─ feature/orders-schema (shared - FIRST!)
```

---

## 📋 Phase Breakdown

### Phase 0: Setup (10 minut) - **BOTH PARALLEL**
**Branch:** `feature/orders-schema`

```bash
# 1. Backend guy pulls main
git pull origin main
git checkout -b feature/orders-schema

# 2. Backend guy:
# - Updates prisma/schema.prisma (Order model extensions)
# - Runs: npx prisma migrate dev --name add_order_fields
# - Pushes to feature/orders-schema

# 3. Frontend (you):
# - Pulls same branch: git pull origin feature/orders-schema
# - Verifies schema works locally
# - Reviews in PR

# 4. MERGE TO MAIN when both approve ✅
```

**What gets updated in schema:**
```prisma
model Order {
  // Existing fields
  id, email, firstName, etc.

  // NEW for state machine
  channel        String @default("web")        // web, pos, ig_dm
  orderStatus    String @default("draft")       // draft, pending, paid, processing, shipped, completed
  paymentStatus  String @default("unpaid")      // unpaid, paid, refunded
  deliveryStatus String @default("pending")     // pending, shipped, delivered

  // NEW for organization
  tags           String?                        // JSON: ["expedovat-dnes", "VIP", "splátky"]
  riskScore      Int    @default(0)            // 0-100 fraud score

  // NEW for notes
  notesInternal  String?
  notesCustomer  String?

  // NEW for assignment
  assignedToUserId String?
  salonId        String?  // B2B partner

  // NEW audit
  updatedAt      DateTime @updatedAt
  lastStatusChangeAt DateTime?
}
```

---

### Phase 1: Backend API (Paralelní práce)
**Branch:** `feature/orders-api` (backend guy exclusive)

Backend guy vytvoří:
```
/app/api/admin/orders/
  ├── route.ts (GET list, POST create)
  ├── filters.ts (FilterBuilder class)
  └── [id]/
      ├── route.ts (GET detail, PUT update, DELETE)
      └── actions/
          ├── capture-payment.ts
          ├── update-status.ts
          └── create-shipment.ts
```

**API Spec (pro reference):**
```bash
# List with filters
GET /api/admin/orders?status=paid&paymentStatus=unpaid&limit=50

# Detail
GET /api/admin/orders/[id]

# Update status
PUT /api/admin/orders/[id]
{ "orderStatus": "paid", "paymentStatus": "paid" }

# Bulk actions
POST /api/admin/orders/bulk
{ "ids": [...], "action": "mark-shipped", "data": {...} }
```

---

### Phase 2: Frontend UI (Vám dva dohromady)
**Branch:** `feature/orders-ui` (you + frontend guy)

```
/app/admin/objednavky/
  ├── page.tsx (LIST - s filtry, sortováním)
  ├── [id]/
  │   ├── page.tsx (DETAIL - s taby)
  │   ├── components/
  │   │   ├── OrderHeader.tsx
  │   │   ├── CustomerSection.tsx
  │   │   ├── ItemsSection.tsx
  │   │   ├── PaymentSection.tsx
  │   │   ├── FulfillmentSection.tsx
  │   │   └── NotesSection.tsx
  │   └── edit/
  │       └── page.tsx (EDIT)
  └── components/
      ├── OrderTable.tsx (list table)
      ├── Filters.tsx (advanced filters)
      ├── BulkActions.tsx
      └── StatusBadge.tsx
```

---

## 🔧 Git Commands by Role

### Backend Guy (Kamarád)
```bash
# 1. Start
git pull origin main
git checkout -b feature/orders-api
# ... code backend APIs ...
git add .
git commit -m "feat(api): add orders list, detail, status endpoints"
git push origin feature/orders-api

# 2. Create PR
# Go to GitHub → Compare & pull request → Set reviewers (you)
# Title: "feat: Orders admin API with filtering and bulk actions"

# 3. Once approved & merged to main, pull latest
git checkout main
git pull origin main
```

### Frontend (You + Colleague)
```bash
# 1. Start (AFTER Phase 0 schema is merged)
git pull origin main
git checkout -b feature/orders-ui

# 2. Code together - small, frequent commits
git add .
git commit -m "feat(orders-list): add filters and table layout"
git push origin feature/orders-ui

# 3. Pull each other's changes
git pull origin feature/orders-ui

# 4. Create PR when ready
```

---

## ⚠️ Konflikt Prevention Rules

### 🚫 NEMĚNIT ZÁROVEŇ (aby se konfliktovalo):
- `app/api/admin/orders/**` (Backend guy exclusive!)
- `prisma/schema.prisma` (Merge Phase 0 first!)

### ✅ MŮŽETE MĚNIT ZÁROVEŇ:
- `app/admin/objednavky/**` (Frontend)
- `lib/` utilities (each in own folder)
- Tailwind CSS, styles

### 🎯 Pravidlo: Small, frequent commits
```bash
# DOBRÝ COMMIT - měnit jednu vec
git commit -m "feat(orders-table): add status column"

# ŠPATNÝ COMMIT - míchat frontend+backend
git commit -m "feat: add orders everything"
```

---

## 📝 PR Process

### Backend Guy
```
PR Title: feat(api): Orders management with list, detail, filters

Description:
- ✅ List endpoint with filtering
- ✅ Detail endpoint
- ✅ Update status endpoint
- ✅ Bulk actions endpoint

Testing:
- curl http://localhost:3007/api/admin/orders
- Filters work (status, paymentStatus, etc.)
```

### Frontend (You)
```
PR Title: feat(ui): Orders admin interface with list and detail

Description:
- ✅ Orders list with table
- ✅ Advanced filters
- ✅ Order detail with tabs
- ✅ Status management

Testing:
- List page loads & filters work
- Detail page shows all sections
- Can update order status
```

---

## 🔄 Merge Checklist

Before merging any branch to `main`:

```
☐ Code review passed (min 1 approve)
☐ Tests pass (if applicable)
☐ No console errors
☐ Naming conventions followed
☐ No hardcoded values
☐ TypeScript strict mode OK
☐ UI responsive on mobile
```

---

## 💾 Daily Sync (Doporučeno)

**Ráno:**
```bash
git pull origin main  # Get latest
git pull origin feature/orders-ui  # Get team's changes
npm install  # If dependencies changed
```

**Večer:**
```bash
git push origin feature/orders-ui  # Push your changes
# Message in chat: "Pushed orders-ui updates"
```

---

## 🆘 Pokud se stane konflikt

```bash
# 1. Pull latest
git pull origin feature/orders-ui

# 2. Open conflicted file - uvidíš:
# <<<<<<< HEAD
# tvůj kód
# =======
# jejich kód
# >>>>>>> feature/orders-ui

# 3. Manual merge - vybereš co chceš
# 4. Vymaž conflict markers
# 5. Save file

git add .
git commit -m "chore: resolve merge conflicts in orders-list"
git push origin feature/orders-ui
```

---

## ✨ Final Merge to Main

Kdy je everything ready:

```bash
# 1. Backend guy merges feature/orders-api to main (PR approved)
# 2. You merge feature/orders-ui to main (PR approved)
# 3. Pull fresh main
git checkout main
git pull origin main

# 4. Test together locally
npm run dev
# Zkuste: list → detail → status change → filters

# 5. All good? Production ready! 🚀
```

---

## 📌 Quick Reference

| Action | Command |
|--------|---------|
| Start branch | `git checkout -b feature/orders-api` |
| Check what changed | `git diff` |
| Save work | `git add . && git commit -m "..."` |
| Send to GitHub | `git push origin feature/orders-api` |
| Get latest changes | `git pull origin feature/orders-api` |
| See branches | `git branch -a` |
| Switch branch | `git checkout main` |
| Delete local branch | `git branch -d feature/orders-api` |

---

## 🎯 Next Steps

1. **Backend guy** creates `feature/orders-schema` PR with updated prisma schema
2. **You** review & approve
3. **Merge to main**
4. **Backend guy** creates `feature/orders-api` with endpoints
5. **You + colleague** create `feature/orders-ui` in parallel
6. **Both merge to main** when ready

**Ready?** 🚀
