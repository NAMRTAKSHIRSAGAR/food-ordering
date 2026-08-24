import { useState, useEffect, useMemo, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  TARRI — a street-food ordering app                                 */
/*  Design: enamel signboard (teal + mustard + hot pink), kitchen chit */
/* ------------------------------------------------------------------ */

const MENU = [
  { id: 1,  name: "Tarri Poha",        cat: "Poha & Chai", price: 60,  veg: true,  heat: 2, emoji: "🍛", desc: "Flattened rice under a ladle of spiced tarri, raw onion, sev." },
  { id: 2,  name: "Kanda Poha",        cat: "Poha & Chai", price: 45,  veg: true,  heat: 0, emoji: "🍚", desc: "The mild one. Onion, curry leaf, lemon wedge on the side." },
  { id: 3,  name: "Cutting Chai",      cat: "Poha & Chai", price: 15,  veg: true,  heat: 0, emoji: "🫖", desc: "Half glass, boiled thrice, ginger crushed to order." },
  { id: 4,  name: "Irani Chai",        cat: "Poha & Chai", price: 25,  veg: true,  heat: 0, emoji: "☕", desc: "Milk-heavy, slow-brewed, served with a butter bun." },
  { id: 5,  name: "Saoji Mutton",      cat: "Saoji",       price: 320, veg: false, heat: 3, emoji: "🍲", desc: "Black masala, mutton on the bone. Order water separately." },
  { id: 6,  name: "Saoji Chicken",     cat: "Saoji",       price: 280, veg: false, heat: 3, emoji: "🍗", desc: "Same masala, gentler bird. Still not gentle." },
  { id: 7,  name: "Jowar Bhakri",      cat: "Saoji",       price: 40,  veg: true,  heat: 0, emoji: "🫓", desc: "Two pieces, hand-patted, roasted on an open flame." },
  { id: 8,  name: "Pav Bhaji",         cat: "Street",      price: 120, veg: true,  heat: 1, emoji: "🥘", desc: "Mashed on the tawa with butter you can see. Four pav." },
  { id: 9,  name: "Vada Pav",          cat: "Street",      price: 25,  veg: true,  heat: 2, emoji: "🍔", desc: "Dry garlic chutney, one fried chilli in the bag." },
  { id: 10, name: "Misal Pav",         cat: "Street",      price: 90,  veg: true,  heat: 3, emoji: "🥣", desc: "Kat poured at the table. Farsan, onion, lemon." },
  { id: 11, name: "Samosa",            cat: "Street",      price: 20,  veg: true,  heat: 1, emoji: "🥟", desc: "Two per plate, fried at 4pm, gone by 6." },
  { id: 12, name: "Paneer Tikka",      cat: "Tandoor",     price: 220, veg: true,  heat: 1, emoji: "🧀", desc: "Eight cubes, charred edges, mint chutney." },
  { id: 13, name: "Tandoori Chicken",  cat: "Tandoor",     price: 260, veg: false, heat: 2, emoji: "🍖", desc: "Half bird, overnight marinade, onion rings." },
  { id: 14, name: "Orange Barfi",      cat: "Sweets",      price: 150, veg: true,  heat: 0, emoji: "🍊", desc: "Nagpur santra, khoya, 250g box." },
  { id: 15, name: "Matka Kulfi",       cat: "Sweets",      price: 60,  veg: true,  heat: 0, emoji: "🍨", desc: "Set in clay, cardamom and pistachio." },
  { id: 16, name: "Nimbu Soda",        cat: "Drinks",      price: 40,  veg: true,  heat: 0, emoji: "🥤", desc: "Salt or sweet. Say which, or you get salt." },
  { id: 17, name: "Solkadhi",          cat: "Drinks",      price: 50,  veg: true,  heat: 0, emoji: "🥛", desc: "Kokum and coconut. Drink it after the Saoji, not before." },
];

const CATS = ["All", "Poha & Chai", "Saoji", "Street", "Tandoor", "Sweets", "Drinks"];
const DELIVERY_FEE = 29;
const FREE_OVER = 499;

const rupees = (n) => "₹" + n.toLocaleString("en-IN");

/* ------------------------------- CSS ------------------------------- */

const css = `
.tarri { --ink:#042f2e; --ink-2:#0b4744; --paper:#fdfbf5; --paper-2:#f2ece0;
  --mustard:#f5b301; --pink:#d81b60; --lime:#a3e635; --line:#0f5f5b;
  background:var(--ink); color:var(--paper); min-height:100vh;
  font-family:"Karla",system-ui,sans-serif; -webkit-font-smoothing:antialiased; }
.tarri *,.tarri *::before,.tarri *::after { box-sizing:border-box; }
.tarri button { font:inherit; cursor:pointer; border:none; background:none; color:inherit; }
.tarri :focus-visible { outline:3px solid var(--mustard); outline-offset:2px; }

.t-display { font-family:"Anton",Impact,sans-serif; font-weight:400;
  letter-spacing:.01em; text-transform:uppercase; line-height:.92; }
.t-mono { font-family:"Space Mono",ui-monospace,monospace; }

/* --- shell --- */
.t-wrap { max-width:1120px; margin:0 auto; padding:0 20px 200px; }

.t-bar { position:sticky; top:0; z-index:30; background:var(--ink);
  border-bottom:2px solid var(--line); }
.t-bar-in { max-width:1120px; margin:0 auto; padding:14px 20px;
  display:flex; align-items:center; gap:16px; }
.t-logo { font-size:30px; color:var(--mustard); }
.t-logo span { color:var(--pink); }
.t-addr { flex:1; min-width:0; font-size:12px; line-height:1.3; color:#8fd6d0; }
.t-addr b { display:block; color:var(--paper); font-size:13px;
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.t-cartbtn { display:flex; align-items:center; gap:8px; padding:9px 14px;
  background:var(--mustard); color:#1a1200; border-radius:999px;
  font-weight:700; font-size:13px; white-space:nowrap; }
.t-cartbtn:hover { background:#ffc61a; }

/* --- hero --- */
.t-hero { padding:44px 0 30px; border-bottom:2px dashed var(--line); }
.t-eyebrow { font-size:11px; letter-spacing:.22em; color:var(--lime);
  text-transform:uppercase; margin-bottom:14px; }
.t-h1 { font-size:clamp(44px,10vw,104px); margin:0; color:var(--paper); }
.t-h1 em { font-style:normal; color:var(--mustard);
  -webkit-text-stroke:2px var(--mustard); }
.t-sub { margin:18px 0 0; max-width:44ch; color:#a9ded9; font-size:15px; line-height:1.55; }
.t-stats { display:flex; flex-wrap:wrap; gap:10px; margin-top:22px; }
.t-stat { border:1.5px solid var(--line); border-radius:999px;
  padding:7px 14px; font-size:12px; color:#8fd6d0; }
.t-stat b { color:var(--paper); }

/* --- category rail --- */
.t-rail { display:flex; gap:8px; overflow-x:auto; padding:22px 0 18px;
  scrollbar-width:none; }
.t-rail::-webkit-scrollbar { display:none; }
.t-chip { flex:none; padding:9px 16px; border-radius:999px; font-size:13px;
  font-weight:700; border:1.5px solid var(--line); color:#a9ded9;
  transition:background .15s,color .15s; }
.t-chip:hover { border-color:var(--mustard); color:var(--paper); }
.t-chip.is-on { background:var(--paper); color:var(--ink); border-color:var(--paper); }

/* --- menu grid --- */
.t-grid { display:grid; gap:14px; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); }
.t-card { background:var(--paper); color:var(--ink); border-radius:14px;
  padding:16px; display:flex; gap:14px; align-items:flex-start;
  border:2px solid transparent; transition:transform .15s,border-color .15s; }
.t-card:hover { transform:translateY(-3px); border-color:var(--mustard); }
.t-tile { flex:none; width:64px; height:64px; border-radius:10px;
  background:var(--paper-2); display:grid; place-items:center; font-size:30px; }
.t-body { flex:1; min-width:0; }
.t-name { display:flex; align-items:center; gap:7px; font-size:16px;
  font-weight:700; margin:0 0 4px; }
.t-desc { margin:0; font-size:12.5px; line-height:1.5; color:#4b5f5d; }
.t-foot { display:flex; align-items:center; justify-content:space-between;
  gap:10px; margin-top:12px; }
.t-price { font-size:15px; font-weight:700; }
.t-mark { flex:none; width:13px; height:13px; border-radius:2px;
  border:2px solid #16803c; display:grid; place-items:center; }
.t-mark::after { content:""; width:5px; height:5px; border-radius:50%; background:#16803c; }
.t-mark.nonveg { border-color:#b91c1c; }
.t-mark.nonveg::after { background:#b91c1c; }
.t-heat { font-size:10px; letter-spacing:1px; }

.t-add { padding:8px 18px; border-radius:8px; background:var(--ink);
  color:var(--mustard); font-weight:700; font-size:13px; }
.t-add:hover { background:var(--pink); color:#fff; }
.t-step { display:flex; align-items:center; gap:2px; background:var(--ink);
  border-radius:8px; padding:2px; }
.t-step button { width:30px; height:30px; border-radius:6px; color:var(--mustard);
  font-size:17px; line-height:1; }
.t-step button:hover { background:var(--pink); color:#fff; }
.t-step span { min-width:24px; text-align:center; color:var(--paper);
  font-size:13px; font-weight:700; }

.t-empty { border:2px dashed var(--line); border-radius:14px; padding:48px 24px;
  text-align:center; }
.t-empty h3 { font-size:24px; margin:0 0 8px; color:var(--mustard); }
.t-empty p { margin:0 0 18px; color:#8fd6d0; font-size:14px; }
.t-ghost { border:1.5px solid var(--mustard); color:var(--mustard);
  padding:9px 18px; border-radius:999px; font-size:13px; font-weight:700; }

/* --- the chit (signature) --- */
.t-chit { position:fixed; left:0; right:0; bottom:0; z-index:40;
  display:flex; justify-content:center; padding:0 12px 12px;
  pointer-events:none; }
.t-chit-in { width:100%; max-width:440px; background:var(--paper); color:var(--ink);
  border-radius:12px 12px 0 0; pointer-events:auto;
  box-shadow:0 -10px 40px rgba(0,0,0,.45); overflow:hidden;
  animation:t-rise .3s cubic-bezier(.2,.8,.3,1); }
@keyframes t-rise { from { transform:translateY(100%); } to { transform:none; } }
.t-tear { height:10px; background:var(--paper);
  -webkit-mask-image:radial-gradient(circle at 6px 10px,transparent 5px,#000 5.5px);
  mask-image:radial-gradient(circle at 6px 10px,transparent 5px,#000 5.5px);
  -webkit-mask-size:12px 10px; mask-size:12px 10px;
  -webkit-mask-repeat:repeat-x; mask-repeat:repeat-x; }
.t-chit-head { display:flex; align-items:center; justify-content:space-between;
  gap:12px; padding:12px 16px; border-bottom:1.5px dashed #c6bfae; }
.t-chit-head h4 { margin:0; font-size:12px; letter-spacing:.16em;
  text-transform:uppercase; color:#6b6152; }
.t-lines { max-height:38vh; overflow:auto; padding:10px 16px; }
.t-line { display:flex; align-items:center; gap:10px; padding:7px 0;
  font-size:13px; }
.t-line-name { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis;
  white-space:nowrap; }
.t-line-qty { color:#6b6152; }
.t-rule { border-top:1.5px dashed #c6bfae; margin:6px 0; }
.t-tot { display:flex; justify-content:space-between; font-size:12.5px;
  color:#4b5f5d; padding:3px 0; }
.t-tot.grand { font-size:16px; font-weight:700; color:var(--ink); padding-top:8px; }
.t-cta { display:block; width:100%; padding:15px; background:var(--pink);
  color:#fff; font-size:15px; font-weight:700; }
.t-cta:hover { background:#ad1457; }
.t-cta[disabled] { background:#c6bfae; cursor:not-allowed; }
.t-nudge { text-align:center; font-size:11.5px; color:#8a7f6c; padding:0 16px 10px; }

/* --- checkout / confirm sheets --- */
.t-sheet { position:fixed; inset:0; z-index:50; background:rgba(4,47,46,.9);
  display:flex; align-items:flex-end; justify-content:center; padding:16px;
  overflow:auto; }
.t-panel { width:100%; max-width:440px; background:var(--paper); color:var(--ink);
  border-radius:14px; padding:20px; animation:t-rise .3s cubic-bezier(.2,.8,.3,1); }
.t-panel h3 { font-family:"Anton",sans-serif; text-transform:uppercase;
  font-size:26px; margin:0 0 4px; }
.t-panel .t-note { margin:0 0 18px; font-size:13px; color:#4b5f5d; }
.t-label { display:block; font-size:11px; letter-spacing:.16em;
  text-transform:uppercase; color:#6b6152; margin:16px 0 7px; }
.t-input { width:100%; padding:12px 14px; border:1.5px solid #d8d1c1;
  border-radius:9px; background:#fff; font:inherit; font-size:14px; color:var(--ink); }
.t-input:focus { border-color:var(--ink); outline:none; }
.t-pays { display:grid; gap:8px; }
.t-pay { display:flex; align-items:center; gap:10px; padding:12px 14px;
  border:1.5px solid #d8d1c1; border-radius:9px; font-size:14px; text-align:left; }
.t-pay.is-on { border-color:var(--ink); background:#fff; box-shadow:inset 0 0 0 1.5px var(--ink); }
.t-pay b { flex:1; font-weight:600; }
.t-back { font-size:13px; color:#6b6152; text-decoration:underline;
  display:block; width:100%; text-align:center; padding:14px 0 2px; }
.t-err { color:#b91c1c; font-size:12px; margin:8px 0 0; }

/* --- tracking --- */
.t-stampwrap { text-align:center; padding:6px 0 18px; }
.t-stamp { display:inline-block; border:3px solid var(--pink); color:var(--pink);
  border-radius:8px; padding:8px 16px; font-family:"Anton",sans-serif;
  text-transform:uppercase; font-size:20px; transform:rotate(-6deg); }
.t-track { display:grid; gap:2px; margin:8px 0 4px; }
.t-tstep { display:flex; gap:12px; align-items:flex-start; padding:10px 0; opacity:.35; }
.t-tstep.done, .t-tstep.now { opacity:1; }
.t-dot { flex:none; width:22px; height:22px; border-radius:50%;
  border:2px solid var(--ink); display:grid; place-items:center; font-size:11px; }
.t-tstep.done .t-dot { background:var(--ink); color:var(--mustard); }
.t-tstep.now .t-dot { border-color:var(--pink); color:var(--pink); }
.t-tstep h5 { margin:0 0 2px; font-size:14px; }
.t-tstep p { margin:0; font-size:12px; color:#4b5f5d; }

@media (prefers-reduced-motion:reduce) {
  .tarri *, .tarri *::before { animation:none !important; transition:none !important; }
  .t-card:hover { transform:none; }
}
@media (max-width:520px) {
  .t-hero { padding:30px 0 22px; }
  .t-card { padding:13px; gap:11px; }
  .t-tile { width:52px; height:52px; font-size:24px; }
}
`;

/* ----------------------------- helpers ----------------------------- */

function Heat({ level }) {
  if (!level) return null;
  return (
    <span className="t-heat" title={"Spice level " + level + " of 3"}>
      {"🌶".repeat(level)}
    </span>
  );
}

function useGoogleFonts() {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=Anton&family=Karla:wght@400;600;700&family=Space+Mono:wght@400;700&display=swap";
    document.head.appendChild(l);
    return () => l.remove();
  }, []);
}

