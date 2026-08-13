"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const CATEGORY_COLORS = ["#F97316","#8B5CF6","#06B6D4","#10B981","#F59E0B","#EF4444","#6366F1","#EC4899"];

function authHeaders(token) {
  return { "Authorization": `Bearer ${token}`, "Accept": "application/json", "Content-Type": "application/json" };
}

function Spinner({ className = "w-5 h-5" }) {
  return <div className={`${className} rounded-full border-2 border-orange-500 border-t-transparent animate-spin`} />;
}

function StatusBadge({ status, listed }) {
  const map = {
    minted:   "bg-emerald-100 text-emerald-700 border-emerald-200",
    pending:  "bg-amber-100 text-amber-700 border-amber-200",
    rejected: "bg-red-100 text-red-600 border-red-200",
  };
  return (
    <div className="flex flex-col gap-1">
      <span className={`inline-flex px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${map[status] || map.pending}`}>
        {status}
      </span>
      {listed && <span className="inline-flex px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-600 border-blue-200">Listed</span>}
    </div>
  );
}

function EmptyState({ icon = "📭", title, sub }) {
  return (
    <div className="text-center py-20 space-y-3">
      <div className="text-5xl">{icon}</div>
      <p className="text-gray-500 font-semibold">{title}</p>
      {sub && <p className="text-gray-400 text-sm">{sub}</p>}
    </div>
  );
}

