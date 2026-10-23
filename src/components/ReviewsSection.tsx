import React from 'react';
import { Star, CheckCircle2, ThumbsUp } from 'lucide-react';

export default function ReviewsSection({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  const reviews = [
    {
      id: 'rev_1',
      author: 'Clara Weber',
      location: 'Munich, Germany',
      rating: 5,
      date: 'September 14, 2026',
      title: 'Stunning organic warm amber glow over our dining table!',
      content:
        'We were curious how the sea container pooling worked. The order took roughly 4 weeks to arrive in Munich once the container sailed, and the shade is simply breathtaking. The natural bamboo lattice casts beautiful radial geometry across our ceiling. Truly heirloom Indian craftsmanship.',
      verified: true,
      helpful: 34,
    },
    {
      id: 'rev_2',
      author: 'Marc Lefebvre',
      location: 'Lyon, France',
      rating: 5,
      date: 'August 28, 2026',
      title: 'Remarkable value compared to Parisian designer showrooms',
      content:
        'Equivalent handwoven bamboo shades in European design stores cost €300+. Buying directly from the Indian maker via container freight saved us a massive amount. Fits European E27 socket seamlessly. Each split of bamboo feels authentic and alive.',
      verified: true,
      helpful: 21,
    },
    {
      id: 'rev_3',
      author: 'Anouk van Dijk',
      location: 'Amsterdam, Netherlands',
      rating: 5,
      date: 'July 19, 2026',
      title: 'Eco-conscious shipping that makes total sense',
      content:
        'Love the concept of pooled container shipping instead of high-emission air freight. The shade arrived in sturdy recycled honeycomb packaging in perfect condition. Measurements matched approx. 40cm as noted.',
      verified: true,
      helpful: 19,
    },
  ];

  return (
    <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h2 className="font-heading font-bold text-xl text-gray-900 dark:text-white mb-6">
        Customer Reviews & Verified European Feedback
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Rating Breakdown Bars (Amazon-Style) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-baseline gap-3">
            <span className="font-heading font-black text-4xl text-gray-900 dark:text-white">
              {rating}
            </span>
            <div>
              <div className="flex text-[#c68a24]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#c68a24] text-[#c68a24]" />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">{reviewCount} global European ratings</p>
            </div>
          </div>

          {/* Rating breakdown percent bars */}
          <div className="space-y-2 text-xs">
            {[
              { stars: '5 star', pct: 88 },
              { stars: '4 star', pct: 9 },
              { stars: '3 star', pct: 3 },
              { stars: '2 star', pct: 0 },
              { stars: '1 star', pct: 0 },
            ].map((row) => (
              <div key={row.stars} className="flex items-center gap-3">
                <span className="w-12 text-gray-600 dark:text-gray-400">{row.stars}</span>
                <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#c68a24] rounded-full"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-gray-500">{row.pct}%</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[#f4f7f5] dark:bg-[#121c17] rounded-lg border border-[#d2dbd4] dark:border-[#273b33] text-xs space-y-1">
            <p className="font-bold text-[#173f34] dark:text-[#e5a439]">
              Verified Sea Freight Delivery
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Reviews submitted by European homeowners and interior designers who received orders through our pooled container batches.
            </p>
          </div>
        </div>

        {/* Right Individual Reviews */}
        <div className="lg:col-span-8 space-y-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 bg-white dark:bg-[#16221d] rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-[#173f34] text-[#e5a439] flex items-center justify-center font-bold text-xs">
                  {rev.author[0]}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-none">
                    {rev.author}
                  </h4>
                  <span className="text-[11px] text-gray-400">{rev.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 my-2">
                <div className="flex text-[#c68a24]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#c68a24] text-[#c68a24]" />
                  ))}
                </div>
                <h5 className="font-bold text-xs text-gray-900 dark:text-white">
                  {rev.title}
                </h5>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-2">
                <span>Reviewed on {rev.date}</span>
                {rev.verified && (
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified European Purchase
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                {rev.content}
              </p>

              <div className="mt-3 flex items-center gap-2 text-[11px] text-gray-400">
                <button
                  type="button"
                  className="px-2.5 py-1 border border-gray-300 dark:border-gray-700 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-1"
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>Helpful ({rev.helpful})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
