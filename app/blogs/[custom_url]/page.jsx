"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "@/app/components/shared/Container";

// Same blog API base as app/blogs/page.jsx.
const BLOG_API_URL = process.env.NEXT_PUBLIC_BLOG_API_URL || "https://api.blog.bfinit.com/api/v1";

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-secondary/8 rounded-xl ${className}`} />;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (_) {
    return dateStr;
  }
}

export default function SingleBlogPage() {
  const params = useParams();
  const router = useRouter();
  const customUrl = params?.custom_url;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!customUrl) return;
    setLoading(true);
    setLoadError("");
    fetch(`${BLOG_API_URL}/single_blog_view/${customUrl}`)
      .then((r) => r.json())
      .then((d) => {
        // Matches the /show_blog list response convention: top-level flag
        // is `status`, not `success`. Unwrap one extra `data` level too,
        // in case this endpoint also nests the record like the paginated
        // list does — falls back to `d.data` directly if it doesn't.
        if (d?.status) setPost(d.data?.data ?? d.data ?? null);
        else setLoadError(d?.message || "This post could not be found.");
      })
      .catch(() => setLoadError("Could not reach the blog service. Check your connection."))
      .finally(() => setLoading(false));
  }, [customUrl]);

  if (loading) {
    return (
      <section className="bg-primary-bg py-16 min-h-screen">
        <Container>
          <div className="max-w-3xl mx-auto space-y-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-72 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </Container>
      </section>
    );
  }

  if (loadError || !post) {
    return (
      <section className="bg-primary-bg py-20 min-h-screen flex items-center justify-center">
        <Container>
          <div className="text-center space-y-4">
            <p className="text-secondary/50 text-lg">{loadError || "Post not found."}</p>
            <button
              onClick={() => router.push("/blogs")}
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold cursor-pointer"
            >
              Back to Blog
            </button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-primary-bg py-16 min-h-screen">
      <Container>
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.push("/blogs")}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-secondary/15 text-secondary/60 text-sm font-medium hover:bg-secondary/5 transition-colors cursor-pointer mb-10"
          >
            ← Back to Blog
          </button>

          <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-primary mb-4">
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

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-secondary mb-6 leading-tight">
            {post.title}
          </h1>

          {post.thumbnail && (
            <div className="rounded-3xl overflow-hidden border border-secondary/10 mb-10">
              <img src={post.thumbnail} alt={post.title} className="w-full h-auto object-cover" />
            </div>
          )}

          {post.content && (
            <article
                    className="
                        prose prose-neutral max-w-none
                        !text-gray-600
                        prose-headings:!text-secondary
                        prose-p:!text-gray-600
                        prose-li:!text-gray-600
                        prose-strong:!text-gray-600
                        prose-em:!text-gray-600
                        prose-blockquote:!text-gray-600
                        prose-a:!text-primary
                    "
                    dangerouslySetInnerHTML={{ __html: post.content }}
                    />
          )}

          <div className="mt-16 pt-8 border-t border-secondary/[0.07] flex items-center justify-between">
            <button
              onClick={() => router.push("/blogs")}
              className="px-5 py-2.5 rounded-xl border border-secondary/15 text-secondary/60 text-sm font-medium hover:bg-secondary/5 transition-colors cursor-pointer"
            >
              ← All posts
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
