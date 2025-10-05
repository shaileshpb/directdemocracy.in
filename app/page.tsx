// directdemocracy.in/app/page.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";

type PressRelease = {
  _id: string;
  title: string;
  ministry: string;
  posted_on_raw: string;
  body_text: string;
  url: string;
};

export default function HomePage() {
  const [releases, setReleases] = useState<PressRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastReleaseElementRef = useCallback(
    (node: HTMLAnchorElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/press-releases?page=${page}&limit=25`);
        if (!res.ok) {
          throw new Error("Failed to fetch press releases");
        }
        const data = await res.json();
        setReleases((prevReleases) => [...prevReleases, ...data.releases]);
        setHasMore(data.releases.length > 0 && releases.length + data.releases.length < data.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [page]);

  if (releases.length === 0 && loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium">Loading updates...</p>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Government Updates for Citizens
      </h1>

      <div className="space-y-6 overflow-y-auto">
        {releases.map((release, index) => {
          const isLastElement = releases.length === index + 1;
          return (
            <a
              key={release._id}
              ref={isLastElement ? lastReleaseElementRef : null}
              href={release.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 bg-white rounded-2xl shadow hover:shadow-lg transition-shadow duration-200"
            >
              <h2 className="text-lg font-bold mb-2">{release.title}</h2>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Ministry:</span> {release.ministry}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                <span className="font-medium">Date:</span> {release.posted_on_raw}
              </p>
              <p className="text-gray-800 line-clamp-4">
                {(() => {
                  const text = release.body_text || "";
                  const idx = text.indexOf("PIB Delhi");
                  return idx !== -1 ? text.slice(idx + "PIB Delhi".length).trim() : text;
                })()}
              </p>
            </a>
          );
        })}
      </div>
      {loading && (
        <div className="text-center p-4 font-medium text-gray-500">
          Loading more...
        </div>
      )}
      {!hasMore && releases.length > 0 && (
        <div className="text-center p-4 font-medium text-gray-500">
          You have reached the end.
        </div>
      )}
    </main>
  );
}