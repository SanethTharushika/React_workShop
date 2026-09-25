import { useEffect, useRef, useState } from "react";

const contacts = [
  {
    title: "Email",
    text: "support@yourstore.lk",
    note: "We reply within one working day",
    d: "M4 6h16v12H4z M4 6l8 7 8-7",
  },
  {
    title: "Phone",
    text: "+94 11 234 5678",
    note: "Mon–Fri, 9:00 AM – 6:00 PM",
    d: "M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z",
  },
  {
    title: "Showroom",
    text: "Colombo, Sri Lanka",
    note: "Open Mon–Sat, 10:00 AM – 7:00 PM",
    d: "M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z M12 12a2 2 0 100-4 2 2 0 000 4z",
  },
];

const topics = ["Order", "Product advice", "Warranty", "Bulk quote"];

const faqs = [
  {
    q: "How long does delivery take?",
    a: "Orders within Colombo usually arrive in 1–2 working days. Island-wide delivery takes 3–5 working days.",
  },
  {
    q: "Do products come with a warranty?",
    a: "Yes. Every item includes the manufacturer's warranty, and we'll help you with the claim process.",
  },
  {
    q: "Can you help me choose compatible parts?",
    a: "Send us your current setup or budget and our team will recommend parts that work together.",
  },
  {
    q: "Do you offer pricing for businesses?",
    a: "Yes. Choose 'Bulk quote' in the form and tell us what you need. We'll send a quote within one working day.",
  },
];

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        shown ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const enter = (delay) =>
    `transition-all duration-700 ease-out motion-reduce:transition-none ${delay} ${
      mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
    }`;

  return (
    <section className="relative isolate h-[72vh] min-h-[480px] w-full overflow-hidden bg-slate-950">
      <div className="hero-grid absolute inset-0 -z-10 opacity-70" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.35),transparent_35%),linear-gradient(135deg,#020817_0%,#0f172a_38%,#111827_100%)]" />
      <div className="absolute left-1/2 top-10 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-400/30 blur-3xl animate-glow" />
      <div className="absolute left-12 top-20 -z-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl animate-float" />
      <div className="absolute bottom-12 right-16 -z-10 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-gradient-to-b from-slate-950/35 via-slate-950/20 to-slate-950/40 px-6 text-center">
        <span className={`rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium tracking-[0.2em] text-sky-100 uppercase backdrop-blur ${enter("delay-0")}`}>
          We usually reply within a day
        </span>

        <h1 className={`text-4xl font-black tracking-tight text-white md:text-6xl ${enter("delay-100")}`}>
          Contact Us
        </h1>

        <p className={`max-w-2xl text-base text-slate-200 md:text-lg ${enter("delay-200")}`}>
          Have questions about a product, an order, or a custom quote? Our team is ready to help you find the right solution.
        </p>

        <div className={`flex flex-wrap items-center justify-center gap-4 ${enter("delay-300")}`}>
          <a
            href="#contact-form"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-accent px-6 py-3 font-medium text-white shadow-[0_18px_40px_rgba(0,26,132,0.35)] transition duration-300 hover:-translate-y-0.5 hover:bg-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95"
          >
            <span className="absolute inset-0 -translate-x-full skew-x-[-22deg] bg-white/20 animate-shine" />
            <span className="relative">Get in Touch</span>
            <svg className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          <a
            href="mailto:support@yourstore.lk"
            className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-medium text-slate-100 transition duration-300 hover:border-sky-200 hover:bg-white/10"
          >
            Email us
          </a>
        </div>
      </div>

      <a href="#contact-form" aria-label="Scroll to contact form" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 transition hover:text-white motion-safe:animate-bounce">
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}

