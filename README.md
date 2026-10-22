# Sakniya | سكنية — Complete Housing, Roommate Matching & Rental Platform

**Your space. Your people. Your peace.**  
**مكانك، وناسك، وراحتك.**

Sakniya is a full-stack housing platform built for university students and employees in Egypt. It combines the cozy bohemian aesthetic with Airbnb-grade property discovery, a structured 8-dimension lifestyle roommate compatibility matching engine, verified Egyptian listings, an interactive campus commute planner, and **Misbah (مصباح)** — the friendly, warm table lamp AI assistant.

---

## 🎨 Visual Identity & Brand Concept

- **Concept**: Cozy Bohemian, warm, earthy, natural, welcoming, and premium.
- **Palette**:
  - Warm Ivory: `#F8F4EC`
  - Oat Beige: `#E9DDCC`
  - Sage Green: `#A9B59A`
  - Olive Green: `#697A58`
  - Terracotta: `#C47D60`
  - Warm Walnut Brown: `#765541`
  - Charcoal Text: `#34332F`
- **Typography**: Dual-language support with **Cairo** for Arabic (RTL) and **Plus Jakarta Sans** for English (LTR).

---

## 🪔 Misbah Character (مصباح)

Misbah is Sakniya's original interactive table lamp housing assistant:
- A soft, warm table lamp with a gentle amber glow.
- Tapping the floating lamp turns its amber light on or off with smooth glow effects.
- Answers questions about Egyptian campus commutes, rent, deposit rules, house rules, roommate compatibility, and platform fees.
- Powered by `@google/genai` with `gemini-3.8-flash` on the server (`/api/gemini/misbah`), with a graceful local fallback engine when API credentials or quotas are restricted.

---

## 🚀 Key Features

### 1. Airbnb-Style Property Discovery
- **Egypt-Wide Directory**: Priority areas in Alexandria (Smouha, Shatby, Azarita, Sporting, Borg El Arab), Cairo (Maadi, Dokki, Mohandessin, New Cairo), 6th of October, Tanta, and Damanhour.
- **Direct Campus Commutes**: Walking, transit, and driving estimates to Pharos University (PUA), Alexandria University (Shatby & Medical Campuses), Cairo University, AUC, GUC, MUST, and Tanta University.
- **Interactive Map**: Leaflet OpenStreetMap with custom terracotta price tags and campus pins.
- **Side-by-Side Comparison**: Compare up to 3 listings simultaneously across rent, deposit, amenities, utilities, and house rules.

### 2. Roommate Compatibility Matching System
Structured 8-dimension lifestyle questionnaire and transparent scoring algorithm:
- **Routine & Sleep Schedule**: 20%
- **Cleanliness & Shared Responsibilities**: 20%
- **Noise & Study Habits**: 15%
- **Smoking & Air Quality**: 15%
- **Guests & Social Life**: 10%
- **Pets & Animals**: 10%
- **Kitchen & Shared Resources**: 5%
- **Communication & Conflict Resolution**: 5%

Provides transparent compatibility percentages (e.g. 94% Match), shared strengths, potential conflicts, and suggested icebreaker discussion questions before booking.

### 3. Transparent Egyptian Payments & Bookings
- **Duration Flexibility**: Semester leases (3 months), annual agreements (12 months), monthly recurring, and 2-3 day short stays.
- **Fee Transparency**: 5% platform commission on semester and annual leases; 15% on short stays.
- **Payment Methods**: Visa/Mastercard, InstaPay instant IPN transfer simulation, and Vodafone Cash mobile wallet checkout.
- Clearly marked sandbox demo receipts and printable booking vouchers.

### 4. Property Owner Experience (Host Portal)
- 10-step Property Listing Creation Wizard with autosave (Type, Location, Capacity, Amenities, Photos, Pricing, Rules, Dates, Deed Verification, Preview).
- Booking request management: Accept, Reject, Message tenant.
- Listing pause/activate toggles and net earnings calculation.

### 5. Verification Center & Admin Console
- Private encrypted document upload for Egyptian National IDs, university enrollment cards, and notary deeds.
- Administrator moderation queues to audit properties and approve verification requests.
- Configurable commission rate controls.

### 6. Mobile App Simulator
- Toggle between full Desktop 1440px layout and an interactive iOS/Android phone simulator frame with bottom navigation (Explore, Roommates, Map, Stays, Host).

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Leaflet
- **Backend**: Node.js, Express, tsx
- **AI**: `@google/genai` (Gemini 3.8 Flash) via server-side `/api/gemini/misbah`
- **Persistence**: LocalStorage state synchronization with realistic Egyptian seed data

---

## 📦 Running Locally

```bash
# Install dependencies
npm install

# Start the dev server (Express backend + Vite frontend on port 3000)
npm run dev

# Build for production
npm run build
```
