---
name: html-output-format
description: Use standalone, self-contained HTML instead of Markdown when the content is naturally spatial, visual, comparative, or interactive — exploring multiple options side by side, annotated diffs/PRs, module/architecture maps, design systems and component sheets, animation/interaction prototypes, SVG illustrations and flowcharts, slide decks, research/concept explainers, status and incident reports, and throwaway custom editing UIs (kanban boards, flag editors, prompt tuners). Trigger whenever Markdown would flatten information the reader needs to see spatially, compare at a glance, or interact with, into a linear wall of text. Produces a single .html file with inline CSS/JS, no build step, opens directly in a browser.
---

# The unreasonable effectiveness of HTML

Companion skill distilled from a 20-example gallery ("html-effectiveness") showing that a
self-contained `.html` file often communicates better than a Markdown document — not because
Markdown is bad, but because Markdown is fundamentally *linear text*, and a lot of what agents
produce is not linear: it's spatial (diagrams, maps), comparative (options side by side, diff
before/after), temporal-with-detail (timelines), or something the reader wants to *poke at*
(prototypes, throwaway editors).

**Markdown stays the default.** Reach for HTML only when one of the signals below is present —
otherwise a plain, well-structured Markdown/text answer is faster to produce and easier to paste
elsewhere.

## Decision heuristic

Ask: *would the reader's understanding change if they could see this spatially, compare it at a
glance, or click on it — versus reading it top to bottom?* If yes, use HTML. Concretely:

| Signal in the request | Why Markdown flattens it | Reach for pattern # |
|---|---|---|
| "give me a few options / directions" | Sequential walls of text you must hold in your head to compare | 1 |
| "walk me through this diff / PR" | A diff is 2-D (old vs new, file vs file); prose linearizes it | 2 |
| "help me understand this codebase/module" | Call graphs and dependencies are spatial, not linear | 2 |
| "here's our design system / component" | The system's medium *is* HTML — screenshots or prose are a translation loss | 3 |
| "show me the animation / interaction" | Motion and feel can't be described in prose, only demonstrated | 4 |
| "draw a diagram / the figures for this doc" | Vector art beats an ASCII-art approximation or a wall of bullet steps | 5 |
| "make a deck / slides" | A deck is spatial (one idea per screen) and sequenced, not paragraphs | 6 |
| "explain how X works / teach me Y" | Explanations benefit from progressive disclosure, tabs, glossary lookup | 7 |
| "status update / postmortem / report" | Skimmable structure (charts, colored timeline) beats a memo nobody reads closely | 8 |
| "it's hard to describe what I want — let me just try it" | The user needs a UI to manipulate, then hand a result back, not a text box | 9 |

If none of these apply — a factual answer, a short explanation, code by itself, a simple list —
just write Markdown/prose. Don't reach for HTML by default.

## Non-negotiable technical constraints

Every artifact in the source gallery follows the same discipline. Keep it:

- **One file.** All CSS in a `<style>` block, all JS in a `<script>` block, no external
  dependencies, no build step. It must open by double-clicking or via a raw file open in any
  browser.
- **No framework.** Vanilla HTML/CSS/JS. Frameworks imply tooling the reader doesn't have.
- **Responsive-safe defaults.** `<meta name="viewport" content="width=device-width, initial-scale=1">`,
  a `* { box-sizing: border-box; }` reset, and `html { scroll-behavior: smooth; }` for anchor
  navigation.
- **A restrained, consistent palette** rather than default browser styling or rainbow colors —
  see the token set below. Consistency across an artifact matters more than which palette you
  pick; reuse the same tokens for headings, borders, and accents throughout one document.
- **Real content over Lorem Ipsum.** Every example uses concrete, specific fictional data (real
  file names, real-looking metrics, real timestamps) — specificity is what makes it feel true
  and readable versus an obvious placeholder.
- **An escape hatch back to text.** Anything interactive that produces a decision or an edit
  (see pattern 9) ends with a "Copy" / "Copy diff" / "Export as Markdown" button that serializes
  the current state to plain text/Markdown via `navigator.clipboard.writeText(...)`. The user
  stays in the loop and can paste the result straight back into the conversation or a commit —
  the UI is a means to an edit, not a dead end.

### Suggested design tokens

A warm, muted palette used consistently across the source examples — reuse it (or adapt hues
while keeping the same *structure*: one ink, one accent, one secondary accent, a warm neutral,
a gray ramp, three font stacks) rather than reinventing tokens per document:

