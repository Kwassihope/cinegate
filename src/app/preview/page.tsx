"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ============================================================
// SUPABASE CLIENT
// Replace these with your actual project values from:
// Supabase Dashboard → Settings → API
// ============================================================
const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase     = createClient(supabaseUrl, supabaseAnon);

// ============================================================
// TYPES
// ============================================================
type MovieStatus   = "pending" | "approved" | "rejected";
type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
type Page          = "login" | "admin" | "producer" | "submit" | "player";

interface Movie {
  id:            string;
  producer_id:   string;
  title:         string;
  genre:         string | null;
  description:   string | null;
  price:         number;
  status:        MovieStatus;
  file_url:      string | null;
  thumbnail_url: string | null;
  views:         number;
  created_at:    string;
  earnings?:     number;
  producer_name?: string;
}

interface Producer {
  id:             string;
  full_name:      string;
  email:          string;
  bio:            string | null;
  avatar_url:     string | null;
  total_earnings: number;
  created_at:     string;
}

interface AdminStats {
  activeProducers: number;
  moviesUploaded:  number;
  totalViews:      number;
  totalRevenue:    number;
}

// ============================================================
// SUPABASE HELPERS
// ============================================================

// AUTH
async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

async function checkIsAdmin(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.app_metadata?.role === "admin";
}

// PRODUCER
async function getMyProfile(): Promise<Producer | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("producers")
    .select("*")
    .eq("id", user.id)
    .single();
  if (error) return null;
  return data;
}

async function getMyMovies(): Promise<Movie[]> {
  const { data, error } = await supabase
    .from("producer_dashboard")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data ?? [];
}

async function submitMovie(movie: {
  title: string;
  genre: string;
  description: string;
  price: number;
  file_url?: string;
  thumbnail_url?: string;
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("movies")
    .insert({ ...movie, producer_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function uploadMovieFile(file: File): Promise<string> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  const ext  = file.name.split(".").pop();
  const path = `${user.id}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("movies").upload(path, file);
  if (error) throw error;
  return path;
}

// VIEWER
async function hasPaid(movieId: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  const { data } = await supabase
    .from("payments")
    .select("id")
    .eq("movie_id", movieId)
    .eq("buyer_id", user.id)
    .eq("status", "completed")
    .maybeSingle();
  return !!data;
}

async function hasWatched(movieId: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  const { data } = await supabase
    .from("views")
    .select("id")
    .eq("movie_id", movieId)
    .eq("viewer_id", user.id)
    .maybeSingle();
  return !!data;
}

async function recordView(movieId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  const paid = await hasPaid(movieId);
  if (!paid) throw new Error("Purchase required before watching.");
  const watched = await hasWatched(movieId);
  if (watched) throw new Error("You have already watched this movie.");
  const { error } = await supabase
    .from("views")
    .insert({ movie_id: movieId, viewer_id: user.id });
  if (error) throw error;
}

async function getMovieStreamUrl(fileUrl: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from("movies")
    .createSignedUrl(fileUrl, 60 * 60 * 2);
  if (error) throw error;
  return data.signedUrl;
}


// ADMIN
async function adminGetStats(): Promise<AdminStats> {
  const [producers, movies, views, revenue] = await Promise.all([
    supabase.from("producers").select("id", { count: "exact", head: true }),
    supabase.from("movies").select("id", { count: "exact", head: true }),
    supabase.from("views").select("id", { count: "exact", head: true }),
    supabase.from("payments").select("amount").eq("status", "completed"),
  ]);
  const totalRevenue = (revenue.data ?? []).reduce((sum, p) => sum + p.amount, 0);
  return {
    activeProducers: producers.count ?? 0,
    moviesUploaded:  movies.count ?? 0,
    totalViews:      views.count ?? 0,
    totalRevenue,
  };
}

async function adminGetPendingMovies(): Promise<Movie[]> {
  const { data, error } = await supabase
    .from("admin_movie_summary")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  if (error) return [];
  return data ?? [];
}

async function adminApproveMovie(movieId: string) {
  const { error } = await supabase
    .from("movies")
    .update({ status: "approved" })
    .eq("id", movieId);
  if (error) throw error;
}

async function adminRejectMovie(movieId: string) {
  const { error } = await supabase
    .from("movies")
    .update({ status: "rejected" })
    .eq("id", movieId);
  if (error) throw error;
}

// ============================================================
// UI COMPONENTS
// ============================================================

function Badge({ children, tone = "green" }: { children: React.ReactNode; tone?: string }) {
  const styles: Record<string, string> = {
    green:  "bg-green-100 text-green-700 border-green-200",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
    red:    "bg-red-100 text-red-700 border-red-200",
    blue:   "bg-blue-100 text-blue-700 border-blue-200",
  };
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${styles[tone]}`}>
      {children}
    </span>
  );
}

function StatCard({ title, value, note }: { title: string; value: string | number; note: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{note}</p>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-red-600" />
    </div>
  );
}

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
      {msg}
    </div>
  );
}