/* ------------------------------- app ------------------------------- */

export default function TarriApp() {
  useGoogleFonts();

  const [cat, setCat] = useState("All");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState({});
  const [view, setView] = useState("menu"); // menu | checkout | placed
  const [addr, setAddr] = useState("");
  const [pay, setPay] = useState("upi");
  const [err, setErr] = useState("");
  const [stage, setStage] = useState(0);
  const timers = useRef([]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MENU.filter(
      (m) =>
        (cat === "All" || m.cat === cat) &&
        (!q || m.name.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q))
    );
  }, [cat, query]);

  const lines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => ({ item: MENU.find((m) => m.id === +id), qty }))
        .filter((l) => l.item),
    [cart]
  );

  const subtotal = lines.reduce((s, l) => s + l.item.price * l.qty, 0);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const fee = subtotal >= FREE_OVER || subtotal === 0 ? 0 : DELIVERY_FEE;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + fee + tax;

  const bump = (id, by) =>
    setCart((c) => {
      const next = { ...c, [id]: (c[id] || 0) + by };
      if (next[id] <= 0) delete next[id];
      return next;
    });

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const placeOrder = () => {
    if (addr.trim().length < 8) {
      setErr("Add a full address — flat, street, landmark.");
      return;
    }
    setErr("");
    setView("placed");
    setStage(0);
    timers.current = [
      setTimeout(() => setStage(1), 2200),
      setTimeout(() => setStage(2), 5200),
    ];
  };

  const startOver = () => {
    timers.current.forEach(clearTimeout);
    setCart({});
    setAddr("");
    setView("menu");
    setStage(0);
  };

  const TRACK = [
    { t: "Order sent to the kitchen", d: "Chit printed at counter 2." },
    { t: "On the tawa", d: "Cooking now. Roughly 9 minutes." },
    { t: "Out with Ravi", d: "Arriving by 8:41 pm. He calls once, from the gate." },
  ];

  return (
    <div className="tarri">
      <style>{css}</style>

      <header className="t-bar">
        <div className="t-bar-in">
          <div className="t-display t-logo">
            Tar<span>ri</span>
          </div>
          <div className="t-addr">
            Deliver to
            <b>Flat 302, Ramdaspeth, Nagpur</b>
          </div>
          <button
            className="t-cartbtn"
            onClick={() => document.querySelector(".t-chit-in")?.scrollIntoView({ block: "nearest" })}
          >
            🧾 {count === 0 ? "No items" : count + (count === 1 ? " item" : " items")}
          </button>
        </div>
      </header>

      <main className="t-wrap">
        <section className="t-hero">
          <div className="t-eyebrow">Open till 2 am · Ramdaspeth &amp; Sitabuldi</div>
          <h1 className="t-display t-h1">
            Poha at seven.
            <br />
            <em>Saoji at midnight.</em>
          </h1>
          <p className="t-sub">
            Seventeen things, cooked by four families who have been doing it a long
            time. Nothing is frozen and nothing travels more than three kilometres.
          </p>
          <div className="t-stats">
            <span className="t-stat">
              Average delivery <b>22 min</b>
            </span>
            <span className="t-stat">
              Free above <b>{rupees(FREE_OVER)}</b>
            </span>
            <span className="t-stat">
              Kitchens <b>4</b>
            </span>
          </div>
        </section>

        <div className="t-rail" role="tablist" aria-label="Menu sections">
          {CATS.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={cat === c}
              className={"t-chip" + (cat === c ? " is-on" : "")}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <label className="t-label" htmlFor="t-search" style={{ marginTop: 0 }}>
          Search the menu
        </label>
        <input
          id="t-search"
          className="t-input"
          style={{ maxWidth: 340, marginBottom: 22 }}
          placeholder="misal, chai, mutton…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {visible.length === 0 ? (
          <div className="t-empty">
            <h3 className="t-display">Nothing by that name</h3>
            <p>Try “poha”, “chai”, or clear the filters and browse everything.</p>
            <button
              className="t-ghost"
              onClick={() => {
                setQuery("");
                setCat("All");
              }}
            >
              Show the full menu
            </button>
          </div>
        ) : (
          <div className="t-grid">
            {visible.map((m) => (
              <article className="t-card" key={m.id}>
                <div className="t-tile" aria-hidden="true">
                  {m.emoji}
                </div>
                <div className="t-body">
                  <h3 className="t-name">
                    <span
                      className={"t-mark" + (m.veg ? "" : " nonveg")}
                      title={m.veg ? "Vegetarian" : "Non-vegetarian"}
                    />
                    {m.name}
                    <Heat level={m.heat} />
                  </h3>
                  <p className="t-desc">{m.desc}</p>
                  <div className="t-foot">
                    <span className="t-mono t-price">{rupees(m.price)}</span>
                    {cart[m.id] ? (
                      <div className="t-step">
                        <button onClick={() => bump(m.id, -1)} aria-label={"Remove one " + m.name}>
                          −
                        </button>
                        <span className="t-mono">{cart[m.id]}</span>
                        <button onClick={() => bump(m.id, 1)} aria-label={"Add one " + m.name}>
                          +
                        </button>
                      </div>
                    ) : (
                      <button className="t-add" onClick={() => bump(m.id, 1)}>
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* ---------- signature: the running kitchen chit ---------- */}
      {count > 0 && view === "menu" && (
        <div className="t-chit">
          <div className="t-chit-in">
            <div className="t-chit-head">
              <h4 className="t-mono">Chit · Table 0 · Delivery</h4>
              <button
                className="t-mono"
                style={{ fontSize: 12, textDecoration: "underline", color: "#6b6152" }}
                onClick={() => setCart({})}
              >
                Clear
              </button>
            </div>
            <div className="t-lines t-mono">
              {lines.map((l) => (
                <div className="t-line" key={l.item.id}>
                  <span className="t-line-qty">{l.qty}×</span>
                  <span className="t-line-name">{l.item.name}</span>
                  <span>{rupees(l.item.price * l.qty)}</span>
                </div>
              ))}
              <div className="t-rule" />
              <div className="t-tot">
                <span>Subtotal</span>
                <span>{rupees(subtotal)}</span>
              </div>
              <div className="t-tot">
                <span>Delivery</span>
                <span>{fee === 0 ? "Free" : rupees(fee)}</span>
              </div>
              <div className="t-tot">
                <span>Taxes</span>
                <span>{rupees(tax)}</span>
              </div>
              <div className="t-tot grand">
                <span>Total</span>
                <span>{rupees(total)}</span>
              </div>
            </div>
            {fee > 0 && (
              <p className="t-nudge t-mono">
                {rupees(FREE_OVER - subtotal)} more and delivery is free.
              </p>
            )}
            <button className="t-cta" onClick={() => setView("checkout")}>
              Checkout · {rupees(total)}
            </button>
          </div>
        </div>
      )}

      {/* ---------- checkout ---------- */}
      {view === "checkout" && (
        <div className="t-sheet" role="dialog" aria-modal="true" aria-label="Checkout">
          <div className="t-panel">
            <h3>Where to</h3>
            <p className="t-note">
              {count} {count === 1 ? "item" : "items"} · {rupees(total)} · about 22 minutes
            </p>

            <label className="t-label" htmlFor="t-addr">
              Delivery address
            </label>
            <input
              id="t-addr"
              className="t-input"
              placeholder="Flat, street, landmark"
              value={addr}
              onChange={(e) => setAddr(e.target.value)}
            />
            {err && <p className="t-err">{err}</p>}

            <span className="t-label">Payment</span>
            <div className="t-pays">
              {[
                ["upi", "📱", "UPI", "Opens your app"],
                ["card", "💳", "Card", "Visa ending 4412"],
                ["cash", "💵", "Cash on delivery", "Keep change ready"],
              ].map(([k, icon, label, hint]) => (
                <button
                  key={k}
                  className={"t-pay" + (pay === k ? " is-on" : "")}
                  onClick={() => setPay(k)}
                  aria-pressed={pay === k}
                >
                  <span aria-hidden="true">{icon}</span>
                  <b>{label}</b>
                  <span className="t-mono" style={{ fontSize: 11, color: "#6b6152" }}>
                    {hint}
                  </span>
                </button>
              ))}
            </div>

            <button className="t-cta" style={{ marginTop: 20, borderRadius: 9 }} onClick={placeOrder}>
              Place order · {rupees(total)}
            </button>
            <button className="t-back" onClick={() => setView("menu")}>
              Back to the menu
            </button>
          </div>
        </div>
      )}

      {/* ---------- placed / tracking ---------- */}
      {view === "placed" && (
        <div className="t-sheet" role="dialog" aria-modal="true" aria-label="Order status">
          <div className="t-panel">
            <div className="t-stampwrap">
              <div className="t-stamp">Order in</div>
            </div>
            <h3>#NAG-4471</h3>
            <p className="t-note t-mono">
              {addr} · {pay === "cash" ? "Cash on delivery" : pay === "upi" ? "UPI" : "Card"} ·{" "}
              {rupees(total)}
            </p>

            <div className="t-track">
              {TRACK.map((s, i) => (
                <div
                  key={s.t}
                  className={"t-tstep" + (i < stage ? " done" : i === stage ? " now" : "")}
                  aria-current={i === stage ? "step" : undefined}
                >
                  <span className="t-dot">{i < stage ? "✓" : i + 1}</span>
                  <div>
                    <h5>{s.t}</h5>
                    <p>{s.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="t-rule" />
            <div className="t-lines t-mono" style={{ padding: "8px 0 0" }}>
              {lines.map((l) => (
                <div className="t-line" key={l.item.id}>
                  <span className="t-line-qty">{l.qty}×</span>
                  <span className="t-line-name">{l.item.name}</span>
                  <span>{rupees(l.item.price * l.qty)}</span>
                </div>
              ))}
            </div>

            <button className="t-cta" style={{ marginTop: 18, borderRadius: 9 }} onClick={startOver}>
              Order something else
            </button>
          </div>
          <div className="t-tear" />
        </div>
      )}
    </div>
  );
}
