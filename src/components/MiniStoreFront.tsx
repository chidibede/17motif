import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Minus,
  Plus,
  Trash2,
  X,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

// ---------- Types ----------

type Product = {
  id: string;
  name: string;
  price: number; // in minor currency units or float? We'll keep as number of the currency
  image: string;
  description: string;
  rating: number; // 0-5
  badge?: string;
  category?: string;
};

type CartItem = {
  product: Product;
  qty: number;
};

// ---------- Demo Data ----------

const PRODUCTS: Product[] = [
  {
    id: "p-aurora",
    name: "Aurora Hoodie",
    price: 64.99,
    image:
      "https://res.cloudinary.com/marshalcloudinary/image/upload/v1762628235/17thmotif/583E8B1E-094E-44B3-9E24-1DB6F8F31CAE_axeu7e.jpg",
    description:
      "A soft, mid‑weight hoodie with a brushed interior and a relaxed silhouette. Sustainably dyed and pre‑shrunk for the perfect fit.",
    rating: 4.6,
    badge: "Bestseller",
    category: "Apparel",
  },
  {
    id: "p-lumen",
    name: "Lumen Desk Lamp",
    price: 39.0,
    image:
      "https://res.cloudinary.com/marshalcloudinary/image/upload/v1762628235/17thmotif/583E8B1E-094E-44B3-9E24-1DB6F8F31CAE_axeu7e.jpg",
    description:
      "Minimal LED lamp with adjustable arm, touch dimmer, and warm white glow. Ideal for late‑night creative sprints.",
    rating: 4.3,
    badge: "New",
    category: "Home",
  },
  {
    id: "p-orbit",
    name: "Orbit Wireless Earbuds",
    price: 89.99,
    image:
      "https://res.cloudinary.com/marshalcloudinary/image/upload/v1762628235/17thmotif/583E8B1E-094E-44B3-9E24-1DB6F8F31CAE_axeu7e.jpg",
    description:
      "Noise‑isolating true wireless earbuds with 32‑hour battery life and snug, all‑day comfort.",
    rating: 4.7,
    badge: "Limited",
    category: "Audio",
  },
  {
    id: "p-canvas",
    name: "Canvas Tote",
    price: 24.5,
    image:
      "https://res.cloudinary.com/marshalcloudinary/image/upload/v1762628235/17thmotif/583E8B1E-094E-44B3-9E24-1DB6F8F31CAE_axeu7e.jpg",
    description:
      "Heavyweight organic cotton tote with reinforced seams and an oversized inner pocket.",
    rating: 4.2,
    category: "Accessories",
  },
  {
    id: "p-bottle",
    name: "Glacier Water Bottle",
    price: 29.99,
    image:
      "https://res.cloudinary.com/marshalcloudinary/image/upload/v1762628235/17thmotif/583E8B1E-094E-44B3-9E24-1DB6F8F31CAE_axeu7e.jpg",
    description:
      "Double‑wall insulated stainless bottle. Stays cold 24h / hot 12h. Leak‑proof, backpack‑ready.",
    rating: 4.5,
    category: "Outdoor",
  },
  {
    id: "p-notebook",
    name: "Grid Notebook",
    price: 12.0,
    image:
      "https://res.cloudinary.com/marshalcloudinary/image/upload/v1762628235/17thmotif/583E8B1E-094E-44B3-9E24-1DB6F8F31CAE_axeu7e.jpg",
    description:
      "Dot‑grid notebook on 120gsm paper. Lay‑flat binding, numbered pages, and index spread.",
    rating: 4.1,
    category: "Stationery",
  },
];

// ---------- Utilities ----------

