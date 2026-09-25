import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const base = "transition-all duration-700 ease-out motion-reduce:transition-none";
  const hidden = "translate-y-6 opacity-0";
  const shown = "translate-y-0 opacity-100";

  const badgeClass = base + " delay-0 " + (mounted ? shown : hidden);
  const titleClass = base + " delay-150 " + (mounted ? shown : hidden);
  const subtitleClass = base + " delay-300 " + (mounted ? shown : hidden);
  const buttonEnterClass = base + " delay-500 " + (mounted ? shown : hidden);

  const videoClass =
    "h-full w-full object-cover transition-transform duration-[4000ms] ease-out motion-reduce:transition-none " +
    (mounted ? "scale-100" : "scale-110");

  const overlayClass =
    "absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/40 transition-opacity duration-1000 " +
    (mounted ? "opacity-100" : "opacity-0");

  const scrollHintClass =
    "absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 transition-opacity duration-1000 hover:text-white motion-safe:animate-bounce " +
    (mounted ? "opacity-100" : "opacity-0");

  const buttonClass =
    "group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-accent px-6 py-3 font-medium text-white shadow-lg shadow-black/30 transition duration-300 hover:bg-accent-dark hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95 " +
    buttonEnterClass;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <video src="landing.mp4" autoPlay loop muted playsInline className={videoClass} />

      <div className={overlayClass} />

      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl motion-safe:animate-pulse" />
      <div className="pointer-events-none absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl motion-safe:animate-pulse [animation-delay:1s]" />

      <div className="absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center gap-6 px-6 text-center text-white text-2xl text-semibold" />

      <a href="/products" className={`${buttonClass} fixed bottom-20 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap`}>
        <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/25 transition-transform duration-700 group-hover:translate-x-full" />
        <span className="relative">Shop Now</span>
        <svg
          className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </a>
    </div>
  );
}