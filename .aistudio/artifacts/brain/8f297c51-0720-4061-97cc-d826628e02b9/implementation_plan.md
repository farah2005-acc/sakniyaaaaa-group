# Sakniya Comprehensive Upgrade: Two-Way Reviews, Authentication, Justice-Scale Comparison & Identity Preservation

This plan specifies the complete end-to-end implementation for upgrading Sakniya into a production-grade rental ecosystem with mutual tenant/landlord accountability, standalone authentication, justice-scale comparison, and distinctive cartoon avatars while strictly preserving the original brand identity.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following design decisions were confirmed via interactive user clarification and govern the execution:
>
> 1. **Two-Way Review Eligibility**: Reviews are permitted exclusively after a completed stay or confirmed rental booking (`status: 'confirmed' | 'completed'`) to guarantee verified, genuine rental experiences and prevent spam or fake reviews.
> 2. **Authentication Flow**: The Login and Sign Up pages will use standard email and password input fields with client validation, credential persistence, and secure session management.
> 3. **Comparison Icon Placement**: The justice-scale icon (`Scale`) will be positioned as a top corner overlay button directly paired with the favorite heart button on every property card.
> 4. **Logo Modification Constraint**: The original house logo is preserved 100% with exact geometry, palette, and typography—the ONLY modification is the clean surgical removal of "EST. 2023".

---

## 1. Overview & Core Concept

- **What It Delivers**:
  - **Cleaned Brand Asset**: High-resolution Sakniya house emblem with "EST. 2023" cleanly removed, updated across favicons, app icons, and headers.
  - **Balanced Justice-Scale Icon**: Replaces the comparison checkmark with a balanced scale of justice icon on property cards and comparison trays.
  - **Two-Way Verified Review System**: Tenants evaluate landlords (communication, honesty, responsiveness, property maintenance), and Landlords evaluate tenants (payment reliability, communication, property care, respect for house rules).
  - **Cartoon Female Avatar Trio**: High-fidelity cartoon illustrations for Farah (App Owner), Yomna (Landlord), and Nora (Student Tenant), replacing real photos.
  - **Dedicated Authentication Pages**: Independent, responsive Login and Sign Up views with role selection, validation, and dashboard routing.
  - **Role-Based Tenant & Landlord Dashboards**: Enforced role authorization preventing cross-account access and managing property listings or booking reviews.

- **Target Audience**: Egyptian university students, roommates, and verified property owners seeking trustworthy, accountable rentals.

---

## 2. User Experience & Visual Design

### Key User Flows

```
[ Unauthenticated / Visitor ]
              │
              ├──► [ Login Page ] ──► Validate Credentials ──► Route to Role Dashboard
              │
              └──► [ Sign Up Page ] ──► Select Role & Cartoon Avatar ──► Route to Role Dashboard
                                                                             │
       ┌─────────────────────────────────────────────────────────────────────┴─────────────────────────────────────────────────────────────────────┐
       ▼                                                                                                                                           ▼
[ Tenant Experience ]                                                                                                                       [ Landlord Experience ]
• Browse listings with Justice-Scale (⚖️) & Heart (❤️)                                                                                      • Manage active listings & inquiries
• Side-by-side comparison modal via persistent dock                                                                                         • View tenant profiles & landlord ratings
• View landlord profile & tenant reviews                                                                                                    • Review tenants after confirmed stays
• Submit landlord review after confirmed stay                                                                                               • Profile settings with Yomna avatar
• Profile settings with Nora avatar
```

### Visual Identity & Theme
- **Color Discipline**:
  - Dominant Canvas: Warm Ivory (`#F8F4EC`) / Night Espresso (`#191614`).
  - Structural Surfaces: Paper Dune (`#E9DDCC`) / Deep Charcoal (`#24201D`).
  - Primary Accent: Terracotta Clay (`#C47D60` / `#D8896C`).
  - Trust & Rating Accents: Warm Amber Gold (`#F59E0B`) for 5-star ratings; Olive Bronze (`#697A58`) for verification shields.
- **Comparison Icon (`Scale`)**:
  - Inactive State: Translucent white/dark blur background with bronze outline.
  - Active State: Terracotta filled badge with active glow and tooltip counter, representing fairness, trust, and balanced comparison.
- **Avatars**:
  - Farah: Confident, friendly cartoon woman in smart-casual bohemian attire representing the app leadership.
  - Yomna: Professional, welcoming Egyptian cartoon landlady communicating warmth, property hosting, and responsibility.
  - Nora: Youthful, cheerful cartoon student with casual college attire and study bag representing university tenants.

