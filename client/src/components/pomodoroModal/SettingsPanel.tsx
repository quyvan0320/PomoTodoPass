import { useState } from "react";

const SettingsPanel = ({
  focusMins,
  breakMins,
  onApply,
}: {
  focusMins: number;
  breakMins: number;
  onApply: (f: number, b: number) => void;
}) => {
  const [f, setF] = useState(focusMins);
  const [b, setB] = useState(breakMins);

  const FOCUS_OPTIONS = [25, 30, 45, 50, 60, 90];
  const BREAK_OPTIONS = [5, 10, 15, 20];
  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] text-white/35 mb-2 uppercase tracking-wider">
          Tập trung
        </p>
        <div className="flex gap-1.5 flex-wrap">
          {FOCUS_OPTIONS.map((v) => (
            <button
              key={v}
              onClick={() => setF(v)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all"
              style={{
                background:
                  f === v ? "rgba(200,155,60,0.15)" : "rgba(255,255,255,0.04)",
                borderColor: f === v ? "#c89b3c" : "rgba(255,255,255,0.08)",
                color: f === v ? "#c89b3c" : "rgba(255,255,255,0.4)",
              }}
            >
              {v}p
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-[11px] text-white/35 mb-2 uppercase tracking-wider">
          Nghỉ
        </p>
        <div className="flex gap-1.5">
          {BREAK_OPTIONS.map((v) => (
            <button
              key={v}
              onClick={() => setB(v)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all"
              style={{
                background:
                  b === v ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.04)",
                borderColor: b === v ? "#4ade80" : "rgba(255,255,255,0.08)",
                color: b === v ? "#4ade80" : "rgba(255,255,255,0.4)",
              }}
            >
              {v}p
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={() => onApply(f, b)}
        className="w-full py-2 rounded-lg text-[12px] font-bold transition-all"
        style={{
          background: "rgba(255,255,255,0.07)",
          color: "rgba(255,255,255,0.7)",
        }}
      >
        Áp dụng
      </button>
    </div>
  );
};

export default SettingsPanel;
