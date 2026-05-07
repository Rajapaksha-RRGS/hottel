'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Star, MessageSquare, Send, ChevronDown } from 'lucide-react';

interface FeedbackItem {
  _id: string;
  category: string;
  rating: number;
  message: string;
  createdAt: string;
}

const categories = ['Room', 'Service', 'Food', 'Overall'];

export default function FeedbackPage() {
  const { data: session } = useSession();
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [form, setForm] = useState({ category: 'Overall', rating: 0, message: '' });
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    fetchFeedbacks();
  }, [session]);

  const fetchFeedbacks = async () => {
    if (!session?.user?.email) return;
    try {
      const res = await fetch(`/api/guest/feedback?email=${encodeURIComponent(session.user.email)}`);
      const data = await res.json();
      if (data.ok) setFeedbacks(data.feedbacks);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.rating === 0) { setMessage({ type: 'error', text: 'Please select a rating' }); return; }
    if (!form.message.trim()) { setMessage({ type: 'error', text: 'Please enter feedback' }); return; }

    setSubmitting(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/guest/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session?.user?.email, name: session?.user?.name, category: form.category, rating: form.rating, message: form.message }),
      });
      const data = await res.json();
      if (data.ok) {
        setMessage({ type: 'success', text: 'Thank you for your feedback!' });
        setForm({ category: 'Overall', rating: 0, message: '' });
        fetchFeedbacks();
      } else {
        setMessage({ type: 'error', text: data.message || 'Submission failed' });
      }
    } catch { setMessage({ type: 'error', text: 'Network error' }); }
    finally { setSubmitting(false); }
  };

  const renderStars = (count: number, interactive = false) => (
    <div className="flex gap-1 star-rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={interactive ? 24 : 14}
          className={`star ${(interactive ? (hoverRating || form.rating) >= i : count >= i) ? 'active text-gold fill-gold' : 'text-bone/20'}`}
          onClick={interactive ? () => setForm({ ...form, rating: i }) : undefined}
          onMouseEnter={interactive ? () => setHoverRating(i) : undefined}
          onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
        />
      ))}
    </div>
  );

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) return <div className="space-y-4 animate-fade-in-up">{[...Array(2)].map((_, i) => <div key={i} className="dashboard-card rounded-xl p-6"><div className="skeleton h-5 w-48 mb-3" /><div className="skeleton h-20 w-full" /></div>)}</div>;

  return (
    <div className="space-y-6 animate-fade-in-up max-w-3xl">
      {/* Submit Form */}
      <div className="dashboard-card rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-bone/10">
          <h2 className="font-serif text-lg text-bone">Share Your Experience</h2>
          <p className="text-xs text-bone/40 mt-1">We value your feedback to improve our services</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {message.text && (
            <div className={`px-4 py-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>{message.text}</div>
          )}

          <div>
            <label className="block text-xs text-bone/40 uppercase tracking-wider mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button key={c} type="button" onClick={() => setForm({ ...form, category: c })}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${form.category === c ? 'bg-gold/20 text-gold border border-gold/30' : 'text-bone/40 border border-bone/10 hover:text-bone/70'}`}
                >{c}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-bone/40 uppercase tracking-wider mb-3">Rating</label>
            {renderStars(0, true)}
          </div>

          <div>
            <label className="block text-xs text-bone/40 uppercase tracking-wider mb-2">Your Feedback</label>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} placeholder="Tell us about your experience..." className="w-full bg-bone/5 border border-bone/10 rounded-lg px-4 py-3 text-sm text-bone placeholder-bone/30 outline-none focus:border-gold/40 transition-colors resize-none" />
          </div>

          <button type="submit" disabled={submitting} className="flex items-center justify-center gap-2 px-6 py-3 bg-gold text-charcoal font-medium text-sm uppercase tracking-wide hover:bg-gold-light transition-all rounded-lg disabled:opacity-50">
            <Send size={16} />
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>

      {/* Previous Feedback */}
      {feedbacks.length > 0 && (
        <div className="dashboard-card rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-bone/10">
            <h2 className="font-serif text-lg text-bone">Your Previous Feedback</h2>
          </div>
          <div className="divide-y divide-bone/5">
            {feedbacks.map((fb) => (
              <div key={fb._id} className="px-6 py-4 hover:bg-bone/5 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 text-[11px] text-gold/70 border border-gold/20 rounded-full">{fb.category}</span>
                    {renderStars(fb.rating)}
                  </div>
                  <span className="text-xs text-bone/30">{fmt(fb.createdAt)}</span>
                </div>
                <p className="text-sm text-bone/60">{fb.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