// ============================================================
// SCREENS
// ============================================================

// --- LOGIN ---
function Login({ setPage }: { setPage: (p: Page) => void }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  async function handleSignIn() {
    setLoading(true);
    setError("");
    try {
      await signIn(email, password);
      const admin = await checkIsAdmin();
      setPage(admin ? "admin" : "producer");
    } catch (e: any) {
      setError(e.message ?? "Sign in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-[640px] grid-cols-1 bg-white lg:grid-cols-2">
      <div className="flex flex-col justify-between bg-gradient-to-br from-slate-950 to-red-950 p-10 text-white">
        <div>
          <div className="mb-10 inline-flex rounded-2xl bg-red-600 px-4 py-3 text-xl font-black">
            CineGate
          </div>
          <h1 className="max-w-xl text-4xl font-black leading-tight">
            Upload movies, sell access, and block repeat viewing after one watch.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-slate-300">
            A simple movie monetization platform for producers, admins, and viewers.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          {["Secure Access", "Payment Link", "One Viewing"].map((t) => (
            <div key={t} className="rounded-2xl bg-white/10 p-4">{t}</div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center bg-slate-50 p-8">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <h2 className="text-2xl font-black">Sign in</h2>
          <p className="mt-1 text-sm text-slate-500">Enter your CineGate credentials</p>
          <input
            className="mt-6 w-full rounded-2xl border border-slate-200 px-4 py-3"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <ErrorMsg msg={error} />}
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="mt-5 w-full rounded-2xl bg-red-600 px-4 py-3 font-bold text-white disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- ADMIN ---
function Admin({ setPage }: { setPage: (p: Page) => void }) {
  const [stats, setStats]     = useState<AdminStats | null>(null);
  const [pending, setPending] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [s, p] = await Promise.all([adminGetStats(), adminGetPendingMovies()]);
      setStats(s);
      setPending(p);
      setLoading(false);
    })();

    // Real-time: listen for new movie submissions
    const channel = supabase
      .channel("admin-pending")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "movies" }, () => {
        adminGetPendingMovies().then(setPending);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function handleApprove(id: string) {
    await adminApproveMovie(id);
    setPending((prev) => prev.filter((m) => m.id !== id));
    setStats((s) => s ? { ...s, moviesUploaded: s.moviesUploaded } : s);
  }

  async function handleReject(id: string) {
    await adminRejectMovie(id);
    setPending((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black">Admin Dashboard</h2>
          <p className="mt-1 text-slate-500">Approvals, access control, revenue, and platform monitoring.</p>
        </div>
        <button
          onClick={async () => { await signOut(); setPage("login"); }}
          className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-bold"
        >
          Sign out
        </button>
      </div>

      {loading ? <Spinner /> : (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Active Producers" value={stats!.activeProducers} note="Registered movie producers" />
            <StatCard title="Movies Uploaded"  value={stats!.moviesUploaded}  note={`${pending.length} awaiting approval`} />
            <StatCard title="Total Views"      value={stats!.totalViews.toLocaleString()} note="Completed paid views" />
            <StatCard title="Revenue"          value={`$${stats!.totalRevenue.toLocaleString()}`} note="Across all movies" />
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-black">
              Pending Movie Reviews
              {pending.length > 0 && (
                <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-sm text-red-700">{pending.length}</span>
              )}
            </h3>
            {pending.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No movies pending review.</p>
            ) : (
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                {pending.map((movie, index) => (
                  <div
                    key={movie.id}
                    className="grid grid-cols-4 gap-3 border-b border-slate-100 p-4 text-sm last:border-b-0 items-center"
                  >
                    <strong>{movie.title}</strong>
                    <span className="text-slate-500">{movie.producer_name ?? `Producer #${index + 1}`}</span>
                    <Badge tone="yellow">Pending</Badge>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(movie.id)}
                        className="rounded-xl bg-green-600 px-3 py-1 text-xs font-bold text-white"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(movie.id)}
                        className="rounded-xl bg-red-100 px-3 py-1 text-xs font-bold text-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                               ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// --- PRODUCER ---
function ProducerDashboard({ setPage, setSelectedMovie }: {
  setPage: (p: Page) => void;
  setSelectedMovie: (m: Movie) => void;
}) {
  const [profile, setProfile] = useState<Producer | null>(null);
  const [movies, setMovies]   = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [p, m] = await Promise.all([getMyProfile(), getMyMovies()]);
      setProfile(p);
      setMovies(m);
      setLoading(false);
    })();
  }, []);

  const approved = movies.filter((m) => m.status === "approved").length;
  const pending  = movies.filter((m) => m.status === "pending").length;
  const totalViews    = movies.reduce((s, m) => s + m.views, 0);

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-black">Producer Dashboard</h2>
          <p className="mt-1 text-slate-500">
            {profile ? `Welcome, ${profile.full_name}` : "Track submissions, approvals, views, and earnings."}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setPage("submit")}
            className="rounded-2xl bg-red-600 px-5 py-3 font-bold text-white"
          >
            Submit New Movie
          </button>
          <button
            onClick={async () => { await signOut(); setPage("login"); }}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold"
          >
            Sign out
          </button>
        </div>
      </div>

      {loading ? <Spinner /> : (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <StatCard
              title="Total Earnings"
              value={`$${(profile?.total_earnings ?? 0).toLocaleString()}`}
              note="Lifetime producer earnings"
            />
            <StatCard title="Completed Views" value={totalViews.toLocaleString()} note="Paid viewing sessions" />
            <StatCard
              title="Approved Movies"
              value={`${approved} / ${movies.length}`}
              note={`${pending} awaiting review`}
            />
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-black">Your Movies</h3>
            {movies.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No movies submitted yet.</p>
            ) : (
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                {movies.map((movie, i) => (
                  <div
                    key={movie.id}
                    className="grid grid-cols-4 gap-3 border-b border-slate-100 p-4 text-sm last:border-b-0 items-center"
                  >
                    <strong>{movie.title}</strong>
                    <Badge tone={movie.status === "approved" ? "green" : movie.status === "rejected" ? "red" : "yellow"}>
                      {movie.status.charAt(0).toUpperCase() + movie.status.slice(1)}
                    </Badge>
                    <span className="text-slate-500">${movie.price.toFixed(2)} · {movie.views} views</span>
                    {movie.status === "approved" && (
                      <button
                        onClick={() => { setSelectedMovie(movie); setPage("player"); }}
                        className="rounded-xl border border-slate-200 px-3 py-1 text-xs font-bold"
                      >
                        Preview
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// --- SUBMIT ---
function Submit({ setPage }: { setPage: (p: Page) => void }) {
  const [form, setForm] = useState({ title: "", genre: "", description: "", price: "" });
  const [file, setFile]       = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  async function handleSubmit() {
    if (!form.title || !form.price) { setError("Title and price are required."); return; }
    setLoading(true);
    setError("");
    try {
      let file_url: string | undefined;
      if (file) file_url = await uploadMovieFile(file);
      await submitMovie({
        title:       form.title,
        genre:       form.genre,
        description: form.description,
        price:       parseFloat(form.price),
        file_url,
      });
      setPage("producer");
    } catch (e: any) {
      setError(e.message ?? "Submission failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-xl">
      <h2 className="text-3xl font-black">Submit a New Movie</h2>
      <p className="mt-1 text-slate-500">
        Fill in the details below. Your movie will be reviewed before going live.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        {[
          { label: "Movie Title",    key: "title",       placeholder: "e.g. The Last Horizon", type: "text" },
          { label: "Genre",          key: "genre",       placeholder: "e.g. Drama, Thriller",  type: "text" },
          { label: "Price (USD)",    key: "price",       placeholder: "e.g. 5.99",             type: "number" },
          { label: "Description",    key: "description", placeholder: "Brief synopsis…",        type: "text" },
        ].map(({ label, key, placeholder, type }) => (
          <div key={key}>
            <label className="mb-1 block text-sm font-semibold text-slate-500">{label}</label>
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              placeholder={placeholder}
              type={type}
              value={(form as any)[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            />
          </div>
        ))}

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-500">Movie File (.mp4)</label>
          <div className="rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center">
            {file ? (
              <p className="text-sm text-slate-700">{file.name}</p>
            ) : (
              <label className="cursor-pointer text-sm text-slate-500">
                Click to select a file
                <input
                  type="file"
                  accept="video/mp4"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </label>
            )}
          </div>
        </div>

        {error && <ErrorMsg msg={error} />}

        <div className="flex gap-3">
          <button
            onClick={() => setPage("producer")}
            className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 font-bold"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-[2] rounded-2xl bg-red-600 px-4 py-3 font-bold text-white disabled:opacity-60"
          >
            {loading ? "Uploading…" : "Submit for Review"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- PLAYER ---
function Player({ movie, setPage }: { movie: Movie | null; setPage: (p: Page) => void }) {
  const [streamUrl, setStreamUrl]   = useState<string | null>(null);
  const [watched, setWatched]       = useState(false);
  const [paid, setPaid]             = useState(false);
  const [loading, setLoading]       = useState(true);
  const [playing, setPlaying]       = useState(false);
  const [error, setError]           = useState("");

  useEffect(() => {
    if (!movie) return;
    (async () => {
      const [p, w] = await Promise.all([hasPaid(movie.id), hasWatched(movie.id)]);
      setPaid(p);
      setWatched(w);
      setLoading(false);
    })();
  }, [movie]);

  async function handlePlay() {
    if (!movie) return;
    setError("");
    try {
      await recordView(movie.id);
      setWatched(true);
      if (movie.file_url) {
        const url = await getMovieStreamUrl(movie.file_url);
        setStreamUrl(url);
      }
      setPlaying(true);
    } catch (e: any) {
      setError(e.message ?? "Could not start playback.");
    }
  }

  if (!movie) return <div className="p-8 text-slate-500">No movie selected.</div>;

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-3xl">
        <div className="relative overflow-hidden rounded-3xl bg-black aspect-video flex items-center justify-center">
          {playing && streamUrl ? (
            <video src={streamUrl} controls autoPlay className="w-full h-full" />
          ) : (
            <div className="text-center">
              <div className="mb-4 text-slate-400 text-6xl">▶</div>
              <p className="text-slate-400 text-sm">{movie.title}</p>
            </div>
          )}
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-black">{movie.title}</h3>
            <p className="mt-1 text-slate-500">
              {movie.genre} · ${movie.price.toFixed(2)} · {movie.views} views
            </p>
            {movie.description && <p className="mt-2 text-sm text-slate-600">{movie.description}</p>}
          </div>
          <Badge tone={movie.status === "approved" ? "green" : "yellow"}>
            {movie.status.charAt(0).toUpperCase() + movie.status.slice(1)}
          </Badge>
        </div>

        {loading ? <Spinner /> : (
          <div className="mt-4">
            {!paid ? (
              <div className="rounded-2xl bg-yellow-50 border border-yellow-200 px-5 py-4 text-sm text-yellow-800">
                You have not purchased this movie. Complete payment to watch.
              </div>
            ) : watched && !playing ? (
              <div className="rounded-2xl bg-slate-100 px-5 py-4 text-sm text-slate-700">
                You have already watched this movie. One-time viewing policy applies.
              </div>
            ) : !playing ? (
              <div className="rounded-2xl bg-slate-50 border border-slate-200 px-5 py-4 text-sm text-slate-700">
                <strong>One-time viewing:</strong> Once you press play, this counts as your one watch.
                <button
                  onClick={handlePlay}
                  className="mt-3 block w-full rounded-2xl bg-red-600 px-4 py-3 font-bold text-white"
                >
                  Play Movie
                </button>
              </div>
            ) : null}
            {error && <ErrorMsg msg={error} />}
          </div>
        )}

        <button
          onClick={() => setPage("producer")}
          className="mt-5 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-bold"
        >
          ← Back to dashboard
        </button>
      </div>
    </div>
  );
}

// ============================================================
// ROOT APP
// ============================================================
export default function CineGateApp() {
  const [page, setPage]                   = useState<Page>("login");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {page === "login" && <Login setPage={setPage} />}
      {page === "admin" && <Admin setPage={setPage} />}
      {page === "producer" && (
        <ProducerDashboard setPage={setPage} setSelectedMovie={setSelectedMovie} />
      )}
      {page === "submit" && <Submit setPage={setPage} />}
      {page === "player" && <Player movie={selectedMovie} setPage={setPage} />}
    </div>
  );
}