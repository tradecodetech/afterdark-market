"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { spinWheel } from "@/lib/actions/reward-actions";
import { PRIZES } from "@/lib/rewards";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const SLICE_DEGREES = 360 / PRIZES.length;
// On-brand wheel palette — alternating violet/rose shades instead of a
// generic rainbow, matching the brand/accent tokens in globals.css.
const SLICE_COLORS = [
  "#e11d48", // accent-600
  "#7c3aed", // brand-600
  "#fb7185", // accent-400
  "#3b0764", // brand-900
  "#a78bfa", // brand-400
  "#6d28d9", // brand-700
];

function conicGradient() {
  const stops = PRIZES.map((_, i) => {
    const start = i * SLICE_DEGREES;
    const end = start + SLICE_DEGREES;
    return `${SLICE_COLORS[i % SLICE_COLORS.length]} ${start}deg ${end}deg`;
  });
  return `conic-gradient(${stops.join(", ")})`;
}

export default function SpinWheel({ alreadySpun }: { alreadySpun: boolean }) {
  const [state, formAction, pending] = useActionState(spinWheel, undefined);
  const [spinCount, setSpinCount] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const rotation = useMemo(() => {
    if (state?.prizeIndex === undefined) return 0;
    const extraSpins = (spinCount + 6) * 360;
    return extraSpins - (state.prizeIndex * SLICE_DEGREES + SLICE_DEGREES / 2);
  }, [state?.prizeIndex, spinCount]);

  useEffect(() => {
    if (state?.prizeIndex === undefined) return;
    const timeout = setTimeout(() => setRevealed(true), 3200);
    return () => clearTimeout(timeout);
    // spinCount included so a repeat spin (even with the same prizeIndex)
    // still re-arms the reveal timer.
  }, [state?.prizeIndex, spinCount]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative h-64 w-64">
        <div
          className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1"
          style={{
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: "16px solid currentColor",
          }}
        />
        <div
          className="h-full w-full rounded-full border-4 border-neutral-900 shadow-lg transition-transform duration-[3000ms] ease-out dark:border-white"
          style={{ background: conicGradient(), transform: `rotate(${rotation}deg)` }}
        >
          {PRIZES.map((prize, i) => {
            const angle = i * SLICE_DEGREES + SLICE_DEGREES / 2;
            return (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 w-20 origin-left text-center text-[10px] font-semibold text-white"
                style={{
                  transform: `rotate(${angle}deg) translate(20px, -6px)`,
                }}
              >
                {prize.label}
              </span>
            );
          })}
        </div>
      </div>

      <form
        action={formAction}
        onSubmit={() => {
          setRevealed(false);
          setSpinCount((c) => c + 1);
        }}
      >
        <Button type="submit" disabled={pending || alreadySpun} size="lg">
          {alreadySpun ? "Come back tomorrow" : pending ? "Spinning…" : "Spin"}
        </Button>
      </form>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      {revealed && state?.label && (
        <Card className="text-center">
          <p className="font-semibold">{state.label}!</p>
          {state.code && state.label !== "Try again tomorrow" && (
            <p className="mt-1 text-sm text-neutral-500">
              Saved to your account — apply it at checkout. Code:{" "}
              <span className="font-mono">{state.code}</span>
            </p>
          )}
        </Card>
      )}
    </div>
  );
}