const fmt = (n: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(n);

function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const arr = new Array(5).fill(0).map((_, i) => i);
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${value.toFixed(1)} out of 5`}
    >
      {arr.map((i) => (
        <Star
          key={i}
          size={16}
          className={`stroke-amber-500 ${
            i < full
              ? "fill-amber-500"
              : i === full && half
              ? "fill-amber-500/50"
              : ""
          }`}
        />
      ))}
      <span className="sr-only">{value.toFixed(1)} stars</span>
    </div>
  );
}

// ---------- Component ----------

export default function MiniStorefront() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, CartItem>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCTS;
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }, [query]);

  const total = useMemo(
    () =>
      Object.values(cart).reduce(
        (sum, it) => sum + it.product.price * it.qty,
        0
      ),
    [cart]
  );

  const addToCart = (product: Product, qty = 1) => {
    setCart((prev) => {
      const existing = prev[product.id];
      const nextQty = (existing?.qty ?? 0) + qty;
      return {
        ...prev,
        [product.id]: { product, qty: nextQty },
      };
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => {
      const next = { ...prev };
      const item = next[id];
      if (!item) return prev;
      const newQty = item.qty + delta;
      if (newQty <= 0) delete next[id];
      else next[id] = { ...item, qty: newQty };
      return next;
    });
  };

  const removeItem = (id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b">
        <div className="max-w-7xl mx-auto flex items-center gap-4 p-4">
          <Logo />
          <div className="mr-auto">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
              17th Motif
            </h1>
            <p className="text-xs text-slate-500">
              Everyday things, delightfully made
            </p>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="pl-9 pr-3 py-2 rounded-xl border bg-white shadow-inner outline-none focus:ring-2 ring-slate-200"
              />
            </div>
          </div>

          {/* Cart */}
          <Sheet open={cartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
              <Button variant="secondary" className="rounded-2xl">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Cart
                {Object.keys(cart).length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center text-xs px-2 py-0.5 rounded-full bg-slate-900 text-white">
                    {Object.values(cart).reduce((n, i) => n + i.qty, 0)}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[92vw] sm:w-[480px]">
              <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                {Object.values(cart).length === 0 ? (
                  <p className="text-sm text-slate-500">Your cart is empty.</p>
                ) : (
                  <div className="space-y-4">
                    {Object.values(cart).map((item) => (
                      <div key={item.product.id} className="flex gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-16 w-16 rounded-xl object-cover border"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium leading-tight">
                                {item.product.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {fmt(item.product.price)}
                              </p>
                            </div>
                            <button
                              className="p-1 rounded-lg hover:bg-slate-100"
                              onClick={() => removeItem(item.product.id)}
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="mt-2 inline-flex items-center rounded-full border px-2">
                            <button
                              className="p-1"
                              onClick={() => updateQty(item.product.id, -1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-3 text-sm tabular-nums">
                              {item.qty}
                            </span>
                            <button
                              className="p-1"
                              onClick={() => updateQty(item.product.id, 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-4 flex items-center justify-between">
                      <p className="text-sm text-slate-500">Subtotal</p>
                      <p className="text-lg font-semibold">{fmt(total)}</p>
                    </div>
                    <Button className="w-full rounded-2xl" disabled>
                      Checkout (demo)
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Mobile search */}
      <div className="md:hidden px-4 mt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-9 pr-3 py-2 rounded-xl border bg-white shadow-inner outline-none focus:ring-2 ring-slate-200"
          />
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-lg font-semibold tracking-tight">Featured</h2>
          <p className="text-sm text-slate-500">{filtered.length} item(s)</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map((p) => (
            <motion.div
              key={p.id}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="rounded-2xl overflow-hidden border shadow-sm">
                <CardHeader className="p-0">
                  <div className="relative">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-56 w-full object-cover"
                      loading="lazy"
                    />
                    {p.badge && (
                      <span className="absolute left-3 top-3 text-xs px-2.5 py-1 rounded-full bg-black/80 text-white">
                        {p.badge}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-base leading-tight">
                        {p.name}
                      </CardTitle>
                      <div className="mt-1 flex items-center gap-2">
                        <Stars value={p.rating} />
                        <span className="text-xs text-slate-500">
                          {p.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{fmt(p.price)}</p>
                      <p className="text-xs text-slate-500">{p.category}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="secondary"
                      className="rounded-xl flex-1"
                      onClick={() => setActive(p)}
                    >
                      Quick view
                    </Button>
                    <Button className="rounded-xl" onClick={() => addToCart(p)}>
                      <ShoppingCart className="h-4 w-4 mr-2" /> Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Product Dialog */}
      <Dialog open={!!active} onOpenChange={(v) => !v && setActive(null)}>
        <DialogContent className="sm:max-w-[720px] rounded-2xl">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{active.name}</span>
                  <button
                    className="p-1 rounded-lg hover:bg-slate-100"
                    onClick={() => setActive(null)}
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <img
                  src={active.image}
                  alt={active.name}
                  className="w-full h-72 object-cover rounded-xl border"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <Stars value={active.rating} />
                    <span className="text-xs text-slate-500">
                      {active.rating.toFixed(1)} • {active.category}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {active.description}
                  </p>

                  <p className="mt-4 text-2xl font-semibold">
                    {fmt(active.price)}
                  </p>

                  <div className="mt-4 flex gap-2">
                    <Button
                      className="rounded-xl flex-1"
                      onClick={() => addToCart(active)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" /> Add to cart
                    </Button>
                    <Button
                      variant="secondary"
                      className="rounded-xl"
                      onClick={() => {
                        addToCart(active);
                        setCartOpen(true);
                      }}
                    >
                      Buy now
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto p-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} 17th Motif
      </footer>
    </div>
  );
}

function Logo() {
  return (
    <div className="flex items-center justify-center h-10 w-10 overflow-hidden rounded-2xl bg-white shadow-md border">
      <img
        src="https://res.cloudinary.com/marshalcloudinary/image/upload/v1762626491/17thmotif/IMG_4287_ms1keh.jpg"
        alt="Company Logo"
        className="h-full w-full object-contain p-1"
        loading="lazy"
      />
    </div>
  );
}

