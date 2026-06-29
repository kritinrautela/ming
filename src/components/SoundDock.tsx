"use client";

import { Pause, Volume2, Waves, Wind } from "lucide-react";

type SoundDockProps = {
  open: boolean;
  active: boolean;
  notice: string;
  onToggle: () => void;
  onPlay: (path: string, label: string, loop?: boolean) => void;
  onStop: () => void;
};

export function SoundDock({ open, active, notice, onToggle, onPlay, onStop }: SoundDockProps) {
  return (
    <div className={`sound-dock ${active ? "is-playing" : ""}`}>
      {open && (
        <div className="sound-menu" role="menu" aria-label="Sound menu" aria-live="polite">
          <p>{notice}</p>
          <button type="button" role="menuitem" onClick={() => onPlay("/audio/singing-bowl.mp3", "Singing Bowl")}>
            <Volume2 size={15} aria-hidden="true" /> Singing Bowl <span lang="zh-Hant">冥想鉢</span>
          </button>
          <button type="button" role="menuitem" onClick={() => onPlay("/audio/tea-pour.mp3", "Tea Pouring")}>
            <Waves size={15} aria-hidden="true" /> Tea Pouring <span lang="zh-Hant">注水聲</span>
          </button>
          <button type="button" role="menuitem" onClick={() => onPlay("/audio/garden-rain.mp3", "Garden Rain", true)}>
            <Wind size={15} aria-hidden="true" /> Garden Rain <span lang="zh-Hant">庭雨</span>
          </button>
          <button type="button" role="menuitem" onClick={onStop}>
            <Pause size={15} aria-hidden="true" /> Silent Mode <span lang="zh-Hant">靜音</span>
          </button>
        </div>
      )}
      <button
        type="button"
        className="sound-toggle"
        aria-label={open ? "Close sound controls" : "Open sound controls"}
        aria-expanded={open}
        onClick={onToggle}
      >
        <Volume2 size={17} aria-hidden="true" />
      </button>
    </div>
  );
}
