import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiChevronDown,
  FiCpu,
  FiGrid,
  FiHardDrive,
  FiHeadphones,
  FiLayers,
  FiMonitor,
  FiShield,
  FiTag,
  FiTruck,
  FiZap,
  FiShoppingBag,
  FiStar,
} from "react-icons/fi";

import api from "../utils/api.js";
import ProductCard from "../components/productCard.jsx";

const categories = [
  { value: "motherboard", label: "Motherboards", icon: <FiGrid />, number: "01" },
  { value: "graphic-card", label: "Graphics Cards", icon: <FiMonitor />, number: "02" },
  { value: "ram", label: "Memory / RAM", icon: <FiLayers />, number: "03" },
  { value: "processor", label: "Processors", icon: <FiCpu />, number: "04" },
  { value: "storage", label: "Storage", icon: <FiHardDrive />, number: "05" },
];

// Edit these texts so they match your real shop policies
const features = [
  {
    icon: <FiShield />,
    title: "100% Genuine",
    text: "Shop confidently with authentic computer components.",
  },
  {
    icon: <FiTag />,
    title: "Best Value",
    text: "Find quality hardware at competitive prices.",
  },
  {
    icon: <FiTruck />,
    title: "Fast Delivery",
    text: "Get your components delivered safely to your door.",
  },
  {
    icon: <FiHeadphones />,
    title: "Expert Support",
    text: "Get assistance choosing the right components.",
  },
];

function scrollToCategories() {
  document.getElementById("categories")?.scrollIntoView({
    behavior: "smooth",
  });
}

