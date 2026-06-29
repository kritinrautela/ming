"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type MediaModalProps = {
  open: boolean;
  title: string;
  src: string;
  onClose: () => void;
};

export function MediaModal({ open, title, src, onClose }: MediaModalProps) {
  const [canPlay, setCanPlay] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!open) {
      setCanPlay(false);
      setChecked(false);
      return;
    }

    let cancelled = false;
    setChecked(false);
    setCanPlay(false);

    fetch(src, { method: "HEAD" })
      .then((response) => {
        if (!cancelled) {
          setCanPlay(response.ok);
          setChecked(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCanPlay(false);
          setChecked(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open, src]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="media-modal-shell" role="dialog" aria-modal="true" aria-labelledby="media-modal-title">
      <button type="button" className="modal-scrim" aria-label="Close film modal" onClick={onClose} />
      <div className="media-modal-panel">
        <div className="media-modal-head">
          <p className="museum-kicker">CHAZEN Film Room</p>
          <button type="button" aria-label="Close film modal" onClick={onClose}>
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="media-modal-stage">
          {checked && canPlay ? (
            <video src={src} controls playsInline className="media-modal-video" />
          ) : (
            <div className="film-placeholder">
              <span aria-hidden="true" />
              <h2 id="media-modal-title">{title}</h2>
              <p>Film coming soon</p>
              <small>
                The ritual room is being prepared. The experience will open here without leaving
                the museum.
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