```css
:root {
  --ivory:    #FAF9F5;  /* page background */
  --slate:    #141413;  /* primary text / ink */
  --clay:     #D97757;  /* primary accent */
  --olive:    #788C5D;  /* secondary accent */
  --oat:      #E3DACC;  /* warm neutral fill */
  --rust:     #B04A3F;  /* danger / attention (optional) */
  --gray-100: #F0EEE6;  /* subtle fill */
  --gray-300: #D1CFC5;  /* borders */
  --gray-500: #87867F;  /* muted text */
  --gray-700: #3D3D3A;  /* body text */
  --white:    #FFFFFF;  /* card/panel surfaces */

  --serif: ui-serif, Georgia, "Times New Roman", serif;   /* headings / editorial voice */
  --sans:  system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; /* UI / body */
  --mono:  ui-monospace, "SF Mono", Menlo, Consolas, monospace;      /* code, labels, metadata */
}
```

Typical usage: serif for large headings (editorial feel), sans for body and UI chrome, mono for
code, file paths, timestamps, eyebrow labels and small caps metadata. Borders `1.5px solid
var(--gray-300)`, radii around 8–12px, shadows kept very soft (`0 4px 14px rgba(20,20,19,.08)`).

## Pattern catalog

Nine categories, each mapped to the concrete structural/interaction pattern that made the
source example work. Use these as scaffolding, not templates to copy verbatim — build the
specific content the request calls for.

### 1 · Exploration & Planning
Use when the user hasn't committed to a direction yet, or needs a decision handed off.

- **Multi-approach comparison** — N columns (cards), one approach per column, each with a
  short verdict/trade-off line at the bottom so the reader can point at one instead of holding
  three sequential essays in their head.
- **Visual design directions** — same idea for layout/palette options: render them live (real
  CSS, not a description of colors) in a small grid so the reader reacts to something real.
- **Implementation plan** — a vertical timeline of milestones (dot + connecting line down the
  left, content to the right) paired with a small data-flow diagram, inline mockup snippets, and
  a risk table. This is the artifact you hand to whoever implements the plan.

### 2 · Code Review & Understanding
Use when discussing a diff, a PR, or an unfamiliar module.

- **Annotated diff** — render actual diff rows, not a prose description of the diff:
  ```html
  <div class="diff-row hunk"><span class="ln"></span><span class="mark"></span><span class="code">@@ -0,0 +1,58 @@</span></div>
  <div class="diff-row add"><span class="ln">1</span><span class="mark">+</span><span class="code">import { useMutation } from '@tanstack/react-query';</span></div>
  <div class="diff-row del"><span class="ln">2</span><span class="mark">−</span><span class="code">import { useState } from 'react';</span></div>
  ```
  Style `.add` with a green-tinted background, `.del` with a red/rust tint, `.hunk` muted. Attach
  margin notes/callouts next to specific lines for review comments, and a severity tag
  (`needs attention`, `nit`, `question`) per file or per hunk so reviewers can triage at a glance.
- **PR writeup for reviewers** — the author's side: motivation up top, a before/after, then a
  file-by-file tour explaining *why*, ending with where to focus review attention.
- **Module map** — boxes-and-arrows, not a bullet list of "X imports Y". Draw entry points,
  highlight the hot path, connect dependencies with lines. SVG or absolutely-positioned divs
  both work; keep it small enough to read as a diagram, not a chart.

### 3 · Design
Use when the artifact *is* about a design system or component — HTML is the native medium.

- **Living design system** — pull tokens (color/type/spacing) and render them as literal
  swatches the reader can eyeball and copy the value from: a colored chip, its hex, and its
  token name side by side; a type scale rendered at actual size; spacing tokens shown as bars.
- **Component variant matrix** — every size/state/intent of one component laid out on a single
  sheet (a grid of the component instances), with live controls (sliders/toggles for
  padding/density) that re-render every instance at once, and hovering a variant reveals its
  exact prop combination as a tooltip/label.

### 4 · Prototyping
Use when motion or interaction is the point — it can't be described, only felt.

- **Animation sandbox** — isolate the transition, add sliders for duration/easing so the exact
  curve can be tuned before it's wired into the real app; swap the CSS custom property driving
  the easing at runtime (`--ease: cubic-bezier(...)`) rather than hardcoding it.
- **Clickable flow** — 3–5 linked "screens" (divs styled as app screens) with real click targets
  that navigate between them — enough fidelity to feel whether the interaction is right, no more.

### 5 · Illustrations & Diagrams
Use when you'd otherwise draw an ASCII diagram or describe a shape in words.

- **SVG figure sheet** — draw the actual figures inline as `<svg>`, one per section, so each can
  be tweaked and copied out individually into the final document. Inline SVG is a real drawing
  surface, not a static asset.
- **Interactive flowchart** — real flowchart shapes (rect = step, diamond = decision) connected
  by lines, where clicking a node reveals detail (what runs, timing, failure path) instead of
  cramming every detail onto the diagram itself:
  ```js
  document.querySelectorAll('.node').forEach(n => {
    n.addEventListener('click', () => showDetail(n.dataset.step));
  });
  ```

