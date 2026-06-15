# Button

**SMUI Package:** `@smui/button`  
**MDI Icons:** `@mdi/js` or `mdi` CSS class  
**Material Kit Pro ref:** Basic Elements → Buttons  
**Status:** `[ ]` Not started

---

## Purpose

The primary interaction element. Use buttons for actions — submitting forms, triggering dialogs, navigating, confirming choices. Not for navigation between pages (use links) unless visually it must look like a button.

---

## Installation

```bash
npm i -D @smui/button @mdi/js
```

---

## Color Palette (Project Defaults)

These CSS custom properties map our paper/cream palette to Material Kit's color system. Define in your global stylesheet or `:root`.

```css
:root {
  /* Core */
  --color-primary:   #1C1510;  /* dark brown — main CTA */
  --color-muted:     #7A6A52;  /* warm brown — secondary actions */
  --color-subtle:    #A8957A;  /* lightest — ghost/tertiary */
  --color-border:    #C4B99A;  /* outlined buttons */
  --color-surface:   #FDF8F0;  /* card bg — button text on dark */
  --color-bg:        #EDE8DC;  /* page bg */

  /* Semantic */
  --color-success:   #5C7A52;  /* muted green */
  --color-warning:   #B8860B;  /* golden amber */
  --color-danger:    #8B3A3A;  /* muted red */
  --color-info:      #5B7FA6;  /* muted blue */
  --color-rose:      #9B5A6A;  /* muted rose */
}
```

---

## Variants

Material Kit Pro defines three style variants:

| Variant | SMUI prop | Description |
|---------|-----------|-------------|
| Raised (filled) | `variant="raised"` | Elevated, filled — primary actions |
| Unelevated | `variant="unelevated"` | Flat filled — secondary primary |
| Outlined | `variant="outlined"` | Border only — secondary/cancel |
| Text (default) | _(no variant)_ | No border, no fill — tertiary/simple |

---

## Sizes

Material Kit Pro sizes map to padding overrides in SMUI:

| Size | Class to add | Use case |
|------|-------------|----------|
| Small | `btn-sm` | Inline actions, table rows |
| Regular | _(default)_ | Most contexts |
| Large | `btn-lg` | Hero CTAs, prominent actions |

```scss
/* _button-sizes.scss — import in your component */
.smui-button--sm {
  height: 28px;
  font-size: 0.75rem;
  padding: 0 12px;
}

.smui-button--lg {
  height: 52px;
  font-size: 1rem;
  padding: 0 32px;
}
```

---

## Basic Usage

### Raised (Primary CTA)

```svelte
<script>
  import Button, { Label } from '@smui/button';
</script>

<Button variant="raised" style="background: var(--color-primary); color: var(--color-surface);">
  <Label>Get Started</Label>
</Button>
```

### Outlined (Secondary)

```svelte
<Button variant="outlined" style="border-color: var(--color-border); color: var(--color-primary);">
  <Label>Learn More</Label>
</Button>
```

### Text / Simple (Tertiary)

```svelte
<Button style="color: var(--color-muted);">
  <Label>Cancel</Label>
</Button>
```

### Unelevated

```svelte
<Button variant="unelevated" style="background: var(--color-muted); color: var(--color-surface);">
  <Label>Save Draft</Label>
</Button>
```

---

## With Icons (MDI)

SMUI accepts an `Icon` slot. Use MDI via the `mdi` CSS class (requires `@mdi/font`).

### Leading Icon

```svelte
<script>
  import Button, { Label, Icon } from '@smui/button';
</script>

<Button variant="raised" style="background: var(--color-primary); color: var(--color-surface);">
  <Icon class="material-icons" style="font-size: 18px;">favorite</Icon>
  <Label>Like</Label>
</Button>
```

### MDI Icon (via @mdi/font)

```svelte
<!-- install: npm i -D @mdi/font -->
<!-- in app.html: <link rel="stylesheet" href=".../@mdi/font/css/materialdesignicons.min.css"> -->

<Button variant="raised" style="background: var(--color-primary); color: var(--color-surface);">
  <Icon class="mdi mdi-heart" style="font-size: 18px;" />
  <Label>Like</Label>
</Button>
```

### Trailing Icon

```svelte
<Button variant="outlined" style="border-color: var(--color-border); color: var(--color-primary);">
  <Label>Next</Label>
  <Icon class="mdi mdi-arrow-right" style="font-size: 18px;" />
</Button>
```

### Icon Only (use FAB or IconButton for this — see icon-button.md)

---

## Sizes in Practice

```svelte
<!-- Small -->
<Button variant="raised" class="smui-button--sm" style="background: var(--color-primary); color: var(--color-surface);">
  <Label>Small</Label>
</Button>

<!-- Regular (default) -->
<Button variant="raised" style="background: var(--color-primary); color: var(--color-surface);">
  <Label>Regular</Label>
</Button>

<!-- Large -->
<Button variant="raised" class="smui-button--lg" style="background: var(--color-primary); color: var(--color-surface);">
  <Label>Large</Label>
</Button>
```

---

## Semantic Color Variants

Mirrors Material Kit's Default / Primary / Info / Success / Warning / Danger / Rose palette, adapted to our scheme.

