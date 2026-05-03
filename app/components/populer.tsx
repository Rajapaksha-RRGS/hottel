import React from "react";
import Link from "next/link";

const activities = [
  {
    title: "Pigeon Island",
    description:
      "A trip to Pigeon Island is a must visit, discover sea turtles and tropical fish in a protected marine sanctuary.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&h=600&fit=crop",
    href: "/activity/pigeon-island",
  },
  {
    title: "Sigiriya",
    description:
      "Visit the ancient rock fortress and palace ruins, one of Sri Lanka’s most iconic landmarks.",
    image:
      "https://images.unsplash.com/photo-1562967914-608f82629710?w=900&h=600&fit=crop",
    href: "/activity/sigiriya",
  },
  {
    title: "Kandy",
    description:
      "A beautiful hill city with mountains, tea country, and rich culture including the Temple of the Tooth.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&h=600&fit=crop",
    href: "/activity/kandy",
  },
  {
    title: "Galle Dutch Fort",
    description:
      "Explore cobblestone streets, colonial architecture, and ocean views at this UNESCO heritage location.",
    image:
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=900&h=600&fit=crop",
    href: "/activity/galle-fort",
  },
];

export default function PopularActivity() {
  return (
    <section className="bg-[#efefef] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
            Popular Activity
          </h2>
          <p className="mt-5 text-slate-600 text-lg leading-relaxed">
            Discover the best places and experiences around Sri Lanka with
            breathtaking views, culture, and unforgettable adventures.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {activities.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-200"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-52 object-cover"
              />
              <div className="p-5">
                <h3 className="text-2xl font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-slate-600 leading-8 text-lg">
                  {item.description}
                </p>
                <Link
                  href={item.href}
                  className="inline-block mt-4 text-blue-600 font-medium hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                >
                  Learn more
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}