# Sakniya UI & Theme System Upgrade

Plan to implement interactive property comparison with a persistent docked bottom bar, 5-star rating components, a realistic table-lamp vector character synced to chat states, and a dynamic Light/Night theme system tailored to Sakniya's warm bohemian aesthetic.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were confirmed through interactive preferences:
> - **Comparison Bar Style**: Floating bottom docked bar with property preview thumbnails, counter, individual remove tags, and primary "Compare Now" launcher.
> - **Night Mode Atmosphere**: Warm bohemian espresso and deep charcoal (`#1C1917` / `#26221E`) with soft amber glow and terracotta accents, preserving the brand's natural aesthetic.
> - **Star Rating UI**: Five interactive star glyphs with filled/half/empty states, numeric average, and review count fetched from state.

---

## 1. Overview & Core Concept

This upgrade elevates the user experience across browsing, discovery, and nighttime usability:
- **Direct Side-by-Side Comparison**: Tenants can mark properties using a 'Compare' checkbox on cards and view an active docked comparison bar as soon as 2 or more properties are selected, enabling immediate multi-criteria evaluation.
- **Visual Trust via 5-Star Reviews**: Property cards display an interactive 5-star rating element reflecting simulated reviews from the central data store.
- **Realistic Misbah Lamp Assistant**: Replaces simple bulb iconography with an architectural bedside table-lamp vector featuring a pleated linen shade, terracotta ceramic urn base, and dynamic amber emission that automatically turns ON when chat is open and OFF when closed.
- **Cozy Night Mode**: Seamless theme toggle featuring an animated Sun-to-Crescent-Moon transformation, persistent via `localStorage`, respecting system theme defaults without flicker.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Theme Toggle Flow**:
   - The user taps the theme toggle button in the header (or mobile drawer).
   - The icon smoothly morphs between a radiant Sun and a clean Crescent Moon with a 250ms rotation and scale transition.
   - The document updates with the `dark` class, transitioning the entire interface into a cozy bohemian night ambiance with deep espresso surfaces (`#1C1917`), dark taupe hairline dividers (`#3D352E`), and warm cream typography (`#EDE6DE`).
   - Preference is stored in `localStorage.setItem('sakniya_theme', 'dark')`.

2. **Property Comparison Flow**:
   - Each property card displays a dedicated 'Compare' checkbox control in its actions cluster.
   - When checked, the property ID is added to `comparedProperties` (max 3).
   - As soon as 2 or 3 properties are checked, a persistent bottom bar smoothly slides up above the viewport base (or above the mobile navigation bar).
   - The bar displays mini thumbnails of selected apartments/rooms, monthly prices, a remove button (`x`), and a prominent "Compare Now (2/3)" button.
   - Tapping "Compare Now" opens the existing side-by-side comparison modal.
   - Clicking "Clear" resets the comparison list and smoothly docks the bar away.

3. **5-Star Rating Component Flow**:
   - Each card renders 5 star glyphs with partial fill precision corresponding to the listing rating (e.g. 4.9 or 4.8).
   - Hovering or tapping reveals the average score (e.g., `4.9/5.0`) and review count (e.g., `(18 reviews)`).

4. **Realistic Misbah Lamp & Chat State Sync Flow**:
   - The floating assistant button presents an authentic bedside table lamp with a pleated shade and terracotta base.
   - When the user opens the chat (or triggers it from "Message Host" or quick actions), the lamp shade lights up with a warm amber gradient and radiant glow ring (`animate-glow`).
   - When the chat dialog is closed or minimized, the light smoothly dims to the resting matte state.
   - The lamp in the chat drawer header reflects the identical live lighting state.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Persistent Bottom Comparison Bar vs. Header Badge**:
  - *Chosen Approach*: Floating bottom docked bar that appears when $\ge 2$ properties are selected, with a maximum of 3 items.
  - *Rationale*: Keeps comparison state constantly visible while browsing through long search results without forcing the user to scroll back to the top bar.
  - *Accessibility & Spacing*: Pinned above the mobile bottom navigation bar when in mobile mode (`bottom-20` on mobile, `bottom-6` on desktop) so it never covers crucial interactive elements or the Misbah floating lamp.

