"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/press-releases");
        if (!res.ok) {
          throw new Error("Failed to fetch press releases");
        }
        const data = await res.json();
        setReleases(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium">Loading press releases...</p>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        PIB Press Releases
      </h1>

      <div className="space-y-6 overflow-y-auto">
        {releases.map((release) => (
          <a
            key={release._id}
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
              <span className="font-medium">Date:</span>{" "}
              {release.posted_on_raw}
              
            </p>
            <p className="text-gray-800 line-clamp-4">{release.body_text}</p>
          </a>
        ))}
      </div>
    </main>
  );
}