```svelte
<!-- Success -->
<Button variant="raised" style="background: var(--color-success); color: #fff;">
  <Icon class="mdi mdi-check" style="font-size: 18px;" />
  <Label>Confirm</Label>
</Button>

<!-- Warning -->
<Button variant="raised" style="background: var(--color-warning); color: #fff;">
  <Icon class="mdi mdi-alert-outline" style="font-size: 18px;" />
  <Label>Caution</Label>
</Button>

<!-- Danger -->
<Button variant="raised" style="background: var(--color-danger); color: #fff;">
  <Icon class="mdi mdi-trash-can-outline" style="font-size: 18px;" />
  <Label>Delete</Label>
</Button>

<!-- Info -->
<Button variant="raised" style="background: var(--color-info); color: #fff;">
  <Icon class="mdi mdi-information-outline" style="font-size: 18px;" />
  <Label>Details</Label>
</Button>

<!-- Rose -->
<Button variant="raised" style="background: var(--color-rose); color: #fff;">
  <Icon class="mdi mdi-heart-outline" style="font-size: 18px;" />
  <Label>Love it</Label>
</Button>
```

---

## Round (Pill) Button

Material Kit Pro's "Round" variant — use border-radius override.

```svelte
<Button
  variant="raised"
  style="
    background: var(--color-primary);
    color: var(--color-surface);
    border-radius: 50px;
  "
>
  <Label>Round Button</Label>
</Button>

<!-- Round Outlined -->
<Button
  variant="outlined"
  style="
    border-color: var(--color-primary);
    color: var(--color-primary);
    border-radius: 50px;
  "
>
  <Label>Round Outlined</Label>
</Button>
```

---

## Disabled State

```svelte
<Button variant="raised" disabled style="background: var(--color-primary); color: var(--color-surface);">
  <Label>Disabled</Label>
</Button>

<Button variant="outlined" disabled>
  <Label>Disabled Outlined</Label>
</Button>
```

---

## Link Button

Renders as an `<a>` tag — use for navigation that must look like a button.

```svelte
<Button href="/dashboard" variant="raised" style="background: var(--color-primary); color: var(--color-surface);">
  <Label>Go to Dashboard</Label>
</Button>
```

---

## Button Group

Horizontal group of related actions (Material Kit Pro style).

```svelte
<div style="display: flex; gap: 0; border: 1px solid var(--color-border); border-radius: 4px; overflow: hidden; width: fit-content;">
  <Button variant="unelevated" style="background: var(--color-primary); color: var(--color-surface); border-radius: 0;">
    <Label>One</Label>
  </Button>
  <Button variant="unelevated" style="background: var(--color-muted); color: var(--color-surface); border-radius: 0; border-left: 1px solid var(--color-border);">
    <Label>Two</Label>
  </Button>
  <Button variant="unelevated" style="background: var(--color-muted); color: var(--color-surface); border-radius: 0; border-left: 1px solid var(--color-border);">
    <Label>Three</Label>
  </Button>
</div>
```

---

## Loading State (Custom)

SMUI doesn't have a built-in loading state — compose it with a spinner.

```svelte
<script>
  import Button, { Label } from '@smui/button';
  import CircularProgress from '@smui/circular-progress';

  let loading = false;

  async function handleClick() {
    loading = true;
    await someAsyncAction();
    loading = false;
  }
</script>

<Button
  variant="raised"
  disabled={loading}
  on:click={handleClick}
  style="background: var(--color-primary); color: var(--color-surface); min-width: 120px;"
>
  {#if loading}
    <CircularProgress style="height: 18px; width: 18px; color: var(--color-surface);" indeterminate />
  {:else}
    <Label>Submit</Label>
  {/if}
</Button>
```

---

## Key Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"raised" \| "unelevated" \| "outlined"` | text | Visual style |
| `disabled` | `boolean` | `false` | Disables the button |
| `href` | `string` | — | Renders as `<a>` tag |
| `color` | `"primary" \| "secondary"` | `"primary"` | SMUI theme color slot |
| `touch` | `boolean` | `false` | 48px min touch target |
| `ripple` | `boolean` | `true` | Material ripple on click |
| `class` | `string` | — | Extra CSS classes |
| `style` | `string` | — | Inline style overrides |

---

## MDI Icon Suggestions

| Action | MDI Icon class |
|--------|---------------|
| Like / Love | `mdi-heart` / `mdi-heart-outline` |
| Delete | `mdi-trash-can-outline` |
| Edit | `mdi-pencil-outline` |
| Add | `mdi-plus` |
| Next / Forward | `mdi-arrow-right` |
| Back | `mdi-arrow-left` |
| Download | `mdi-download` |
| Upload | `mdi-upload` |
| Share | `mdi-share-variant` |
| Send | `mdi-send` |
| Save | `mdi-content-save-outline` |
| Search | `mdi-magnify` |
| Settings | `mdi-cog-outline` |
| Close / Cancel | `mdi-close` |
| Check / Confirm | `mdi-check` |
| Info | `mdi-information-outline` |
| Warning | `mdi-alert-outline` |
| Filter | `mdi-filter-outline` |
| Refresh | `mdi-refresh` |

---

## Design Notes

- **Material Kit Pro** uses a prominent drop shadow on raised buttons — SMUI `variant="raised"` replicates this via MDC elevation.
- **Round buttons** in Material Kit are simple `border-radius: 50px` — no special component needed.
- **Simple / text buttons** from Material Kit = SMUI default (no variant prop).
- Always pair icon buttons with a visible label unless space is critically constrained (use `icon-button.md` for icon-only).
- On dark backgrounds (hero sections), use `color: var(--color-surface)` text with `background: var(--color-primary)` fill.