---

## 3. Technical Architecture & System Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                             Sakniya Application State                                            │
│                                           (AppContext + localStorage)                                           │
└───────────────────────────────────────┬─────────────────────────────────────────────────┬───────────────────────┘
                                        │                                                 │
                  ┌─────────────────────▼────────────────────┐        ┌───────────────────▼─────────────────────┐
                  │          Auth & User State               │        │        Review & Rating Store            │
                  │  • currentUser (Farah / Yomna / Nora)    │        │  • reviews: UserReview[]                │
                  │  • userRole: 'tenant' | 'owner' | 'admin'│        │  • submitReview(reviewData)             │
                  │  • isAuthenticated: boolean              │        │  • getReviewsForUser(userId)            │
                  └─────────────────────┬────────────────────┘        └───────────────────┬─────────────────────┘
                                        │                                                 │
          ┌─────────────────────────────┼─────────────────────────────┐                   │
          ▼                             ▼                             ▼                   ▼
┌───────────────────┐         ┌───────────────────┐         ┌───────────────────┐  ┌──────────────────────────┐
│    LoginPage      │         │   SignUpPage      │         │ PropertyCard      │  │ ReviewsList & Modal      │
│ • Role Selector   │         │ • Avatar Picker   │         │ • Justice-Scale   │  │ • 5-star criteria        │
│ • Email / Password│         │ • Form Validation │         │ • Heart Favorite  │  │ • Verification check     │
│ • Logo without EST│         │ • Redirect Router │         │ • Commute badge   │  │ • Two-way mutual view    │
└───────────────────┘         └───────────────────┘         └───────────────────┘  └──────────────────────────┘
```

---

## 4. Implementation Steps & Sub-Tasks

### Step 1: Logo Correction & Asset Generation
- Generate the corrected high-resolution Sakniya house logo with "EST. 2023" cleanly removed.
- In parallel, generate the three cartoon female avatars (`avatar_farah_owner`, `avatar_yomna_landlord`, `avatar_nora_tenant`).
- Update `/index.html`, `SakniyaLogo.tsx`, and all brand icon references to use the cleaned logo.

### Step 2: Comparison Icon Restoration
- Replace the checkmark checkbox in `PropertyCard.tsx` with the balanced justice scale icon (`Scale` from `lucide-react`).
- Position it as a top corner overlay button directly paired with the favorite heart button.
- Ensure click events propagate to `toggleCompare(property.id)` and update the persistent bottom comparison bar seamlessly.

### Step 3: Two-Way Review Data Model & State
- Extend `src/types/index.ts` with `UserReview` interface:
  - Rating, multi-criteria breakdown (communication, honesty, cleanliness/property care, agreements).
  - Reviewer ID, reviewer cartoon avatar, reviewer role, target user ID, booking ID, date, and comments.
- Update `AppContext.tsx` with `reviews` state and `submitReview` action that verifies booking completion and blocks duplicates.
- Pre-seed initial verified reviews between Yomna (Landlord) and Nora (Tenant) for realism.

### Step 4: Review UI Components
- Build `ReviewModal.tsx` for submitting star ratings and category scores.
- Build `UserReviewsList.tsx` for displaying received reviews on tenant and landlord profiles with average rating calculation and category bars.

### Step 5: Dedicated Login & Sign Up Pages
- Build `src/components/auth/LoginPage.tsx`:
  - Clean layout with the corrected Sakniya house logo.
  - Role selector (Tenant / Landlord), email and password with show/hide toggle.
  - Form validation, error messages, and loading state.
  - Links to Sign Up.
- Build `src/components/auth/SignUpPage.tsx`:
  - Full name, email, phone, password, confirm password.
  - Role selector and cartoon avatar picker (pre-selecting Nora for tenants or Yomna for landlords).
  - Validation, duplicate email protection, and auto-login upon creation.

### Step 6: Role Dashboards & Navigation Integration
- Add Login/Sign Up buttons to `Header.tsx` and profile popover.
- Update `TenantDashboard.tsx` to display Nora's cartoon avatar, her rental activity, and an "Add Review" button on confirmed stays.
- Update `OwnerDashboard.tsx` to display Yomna's cartoon avatar, property listing management, and tenant reviews.
- Enforce role-based permission checks on dashboard rendering and listing wizard.

### Step 7: Compilation, Linting & Verification
- Run `lint_applet` and `compile_applet`.
- Verify responsive layout across mobile simulator and desktop views.
