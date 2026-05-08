'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Edit2, Trash2, Image as ImageIcon, 
  Loader2, Check, X, Flame, Clock, Info, Utensils
} from 'lucide-react';
import Image from 'next/image';

type Prices = {
  normal: number;
  full?: number;
};

type FoodItem = {
  _id: string;
  name: string;
  category: 'Appetizer' | 'Main' | 'Dessert' | 'Beverage' | 'Cocktail' | 'Shot' | 'Grilled' | 'Fried' | 'Burgers' | 'Sandwich'| 'spaghetti' | 'pastha' ;
  prices: Prices;
  image: string;
  prepTime?: string;
  allergens?: string[];
  spiceLevel?: number;
  isAvailable: boolean;
  description?: string;
};

const CATEGORIES = ['All', 'Appetizer' , 'Main' , 'Dessert' , 'Beverage' ,'Cocktail' , 'Shot' , 'Grilled' , 'Fried' , 'Burgers' , 'Sandwich' ,'spaghetti','pastha'];

export default function MenuManagement() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<FoodItem>>({
    name: '',
    category: 'Main',
    prices: { normal: 0 },
    image: '',
    prepTime: '',
    allergens: [],
    spiceLevel: 0,
    isAvailable: true,
    description: ''
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [filterCategory]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const url = filterCategory === 'All' 
        ? '/api/admin/menu' 
        : `/api/admin/menu?category=${filterCategory}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

const uploadImage = async (file: File) => {
    setIsUploading(true);
    const formDataObj = new FormData();
    
    formDataObj.append('file', file);
    // මෙතැනට අපේ අලුත් Unsigned Preset එක ලැබෙනවා
    formDataObj.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'menu_items_preset');

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dfb6mzn1z';
      
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formDataObj,
      });

      const data = await res.json();
      
      if (data.secure_url) {
        // පින්තූරය සාර්ථකව upload වුණාම URL එක state එකට දානවා
        setFormData(prev => ({ ...prev, image: data.secure_url }));
        console.log("Seafood image uploaded:", data.secure_url);
      } else {
        alert('Cloudinary Error: ' + data.error.message);
      }
    } catch (error) {
      console.error('Network error during upload:', error);
    } finally {
      setIsUploading(false);
    }
};

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadImage(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadImage(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.image || !formData.prices?.normal) {
      alert('Please fill out all required fields (Name, Price, Image).');
      return;
    }
    setSaving(true);
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem ? `/api/admin/menu/${editingItem._id}` : '/api/admin/menu';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchItems();
      } else {
        alert('Failed to save item.');
      }
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await fetch(`/api/admin/menu/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const toggleAvailability = async (item: FoodItem) => {
    try {
      const res = await fetch(`/api/admin/menu/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, isAvailable: !item.isAvailable })
      });
      if (res.ok) {
        setItems(items.map(i => i._id === item._id ? { ...i, isAvailable: !i.isAvailable } : i));
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  const openModal = (item?: FoodItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      setFormData({
        name: '', category: 'Main', prices: { normal: 0 }, image: '', prepTime: '', allergens: [], spiceLevel: 0, isAvailable: true, description: ''
      });
    }
    setIsModalOpen(true);
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900/60 border border-slate-800/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 w-full sm:w-64 transition-all duration-200"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 max-w-full hide-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  filterCategory === cat 
                    ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all duration-200 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Menu Item
        </button>
      </div>

      {/* Grid View */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800/50">
          <Utensils className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-300">No items found</h3>
          <p className="text-slate-500 mt-1">Try adjusting your search or add a new menu item.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <motion.div
              key={item._id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`bg-slate-900/60 border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col ${
                item.isAvailable ? 'border-slate-800/60 hover:border-amber-500/30' : 'border-slate-800/30 opacity-75'
              }`}
            >
              {/* Image Section */}
              <div className="relative h-48 w-full bg-slate-800">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                )}
                
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <span className="px-2.5 py-1 bg-slate-950/80 backdrop-blur-md rounded-lg text-xs font-medium text-amber-400 border border-slate-700/50">
                    {item.category}
                  </span>
                </div>

                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => openModal(item)}
                    className="p-1.5 bg-slate-950/80 backdrop-blur-md rounded-lg text-slate-300 hover:text-amber-400 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-1.5 bg-slate-950/80 backdrop-blur-md rounded-lg text-slate-300 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white leading-tight">{item.name}</h3>
                  <div className="text-right">
                    <span className="text-amber-500 font-bold block">${item.prices.normal.toFixed(2)}</span>
                    {item.prices.full && (
                      <span className="text-xs text-slate-400 block">Full: ${item.prices.full.toFixed(2)}</span>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-1">
                  {item.description || 'No description provided.'}
                </p>
                
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4">
                  {item.prepTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {item.prepTime}
                    </div>
                  )}
                  {item.spiceLevel ? (
                    <div className="flex items-center gap-0.5 text-red-400">
                      {Array.from({ length: item.spiceLevel }).map((_, i) => (
                        <Flame key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  ) : null}
                  {item.allergens && item.allergens.length > 0 && (
                    <div className="flex items-center gap-1 cursor-help" title={item.allergens.join(', ')}>
                      <Info className="w-3.5 h-3.5" />
                      {item.allergens.length} tags
                    </div>
                  )}
                </div>

                {/* Availability Toggle */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/50">
                  <span className="text-sm font-medium text-slate-400">
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                  <button
                    onClick={() => toggleAvailability(item)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                      item.isAvailable ? 'bg-amber-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        item.isAvailable ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0a0e17] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-800/50">
                <h2 className="text-xl font-bold text-white">
                  {editingItem ? 'Edit Menu Item' : 'Add New Item'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                {/* Image Upload Zone */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Item Image (Required)</label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center overflow-hidden transition-colors ${
                      isDragging ? 'border-amber-500 bg-amber-500/5' : 'border-slate-700 bg-slate-900/50 hover:bg-slate-800/50'
                    }`}
                  >
                    {formData.image ? (
                      <>
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-950/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <label className="cursor-pointer bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors">
                            Change Image
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                          </label>
                        </div>
                      </>
                    ) : isUploading ? (
                      <div className="flex flex-col items-center text-amber-500">
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                        <span className="text-sm font-medium">Uploading...</span>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center p-6 text-slate-400 text-center">
                        <ImageIcon className="w-10 h-10 mb-3 text-slate-500" />
                        <span className="text-sm font-medium text-slate-300 mb-1">Drag & drop an image here</span>
                        <span className="text-xs text-slate-500">or click to browse</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      </label>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Item Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
                        placeholder="e.g., Grilled Salmon"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500 transition-colors appearance-none"
                      >
                        {CATEGORIES.filter(c => c !== 'All').map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Normal Price ($) *</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.prices?.normal || ''}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            prices: { ...formData.prices!, normal: parseFloat(e.target.value) } 
                          })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Price ($)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.prices?.full || ''}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            prices: { ...formData.prices!, full: parseFloat(e.target.value) } 
                          })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Extra Details */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Prep Time</label>
                      <input
                        type="text"
                        value={formData.prepTime}
                        onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
                        placeholder="e.g., 15-20 mins"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Allergen Tags</label>
                      <input
                        type="text"
                        value={formData.allergens?.join(', ')}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          allergens: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                        })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
                        placeholder="e.g., Nuts, Dairy, Gluten (comma separated)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Spice Level (0-3)</label>
                      <input
                        type="range"
                        min="0"
                        max="3"
                        step="1"
                        value={formData.spiceLevel || 0}
                        onChange={(e) => setFormData({ ...formData, spiceLevel: parseInt(e.target.value) })}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 mt-3"
                      />
                      <div className="flex justify-between text-xs text-slate-500 mt-2">
                        <span>None</span>
                        <span>Mild</span>
                        <span>Medium</span>
                        <span>Hot</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                    placeholder="Brief description of the dish..."
                  />
                </div>
                
                <div className="flex items-center gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-slate-200">Active Status</h4>
                    <p className="text-xs text-slate-500">Show this item on the live menu</p>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, isAvailable: !formData.isAvailable })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                      formData.isAvailable ? 'bg-amber-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        formData.isAvailable ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="p-6 border-t border-slate-800/50 flex justify-end gap-3 bg-slate-900/30">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || isUploading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                >
                  {saving ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                  ) : (
                    <><Check className="w-4 h-4" /> Save Item</>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