/* ---------------- Contact info cards ---------------- */
function ContactInfo() {
  return (
    <div className="space-y-4">
      {contacts.map((c, i) => (
        <Reveal key={c.title} delay={i * 120}>
          <div className="contact-card group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-[0_18px_35px_rgba(15,23,42,0.04)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[0_20px_40px_rgba(0,26,132,0.12)]">
            <div className="card-icon grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-slate-700 transition duration-300 group-hover:bg-gradient-to-br group-hover:from-accent group-hover:to-accent-dark group-hover:text-white">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={c.d} />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{c.title}</p>
              <p className="font-semibold text-slate-900">{c.text}</p>
              <p className="text-sm text-slate-500">{c.note}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ---------------- Floating-label field ---------------- */
function Field({ id, label, textarea = false, type = "text" }) {
  const base =
    "field-input peer w-full border-b border-slate-300 bg-transparent pb-2 pt-6 text-slate-900 placeholder-transparent outline-none transition duration-300 focus:border-accent";
  return (
    <div className="relative">
      {textarea ? (
        <textarea id={id} name={id} placeholder={label} rows={4} required className={`${base} resize-none`} />
      ) : (
        <input id={id} name={id} type={type} placeholder={label} required className={base} />
      )}
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-0 top-1 text-xs font-medium text-accent transition-all duration-300 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-focus:top-1 peer-focus:text-xs peer-focus:text-accent"
      >
        {label}
      </label>
      <span className="field-focus-ring" />
    </div>
  );
}

/* ---------------- Form ---------------- */
function ContactForm() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [topic, setTopic] = useState(topics[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");
    // TODO: replace with your real API call, e.g.
    // await fetch("/api/contact", { method: "POST", body: JSON.stringify({ ...formData, topic }) });
    setTimeout(() => setStatus("sent"), 1400);
  };

  if (status === "sent") {
    return (
      <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <span className="relative grid h-16 w-16 place-items-center">
          <span className="absolute inset-0 rounded-full bg-emerald-400/40 motion-safe:animate-ping" />
          <span className="relative grid h-16 w-16 place-items-center rounded-full bg-emerald-500 text-white">
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </span>
        </span>
        <h3 className="text-xl font-semibold text-slate-900">Message sent</h3>
        <p className="max-w-xs text-slate-500">Thanks for reaching out. We'll get back to you within one working day.</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-2 rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 active:scale-95"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel space-y-8 rounded-[28px] border border-slate-200/80 bg-white/80 p-8 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
      <div>
        <p className="mb-3 text-sm font-medium text-slate-600">What is this about?</p>
        <div className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTopic(t)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300 active:scale-95 ${
                topic === t
                  ? "border-accent bg-accent text-white shadow-[0_10px_25px_rgba(0,26,132,0.25)]"
                  : "border-slate-300 text-slate-600 hover:border-accent hover:text-accent"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field id="name" label="Full name" />
        <Field id="email" label="Email address" type="email" />
      </div>
      <Field id="message" label="How can we help?" textarea />

      <button
        type="submit"
        disabled={status === "sending"}
        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-accent px-6 py-3.5 font-medium text-white shadow-[0_16px_28px_rgba(0,26,132,0.25)] transition duration-300 hover:-translate-y-0.5 hover:bg-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-80"
      >
        <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />
        {status === "sending" ? (
          <>
            <svg className="relative h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <circle cx="12" cy="12" r="9" className="opacity-25" />
              <path d="M21 12a9 9 0 00-9-9" strokeLinecap="round" />
            </svg>
            <span className="relative">Sending…</span>
          </>
        ) : (
          <span className="relative">Send message</span>
        )}
      </button>
    </form>
  );
}

/* ---------------- FAQ accordion (animated height with grid-rows) ---------------- */
function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <div className="divide-y divide-slate-200 overflow-hidden rounded-[28px] border border-slate-200 bg-white/80 shadow-[0_18px_45px_rgba(15,23,42,0.05)] backdrop-blur-sm">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="transition-colors duration-300 hover:bg-slate-50/80">
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-medium text-slate-900 transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
            >
              {f.q}
              <svg
                className={`h-5 w-5 shrink-0 text-slate-400 transition-all duration-300 ${isOpen ? "rotate-180 text-accent" : ""}`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-slate-600">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Page ---------------- */
export default function ContactUs() {
  return (
    <main className="bg-transparent text-slate-800 scroll-smooth">
      <Hero />

      <section id="contact-form" className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[0.9fr_1.4fr] lg:py-24">
        <div className="space-y-6">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Support
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Talk to our team</h2>
            <p className="mt-3 max-w-md text-base text-slate-600">
              Questions about an order, help choosing parts, or a quote for a bulk build. Send us a message and we'll point you in the right direction.
            </p>
          </Reveal>
          <ContactInfo />
        </div>

        <Reveal delay={150}>
          <div className="animate-float" style={{ animationDelay: "0.3s" }}>
            <ContactForm />
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24">
        <Reveal>
          <h2 className="mb-6 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Frequently asked questions</h2>
          <Faq />
        </Reveal>
      </section>
    </main>
  );
}
