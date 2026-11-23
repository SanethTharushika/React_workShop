import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronUp, FiHome, FiLogOut, FiUser } from "react-icons/fi";

/* Profile picture, with the first letter as a fallback when it is missing or fails to load */
function Avatar({ user }) {
    const [failed, setFailed] = useState(false);
    const initial = (user.firstName || user.email || "A").charAt(0).toUpperCase();

    if (user.image && !failed) {
        return (
            <img
                src={user.image}
                alt=""
                onError={() => setFailed(true)}
                className="h-9 w-9 shrink-0 rounded-full object-cover"
            />
        );
    }

    return (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
            {initial}
        </span>
    );
}

const itemClass =
    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors " +
    "duration-200 focus-visible:outline-none";

export default function AdminAccountMenu({ user, onLogout, onNavigate }) {

    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);
    const buttonRef = useRef(null);
    const itemRefs = useRef([]);

    // Close on outside click / touch and on Esc (focus goes back to the card)
    useEffect(() => {
        if (!open) return;

        const onPointer = (e) => {
            if (!wrapperRef.current?.contains(e.target)) setOpen(false);
        };
        const onKey = (e) => {
            if (e.key === "Escape") {
                setOpen(false);
                buttonRef.current?.focus();
            }
        };

        document.addEventListener("mousedown", onPointer);
        document.addEventListener("touchstart", onPointer);
        document.addEventListener("keydown", onKey);

        return () => {
            document.removeEventListener("mousedown", onPointer);
            document.removeEventListener("touchstart", onPointer);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    // Move focus into the popup when it opens
    useEffect(() => {
        if (!open) return;
        const timer = setTimeout(() => itemRefs.current[0]?.focus(), 30);
        return () => clearTimeout(timer);
    }, [open]);

    // Skeleton card while the user data loads, with the same height as the real card (no layout jump)
    if (!user) {
        return (
            <div className="flex h-[60px] items-center gap-3 rounded-xl bg-gray-50 px-3">
                <span className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
                </div>
            </div>
        );
    }

    const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "Admin";

    function onButtonKeyDown(e) {
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
        }
    }

    function onMenuKeyDown(e) {
        const items = itemRefs.current.filter(Boolean);
        const index = items.indexOf(document.activeElement);

        if (e.key === "ArrowDown") {
            e.preventDefault();
            items[(index + 1) % items.length]?.focus();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            items[(index - 1 + items.length) % items.length]?.focus();
        } else if (e.key === "Home") {
            e.preventDefault();
            items[0]?.focus();
        } else if (e.key === "End") {
            e.preventDefault();
            items[items.length - 1]?.focus();
        } else if (e.key === "Tab") {
            setOpen(false);
        }
    }

    function chooseLink() {
        setOpen(false);
        onNavigate?.();
    }

    return (
        <div ref={wrapperRef} className="relative">

            {/* Popup (opens upward, same width as the card) */}
            <div
                id="admin-account-menu"
                role="menu"
                aria-label="Account menu"
                onKeyDown={onMenuKeyDown}
                className={`absolute bottom-full left-0 right-0 mb-2 origin-bottom rounded-xl border border-gray-100
                            bg-white p-1.5 shadow-xl transition-[opacity,transform,visibility] duration-200
                            ${open
                        ? "visible translate-y-0 opacity-100"
                        : "pointer-events-none invisible translate-y-2 opacity-0"}`}
            >
                <Link
                    to="/"
                    role="menuitem"
                    tabIndex={-1}
                    ref={(el) => (itemRefs.current[0] = el)}
                    onClick={chooseLink}
                    className={`${itemClass} text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100`}
                >
                    <FiHome className="text-lg" />
                    Back to store
                </Link>

                <Link
                    to="/settings"
                    role="menuitem"
                    tabIndex={-1}
                    ref={(el) => (itemRefs.current[1] = el)}
                    onClick={chooseLink}
                    className={`${itemClass} text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100`}
                >
                    <FiUser className="text-lg" />
                    My account
                </Link>

                <div className="my-1 border-t border-gray-100" />

                <button
                    type="button"
                    role="menuitem"
                    tabIndex={-1}
                    ref={(el) => (itemRefs.current[2] = el)}
                    onClick={() => {
                        setOpen(false);
                        onLogout();
                    }}
                    className={`${itemClass} text-red-600 hover:bg-red-50 focus-visible:bg-red-50`}
                >
                    <FiLogOut className="text-lg" />
                    Logout
                </button>
            </div>

            {/* Account card (toggles the popup) */}
            <button
                ref={buttonRef}
                type="button"
                aria-haspopup="menu"
                aria-expanded={open}
                aria-controls="admin-account-menu"
                onClick={() => setOpen((value) => !value)}
                onKeyDown={onButtonKeyDown}
                className={`flex h-[60px] w-full items-center gap-3 rounded-xl px-3 text-left transition-all duration-200
                            hover:bg-gray-100 active:scale-[0.98]
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                            ${open ? "bg-gray-100" : "bg-gray-50"}`}
            >
                <Avatar user={user} />

                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-800">{fullName}</p>
                    <p className="truncate text-xs text-gray-500">{user.email}</p>
                </div>

                <FiChevronUp
                    className={`shrink-0 text-lg text-gray-400 transition-transform duration-300
                                ${open ? "rotate-180 text-accent" : ""}`}
                />
            </button>
        </div>
    );
}