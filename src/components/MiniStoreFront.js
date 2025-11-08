import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Search, Minus, Plus, Trash2, X, Star, } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "./ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, } from "./ui/sheet";
// ---------- Demo Data ----------
const PRODUCTS = [
    {
        id: "p-aurora",
        name: "Aurora Hoodie",
        price: 64.99,
        image: "https://res.cloudinary.com/marshalcloudinary/image/upload/v1762628235/17thmotif/583E8B1E-094E-44B3-9E24-1DB6F8F31CAE_axeu7e.jpg",
        description: "A soft, mid‑weight hoodie with a brushed interior and a relaxed silhouette. Sustainably dyed and pre‑shrunk for the perfect fit.",
        rating: 4.6,
        badge: "Bestseller",
        category: "Apparel",
    },
    {
        id: "p-lumen",
        name: "Lumen Desk Lamp",
        price: 39.0,
        image: "https://res.cloudinary.com/marshalcloudinary/image/upload/v1762628235/17thmotif/583E8B1E-094E-44B3-9E24-1DB6F8F31CAE_axeu7e.jpg",
        description: "Minimal LED lamp with adjustable arm, touch dimmer, and warm white glow. Ideal for late‑night creative sprints.",
        rating: 4.3,
        badge: "New",
        category: "Home",
    },
    {
        id: "p-orbit",
        name: "Orbit Wireless Earbuds",
        price: 89.99,
        image: "https://res.cloudinary.com/marshalcloudinary/image/upload/v1762628235/17thmotif/583E8B1E-094E-44B3-9E24-1DB6F8F31CAE_axeu7e.jpg",
        description: "Noise‑isolating true wireless earbuds with 32‑hour battery life and snug, all‑day comfort.",
        rating: 4.7,
        badge: "Limited",
        category: "Audio",
    },
    {
        id: "p-canvas",
        name: "Canvas Tote",
        price: 24.5,
        image: "https://res.cloudinary.com/marshalcloudinary/image/upload/v1762628235/17thmotif/583E8B1E-094E-44B3-9E24-1DB6F8F31CAE_axeu7e.jpg",
        description: "Heavyweight organic cotton tote with reinforced seams and an oversized inner pocket.",
        rating: 4.2,
        category: "Accessories",
    },
    {
        id: "p-bottle",
        name: "Glacier Water Bottle",
        price: 29.99,
        image: "https://res.cloudinary.com/marshalcloudinary/image/upload/v1762628235/17thmotif/583E8B1E-094E-44B3-9E24-1DB6F8F31CAE_axeu7e.jpg",
        description: "Double‑wall insulated stainless bottle. Stays cold 24h / hot 12h. Leak‑proof, backpack‑ready.",
        rating: 4.5,
        category: "Outdoor",
    },
    {
        id: "p-notebook",
        name: "Grid Notebook",
        price: 12.0,
        image: "https://res.cloudinary.com/marshalcloudinary/image/upload/v1762628235/17thmotif/583E8B1E-094E-44B3-9E24-1DB6F8F31CAE_axeu7e.jpg",
        description: "Dot‑grid notebook on 120gsm paper. Lay‑flat binding, numbered pages, and index spread.",
        rating: 4.1,
        category: "Stationery",
    },
];
// ---------- Utilities ----------
const fmt = (n) => new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
}).format(n);
function Stars({ value }) {
    const full = Math.floor(value);
    const half = value - full >= 0.5;
    const arr = new Array(5).fill(0).map((_, i) => i);
    return (_jsxs("div", { className: "flex items-center gap-0.5", "aria-label": `${value.toFixed(1)} out of 5`, children: [arr.map((i) => (_jsx(Star, { size: 16, className: `stroke-amber-500 ${i < full
                    ? "fill-amber-500"
                    : i === full && half
                        ? "fill-amber-500/50"
                        : ""}` }, i))), _jsxs("span", { className: "sr-only", children: [value.toFixed(1), " stars"] })] }));
}
// ---------- Component ----------
export default function MiniStorefront() {
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(null);
    const [cartOpen, setCartOpen] = useState(false);
    const [cart, setCart] = useState({});
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q)
            return PRODUCTS;
        return PRODUCTS.filter((p) => p.name.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q));
    }, [query]);
    const total = useMemo(() => Object.values(cart).reduce((sum, it) => sum + it.product.price * it.qty, 0), [cart]);
    const addToCart = (product, qty = 1) => {
        setCart((prev) => {
            const existing = prev[product.id];
            const nextQty = (existing?.qty ?? 0) + qty;
            return {
                ...prev,
                [product.id]: { product, qty: nextQty },
            };
        });
    };
    const updateQty = (id, delta) => {
        setCart((prev) => {
            const next = { ...prev };
            const item = next[id];
            if (!item)
                return prev;
            const newQty = item.qty + delta;
            if (newQty <= 0)
                delete next[id];
            else
                next[id] = { ...item, qty: newQty };
            return next;
        });
    };
    const removeItem = (id) => {
        setCart((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900", children: [_jsx("header", { className: "sticky top-0 z-40 backdrop-blur bg-white/70 border-b", children: _jsxs("div", { className: "max-w-7xl mx-auto flex items-center gap-4 p-4", children: [_jsx(Logo, {}), _jsxs("div", { className: "mr-auto", children: [_jsx("h1", { className: "text-xl sm:text-2xl font-semibold tracking-tight", children: "17th Motif" }), _jsx("p", { className: "text-xs text-slate-500", children: "Everyday things, delightfully made" })] }), _jsx("div", { className: "hidden md:flex items-center gap-2", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" }), _jsx("input", { value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Search products\u2026", className: "pl-9 pr-3 py-2 rounded-xl border bg-white shadow-inner outline-none focus:ring-2 ring-slate-200" })] }) }), _jsxs(Sheet, { open: cartOpen, onOpenChange: setCartOpen, children: [_jsx(SheetTrigger, { asChild: true, children: _jsxs(Button, { variant: "secondary", className: "rounded-2xl", children: [_jsx(ShoppingCart, { className: "mr-2 h-4 w-4" }), "Cart", Object.keys(cart).length > 0 && (_jsx("span", { className: "ml-2 inline-flex items-center justify-center text-xs px-2 py-0.5 rounded-full bg-slate-900 text-white", children: Object.values(cart).reduce((n, i) => n + i.qty, 0) }))] }) }), _jsxs(SheetContent, { side: "right", className: "w-[92vw] sm:w-[480px]", children: [_jsx(SheetHeader, { children: _jsx(SheetTitle, { children: "Your Cart" }) }), _jsx("div", { className: "mt-4 space-y-4", children: Object.values(cart).length === 0 ? (_jsx("p", { className: "text-sm text-slate-500", children: "Your cart is empty." })) : (_jsxs("div", { className: "space-y-4", children: [Object.values(cart).map((item) => (_jsxs("div", { className: "flex gap-3", children: [_jsx("img", { src: item.product.image, alt: item.product.name, className: "h-16 w-16 rounded-xl object-cover border" }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium leading-tight", children: item.product.name }), _jsx("p", { className: "text-xs text-slate-500", children: fmt(item.product.price) })] }), _jsx("button", { className: "p-1 rounded-lg hover:bg-slate-100", onClick: () => removeItem(item.product.id), "aria-label": "Remove item", children: _jsx(Trash2, { className: "h-4 w-4" }) })] }), _jsxs("div", { className: "mt-2 inline-flex items-center rounded-full border px-2", children: [_jsx("button", { className: "p-1", onClick: () => updateQty(item.product.id, -1), "aria-label": "Decrease quantity", children: _jsx(Minus, { className: "h-4 w-4" }) }), _jsx("span", { className: "px-3 text-sm tabular-nums", children: item.qty }), _jsx("button", { className: "p-1", onClick: () => updateQty(item.product.id, 1), "aria-label": "Increase quantity", children: _jsx(Plus, { className: "h-4 w-4" }) })] })] })] }, item.product.id))), _jsxs("div", { className: "border-t pt-4 flex items-center justify-between", children: [_jsx("p", { className: "text-sm text-slate-500", children: "Subtotal" }), _jsx("p", { className: "text-lg font-semibold", children: fmt(total) })] }), _jsx(Button, { className: "w-full rounded-2xl", disabled: true, children: "Checkout (demo)" })] })) })] })] })] }) }), _jsx("div", { className: "md:hidden px-4 mt-4", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" }), _jsx("input", { value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Search products\u2026", className: "w-full pl-9 pr-3 py-2 rounded-xl border bg-white shadow-inner outline-none focus:ring-2 ring-slate-200" })] }) }), _jsxs("main", { className: "max-w-7xl mx-auto p-4 sm:p-6", children: [_jsxs("div", { className: "flex items-baseline justify-between mb-4", children: [_jsx("h2", { className: "text-lg font-semibold tracking-tight", children: "Featured" }), _jsxs("p", { className: "text-sm text-slate-500", children: [filtered.length, " item(s)"] })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6", children: filtered.map((p) => (_jsx(motion.div, { whileHover: { y: -4 }, transition: { type: "spring", stiffness: 300, damping: 20 }, children: _jsxs(Card, { className: "rounded-2xl overflow-hidden border shadow-sm", children: [_jsx(CardHeader, { className: "p-0", children: _jsxs("div", { className: "relative", children: [_jsx("img", { src: p.image, alt: p.name, className: "h-56 w-full object-cover", loading: "lazy" }), p.badge && (_jsx("span", { className: "absolute left-3 top-3 text-xs px-2.5 py-1 rounded-full bg-black/80 text-white", children: p.badge }))] }) }), _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx(CardTitle, { className: "text-base leading-tight", children: p.name }), _jsxs("div", { className: "mt-1 flex items-center gap-2", children: [_jsx(Stars, { value: p.rating }), _jsx("span", { className: "text-xs text-slate-500", children: p.rating.toFixed(1) })] })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "font-semibold", children: fmt(p.price) }), _jsx("p", { className: "text-xs text-slate-500", children: p.category })] })] }), _jsxs("div", { className: "mt-4 flex gap-2", children: [_jsx(Button, { variant: "secondary", className: "rounded-xl flex-1", onClick: () => setActive(p), children: "Quick view" }), _jsxs(Button, { className: "rounded-xl", onClick: () => addToCart(p), children: [_jsx(ShoppingCart, { className: "h-4 w-4 mr-2" }), " Add"] })] })] })] }) }, p.id))) })] }), _jsx(Dialog, { open: !!active, onOpenChange: (v) => !v && setActive(null), children: _jsx(DialogContent, { className: "sm:max-w-[720px] rounded-2xl", children: active && (_jsxs(_Fragment, { children: [_jsx(DialogHeader, { children: _jsxs(DialogTitle, { className: "flex items-center justify-between", children: [_jsx("span", { children: active.name }), _jsx("button", { className: "p-1 rounded-lg hover:bg-slate-100", onClick: () => setActive(null), "aria-label": "Close", children: _jsx(X, { className: "h-5 w-5" }) })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsx("img", { src: active.image, alt: active.name, className: "w-full h-72 object-cover rounded-xl border" }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Stars, { value: active.rating }), _jsxs("span", { className: "text-xs text-slate-500", children: [active.rating.toFixed(1), " \u2022 ", active.category] })] }), _jsx("p", { className: "mt-3 text-sm text-slate-600 leading-relaxed", children: active.description }), _jsx("p", { className: "mt-4 text-2xl font-semibold", children: fmt(active.price) }), _jsxs("div", { className: "mt-4 flex gap-2", children: [_jsxs(Button, { className: "rounded-xl flex-1", onClick: () => addToCart(active), children: [_jsx(ShoppingCart, { className: "h-4 w-4 mr-2" }), " Add to cart"] }), _jsx(Button, { variant: "secondary", className: "rounded-xl", onClick: () => {
                                                            addToCart(active);
                                                            setCartOpen(true);
                                                        }, children: "Buy now" })] })] })] })] })) }) }), _jsxs("footer", { className: "max-w-7xl mx-auto p-6 text-center text-xs text-slate-500", children: ["\u00A9 ", new Date().getFullYear(), " 17th Motif"] })] }));
}
function Logo() {
    return (_jsx("div", { className: "flex items-center justify-center h-10 w-10 overflow-hidden rounded-2xl bg-white shadow-md border", children: _jsx("img", { src: "https://res.cloudinary.com/marshalcloudinary/image/upload/v1762626491/17thmotif/IMG_4287_ms1keh.jpg", alt: "Company Logo", className: "h-full w-full object-contain p-1", loading: "lazy" }) }));
}
