'use client';

import React, { useEffect, useRef, useState } from 'react';

export type MascotState = 'idle' | 'email' | 'password' | 'peek' | 'loading' | 'success' | 'error';

export interface MascotProps {
  state: MascotState;
  lookX?: number; // 0 (left) to 1 (right)
  isConfirmPassword?: boolean;
  passwordsMatch?: boolean;
  className?: string;
}

export default function Mascot({
  state,
  lookX = 0.5,
  isConfirmPassword = false,
  passwordsMatch = false,
  className = '',
}: MascotProps) {
  // Smoothly interpolated pupil tracking using requestAnimationFrame
  const [currentLookX, setCurrentLookX] = useState(0.5);
  const targetLookXRef = useRef(lookX);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    targetLookXRef.current = lookX;
  }, [lookX]);

  useEffect(() => {
    let active = true;

    const animatePupils = () => {
      if (!active) return;
      setCurrentLookX((prev) => {
        const diff = targetLookXRef.current - prev;
        if (Math.abs(diff) < 0.005) return targetLookXRef.current;
        return prev + diff * 0.18;
      });
      animFrameRef.current = requestAnimationFrame(animatePupils);
    };

    animFrameRef.current = requestAnimationFrame(animatePupils);
    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Compute pupil position and head tilt
  const clampedX = Math.max(0, Math.min(1, currentLookX));
  const pupilShiftX = (clampedX - 0.5) * 13; // -6.5px to +6.5px
  const headTilt = state === 'email' ? (clampedX - 0.5) * 5 : 0;

  // Vertical pupil shift depending on state
  let pupilShiftY = 0;
  if (state === 'email') pupilShiftY = 5.5; // looking down toward field
  else if (state === 'loading') pupilShiftY = -6; // looking up
  else if (state === 'peek') pupilShiftY = 2; // looking toward user
  else if (state === 'error') pupilShiftY = 3;

  // Hand / Arm transforms
  const isCovering = state === 'password' || (isConfirmPassword && !passwordsMatch);
  const isPeeking = state === 'peek';
  const isSuccess = state === 'success';
  const isError = state === 'error';

  // Left arm transform
  let leftArmTransform = 'translate(0, 0) rotate(0deg)';
  if (isCovering || isPeeking) {
    // Hands cover left eye
    leftArmTransform = 'translate(36px, -46px) rotate(32deg)';
  } else if (isSuccess) {
    leftArmTransform = 'translate(-4px, -18px) rotate(-16deg)';
  }

  // Right arm transform
  let rightArmTransform = 'translate(0, 0) rotate(0deg)';
  if (passwordsMatch && isConfirmPassword) {
    // Thumbs up / match celebratory wave
    rightArmTransform = 'translate(6px, -28px) rotate(16deg)';
  } else if (isPeeking) {
    // Right hand lowers down ~20px so right eye peeks through!
    rightArmTransform = 'translate(-22px, -20px) rotate(-12deg)';
  } else if (isCovering) {
    // Both hands cover eyes
    rightArmTransform = 'translate(-36px, -46px) rotate(-32deg)';
  } else if (isSuccess) {
    rightArmTransform = 'translate(4px, -18px) rotate(16deg)';
  }

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      aria-hidden="true"
    >
      {/* Ambient Radial Halo Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#e5a439]/25 via-[#173f34]/20 to-transparent blur-md pointer-events-none" />

      {/* Confetti & Sparkle Burst on Success */}
      {isSuccess && (
        <div className="absolute -inset-6 pointer-events-none z-20 flex items-center justify-center">
          {[
            { top: '10%', left: '20%', delay: '0ms', color: '#f5bc5c' },
            { top: '15%', left: '80%', delay: '120ms', color: '#2ecc71' },
            { top: '30%', left: '8%', delay: '240ms', color: '#e5a439' },
            { top: '35%', left: '92%', delay: '180ms', color: '#f5bc5c' },
            { top: '75%', left: '12%', delay: '300ms', color: '#2ecc71' },
            { top: '78%', left: '88%', delay: '210ms', color: '#f5bc5c' },
            { top: '5%', left: '50%', delay: '90ms', color: '#ffffff' },
            { top: '88%', left: '50%', delay: '350ms', color: '#e5a439' },
          ].map((sparkle, idx) => (
            <svg
              key={idx}
              className="absolute w-4 h-4 animate-sparkle"
              style={{
                top: sparkle.top,
                left: sparkle.left,
                animationDelay: sparkle.delay,
              }}
              viewBox="0 0 24 24"
              fill={sparkle.color}
            >
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
            </svg>
          ))}
        </div>
      )}

      {/* Main Mascot SVG */}
      <svg
        viewBox="0 0 200 200"
        className={`w-full h-full drop-shadow-xl transition-transform duration-300 ${
          state === 'idle' ? 'animate-mascot-float' : ''
        } ${isError ? 'animate-head-shake' : ''} ${isSuccess ? 'animate-mascot-bounce' : ''}`}
        style={{
          transformOrigin: '100px 140px',
          transform: state === 'email' ? `rotate(${headTilt}deg)` : undefined,
        }}
      >
        <defs>
          {/* Bamboo Shade Gradient */}
          <linearGradient id="bambooShadeGrad" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#f3b853" />
            <stop offset="35%" stopColor="#d69022" />
            <stop offset="70%" stopColor="#a76813" />
            <stop offset="100%" stopColor="#7a4608" />
          </linearGradient>

          {/* Wooden Cap / Top Finial Gradient */}
          <linearGradient id="finialGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5d390f" />
            <stop offset="50%" stopColor="#966120" />
            <stop offset="100%" stopColor="#5d390f" />
          </linearGradient>

          {/* Inner Lantern Warm Radial Glow */}
          <radialGradient id="lampGlow" cx="50%" cy="55%" r="48%">
            <stop offset="0%" stopColor="#fff9e6" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#f6ce72" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#c68a24" stopOpacity="0" />
          </radialGradient>

          {/* Bamboo Arm & Hand Gradient */}
          <linearGradient id="bambooLimbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e5a439" />
            <stop offset="70%" stopColor="#ba781a" />
            <stop offset="100%" stopColor="#7e4a0a" />
          </linearGradient>
        </defs>

        {/* 1. Hanging Cord & Top Turned-Wood Finial */}
        <g id="mascot-cord-and-cap">
          {/* Cord */}
          <line
            x1="100"
            y1="4"
            x2="100"
            y2="34"
            stroke="#173f34"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Brass hanging ring */}
          <circle cx="100" cy="18" r="3.5" fill="none" stroke="#e5a439" strokeWidth="2" />
          {/* Wood Finial / Pendant Canopy */}
          <ellipse cx="100" cy="34" rx="15" ry="6" fill="url(#finialGrad)" stroke="#4a2e0a" strokeWidth="1" />
          <ellipse cx="100" cy="39" rx="10" ry="3.5" fill="#e5a439" />
        </g>

        {/* 2. Bamboo Shade Body (Pendant Silhouette) */}
        <g id="mascot-body-shade">
          {/* Outer bell contour */}
          <path
            d="M 88 40 C 88 40 68 56 58 76 C 46 98 42 125 42 142 C 42 152 50 156 100 156 C 150 156 158 152 158 142 C 158 125 154 98 142 76 C 132 56 112 40 112 40 Z"
            fill="url(#bambooShadeGrad)"
            stroke="#6e3e08"
            strokeWidth="2.5"
          />

          {/* Inner warm ambient illumination */}
          <circle cx="100" cy="108" r="46" fill="url(#lampGlow)" />

          {/* Horizontal woven bamboo hoops */}
          <path d="M 76 56 Q 100 63 124 56" fill="none" stroke="#7e4a0a" strokeWidth="1.5" opacity="0.5" />
          <path d="M 64 80 Q 100 90 136 80" fill="none" stroke="#7e4a0a" strokeWidth="1.5" opacity="0.55" />
          <path d="M 52 110 Q 100 122 148 110" fill="none" stroke="#7e4a0a" strokeWidth="1.6" opacity="0.6" />
          <path d="M 44 140 Q 100 154 156 140" fill="none" stroke="#7e4a0a" strokeWidth="2" opacity="0.65" />

          {/* Vertical woven rib striations */}
          <path d="M 94 40 Q 86 96 62 148" fill="none" stroke="#f6ce72" strokeWidth="1.2" opacity="0.45" />
          <path d="M 106 40 Q 114 96 138 148" fill="none" stroke="#f6ce72" strokeWidth="1.2" opacity="0.45" />
          <path d="M 100 40 L 100 156" fill="none" stroke="#f6ce72" strokeWidth="1" opacity="0.35" />
        </g>

        {/* 3. Mascot Face */}
        <g id="mascot-face">
          {/* Eyebrows */}
          <g id="mascot-eyebrows" className="transition-all duration-200">
            {isError ? (
              // Worried / sad eyebrows
              <>
                <path d="M 68 83 Q 78 88 88 89" fill="none" stroke="#4a2e0a" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 112 89 Q 122 88 132 83" fill="none" stroke="#4a2e0a" strokeWidth="2.5" strokeLinecap="round" />
              </>
            ) : isSuccess || state === 'loading' ? (
              // Arched high excited eyebrows
              <>
                <path d="M 68 78 Q 78 72 88 78" fill="none" stroke="#4a2e0a" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 112 78 Q 122 72 132 78" fill="none" stroke="#4a2e0a" strokeWidth="2.5" strokeLinecap="round" />
              </>
            ) : (
              // Friendly curved eyebrows
              <>
                <path d="M 68 85 Q 78 80 88 85" fill="none" stroke="#4a2e0a" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 112 85 Q 122 80 132 85" fill="none" stroke="#4a2e0a" strokeWidth="2.5" strokeLinecap="round" />
              </>
            )}
          </g>

          {/* Eyes & Sclera */}
          <g id="mascot-eyes">
            {isSuccess ? (
              // Happy squinting smiling eyes
              <>
                <path
                  d="M 66 102 Q 78 88 90 102"
                  fill="none"
                  stroke="#173f34"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                <path
                  d="M 110 102 Q 122 88 134 102"
                  fill="none"
                  stroke="#173f34"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
              </>
            ) : (
              // Rounded eyes with sclera and blinking eyelid group
              <g className={state === 'idle' ? 'animate-mascot-blink' : ''}>
                {/* Left Eye Socket */}
                <ellipse cx="78" cy="100" rx="14" ry="14" fill="#ffffff" stroke="#7e4a0a" strokeWidth="1.2" />
                {/* Right Eye Socket */}
                <ellipse cx="122" cy="100" rx="14" ry="14" fill="#ffffff" stroke="#7e4a0a" strokeWidth="1.2" />

                {/* Pupils with tracking */}
                <g
                  id="mascot-pupils"
                  style={{
                    transform: `translate(${pupilShiftX}px, ${pupilShiftY}px)`,
                    transition: state === 'email' ? 'none' : 'transform 0.25s ease-out',
                  }}
                >
                  {/* Left Pupil */}
                  <circle cx="78" cy="100" r="6.2" fill="#173f34" />
                  <circle cx="78" cy="100" r="4.5" fill="#0d241d" />
                  <circle cx="78" cy="100" r="2.2" fill="#c68a24" opacity="0.6" />
                  {/* Catchlights */}
                  <circle cx="75.8" cy="97.8" r="2" fill="#ffffff" />
                  <circle cx="80.2" cy="102" r="0.9" fill="#ffffff" />

                  {/* Right Pupil */}
                  <circle cx="122" cy="100" r="6.2" fill="#173f34" />
                  <circle cx="122" cy="100" r="4.5" fill="#0d241d" />
                  <circle cx="122" cy="100" r="2.2" fill="#c68a24" opacity="0.6" />
                  {/* Catchlights */}
                  <circle cx="119.8" cy="97.8" r="2" fill="#ffffff" />
                  <circle cx="124.2" cy="102" r="0.9" fill="#ffffff" />
                </g>
              </g>
            )}
          </g>

          {/* Rosy artisan blush cheeks */}
          <g id="mascot-cheeks">
            <ellipse cx="58" cy="112" rx="7" ry="4" fill="#e26d5c" opacity="0.38" />
            <ellipse cx="142" cy="112" rx="7" ry="4" fill="#e26d5c" opacity="0.38" />
          </g>

          {/* Mouth */}
          <g id="mascot-mouth">
            {isError ? (
              // Frown / wavy wobble
              <path
                d="M 91 126 Q 100 117 109 126"
                stroke="#173f34"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            ) : isSuccess || (isConfirmPassword && passwordsMatch) ? (
              // Joyful wide grin with tongue
              <g>
                <path d="M 87 116 Q 100 136 113 116 Z" fill="#173f34" />
                <ellipse cx="100" cy="124" rx="5.5" ry="3.5" fill="#e26d5c" />
              </g>
            ) : state === 'loading' ? (
              // Curious little 'o' mouth
              <circle cx="100" cy="122" r="3.5" fill="#173f34" />
            ) : state === 'email' ? (
              // Subtle focused smile
              <path
                d="M 93 120 Q 100 126 107 120"
                stroke="#173f34"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              // Default sweet smile
              <path
                d="M 90 119 Q 100 128 110 119"
                stroke="#173f34"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </g>
        </g>

        {/* 4. Left Arm & Hand */}
        <g
          id="mascot-left-arm"
          style={{
            transformOrigin: '42px 140px',
            transform: leftArmTransform,
            transition: 'transform 0.32s cubic-bezier(0.34, 1.45, 0.64, 1)',
          }}
        >
          {/* Bamboo forearm */}
          <path
            d="M 44 138 C 36 142 32 150 35 158"
            stroke="url(#bambooLimbGrad)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Bamboo joint ring */}
          <circle cx="39" cy="146" r="3" fill="#6e3e08" opacity="0.6" />

          {/* Wooden carved hand palm */}
          <ellipse
            cx="34"
            cy="160"
            rx="9.5"
            ry="8.5"
            fill="url(#bambooLimbGrad)"
            stroke="#6e3e08"
            strokeWidth="1.2"
          />
          {/* 4 Carved Fingers */}
          <circle cx="28" cy="155" r="3" fill="#f3b853" stroke="#6e3e08" strokeWidth="0.9" />
          <circle cx="31.5" cy="151" r="3" fill="#f3b853" stroke="#6e3e08" strokeWidth="0.9" />
          <circle cx="36.5" cy="151" r="3" fill="#f3b853" stroke="#6e3e08" strokeWidth="0.9" />
          <circle cx="41" cy="155" r="3" fill="#f3b853" stroke="#6e3e08" strokeWidth="0.9" />
        </g>

        {/* 5. Right Arm & Hand */}
        <g
          id="mascot-right-arm"
          style={{
            transformOrigin: '158px 140px',
            transform: rightArmTransform,
            transition: 'transform 0.32s cubic-bezier(0.34, 1.45, 0.64, 1)',
          }}
        >
          {/* Bamboo forearm */}
          <path
            d="M 156 138 C 164 142 168 150 165 158"
            stroke="url(#bambooLimbGrad)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Bamboo joint ring */}
          <circle cx="161" cy="146" r="3" fill="#6e3e08" opacity="0.6" />

          {/* Wooden carved hand palm */}
          <ellipse
            cx="166"
            cy="160"
            rx="9.5"
            ry="8.5"
            fill="url(#bambooLimbGrad)"
            stroke="#6e3e08"
            strokeWidth="1.2"
          />
          {/* 4 Carved Fingers */}
          <circle cx="159" cy="155" r="3" fill="#f3b853" stroke="#6e3e08" strokeWidth="0.9" />
          <circle cx="163.5" cy="151" r="3" fill="#f3b853" stroke="#6e3e08" strokeWidth="0.9" />
          <circle cx="168.5" cy="151" r="3" fill="#f3b853" stroke="#6e3e08" strokeWidth="0.9" />
          <circle cx="172" cy="155" r="3" fill="#f3b853" stroke="#6e3e08" strokeWidth="0.9" />

          {/* Thumbs-up extra thumb on password match */}
          {passwordsMatch && isConfirmPassword && (
            <path
              d="M 166 148 Q 166 138 171 138 Q 175 138 174 148 Z"
              fill="#f3b853"
              stroke="#6e3e08"
              strokeWidth="1"
            />
          )}
        </g>
      </svg>
    </div>
  );
}