// ── Login ─────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  async function submit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("nft_admin_token", data.token);
        localStorage.setItem("nft_admin_user",  JSON.stringify(data.user));
        onLogin(data.token, data.user);
      } else setError(data.message || "Invalid credentials.");
    } catch (_) { setError("Cannot connect to server."); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-[#0f0f10] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] bg-gradient-to-b from-orange-500 to-orange-600 p-12 shrink-0">
        <div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl mb-8">🎃</div>
          <h1 className="text-white text-4xl font-black leading-tight mb-4">NFT Admin<br />Dashboard</h1>
          <p className="text-white/70 text-sm leading-relaxed">Manage your NFT ecosystem — approve mints, track sales, moderate content and monitor platform revenue.</p>
        </div>
        <div className="space-y-3">
          {["NFT Moderation", "Sales Analytics", "User Management", "Platform Revenue"].map((f) => (
            <div key={f} className="flex items-center gap-3 text-white/80 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
              {f}
            </div>
          ))}
          <p className="text-white/40 text-xs pt-4">Scotty Pumpkin · nft.bfin.technology</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="lg:hidden text-center">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-2xl mx-auto mb-3">🎃</div>
            <h1 className="text-white text-2xl font-black">NFT Admin</h1>
          </div>

          <div>
            <h2 className="text-white text-2xl font-bold mb-1">Welcome back</h2>
            <p className="text-gray-500 text-sm">Sign in to your admin account</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Email address</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nft.bfin.technology"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-600 outline-none focus:border-orange-500/50 focus:bg-white/8 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-600 outline-none focus:border-orange-500/50 focus:bg-white/8 transition-all pr-14"
                />
                <button type="button" onClick={() => setShow(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-xs cursor-pointer transition-colors">
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                <span>⚠</span> {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-400 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-orange-500/25">
              {loading ? <><Spinner className="w-4 h-4 border-white border-t-transparent" /> Signing in...</> : "Sign in →"}
            </button>
          </form>

          <p className="text-gray-600 text-xs text-center">
            Scotty Pumpkin NFT Platform · Admin Access Only
          </p>
        </div>
      </div>
    </div>
  );
}

// ── NFT Detail Drawer ─────────────────────────────────────────────────────
function NftDrawer({ nft, onClose, onAction }) {
  if (!nft) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-md bg-[#1a1a1c] border-l border-white/8 flex flex-col overflow-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
          <p className="text-white font-bold">NFT Details</p>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/8 text-white/50 hover:bg-white/12 hover:text-white flex items-center justify-center cursor-pointer transition-all text-lg leading-none">×</button>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {/* Image */}
          <div className="aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/8">
            {nft.image_url
              ? <img src={nft.image_url} alt={nft.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-6xl">🖼️</div>
            }
          </div>

          {/* Info */}
          <div className="space-y-3">
            <div>
              <p className="text-white text-xl font-bold">{nft.name}</p>
              {nft.symbol && <p className="text-gray-500 text-xs font-mono mt-0.5">{nft.symbol}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={nft.status} listed={nft.is_listed} />
              <span className="px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider bg-purple-500/15 text-purple-400 border-purple-500/20">{nft.category}</span>
            </div>
            {nft.description && <p className="text-gray-400 text-sm leading-relaxed">{nft.description}</p>}
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: "Price",      value: nft.list_price ? `${nft.list_price} SOL` : "Not listed" },
              { label: "Royalty",    value: `${nft.royalty || 0}%` },
              { label: "Edition",    value: nft.edition_type === "limited" ? `Limited (${nft.total_supply})` : "Unlimited" },
              { label: "Collection", value: nft.collection?.name || "None" },
            ].map((row) => (
              <div key={row.label} className="px-3.5 py-3 rounded-xl bg-white/4 border border-white/8">
                <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">{row.label}</p>
                <p className="text-white text-sm font-semibold">{row.value}</p>
              </div>
            ))}
          </div>

          {/* Wallet */}
          <div className="px-4 py-3 rounded-xl bg-white/4 border border-white/8 space-y-1">
            <p className="text-gray-500 text-[10px] uppercase tracking-wider">Owner Wallet</p>
            <p className="text-white/70 text-xs font-mono break-all">{nft.wallet_address}</p>
          </div>

          {/* Mint address */}
          {nft.mint_address && (
            <div className="px-4 py-3 rounded-xl bg-white/4 border border-white/8 space-y-1">
              <p className="text-gray-500 text-[10px] uppercase tracking-wider">Mint Address</p>
              <p className="text-white/70 text-xs font-mono break-all">{nft.mint_address}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-5 border-t border-white/8 space-y-2.5">
          {nft.status === "pending" && (
            <button onClick={() => onAction(nft.id, "approve")}
              className="w-full py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 transition-colors cursor-pointer">
              ✓ Approve NFT
            </button>
          )}
          <div className="grid grid-cols-2 gap-2">
            {nft.is_listed && (
              <button onClick={() => onAction(nft.id, "unlist")}
                className="py-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20 font-semibold text-sm hover:bg-amber-500/25 transition-colors cursor-pointer">
                Unlist
              </button>
            )}
            {nft.status !== "rejected" && (
              <button onClick={() => onAction(nft.id, "reject")}
                className="py-2.5 rounded-xl bg-red-500/15 text-red-400 border border-red-500/20 font-semibold text-sm hover:bg-red-500/25 transition-colors cursor-pointer">
                Reject
              </button>
            )}
            {nft.mint_address && (
              <a href={`https://explorer.solana.com/address/${nft.mint_address}?cluster=devnet`}
                target="_blank" rel="noreferrer"
                className="py-2.5 rounded-xl bg-white/8 text-white/50 border border-white/10 font-semibold text-sm hover:bg-white/12 transition-colors cursor-pointer text-center">
                Explorer ↗
              </a>
            )}
            <button onClick={() => { if (confirm(`Delete "${nft.name}"?`)) onAction(nft.id, "delete"); }}
              className="py-2.5 rounded-xl bg-white/5 text-gray-500 border border-white/8 font-semibold text-sm hover:bg-red-500/15 hover:text-red-400 transition-colors cursor-pointer">
              🗑 Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────
function DashboardTab({ token }) {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/admin/stats`, { headers: authHeaders(token) })
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d.data); })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner className="w-8 h-8" /></div>;
  if (!stats)  return <EmptyState icon="❌" title="Failed to load stats" />;

  const pieData = (stats.category_stats || []).map((c, i) => ({
    name: c.category, value: c.total, fill: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
  }));

  const STATS = [
    { label: "Total NFTs",      value: stats.total_nfts,   icon: "🖼️",  color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20" },
    { label: "Minted",           value: stats.minted_nfts,  icon: "✅",   color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { label: "Pending",          value: stats.pending_nfts, icon: "⏳",   color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20" },
    { label: "Listed for Sale",  value: stats.listed_nfts,  icon: "🏷️",  color: "text-orange-400",  bg: "bg-orange-500/10 border-orange-500/20" },
    { label: "Total Sales",      value: stats.sold_nfts,    icon: "🛒",   color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { label: "Total Volume",     value: `${stats.total_volume} SOL`,   icon: "◎",    color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20" },
    { label: "Platform Revenue", value: `${stats.total_revenue} SOL`,  icon: "💎",   color: "text-orange-400",  bg: "bg-orange-500/10 border-orange-500/20", sub: "3% fee" },
  ];

  return (
    <div className="space-y-6">
      {/* Pending alert */}
      {stats.pending_nfts > 0 && (
        <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <p className="text-amber-400 font-semibold text-sm">{stats.pending_nfts} NFT{stats.pending_nfts > 1 ? "s" : ""} waiting for approval</p>
            <p className="text-amber-500/60 text-xs">Go to NFTs tab → filter by Pending to review</p>
          </div>
          <span className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">{stats.pending_nfts}</span>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STATS.slice(0, 4).map((s) => (
          <div key={s.label} className={`rounded-2xl border p-5 space-y-3 ${s.bg}`}>
            <div className="flex items-center justify-between">
              <p className="text-gray-400 text-[10px] uppercase tracking-widest font-semibold">{s.label}</p>
              <span className="text-xl">{s.icon}</span>
            </div>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {STATS.slice(4).map((s) => (
          <div key={s.label} className={`rounded-2xl border p-5 space-y-3 ${s.bg}`}>
            <div className="flex items-center justify-between">
              <p className="text-gray-400 text-[10px] uppercase tracking-widest font-semibold">{s.label}</p>
              <span className="text-xl">{s.icon}</span>
            </div>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            {s.sub && <p className="text-gray-500 text-xs">{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* Charts */}
      {pieData.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white/3 border border-white/8 p-6">
            <p className="text-white/70 text-sm font-bold mb-5">NFTs by Category</p>
            <div className="flex items-center gap-4">
              <PieChart width={130} height={130}>
                <Pie data={pieData} cx={60} cy={60} innerRadius={38} outerRadius={60} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />)}
                </Pie>
              </PieChart>
              <div className="flex-1 space-y-2">
                {pieData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: d.fill }} />
                    <span className="text-gray-400 text-xs capitalize flex-1">{d.name}</span>
                    <span className="text-white/70 text-xs font-semibold">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/3 border border-white/8 p-6">
            <p className="text-white/70 text-sm font-bold mb-5">Count by Category</p>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={stats.category_stats} margin={{ top: 0, right: 0, bottom: 0, left: -25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: "#6b7280" }} />
                <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} />
                <Tooltip contentStyle={{ background: "#1a1a1c", border: "1px solid #ffffff15", borderRadius: 8, fontSize: 12, color: "#fff" }} />
                <Bar dataKey="total" fill="#F97316" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent sales */}
      {stats.recent_sales?.length > 0 && (
        <div className="rounded-2xl bg-white/3 border border-white/8 p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/70 text-sm font-bold">Recent Sales</p>
            <span className="text-gray-500 text-xs">Last 5 transactions</span>
          </div>
          <div className="space-y-0">
            {stats.recent_sales.map((s, i) => (
              <div key={s.id} className={`flex items-center gap-4 py-3.5 ${i < stats.recent_sales.length - 1 ? "border-b border-white/5" : ""}`}>
                <span className="text-gray-700 font-bold text-sm w-5 text-center shrink-0">{i + 1}</span>
                {s.image_url
                  ? <img src={s.image_url} alt={s.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                  : <div className="w-10 h-10 rounded-xl bg-white/8 shrink-0 flex items-center justify-center">🖼️</div>
                }
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-sm font-medium truncate">{s.name}</p>
                  <p className="text-gray-500 text-xs font-mono mt-0.5">→ {s.sold_to?.slice(0,6)}...{s.sold_to?.slice(-4)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-orange-400 font-bold text-sm">{s.list_price} SOL</p>
                  <p className="text-gray-600 text-xs">{s.sold_at ? new Date(s.sold_at).toLocaleDateString("en-GB") : "—"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── NFTs Tab ──────────────────────────────────────────────────────────────
function NftsTab({ token }) {
  const [nfts, setNfts]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [toast, setToast]         = useState({ msg: "", type: "success" });
  const [search, setSearch]       = useState("");
  const [status, setStatus]       = useState("");
  const [page, setPage]           = useState(1);
  const [lastPage, setLastPage]   = useState(1);
  const [selected, setSelected]   = useState(null);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3500);
  }

  const fetchNfts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page });
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    const res  = await fetch(`${API_URL}/admin/nfts?${params}`, { headers: authHeaders(token) });
    const data = await res.json();
    if (data.success) { setNfts(data.data.data || []); setLastPage(data.data.last_page || 1); }
    setLoading(false);
  }, [token, page, search, status]);

  useEffect(() => { fetchNfts(); }, [fetchNfts]);

  async function action(id, type) {
    const method = type === "delete" ? "DELETE" : "POST";
    const url    = type === "delete" ? `${API_URL}/admin/nfts/${id}` : `${API_URL}/admin/nfts/${id}/${type}`;
    const res    = await fetch(url, { method, headers: authHeaders(token) });
    const data   = await res.json();
    if (data.success) { showToast(data.message); setSelected(null); fetchNfts(); }
    else showToast(data.message || "Action failed.", "error");
  }

  return (
    <div className="space-y-4">
      {selected && <NftDrawer nft={selected} onClose={() => setSelected(null)} onAction={action} />}

      {toast.msg && (
        <div className={`px-4 py-3 rounded-xl border text-sm font-medium ${
          toast.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
        }`}>{toast.msg}</div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /></svg>
          <input type="text" placeholder="Search NFTs..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-600 outline-none focus:border-orange-500/40 transition-all"
          />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm outline-none focus:border-orange-500/40 cursor-pointer"
          style={{ colorScheme: "dark" }}>
          <option value="">All Status</option>
          <option value="pending">⏳ Pending</option>
          <option value="minted">✅ Minted</option>
          <option value="rejected">❌ Rejected</option>
        </select>
        <button onClick={fetchNfts} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm hover:bg-white/8 cursor-pointer transition-colors">
          🔄
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white/3 border border-white/8 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-white/8">
            <tr>
              {["NFT", "Category", "Status", "Price", "Owner", "Date", ""].map((h) => (
                <th key={h} className="px-4 py-3.5 text-left text-gray-500 text-[10px] uppercase tracking-wider font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="py-16 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-500"><Spinner /> Loading...</div>
              </td></tr>
            ) : nfts.length === 0 ? (
              <tr><td colSpan={7}><EmptyState icon="🖼️" title="No NFTs found" sub="Adjust your filters" /></td></tr>
            ) : nfts.map((nft) => (
              <tr key={nft.id} onClick={() => setSelected(nft)}
                className="border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    {nft.image_url
                      ? <img src={nft.image_url} alt={nft.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                      : <div className="w-10 h-10 rounded-xl bg-white/8 shrink-0 flex items-center justify-center text-lg">🖼️</div>
                    }
                    <div>
                      <p className="text-white/80 font-semibold truncate max-w-[140px]">{nft.name}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{nft.edition_type === "limited" ? `${nft.total_supply} copies` : "Unlimited"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20 text-[10px] font-bold uppercase capitalize">
                    {nft.category}
                  </span>
                </td>
                <td className="px-4 py-3.5"><StatusBadge status={nft.status} listed={nft.is_listed} /></td>
                <td className="px-4 py-3.5 text-orange-400 font-mono text-xs font-semibold">{nft.list_price ? `${nft.list_price} SOL` : "—"}</td>
                <td className="px-4 py-3.5 text-gray-500 font-mono text-xs">{nft.wallet_address?.slice(0,6)}...{nft.wallet_address?.slice(-4)}</td>
                <td className="px-4 py-3.5 text-gray-600 text-xs">{nft.created_at ? new Date(nft.created_at).toLocaleDateString("en-GB") : "—"}</td>
                <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-1.5">
                    {nft.status === "pending" && (
                      <button onClick={() => action(nft.id, "approve")}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/25 transition-colors cursor-pointer border border-emerald-500/20">
                        ✓
                      </button>
                    )}
                    {nft.status !== "rejected" && (
                      <button onClick={() => action(nft.id, "reject")}
                        className="px-2.5 py-1 rounded-lg bg-red-500/15 text-red-400 text-xs font-semibold hover:bg-red-500/25 transition-colors cursor-pointer border border-red-500/20">
                        ✕
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {lastPage > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/8">
            <p className="text-gray-600 text-xs">Page {page} of {lastPage}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-gray-400 text-xs hover:bg-white/8 disabled:opacity-30 cursor-pointer">← Prev</button>
              <button onClick={() => setPage(p => Math.min(lastPage, p+1))} disabled={page === lastPage}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-gray-400 text-xs hover:bg-white/8 disabled:opacity-30 cursor-pointer">Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sales Tab ─────────────────────────────────────────────────────────────
function SalesTab({ token }) {
  const [sales, setSales]       = useState([]);
  const [summary, setSummary]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [from, setFrom]         = useState("");
  const [to, setTo]             = useState("");
  const [page, setPage]         = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchSales = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page });
    if (from) params.append("from", from);
    if (to)   params.append("to", to);
    const res  = await fetch(`${API_URL}/admin/sales?${params}`, { headers: authHeaders(token) });
    const data = await res.json();
    if (data.success) { setSales(data.data.data || []); setLastPage(data.data.last_page || 1); setSummary(data.summary); }
    setLoading(false);
  }, [token, from, to, page]);

  useEffect(() => { fetchSales(); }, [fetchSales]);

  return (
    <div className="space-y-5">
      {summary && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Sales",      value: summary.total_sales,             icon: "🛒", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
            { label: "Total Volume",     value: `${summary.total_volume} SOL`,   icon: "◎",  color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20" },
            { label: "Platform Revenue", value: `${summary.total_revenue} SOL`,  icon: "💎", color: "text-orange-400",  bg: "bg-orange-500/10 border-orange-500/20" },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl border p-5 space-y-2 ${s.bg}`}>
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-[10px] uppercase tracking-widest font-semibold">{s.label}</p>
                <span className="text-xl">{s.icon}</span>
              </div>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Date filter */}
      <div className="flex flex-wrap gap-3 items-center px-5 py-4 rounded-2xl bg-white/3 border border-white/8">
        <p className="text-gray-400 text-sm font-medium">Filter:</p>
        <div className="flex items-center gap-2">
          <label className="text-gray-500 text-xs">From</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm outline-none focus:border-orange-500/40"
            style={{ colorScheme: "dark" }} />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-gray-500 text-xs">To</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm outline-none focus:border-orange-500/40"
            style={{ colorScheme: "dark" }} />
        </div>
        {(from || to) && (
          <button onClick={() => { setFrom(""); setTo(""); }}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-500 text-xs hover:bg-white/8 cursor-pointer transition-colors">
            ✕ Clear
          </button>
        )}
      </div>

      <div className="rounded-2xl bg-white/3 border border-white/8 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-white/8">
            <tr>
              {["NFT", "Sale Price", "Fee (3%)", "Seller", "Buyer", "Tx", "Date"].map((h) => (
                <th key={h} className="px-4 py-3.5 text-left text-gray-500 text-[10px] uppercase tracking-wider font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="py-16 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-500"><Spinner /> Loading sales...</div>
              </td></tr>
            ) : sales.length === 0 ? (
              <tr><td colSpan={7}><EmptyState icon="💰" title="No sales yet" sub="Sales will appear once NFTs are purchased" /></td></tr>
            ) : sales.map((s) => (
              <tr key={s.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    {s.image_url
                      ? <img src={s.image_url} alt={s.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                      : <div className="w-9 h-9 rounded-lg bg-white/8 shrink-0" />
                    }
                    <p className="text-white/70 font-medium truncate max-w-[120px]">{s.name}</p>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-orange-400 font-bold">{s.list_price} SOL</td>
                <td className="px-4 py-3.5 text-emerald-400 text-xs font-medium">{(s.list_price * 0.03).toFixed(4)} SOL</td>
                <td className="px-4 py-3.5 text-gray-500 font-mono text-xs">{(s.previous_owner || s.wallet_address)?.slice(0,6)}...{(s.previous_owner || s.wallet_address)?.slice(-4)}</td>
                <td className="px-4 py-3.5 text-gray-500 font-mono text-xs">{s.sold_to?.slice(0,6)}...{s.sold_to?.slice(-4)}</td>
                <td className="px-4 py-3.5">
                  {s.sold_tx
                    ? <a href={`https://explorer.solana.com/tx/${s.sold_tx}?cluster=devnet`} target="_blank" rel="noreferrer" className="text-orange-400 text-xs underline hover:text-orange-300">View ↗</a>
                    : <span className="text-gray-700 text-xs">—</span>
                  }
                </td>
                <td className="px-4 py-3.5 text-gray-600 text-xs">
                  {s.sold_at ? new Date(s.sold_at).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {lastPage > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/8">
            <p className="text-gray-600 text-xs">Page {page} of {lastPage}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-gray-400 text-xs hover:bg-white/8 disabled:opacity-30 cursor-pointer">← Prev</button>
              <button onClick={() => setPage(p => Math.min(lastPage, p+1))} disabled={page === lastPage}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-gray-400 text-xs hover:bg-white/8 disabled:opacity-30 cursor-pointer">Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Users Tab ─────────────────────────────────────────────────────────────
function UsersTab({ token }) {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  useEffect(() => {
    fetch(`${API_URL}/admin/users`, { headers: authHeaders(token) })
      .then(r => r.json())
      .then(d => { if (d.success) setUsers(d.data.data || []); })
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = search
    ? users.filter(u => u.wallet_address?.toLowerCase().includes(search.toLowerCase()))
    : users;

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /></svg>
        <input type="text" placeholder="Search by wallet address..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-600 outline-none focus:border-orange-500/40 transition-all"
        />
      </div>

      <div className="rounded-2xl bg-white/3 border border-white/8 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-white/8">
            <tr>
              {["#", "Wallet", "Total NFTs", "Listed", "Sold", "Last Activity", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3.5 text-left text-gray-500 text-[10px] uppercase tracking-wider font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="py-16 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-500"><Spinner /> Loading users...</div>
              </td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7}><EmptyState icon="👥" title="No users found" /></td></tr>
            ) : filtered.map((u, i) => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                <td className="px-4 py-3.5 text-gray-700 font-bold text-sm">{i + 1}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500/30 to-purple-500/30 border border-white/10 flex items-center justify-center text-xs font-bold text-orange-400 shrink-0">
                      {u.wallet_address?.slice(0,2).toUpperCase()}
                    </div>
                    <span className="font-mono text-gray-400 text-xs">{u.wallet_address?.slice(0,8)}...{u.wallet_address?.slice(-6)}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-white/80 font-bold">{u.total_nfts}</td>
                <td className="px-4 py-3.5 text-blue-400 font-semibold">{u.listed_nfts}</td>
                <td className="px-4 py-3.5 text-emerald-400 font-semibold">{u.sold_nfts}</td>
                <td className="px-4 py-3.5 text-gray-600 text-xs">
                  {u.last_activity ? new Date(u.last_activity).toLocaleDateString("en-GB") : "—"}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-1.5">
                    <a href={`/profile/${u.wallet_address}`} target="_blank" rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-orange-500/15 text-orange-400 text-xs font-semibold hover:bg-orange-500/25 transition-colors border border-orange-500/20">
                      Profile ↗
                    </a>
                    <button onClick={() => { navigator.clipboard.writeText(u.wallet_address); }}
                      className="px-2.5 py-1 rounded-lg bg-white/5 text-gray-500 text-xs font-semibold hover:bg-white/8 transition-colors border border-white/8 cursor-pointer">
                      Copy
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [tab, setTab]     = useState("dashboard");

  useEffect(() => {
    const t = localStorage.getItem("nft_admin_token");
    const u = localStorage.getItem("nft_admin_user");
    if (t) { setToken(t); setAdmin(u ? JSON.parse(u) : null); }
  }, []);

  async function logout() {
    if (token) await fetch(`${API_URL}/admin/logout`, { method: "POST", headers: authHeaders(token) }).catch(() => {});
    localStorage.removeItem("nft_admin_token");
    localStorage.removeItem("nft_admin_user");
    setToken(null); setAdmin(null);
  }

  if (!token) return <LoginPage onLogin={(t, u) => { setToken(t); setAdmin(u); }} />;

  const TABS = [
    { key: "dashboard", label: "Dashboard", icon: "📊" },
    { key: "nfts",      label: "NFTs",      icon: "🖼️" },
    { key: "sales",     label: "Sales",     icon: "💰" },
    { key: "users",     label: "Users",     icon: "👥" },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f10] flex text-white">

      {/* Sidebar */}
      <aside className="w-56 bg-[#141416] border-r border-white/6 flex flex-col shrink-0 sticky top-0 h-screen">
        {/* Logo */}
        <div className="px-5 py-6 border-b border-white/6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-lg shrink-0">🎃</div>
            <div>
              <p className="font-black text-white text-sm leading-tight">NFT Admin</p>
              <p className="text-gray-600 text-[10px] font-mono">bfin.technology</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                tab === t.key
                  ? "bg-orange-500/12 text-orange-400 border border-orange-500/15"
                  : "text-gray-500 hover:bg-white/4 hover:text-gray-300"
              }`}
            >
              <span className="text-base">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        {/* User info */}
        <div className="px-4 py-5 border-t border-white/6 space-y-3">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/4 border border-white/8">
            <div className="w-7 h-7 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-xs font-bold text-orange-400 shrink-0">
              {admin?.name?.charAt(0) || "A"}
            </div>
            <div className="min-w-0">
              <p className="text-white/70 text-xs font-medium truncate">{admin?.name || "Admin"}</p>
              <p className="text-gray-600 text-[10px] truncate">{admin?.email}</p>
            </div>
          </div>
          <button onClick={logout}
            className="w-full py-2 rounded-xl bg-white/4 border border-white/8 text-gray-500 text-xs font-medium hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all cursor-pointer">
            Sign out →
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-[#0f0f10]/90 backdrop-blur-md border-b border-white/6 px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-[10px] uppercase tracking-widest">Admin Panel</p>
            <h1 className="text-white font-black text-xl capitalize">{tab}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-gray-500 text-xs">Live</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 py-8">
          {tab === "dashboard" && <DashboardTab token={token} />}
          {tab === "nfts"      && <NftsTab token={token} />}
          {tab === "sales"     && <SalesTab token={token} />}
          {tab === "users"     && <UsersTab token={token} />}
        </div>
      </main>
    </div>
  );
}