/* Fades + slides an element in when it scrolls into view */
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none
                ${visible
          ? "translate-y-0 opacity-100"
          : "translate-y-8 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
        } ${className}`}
    >
      {children}
    </div>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="text-center">
      {eyebrow && (
        <span
          className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100
                               bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-accent"
        >
          <FiZap />
          {eyebrow}
        </span>
      )}

      <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h2>

      {description && (
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [featured, setFeatured] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    let active = true;

    api.get("/products")
      .then((response) => {
        if (active) {
          setFeatured(response.data.slice(0, 4));
        }
      })
      .catch((error) => {
        console.error("Failed to load featured products:", error);
      })
      .finally(() => {
        if (active) {
          setLoadingFeatured(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Hero entrance animation (delays are set with inline styles so Tailwind doesn't need to generate them)
  const enter = `transition-all duration-700 ease-out motion-reduce:transition-none ${mounted
      ? "translate-y-0 opacity-100"
      : "translate-y-8 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
    }`;

  return (
    <main className="w-full overflow-hidden bg-white pb-24 lg:pb-0">

      {/* ================= HERO ================= */}

      <section className="relative isolate h-[calc(100vh-100px)] min-h-[650px] max-h-[900px] overflow-hidden bg-slate-950">

        {/* Background video */}
        <video
          src="/landing.mp4"
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 h-full w-full object-cover
                        transition-transform duration-[5000ms] ease-out motion-reduce:transition-none
                        ${mounted ? "scale-100" : "scale-110"}`}
        />

        {/* Dark gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />

        {/* Decorative glow */}
        <div className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-[120px]" />

        {/* Hero content */}
        <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl items-center px-6 py-24">

          <div className="max-w-3xl text-white">

            <h1
              className={`${enter} mt-7 text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl`}
              style={{ transitionDelay: "150ms" }}
            >
              Power your
              <br />
              next big
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
                build.
              </span>
            </h1>

            <p
              className={`${enter} mt-7 max-w-xl text-base leading-8 text-slate-300 sm:text-lg`}
              style={{ transitionDelay: "300ms" }}
            >
              Discover powerful processors, graphics cards, memory and more. Everything you need
              to build your dream PC starts here.
            </p>

            <div
              className={`${enter} mt-9 flex flex-wrap items-center gap-4`}
              style={{ transitionDelay: "500ms" }}
            >
              <Link
                to="/products"
                className="group inline-flex items-center gap-3 rounded-xl bg-blue-600 px-7 py-4
                                           font-bold text-white shadow-xl shadow-blue-600/30 transition-all
                                           duration-300 hover:-translate-y-1 hover:bg-blue-500
                                           hover:shadow-blue-500/40 active:scale-95"
              >
                Explore Products
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>

              <button
                type="button"
                onClick={scrollToCategories}
                className="inline-flex items-center gap-2 rounded-xl border border-white/25
                                           bg-white/10 px-7 py-4 font-semibold text-white backdrop-blur-md
                                           transition hover:bg-white/20 active:scale-95"
              >
                Browse Categories
                <FiChevronDown />
              </button>
            </div>

            {/* Small hero highlights */}
            <div
              className={`${enter} mt-14 flex flex-wrap gap-8 border-t border-white/15 pt-7`}
              style={{ transitionDelay: "650ms" }}
            >
              <div>
                <p className="text-2xl font-bold text-white">Quality</p>
                <p className="mt-1 text-xs text-slate-400">Trusted components</p>
              </div>

              <div>
                <p className="text-2xl font-bold text-white">Value</p>
                <p className="mt-1 text-xs text-slate-400">Competitive prices</p>
              </div>

              <div>
                <p className="text-2xl font-bold text-white">Support</p>
                <p className="mt-1 text-xs text-slate-400">Here to help</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator (desktop only, the mobile bottom bar covers this area) */}
        <button
          type="button"
          onClick={scrollToCategories}
          aria-label="Scroll to categories"
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-2xl text-white/70
                               transition hover:text-white motion-safe:animate-bounce lg:block"
        >
          <FiChevronDown />
        </button>
      </section>

      {/* ================= CATEGORIES ================= */}

      <section id="categories" className="relative bg-slate-50 px-6 py-24">

        <div className="mx-auto max-w-7xl">

          <Reveal>
            <SectionHeading
              eyebrow="Explore hardware"
              title="Find your components"
              description="From essential PC components to powerful upgrades, discover the hardware that brings your setup to life."
            />
          </Reveal>

          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">

            {categories.map((cat, index) => (
              <Reveal key={cat.value} delay={index * 80}>
                <Link
                  to={`/products?category=${cat.value}`}
                  className="group relative flex h-full min-h-[190px] flex-col items-start
                                               justify-between overflow-hidden rounded-2xl border border-slate-200
                                               bg-white p-6 shadow-sm transition-all duration-300
                                               hover:-translate-y-2 hover:border-accent hover:shadow-xl"
                >
                  <span
                    className="absolute right-4 top-3 text-4xl font-black text-slate-100
                                                   transition-colors group-hover:text-blue-50"
                  >
                    {cat.number}
                  </span>

                  <span
                    className="relative flex h-14 w-14 items-center justify-center rounded-xl
                                                   bg-blue-50 text-2xl text-accent transition-all duration-300
                                                   group-hover:bg-accent group-hover:text-white"
                  >
                    {cat.icon}
                  </span>

                  <div className="relative mt-8 w-full">
                    <h3 className="font-bold text-slate-800 transition-colors group-hover:text-accent">
                      {cat.label}
                    </h3>

                    <div className="mt-3 flex items-center justify-between text-accent">
                      <span className="text-xs font-semibold">Explore</span>
                      <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}

      <section className="bg-white px-6 py-24">

        <div className="mx-auto max-w-7xl">

          <Reveal>
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

              <div className="text-left">
                <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  <FiStar />
                  Featured
                </span>

                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  Featured products
                </h2>

                <p className="mt-3 max-w-lg text-sm leading-7 text-slate-500">
                  Check out some of the components available in our store.
                </p>
              </div>

              <Link
                to="/products"
                className="group inline-flex items-center gap-2 font-bold text-accent
                                           transition hover:brightness-125"
              >
                View all products
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-12 flex flex-wrap justify-center gap-6 lg:justify-start">

            {loadingFeatured &&
              [0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[400px] w-72 animate-pulse rounded-2xl bg-slate-100"
                />
              ))}

            {!loadingFeatured &&
              featured.map((product, index) => (
                <Reveal key={product._id || product.productId} delay={index * 100}>
                  <ProductCard product={product} />
                </Reveal>
              ))}

            {!loadingFeatured && featured.length === 0 && (
              <div className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
                <FiShoppingBag className="mx-auto text-4xl text-slate-300" />
                <h3 className="mt-4 font-bold text-slate-700">
                  No featured products available
                </h3>
                <p className="mt-2 text-sm text-slate-500">Please check back later.</p>
                <Link
                  to="/products"
                  className="mt-5 inline-block font-semibold text-accent hover:brightness-125"
                >
                  Browse all products →
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}

      <section className="bg-slate-50 px-6 py-24">

        <div className="mx-auto max-w-7xl">

          <Reveal>
            <SectionHeading
              eyebrow="The TechMart advantage"
              title="Why shop with us?"
              description="We make finding the right computer components simple, convenient and reliable."
            />
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {features.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 100}>
                <div
                  className="group h-full rounded-2xl border border-slate-200 bg-white p-7
                                               shadow-sm transition-all duration-300 hover:-translate-y-2
                                               hover:border-accent hover:shadow-xl"
                >
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50
                                                   text-2xl text-accent transition-all duration-300
                                                   group-hover:bg-accent group-hover:text-white"
                  >
                    {feature.icon}
                  </span>

                  <h3 className="mt-6 text-lg font-bold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {feature.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CONTACT BANNER (closing section) ================= */}

      <section className="bg-white px-6 py-20">
        <Reveal>
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-slate-950 px-8 py-16 sm:px-14 lg:py-20">

            <div className="absolute -right-20 -top-32 h-96 w-96 rounded-full bg-blue-600/30 blur-[100px]" />
            <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-cyan-500/20 blur-[100px]" />

            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                <FiZap />
                Build without limits
              </span>

              <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white sm:text-5xl">
                Your dream setup.
                <span className="block text-blue-400">
                  Starts with the right parts.
                </span>
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-slate-400">
                Not sure which components are right for you? Our team is ready to help you
                find the perfect hardware for your needs and budget.
              </p>

              <Link
                to="/contact-us"
                className="group mt-8 inline-flex items-center gap-3 rounded-xl bg-blue-600 px-7 py-4
                                           font-bold text-white transition-all hover:-translate-y-1
                                           hover:bg-blue-500 active:scale-95"
              >
                Talk to our team
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

    </main>
  );
}