# Gemini CLI Prompt Configuration

Use this prompt with the Gemini CLI or within the editor to update your existing login page with a professional, minimal, neutral dark-theme UI.

## Prompt to Copy

```text
Act as an expert UI/UX developer. Update the existing login page component to align with a professional, enterprise-grade analytics dashboard aesthetic using neutral colors (slate/zinc) and a split-screen layout.

Apply the following specific changes and requirements:
1. Palette: Use dark neutral tones (e.g., zinc-950 background, zinc-900 inputs, zinc-200 text) with subtle borders and neutral highlights.
2. Structure: Implement a 2-column layout on large screens. Left side is the sign-in form, and the right side features a minimalist, non-intrusive promo/status card on a subtle grid background.
3. Typography: Improve hierarchy. Use smaller, uppercase tracking-wide labels and bold, clean typography for input fields.
4. UI States: Ensure loading states, eye-toggle visibility for passwords, and consistent spacing are handled elegantly.
5. Components: Use the following icon set from `lucide-react`: Lock, Mail, Eye, EyeOff, BarChart3, ArrowRight, and ShieldCheck.

Please refactor the existing page.tsx file to match this design pattern, keeping the code modular and utilizing Tailwind CSS.