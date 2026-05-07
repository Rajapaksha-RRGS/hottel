'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { AlertCircle, Send, Clock, CheckCircle2, Loader2 } from 'lucide-react';

interface ComplaintItem {
  _id: string;
  category: string;
  priority: string;
  subject: string;
  description: string;
  status: string;
  createdAt: string;
}

const cats = ['Room', 'Service', 'Food', 'Cleanliness', 'Noise', 'Other'];
const priorities = ['Low', 'Medium', 'High'];

export default function ComplaintsPage() {
  const { data: session } = useSession();
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [form, setForm] = useState({ category: 'Room', priority: 'Medium', subject: '', description: '' });

  useEffect(() => { fetchComplaints(); }, [session]);

  const fetchComplaints = async () => {
    if (!session?.user?.email) return;
    try {
      const res = await fetch(`/api/guest/complaints?email=${encodeURIComponent(session.user.email)}`);
      const data = await res.json();
      if (data.ok) setComplaints(data.complaints);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.description.trim()) {
      setMsg({ type: 'error', text: 'Please fill all fields' }); return;
    }
    setSubmitting(true); setMsg({ type: '', text: '' });
    try {
      const res = await fetch('/api/guest/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session?.user?.email, name: session?.user?.name, ...form }),
      });
      const data = await res.json();
      if (data.ok) {
        setMsg({ type: 'success', text: 'Complaint submitted successfully' });
        setForm({ category: 'Room', priority: 'Medium', subject: '', description: '' });
        fetchComplaints();
      } else setMsg({ type: 'error', text: data.message || 'Failed' });
    } catch { setMsg({ type: 'error', text: 'Network error' }); }
    finally { setSubmitting(false); }
  };

  const statusIcon = (s: string) => {
    if (s === 'Open') return <AlertCircle size={14} className="text-amber-400" />;
    if (s === 'In-Progress') return <Loader2 size={14} className="text-blue-400 animate-spin" />;
    return <CheckCircle2 size={14} className="text-green-400" />;
  };

  const statusClass = (s: string) => {
    if (s === 'Open') return 'status-badge payment-pending';
    if (s === 'In-Progress') return 'status-badge status-checked-in';
    return 'status-badge payment-paid';
  };

  const priorityClass = (p: string) => {
    if (p === 'High') return 'text-red-400 bg-red-500/10 border-red-500/20';
    if (p === 'Medium') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-green-400 bg-green-500/10 border-green-500/20';
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) return <div className="space-y-4 animate-fade-in-up">{[...Array(2)].map((_, i) => <div key={i} className="dashboard-card rounded-xl p-6"><div className="skeleton h-5 w-48 mb-3" /><div className="skeleton h-20 w-full" /></div>)}</div>;

  return (
    <div className="space-y-6 animate-fade-in-up max-w-3xl">
      {/* Submit Form */}
      <div className="dashboard-card rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-bone/10">
          <h2 className="font-serif text-lg text-bone">Report an Issue</h2>
          <p className="text-xs text-bone/40 mt-1">Let us know about any concerns during your stay</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {msg.text && (
            <div className={`px-4 py-3 rounded-lg text-sm ${msg.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>{msg.text}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-bone/40 uppercase tracking-wider mb-2">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-bone/5 border border-bone/10 rounded-lg px-4 py-3 text-sm text-bone outline-none focus:border-gold/40 transition-colors appearance-none">
                {cats.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-bone/40 uppercase tracking-wider mb-2">Priority</label>
              <div className="flex gap-2">
                {priorities.map((p) => (
                  <button key={p} type="button" onClick={() => setForm({ ...form, priority: p })}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${form.priority === p ? priorityClass(p) : 'text-bone/40 border-bone/10 hover:text-bone/70'}`}
                  >{p}</button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs text-bone/40 uppercase tracking-wider mb-2">Subject</label>
            <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Brief description of the issue" className="w-full bg-bone/5 border border-bone/10 rounded-lg px-4 py-3 text-sm text-bone placeholder-bone/30 outline-none focus:border-gold/40 transition-colors" />
          </div>

          <div>
            <label className="block text-xs text-bone/40 uppercase tracking-wider mb-2">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} placeholder="Describe the issue in detail..." className="w-full bg-bone/5 border border-bone/10 rounded-lg px-4 py-3 text-sm text-bone placeholder-bone/30 outline-none focus:border-gold/40 transition-colors resize-none" />
          </div>

          <button type="submit" disabled={submitting} className="flex items-center justify-center gap-2 px-6 py-3 bg-gold text-charcoal font-medium text-sm uppercase tracking-wide hover:bg-gold-light transition-all rounded-lg disabled:opacity-50">
            <Send size={16} />
            {submitting ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </div>

      {/* Complaint History */}
      {complaints.length > 0 && (
        <div className="dashboard-card rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-bone/10">
            <h2 className="font-serif text-lg text-bone">Complaint History</h2>
          </div>
          <div className="divide-y divide-bone/5">
            {complaints.map((c) => (
              <div key={c._id} className="px-6 py-4 hover:bg-bone/5 transition-colors">
                <div className="flex items-start justify-between mb-2 gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-sm text-bone font-medium">{c.subject}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${priorityClass(c.priority)}`}>{c.priority}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-bone/40">
                      <span>{c.category}</span>
                      <span>•</span>
                      <span>{fmt(c.createdAt)}</span>
                    </div>
                  </div>
                  <span className={statusClass(c.status)}>
                    {statusIcon(c.status)}
                    {c.status}
                  </span>
                </div>
                <p className="text-sm text-bone/50 mt-2">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