### 6 · Decks
Use for "make me a deck / slides out of this".

- A handful of `<section class="slide">` elements, one per screen, `display:none` on all but the
  active one, plus ~20 lines of JS listening for arrow keys to advance/retreat. No export step,
  no Keynote — arrow-key through it in the meeting directly from the file.

### 7 · Research & Learning
Use for "explain how X works" or "teach me Y" where the topic has real structure.

- **Feature explainer** — TL;DR box up top, then `<details><summary>` blocks for
  progressively-disclosed steps (open the first by default), tabbed code/config samples
  (`data-tabs` + a tab bar that toggles an `active` class and shows/hides panels), and an FAQ at
  the end.
- **Concept explainer** — teach through a live, manipulable diagram (e.g. nodes on a ring you
  can add/remove) rather than static prose, a comparison table for trade-offs, and a hover-linked
  glossary: wrap jargon in `<span class="term" data-term="node">node</span>` and show a
  definition on hover/focus so the reader never has to leave the passage to look something up.

### 8 · Reports
Use for recurring documents — status updates, postmortems — that people currently skim.

- **Weekly status** — what shipped / what slipped / what's next, plus one small inline chart
  (a handful of styled bars is enough — no charting library needed) so the shape of the week is
  visible in a glance before anyone reads a word.
- **Incident timeline** — a vertical timeline down the left (dot + time + body per event,
  color the dot by severity: detection, impact, mitigation, resolution), followed by relevant
  log excerpts and a follow-up action checklist:
  ```html
  <div class="tl-entry">
    <span class="tl-dot impact"></span>
    <span class="tl-time">14:06</span>
    <div class="tl-body">Error rate crosses 5%; on-call paged.</div>
  </div>
  ```

### 9 · Custom Editing Interfaces
Use when it's genuinely hard to describe what's wanted in a text box — build a throwaway editor
for the *exact* thing being worked on. Always **end with an export/copy button** that turns
whatever was done in the UI back into text the user can paste into the conversation or commit.
This is what keeps the human in the loop while tightening the iteration loop.

- **Triage/kanban board** — draggable cards across columns (`draggable="true"`,
  `dragstart`/`dragover`/`drop` handlers moving a card's column state), ending with a button that
  serializes the final column ordering to Markdown and copies it:
  ```js
  card.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', card.dataset.id));
  copyBtn.addEventListener('click', () => navigator.clipboard.writeText(buildMarkdown(state)));
  ```
- **Settings/flag editor** — toggles grouped by area, dependency validation that disables/warns
  when a prerequisite is off, and a "Copy diff" button (disabled until something actually
  changed) that copies only the changed keys — not the whole state — so it pastes cleanly into a
  config file or PR description.
- **Live template/prompt tuner** — an editable template pane (`contenteditable="true"
  spellcheck="false"`) with variable slots highlighted, and 2–3 sample-input panes that re-render
  the filled template live on every keystroke (`editor.addEventListener('input', rerender)`), so
  the effect of a wording change is visible across all samples at once before committing to it.

## Reusable building blocks

Small pieces that recur across multiple patterns above — reach for these instead of reinventing
markup each time:

- **Collapsible section:** native `<details><summary>…</summary>…</details>` — no JS needed,
  keyboard-accessible for free.
- **Tabs:** a `.tabbar` of buttons toggling an `active` class, paired `.tab-panel` elements shown
  only when their id matches the active tab.
- **Hover glossary term:** `<span class="term" data-term="x">` + a CSS `::after`/tooltip or a
  small JS listener reading `data-term` to populate a definition popover.
- **Severity/status tag:** a small pill (`border-radius: 999px`, small mono/sans caps text)
  colored by state — reuse across diffs, reports, and flag editors instead of inventing new
  color language each time.
- **Copy-to-clipboard export:** `navigator.clipboard.writeText(serialize(state)).then(flashOk)`
  — the universal escape hatch for every editor pattern.

## Checklist before shipping an HTML artifact

1. Does this actually need to be HTML, or would Markdown/prose serve the reader just as well?
   (Default to Markdown — only escalate when a signal from the heuristic table applies.)
2. Single file, no external assets, no build step — opens directly in a browser.
3. Consistent tokens used throughout (not default browser styles, not a new palette per section).
4. Content is specific and real, not placeholder filler.
5. If interactive: is there a copy/export path back to plain text so the user isn't stuck in the
   UI with no way to bring the result back into the conversation?
6. Reasonably responsive — check it doesn't break at narrow widths if it might be viewed on a
   laptop split-screen or a phone.

---
*Distilled from the "html-effectiveness" example gallery (20 self-contained HTML demos organized
into 9 categories, plus an index page) accompanying a blog post on HTML as an agent output format.*
