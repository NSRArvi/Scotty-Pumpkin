"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@/app/components/shared/Container";

// Blog API lives on its own subdomain/base path, separate from the main
// NEXT_PUBLIC_API_URL used elsewhere in the app.
const BLOG_API_URL = process.env.NEXT_PUBLIC_BLOG_API_URL || "https://api.blog.bfinit.com/api/v1";

// Route contract (Laravel):
//   GET /show_blog/{category_id}  -> BlogController::index
// 32 was given as the working example id — confirm with your backend
// whether this is really an "all posts" id or just one category among
// others. If it's just one category, swap in a real "all" id/route once
// you have one, and treat this as the default/initial category instead.
const ALL_CATEGORIES_ID = "38";

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-secondary/8 rounded-xl ${className}`} />;
}

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (_) {
    return dateStr;
  }
}

function BlogCardSkeleton() {
  return (
    <div className="rounded-3xl border border-secondary/10 bg-white overflow-hidden">
      <Skeleton className="h-44 rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export default function BlogsPage() {
  return (
    <Suspense fallback={<BlogsPageFallback />}>
      <BlogsPageContent />
    </Suspense>
  );
}

// Rendered instantly (server-side / before hydration) while the part that
// needs useSearchParams() suspends — keeps the page from bailing out of
// static prerendering entirely.
function BlogsPageFallback() {
  return (
    <section className="bg-primary-bg py-16 min-h-screen">
      <Container>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function BlogsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category") || ALL_CATEGORIES_ID;

  const [activeCategory, setActiveCategory] = useState(categoryFromUrl);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // ── Blogs for the active category ──────────────────────────
  // Real response shape (confirmed from the live endpoint):
  //   { status: true, message: "...", data: { data: [ ...posts ], current_page, total, ... } }
  // i.e. Laravel's paginate() — the post array is nested two levels deep
  // under `data.data`, and the top-level flag is `status`, not `success`.
  const loadBlogs = useCallback((categoryId) => {
    setLoading(true);
    setLoadError("");
    fetch(`${BLOG_API_URL}/show_blog/${categoryId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.status) {
          const posts = Array.isArray(d.data?.data) ? d.data.data : [];
          setBlogs(posts);
        } else {
          setLoadError(d?.message || "Unable to load blogs right now.");
        }
      })
      .catch(() => setLoadError("Could not reach the blog service. Check your connection."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadBlogs(activeCategory);
  }, [activeCategory, loadBlogs]);

  function selectCategory(id) {
    setActiveCategory(id);
    const qs = id === ALL_CATEGORIES_ID ? "" : `?category=${id}`;
    router.push(`/blogs${qs}`, { scroll: false });
  }

  return (
    <section className="bg-primary-bg py-16 min-h-screen">
      <Container>
        <div className="max-w-2xl mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-secondary mb-3">
           Recent Blogs & Information
          </h1>
          <p className="text-secondary/50 text-base font-light">
            News, updates, and deep dives from the Scotty Pumpkin team.
          </p>
        </div>

        {/* Single category tab for now — no category-list endpoint exists yet.
            Add more tabs here once you have real category ids/names to switch between. */}
        {/* <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => selectCategory(ALL_CATEGORIES_ID)}
            className="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-primary text-white"
          >
            All
          </button>
        </div> */}

        {loadError && (
          <div className="mb-8 px-4 py-3 rounded-xl bg-red-500/8 border border-red-400/20 text-red-500 text-sm flex items-center justify-between gap-3">
            <span>{loadError}</span>
            <button
              onClick={() => loadBlogs(activeCategory)}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 font-semibold cursor-pointer transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : blogs.length === 0 && !loadError ? (
          <div className="text-center py-24">
            <p className="text-secondary/40 text-lg">No posts here yet — check back soon.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((post) => (
              <div
                key={post.id}
                onClick={() => router.push(`/blogs/${post.custom_url}`)}
                className="text-left rounded-3xl border border-secondary/10 bg-white overflow-hidden hover:shadow-xl hover:shadow-secondary/5 transition-shadow cursor-pointer group"
              >
                <div className="h-44 bg-secondary/5 overflow-hidden">
                  {post.thumbnail ? (
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">📝</div>
                  )}
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-primary">
                    {post.category_name && <span>{post.category_name}</span>}
                    {post.created_at && (
                      <>
                        <span className="text-secondary/20">·</span>
                        <span className="text-secondary/40 font-medium normal-case tracking-normal">
                          {formatDate(post.created_at)}
                        </span>
                      </>
                    )}
                  </div>
                  <h2 className="text-secondary font-bold text-lg leading-snug line-clamp-2">
                    {post.title}
                  </h2>
                  {post.content && (
                    <p className="text-gray-600 text-sm font-light line-clamp-2">
                      {stripHtml(post.content).slice(0, 140)}
                    </p>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/blogs/${post.custom_url}`);
                    }}
                    className="inline-flex items-center gap-1 pt-2 text-primary text-sm font-semibold cursor-pointer group-hover:gap-1.5 transition-all"
                  >
                    Read more
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