- **Decision 2: Warm Bohemian Night Mode vs. High-Contrast Slate**:
  - *Chosen Approach*: Earthy dark espresso (`#1C1917`), cocoa charcoal (`#26221E`), and warm terracotta accents.
  - *Rationale*: Maintains Sakniya's brand promise ("مكانك، وناسك، وراحتك") of cozy, calming interiors, avoiding the generic cold blue/slate aesthetic of standard dashboards.

- **Decision 3: Standalone 5-Star SVG Component**:
  - *Chosen Approach*: Reusable `StarRating` component calculating filled, half-filled, and empty stars based on numeric rating, supporting both Arabic and English reading directions.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    AppContext / State                       │
│  - theme: 'light' | 'dark' (localStorage + media query)     │
│  - comparedProperties: string[] (max 3)                     │
│  - isMisbahChatOpen: boolean (lamp state synchronization)   │
│  - properties, favorites, reviews data                      │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
       ┌───────▼────────┐             ┌───────▼────────┐
       │   ThemeToggle  │             │ PropertyCard   │
       │ (Sun <-> Moon) │             │ - Compare check│
       └────────────────┘             │ - 5-Star rating│
                                      │ - Heart toggle │
                                      └───────┬────────┘
                                              │ (>= 2 selected)
                                      ┌───────▼────────┐
                                      │ ComparisonBar  │
                                      │ (Bottom docked)│
                                      └────────────────┘
```

### Component & State Plan

1. **`src/context/AppContext.tsx`**:
   - Add `theme: 'light' | 'dark'` and `toggleTheme: () => void`.
   - Add `isMisbahChatOpen: boolean` and `setIsMisbahChatOpen: (open: boolean) => void`.
   - Update `toggleCompare` and `clearCompare` functions.
   - Sync `dark` class on `document.documentElement` whenever `theme` changes.

2. **`src/components/common/ThemeToggle.tsx`**:
   - Single animated button featuring smooth SVG path morph/rotation between radiant Sun and crescent Moon.

3. **`src/components/common/StarRating.tsx`**:
   - Reusable component displaying 5 star glyphs with fraction-filled SVGs, average score, and verified review count.

4. **`src/components/misbah/RealisticLampIcon.tsx`**:
   - Detailed SVG vector representing an authentic table lamp (pleated shade, neck, terracotta base, and ambient light cone) with smooth CSS transitions for ON/OFF states.

5. **`src/components/discovery/PersistentComparisonBar.tsx`**:
   - Docked bottom bar appearing when `comparedProperties.length >= 2`.
   - Renders thumbnails, titles, prices, quick delete, and "Compare Now" CTA.

6. **`src/components/discovery/PropertyCard.tsx`**:
   - Integrate `StarRating` component.
   - Add accessible 'Compare' checkbox next to the Heart button.

7. **`src/index.css` & Dark Mode Token Layer**:
   - Define coordinated CSS variables and utility classes for light and dark modes:
     - Light: Background `#F8F4EC`, Surfaces `#FFFFFF`, Text `#34332F`.
     - Dark: Background `#1C1917`, Surfaces `#26221E`, Text `#EDE6DE`, Borders `#3D352E`.

---

## 5. Verification & Testing Steps

1. Verify theme toggle: Clicking switches between Sun and Moon, toggles `dark` class on `<html>`, and updates all views, cards, modals, and dropdowns.
2. Verify persistence: Reloading the page maintains the selected theme.
3. Verify comparison bar:
   - Selecting 1 property does not show the bar.
   - Selecting 2 or 3 properties smoothly brings up the docked bottom bar.
   - Deselecting or clicking "Clear" dismisses the bar.
   - Clicking "Compare Now" opens the comparison modal with the selected listings.
4. Verify star rating: Displays 5 accurate star glyphs matching the property rating.
5. Verify Misbah lamp:
   - Lamp is OFF when chat is closed.
   - Opening chat smoothly illuminates the lamp with a warm amber glow.
   - Closing chat dims the lamp back to resting state.
6. Verify mobile responsiveness and build compilation with `npm run build` / `compile_applet`.
