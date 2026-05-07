'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User, Mail, Phone, Save, Camera } from 'lucide-react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [form, setForm] = useState({ name: '', email: '', phone: '', image: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetch(`/api/guest/profile?email=${encodeURIComponent(session.user.email)}`);
        const data = await res.json();
        if (data.ok) {
          setForm({ name: data.guest.name, email: data.guest.email, phone: data.guest.phone || '', image: data.guest.image || '' });
        } else {
          setForm({ name: session.user.name || '', email: session.user.email || '', phone: '', image: session.user.image || '' });
        }
      } catch { setForm({ name: session?.user?.name || '', email: session?.user?.email || '', phone: '', image: '' }); }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, [session]);

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/guest/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, name: form.name, phone: form.phone }),
      });
      const data = await res.json();
      setMessage(data.ok ? { type: 'success', text: 'Profile updated!' } : { type: 'error', text: data.message || 'Update failed' });
    } catch { setMessage({ type: 'error', text: 'Network error' }); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
      <div className="dashboard-card rounded-xl p-8"><div className="skeleton h-20 w-20 rounded-full mx-auto mb-4" /><div className="skeleton h-5 w-40 mx-auto mb-6" /><div className="skeleton h-12 w-full mb-4" /><div className="skeleton h-12 w-full" /></div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
      <div className="dashboard-card rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-8 text-center border-b border-bone/10 bg-gradient-to-b from-gold/5 to-transparent">
          <div className="relative w-20 h-20 mx-auto mb-4">
            {form.image ? (
              <img src={form.image} alt="Profile" className="w-20 h-20 rounded-full object-cover border-3 border-gold/40" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gold/10 border-3 border-gold/40 flex items-center justify-center">
                <User size={32} className="text-gold" />
              </div>
            )}
            <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gold text-charcoal flex items-center justify-center hover:bg-gold-light transition-colors">
              <Camera size={14} />
            </button>
          </div>
          <h2 className="font-serif text-xl text-bone">{form.name}</h2>
          <p className="text-xs text-gold/60 uppercase tracking-widest mt-1">Guest</p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {message.text && (
            <div className={`px-4 py-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {message.text}
            </div>
          )}

          <div>
            <label className="block text-xs text-bone/40 uppercase tracking-wider mb-2">Full Name</label>
            <div className="flex items-center gap-3 bg-bone/5 border border-bone/10 rounded-lg px-4 py-3 focus-within:border-gold/40 transition-colors">
              <User size={16} className="text-bone/30" />
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="flex-1 bg-transparent text-bone text-sm outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-bone/40 uppercase tracking-wider mb-2">Email Address</label>
            <div className="flex items-center gap-3 bg-bone/5 border border-bone/10 rounded-lg px-4 py-3 opacity-60">
              <Mail size={16} className="text-bone/30" />
              <input type="email" value={form.email} readOnly className="flex-1 bg-transparent text-bone text-sm outline-none cursor-not-allowed" />
            </div>
            <p className="text-[11px] text-bone/30 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-xs text-bone/40 uppercase tracking-wider mb-2">Phone Number</label>
            <div className="flex items-center gap-3 bg-bone/5 border border-bone/10 rounded-lg px-4 py-3 focus-within:border-gold/40 transition-colors">
              <Phone size={16} className="text-bone/30" />
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Enter your phone number" className="flex-1 bg-transparent text-bone text-sm outline-none placeholder-bone/30" />
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gold text-charcoal font-medium text-sm uppercase tracking-wide hover:bg-gold-light transition-all rounded-lg disabled:opacity-50">
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
