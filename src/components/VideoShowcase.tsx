"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Click-to-play video block.
 *
 * Until the visitor presses play we render only the poster image, and the
 * <video> element isn't mounted at all — so the file is never requested. This
 * matters because the walkthrough clip is the original 4K upload (~22 MB);
 * dropping it into an autoplaying banner would push that onto every visitor
 * whether they watch it or not.
 */
export default function VideoShowcase({
  src,
  poster,
  posterAlt,
  caption,
}: {
  src: string;
  poster: string;
  posterAlt: string;
  caption?: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure className="m-0">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black">
        {playing ? (
          <video
            className="h-full w-full object-cover"
            src={src}
            poster={poster}
            controls
            autoPlay
            playsInline
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 h-full w-full cursor-pointer"
            aria-label="Play the dining room walkthrough"
          >
            <Image
              src={poster}
              alt={posterAlt}
              fill
              sizes="(min-width: 1024px) 960px, 100vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-black/30" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/50 bg-black/50 text-gold backdrop-blur-sm transition group-hover:scale-110 group-hover:bg-black/70">
                <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-8 w-8">
                  <path d="M8 5.5v13l11-6.5z" />
                </svg>
              </span>
            </span>
            <span className="absolute inset-x-0 bottom-0 p-5 text-left sm:p-7">
              <span className="block font-display text-xl font-bold text-cream drop-shadow-lg sm:text-2xl">
                Take a look around
              </span>
              <span className="mt-1 block text-sm text-cream/75">
                Tap to play · no sound needed
              </span>
            </span>
          </button>
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
