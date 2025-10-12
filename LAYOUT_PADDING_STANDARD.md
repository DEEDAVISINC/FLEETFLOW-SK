# FleetFlow Layout Padding Standard

## Navigation Height

- Fixed navigation bar: `minHeight: '80px'`
- Position: `position: 'fixed'`, `top: 0`, `zIndex: 1000`

## Standard Page Padding

**ALL dashboard pages MUST use `paddingTop: '120px'` in their layout wrapper.**

This provides proper clearance for:

- Navigation bar (80px)
- Additional spacing for visual comfort (40px)

## Implementation Pattern

### ✅ CORRECT: Use layout wrapper

```tsx
// app/your-dashboard/layout.tsx
'use client';

export default function YourDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: '100vh' }}>
      <main style={{ paddingTop: '120px' }}>{children}</main>
    </div>
  );
}
```

```tsx
// app/your-dashboard/page.tsx
export default function YourDashboard() {
  return (
    <div style={{
      padding: '20px', // Side and bottom padding
      // NO paddingTop here - layout handles it
    }}>
      {/* Your content */}
    </div>
  );
}
```

### ❌ INCORRECT: Inline padding conflicts

```tsx
// BAD - Don't do this
<div style={{ paddingTop: '100px' }}> // Conflicts with layout

// BAD - Full viewport height goes behind navigation
<div style={{ minHeight: '100vh' }}> // Starts from top of viewport

// GOOD - Account for navigation height
<div style={{ minHeight: 'calc(100vh - 120px)' }}> // Respects layout padding
```

## Current Implementation

### Dashboards Using This Standard:

1. `/app/fleetflowdash/` - ✅ Has layout.tsx with 120px padding
2. `/app/depointe-dashboard/` - ✅ Has layout.tsx with 120px padding
3. `/app/drivers/dashboard/` - ✅ Has layout.tsx with 120px padding
4. `/app/broker/dashboard/` - ✅ Has layout.tsx with 120px padding
5. `/app/dashboard/` - ✅ Has layout.tsx with 120px padding

## When Adding New Dashboards

1. Create a `layout.tsx` file in your dashboard directory
2. Use the standard 120px paddingTop
3. Remove any inline paddingTop from your page.tsx
4. Test on all screen sizes

## Why This Matters

- **Consistency**: All dashboards look the same
- **Maintainability**: Change once, applies everywhere
- **User Experience**: No content hidden behind navigation
- **Performance**: Layout shift prevention

---

**Last Updated**: October 11, 2025 **Standard Version**: 1.0
