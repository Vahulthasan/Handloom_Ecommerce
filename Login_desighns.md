Build a Login and Register page with an animated interactive mascot that reacts to what the user does in the form, like the "Yeti login" effect. Use my existing design language (dark green + gold, dark/light toggle) and make it fully responsive (phones, tablets, laptops).

MASCOT
- Create a friendly mascot as an inline SVG, with separate groups for: head, eyes, pupils, eyebrows, mouth, and two hands/arms. Use a themed character that fits a handmade bamboo-lamp store (for example a smiling bamboo pendant-shade character with a small face and wooden hands), in my gold/green palette.
- Place it in a circle at the top of the form card, about 120px on mobile and 160px on desktop.

MASCOT REACTIONS (state machine)
1. Idle: gentle breathing/float loop and a blink every 3-5 seconds.
2. Email field focused: the mascot looks down toward the field. Pupils follow the text cursor, moving left to right as the user types (map input length / caret position to pupil x-offset, clamped to a safe range). The head tilts slightly toward the typing side.
3. Password field focused: the hands rise and cover the eyes (smooth transform, about 300ms ease-out).
4. "Show password" toggle ON: the hands lower slightly and the mascot peeks through its fingers (one eye visible). Toggle OFF: the hands cover the eyes again.
5. Field blur: return to idle.
6. Submit loading: the mascot looks up and a small spinner shows on the button.
7. Success: happy face, a small bounce, and a confetti or sparkle burst, then redirect.
8. Error (wrong password or validation failure): the mascot shakes its head ("no" shake), shows a sad or worried face, and the form card does a subtle shake.
9. Register page extras: a "Confirm password" field keeps the eyes covered. When the passwords match, the mascot gives a thumbs-up or smile.

FORM UI
- Tabs or toggle between Login and Register (animated sliding underline), plus "Forgot password?" link.
- Login: email, password (show/hide eye icon), remember me, Login button, divider "or", and a "Continue with Google" button.
- Register: full name, email, phone (optional), password with a strength meter (weak / medium / strong bar), confirm password, a terms checkbox, Create Account button.
- Floating labels, 48px tall inputs, 16px+ font (prevents iOS zoom), clear focus ring in gold, inline validation messages under each field (not alerts).
- Buttons have hover lift and press feedback. Show a loading state and disable the button while submitting.
- Card: glassmorphism or a soft shadow, max-width 420px, centered vertically and horizontally. Optional split layout on 1024px+: left = brand image or tagline ("Handmade bamboo shades, shipped to Europe"), right = form.

ANIMATION RULES
- Animate only transform and opacity, with CSS transitions or keyframes; use requestAnimationFrame for the pupil tracking.
- Respect prefers-reduced-motion (disable the tracking, floating and confetti; keep simple state changes).
- Keep total animation JS small (no heavy libraries). Optional: Rive or Lottie only if I ask.

ACCESSIBILITY AND SECURITY
- The mascot SVG is decorative (aria-hidden="true"); form state is also conveyed with text.
- Proper labels, autocomplete attributes (email, current-password, new-password), keyboard navigation, visible focus, aria-live for error messages.
- Never log or expose the password. Validate on the client and the server. Use HTTPS-only cookies or tokens, rate-limit login attempts, and include CSRF protection.

STACK
- Use my current stack. If none, use React + plain CSS (or Tailwind) in a single reusable component <AuthMascotForm />, with the mascot as a separate <Mascot state="idle|email|password|peek|loading|success|error" lookX={0-1} /> component.

ACCEPTANCE CHECKLIST
- The pupils follow typing in the email field smoothly.
- The hands cover the eyes on password focus and peek when show-password is on.
- The error state shakes and the success state celebrates.
- No horizontal scroll at 360px up to 1920px; works in dark and light themes.
- Works on touch devices (focus events, not hover).
- Lighthouse accessibility score 90+.

Deliver the changed or new files, and a short note on how the mascot states are triggered.