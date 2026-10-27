import { useState, useRef, useLayoutEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BsCart3 } from "react-icons/bs";
import UserData from "./userData.jsx";
import { IoHomeOutline, IoCubeOutline, IoCartOutline } from "react-icons/io5";
import { CiPhone } from "react-icons/ci";

const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/contact-us", label: "Contact Us" },
];

function isActive(to, pathname) {
    return to === "/" ? pathname === "/" : pathname.startsWith(to);
}

/* ---------- Mobile bottom bar item ---------- */
function MobileNavItem({ to, label, icon, pathname }) {
    const active = isActive(to, pathname);

    return (
        <Link to={to} className="flex h-full w-16 flex-col items-center justify-center">
            <span
                style={active ? { animation: "navPop 450ms cubic-bezier(0.34, 1.56, 0.64, 1)" } : undefined}
                className={`flex items-center justify-center rounded-full text-2xl transition-all duration-300
                            ${active
                        ? "h-12 w-12 -translate-y-3 scale-110 bg-accent text-white shadow-lg"
                        : "h-10 w-10 text-accent"}`}
            >
                {icon}
            </span>
            <span
                className={`text-xs transition-all duration-300
                            ${active ? "-translate-y-2 font-semibold text-accent" : "text-accent/70"}`}
            >
                {label}
            </span>
        </Link>
    );
}

export default function Header() {

    const { pathname } = useLocation();

    const itemRefs = useRef([]);
    const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false });

    // Measure the active desktop link so the pill can slide to it
    useLayoutEffect(() => {

        function measure() {
            const index = navLinks.findIndex((l) => isActive(l.to, pathname));
            const el = itemRefs.current[index];

            if (index === -1 || !el) {
                setIndicator((prev) => ({ ...prev, visible: false }));
                return;
            }

            setIndicator({ left: el.offsetLeft, width: el.offsetWidth, visible: true });
        }

        measure();
        window.addEventListener("resize", measure);
        document.fonts?.ready.then(measure);

        return () => window.removeEventListener("resize", measure);
    }, [pathname]);

    return (

        <>
        <style>{`
            @keyframes navPop {
                0%   { transform: translateY(0) scale(0.8); }
                60%  { transform: translateY(-16px) scale(1.2); }
                100% { transform: translateY(-12px) scale(1.1); }
            }
        `}</style>

        <header className="w-full h-[100px] bg-accent flex items-center justify-center lg:justify-between px-6">

            {/* Logo */}
            <Link to="/" className="w-[90px] h-[70px]">
                <img
                    src="/logo.jpg"
                    alt="Logo"
                    className="w-full h-full object-cover rounded-lg"
                />
            </Link>


            {/* Navigation */}
            <nav className="relative hidden lg:flex items-center gap-2">

                {/* Sliding pill + underline */}
                <span
                    className="absolute top-1/2 h-10 -translate-y-1/2 rounded-full bg-white/15 ring-1 ring-white/20"
                    style={{
                        left: indicator.left,
                        width: indicator.width,
                        opacity: indicator.visible ? 1 : 0,
                        transition:
                            "left 450ms cubic-bezier(0.34, 1.56, 0.64, 1), width 450ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms",
                    }}
                >
                    <span className="absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-white" />
                </span>

                {navLinks.map((link, index) => {
                    const active = isActive(link.to, pathname);
                    return (
                        <Link
                            key={link.to}
                            to={link.to}
                            ref={(el) => (itemRefs.current[index] = el)}
                            className={`relative z-10 rounded-full px-5 py-2 text-sm transition-all duration-300
                                        hover:-translate-y-0.5
                                        ${active
                                    ? "font-semibold text-white"
                                    : "font-medium text-white/70 hover:text-white"}`}
                        >
                            {link.label}
                        </Link>
                    );
                })}

            </nav>


            {/* Cart + User */}
            <div className="justify-center items-center gap-4 hidden lg:flex">

                <Link
                    to="/cart"
                    className={`relative flex items-center justify-center transition-all duration-300 hover:scale-110
                                ${isActive("/cart", pathname) ? "text-white" : "text-white/70 hover:text-white"}`}
                >
                    <BsCart3 size={24} />
                    <span
                        className={`absolute -bottom-2 h-1 w-1 rounded-full bg-white transition-all duration-300
                                    ${isActive("/cart", pathname) ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
                    />
                </Link>

                <UserData />

            </div>

        </header>

        {/* Mobile bottom bar */}
        <div className="fixed bottom-0 left-0 w-full h-[80px] bg-white shadow-2xl flex lg:hidden justify-evenly items-center z-50 ">

            <MobileNavItem to="/" label="Home" icon={<IoHomeOutline />} pathname={pathname} />
            <MobileNavItem to="/products" label="Products" icon={<IoCubeOutline />} pathname={pathname} />
            <MobileNavItem to="/cart" label="Cart" icon={<IoCartOutline />} pathname={pathname} />
            <MobileNavItem to="/contact-us" label="Contact Us" icon={<CiPhone />} pathname={pathname} />

            <UserData />

        </div>

        </>
    );
}