import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createFood, updateFood } from '../store/foodSlice';
import { X, Plus, Edit3, DollarSign, Sparkles } from 'lucide-react';

const CATEGORIES = ['Burgers', 'Asian', 'Pizza', 'Mexican', 'Bowls', 'Italian', 'Desserts', 'Beverages'];

export default function CrudModal({ isOpen, onClose, editingFood }) {
  const dispatch = useDispatch();
  const { isMutating, mutationError } = useSelector((state) => state.food);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Burgers',
    price: '',
    calories: '550',
    prepTime: '15 mins',
    rating: '4.8',
    isVegetarian: false,
    isSpicy: false,
    image: '',
    description: '',
    ingredients: '',
    allergens: '',
    chefNotes: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (editingFood) {
      setFormData({
        name: editingFood.name || '',
        category: editingFood.category || 'Burgers',
        price: editingFood.price || '',
        calories: editingFood.calories || '550',
        prepTime: editingFood.prepTime || '15 mins',
        rating: editingFood.rating || '4.8',
        isVegetarian: Boolean(editingFood.isVegetarian),
        isSpicy: Boolean(editingFood.isSpicy),
        image: editingFood.image || '',
        description: editingFood.description || '',
        ingredients: Array.isArray(editingFood.ingredients) ? editingFood.ingredients.join(', ') : editingFood.ingredients || '',
        allergens: Array.isArray(editingFood.allergens) ? editingFood.allergens.join(', ') : editingFood.allergens || '',
        chefNotes: editingFood.chefNotes || ''
      });
    } else {
      setFormData({
        name: '',
        category: 'Burgers',
        price: '',
        calories: '550',
        prepTime: '15 mins',
        rating: '4.8',
        isVegetarian: false,
        isSpicy: false,
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        description: '',
        ingredients: 'Fresh seasonal ingredients, Herbs, Extra virgin olive oil',
        allergens: 'None',
        chefNotes: 'Crafted with premium farm-to-table ingredients.'
      });
    }
    setFormErrors({});
  }, [editingFood, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Food name is required';
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      errs.price = 'Valid price is required';
    }
    if (!formData.description.trim()) errs.description = 'Description is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingFood) {
      // PUT /api/foods/:id (Exp 3c)
      const action = await dispatch(updateFood({ id: editingFood.id, data: formData }));
      if (updateFood.fulfilled.match(action)) {
        onClose();
      }
    } else {
      // POST /api/foods (Exp 3b)
      const action = await dispatch(createFood(formData));
      if (createFood.fulfilled.match(action)) {
        onClose();
      }
    }
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div
        className="glass-panel"
        style={modalContainerStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={iconBadgeStyle}>
              {editingFood ? <Edit3 size={18} color="#f97316" /> : <Plus size={18} color="#f97316" />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0 }}>
                {editingFood ? `Edit "${editingFood.name}"` : 'Add New Food Item'}
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {editingFood
                  ? 'REST API PUT /api/foods/:id (Experiment 3c)'
                  : 'REST API POST /api/foods (Experiment 3b)'}
              </span>
            </div>
          </div>
          <button style={closeButtonStyle} onClick={onClose}>
            <X size={18} color="#94a3b8" />
          </button>
        </div>

        {/* Auth warning if not signed in as admin */}
        {(!isAuthenticated || user?.role !== 'admin') && (
          <div style={authNoticeBannerStyle}>
            <span style={{ fontSize: '0.8rem', color: '#fbbf24' }}>
              🔒 <strong>Note:</strong> Food menu modifications require an authorized Bearer token.
              {!isAuthenticated ? ' Please sign in as Admin.' : ' Current user is customer.'}
            </span>
          </div>
        )}

        {/* Mutation Error banner (Exp 3g) */}
        {mutationError && (
          <div style={errorBannerStyle}>
            <span style={{ fontSize: '0.84rem', color: '#fca5a5' }}>
              ❌ {mutationError}
            </span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={formGridStyle}>
            {/* Food Name */}
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Food Title *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Smoky Chipotle Pulled Pork"
                style={{ ...inputStyle, borderColor: formErrors.name ? 'var(--color-error)' : 'var(--border-subtle)' }}
              />
              {formErrors.name && <span style={errorTextStyle}>{formErrors.name}</span>}
            </div>

            {/* Category Select */}
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={inputStyle}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Price ($ USD) *</label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={14} color="#94a3b8" style={{ position: 'absolute', left: 10, top: 12 }} />
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="14.99"
                  style={{ ...inputStyle, paddingLeft: '28px', borderColor: formErrors.price ? 'var(--color-error)' : 'var(--border-subtle)' }}
                />
              </div>
              {formErrors.price && <span style={errorTextStyle}>{formErrors.price}</span>}
            </div>

            {/* Calories & Prep Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Calories</label>
                <input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  placeholder="550"
                  style={inputStyle}
                />
              </div>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Prep Time</label>
                <input
                  type="text"
                  value={formData.prepTime}
                  onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                  placeholder="15 mins"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Image URL with live preview */}
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Image URL</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                style={{ ...inputStyle, flex: 1 }}
              />
              {formData.image && (
                <img
                  src={formData.image}
                  alt="preview"
                  style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-subtle)' }}
                  onError={(e) => (e.target.style.display = 'none')}
                />
              )}
            </div>
          </div>

          {/* Description */}
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Description *</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe flavors, ingredients, cooking technique..."
              style={{ ...inputStyle, resize: 'vertical' }}
            />
            {formErrors.description && <span style={errorTextStyle}>{formErrors.description}</span>}
          </div>

          {/* Ingredients & Allergens */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Ingredients (comma-separated)</label>
              <input
                type="text"
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                placeholder="Beef, Garlic aioli, Brioche"
                style={inputStyle}
              />
            </div>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Allergens</label>
              <input
                type="text"
                value={formData.allergens}
                onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
                placeholder="Dairy, Gluten"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Toggles: Vegetarian & Spicy */}
          <div style={{ display: 'flex', gap: '20px', padding: '6px 0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.86rem' }}>
              <input
                type="checkbox"
                checked={formData.isVegetarian}
                onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
              />
              <span>🌱 Vegetarian Dish</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.86rem' }}>
              <input
                type="checkbox"
                checked={formData.isSpicy}
                onChange={(e) => setFormData({ ...formData, isSpicy: e.target.checked })}
              />
              <span>🌶️ Spicy Recipe</span>
            </label>
          </div>

          {/* Submit & Cancel Buttons with Loading Spinner (Exp 3f) */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn-secondary" disabled={isMutating}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isMutating} id="crud-submit-btn">
              {isMutating ? (
                <>
                  <div
                    className="animate-spin"
                    style={{ width: '16px', height: '16px', border: '2px solid rgba(255, 255, 255, 0.3)', borderTopColor: '#ffffff', borderRadius: '50%' }}
                  />
                  <span>Executing REST API...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>{editingFood ? 'Save Changes (PUT)' : 'Create Food (POST)'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.75)',
  backdropFilter: 'blur(8px)',
  zIndex: 1100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px'
};

const modalContainerStyle = {
  width: '100%',
  maxWidth: '680px',
  borderRadius: 'var(--radius-xl)',
  background: 'var(--bg-secondary)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  boxShadow: 'var(--shadow-lg)',
  overflow: 'hidden'
};

const headerStyle = {
  padding: '16px 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
};

const iconBadgeStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '8px',
  background: 'rgba(249, 115, 22, 0.15)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid rgba(249, 115, 22, 0.3)'
};

const closeButtonStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255, 255, 255, 0.05)',
  cursor: 'pointer'
};

const authNoticeBannerStyle = {
  padding: '8px 20px',
  background: 'rgba(245, 158, 11, 0.12)',
  borderBottom: '1px solid rgba(245, 158, 11, 0.25)'
};

const errorBannerStyle = {
  padding: '8px 20px',
  background: 'rgba(239, 68, 68, 0.15)',
  borderBottom: '1px solid rgba(239, 68, 68, 0.3)'
};

const formStyle = {
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  maxHeight: '75vh',
  overflowY: 'auto'
};

const formGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '12px'
};

const fieldGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px'
};

const labelStyle = {
  fontSize: '0.8rem',
  fontWeight: 600,
  color: 'var(--text-muted)'
};

const inputStyle = {
  background: 'var(--bg-input)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-sm)',
  padding: '9px 12px',
  color: 'var(--text-main)',
  fontSize: '0.88rem'
};

const errorTextStyle = {
  fontSize: '0.74rem',
  color: 'var(--color-error)'
};
