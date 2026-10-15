import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearSelectedFood, fetchFoodDetails } from '../store/foodSlice';
import { addToCart } from '../store/cartSlice';
import {
  X,
  Star,
  Clock,
  Flame,
  Leaf,
  Plus,
  Minus,
  Check,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export default function FoodDetailModal() {
  const dispatch = useDispatch();
  const { selectedFood, isDetailLoading, detailError } = useSelector((state) => state.food);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!selectedFood && !isDetailLoading && !detailError) return null;

  const handleClose = () => {
    dispatch(clearSelectedFood());
    setQuantity(1);
    setAddedNotice(false);
  };

  const handleAdd = () => {
    if (!selectedFood) return;
    dispatch(
      addToCart({
        ...selectedFood,
        quantity
      })
    );
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      handleClose();
    }, 700);
  };

  const handleRetry = () => {
    if (selectedFood?.id) {
      dispatch(fetchFoodDetails(selectedFood.id));
    }
  };

  return (
    <div style={overlayStyle} onClick={handleClose}>
      <div
        className="glass-panel"
        style={modalContainerStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button style={closeButtonStyle} onClick={handleClose} title="Close details modal">
          <X size={20} color="#94a3b8" />
        </button>

        {/* Loading State (Exp 1f) */}
        {isDetailLoading && (
          <div style={loadingContainerStyle}>
            <div
              className="animate-spin"
              style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(249, 115, 22, 0.2)',
                borderTopColor: 'var(--accent-primary)',
                borderRadius: '50%'
              }}
            />
            <div style={{ marginTop: '16px', fontSize: '0.95rem', color: '#cbd5e1' }}>
              Retrieving detailed food item from REST API...
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              Axios GET /api/foods/:id (Experiment 1g)
            </div>
          </div>
        )}

        {/* Error State (Exp 1f) */}
        {detailError && !isDetailLoading && (
          <div style={errorContainerStyle}>
            <AlertTriangle size={48} color="#ef4444" />
            <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', marginTop: '12px' }}>
              Failed to load food details
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '340px', textAlign: 'center' }}>
              {detailError}
            </p>
            <button onClick={handleRetry} className="btn-secondary" style={{ marginTop: '16px' }}>
              <RotateCcw size={15} /> Retry API Request
            </button>
          </div>
        )}

        {/* Food Details (Exp 1g) */}
        {selectedFood && !isDetailLoading && (
          <div style={modalBodyStyle}>
            {/* Left: Image & Quick Stats */}
            <div style={modalImageSectionStyle}>
              <img
                src={selectedFood.image}
                alt={selectedFood.name}
                style={modalHeroImageStyle}
              />
              <div style={floatingCategoryBadgeStyle}>
                <span className="badge badge-primary">{selectedFood.category}</span>
                {selectedFood.isVegetarian && (
                  <span className="badge badge-success">
                    <Leaf size={11} /> 100% Vegetarian
                  </span>
                )}
                {selectedFood.isSpicy && (
                  <span className="badge badge-danger">
                    <Flame size={11} /> Spicy
                  </span>
                )}
              </div>

              {/* Nutrition & Meta Grid */}
              <div style={statsGridStyle}>
                <div style={statBoxStyle}>
                  <Flame size={18} color="#f97316" />
                  <span style={statValueStyle}>{selectedFood.calories || 550}</span>
                  <span style={statLabelStyle}>Calories</span>
                </div>
                <div style={statBoxStyle}>
                  <Clock size={18} color="#fbbf24" />
                  <span style={statValueStyle}>{selectedFood.prepTime || '15m'}</span>
                  <span style={statLabelStyle}>Prep Time</span>
                </div>
                <div style={statBoxStyle}>
                  <Star size={18} fill="#f59e0b" color="#f59e0b" />
                  <span style={statValueStyle}>{selectedFood.rating}</span>
                  <span style={statLabelStyle}>Rating</span>
                </div>
              </div>
            </div>

            {/* Right: Info & Cart Addition */}
            <div style={modalInfoSectionStyle}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Rest API Food Details (GET /api/foods/{selectedFood.id})
                </span>
                <h2 style={{ fontSize: '1.65rem', color: '#ffffff', lineHeight: 1.2 }}>
                  {selectedFood.name}
                </h2>
              </div>

              <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.55 }}>
                {selectedFood.description}
              </p>

              {/* Chef's Notes */}
              {selectedFood.chefNotes && (
                <div style={chefNoteBoxStyle}>
                  <Sparkles size={16} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24' }}>
                      Chef's Culinary Note
                    </div>
                    <div style={{ fontSize: '0.84rem', color: '#cbd5e1', fontStyle: 'italic' }}>
                      "{selectedFood.chefNotes}"
                    </div>
                  </div>
                </div>
              )}

              {/* Ingredients List */}
              {selectedFood.ingredients && (
                <div>
                  <h4 style={{ fontSize: '0.88rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                    Fresh Ingredients
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(Array.isArray(selectedFood.ingredients) ? selectedFood.ingredients : selectedFood.ingredients.split(',')).map((ing, i) => (
                      <span key={i} className="badge badge-secondary" style={{ textTransform: 'none', fontSize: '0.8rem', padding: '4px 10px' }}>
                        {ing.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Allergen Warning */}
              {selectedFood.allergens && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <ShieldAlert size={16} color="#ef4444" />
                  <span style={{ fontSize: '0.8rem', color: '#fca5a5' }}>
                    <strong>Allergens:</strong>{' '}
                    {Array.isArray(selectedFood.allergens) ? selectedFood.allergens.join(', ') : selectedFood.allergens}
                  </span>
                </div>
              )}

              {/* Bottom Row: Quantity & Add to Cart (Exp 2b) */}
              <div style={modalFooterRowStyle}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unit Price</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                    ${Number(selectedFood.price).toFixed(2)}
                  </span>
                </div>

                {/* Quantity Controls */}
                <div style={qtyControlGroupStyle}>
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={qtyButtonStyle}
                    disabled={quantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ width: '28px', textAlign: 'center', fontWeight: 700, fontSize: '1rem' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    style={qtyButtonStyle}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAdd}
                  className="btn-primary"
                  style={{ flex: 1, padding: '12px 18px', fontSize: '0.92rem' }}
                >
                  {addedNotice ? (
                    <>
                      <Check size={18} /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <Plus size={18} /> Add (${(Number(selectedFood.price) * quantity).toFixed(2)})
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
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
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px'
};

const modalContainerStyle = {
  width: '100%',
  maxWidth: '820px',
  borderRadius: 'var(--radius-xl)',
  overflow: 'hidden',
  position: 'relative',
  background: 'var(--bg-secondary)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  boxShadow: 'var(--shadow-lg)'
};

const closeButtonStyle = {
  position: 'absolute',
  top: '16px',
  right: '16px',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: 'rgba(0, 0, 0, 0.5)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  zIndex: 10
};

const loadingContainerStyle = {
  padding: '60px 20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
};

const errorContainerStyle = {
  padding: '50px 20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
};

const modalBodyStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  maxHeight: '85vh',
  overflowY: 'auto'
};

const modalImageSectionStyle = {
  position: 'relative',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  background: 'rgba(0, 0, 0, 0.2)'
};

const modalHeroImageStyle = {
  width: '100%',
  height: '260px',
  objectFit: 'cover',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-subtle)'
};

const floatingCategoryBadgeStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px'
};

const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '10px'
};

const statBoxStyle = {
  background: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-md)',
  padding: '10px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px'
};

const statValueStyle = {
  fontSize: '0.95rem',
  fontWeight: 700,
  color: '#ffffff'
};

const statLabelStyle = {
  fontSize: '0.72rem',
  color: 'var(--text-muted)'
};

const modalInfoSectionStyle = {
  padding: '28px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  justifyContent: 'space-between'
};

const chefNoteBoxStyle = {
  display: 'flex',
  gap: '10px',
  background: 'rgba(251, 191, 36, 0.08)',
  border: '1px solid rgba(251, 191, 36, 0.25)',
  padding: '10px 14px',
  borderRadius: 'var(--radius-md)'
};

const modalFooterRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  paddingTop: '16px',
  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  marginTop: '8px'
};

const qtyControlGroupStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  background: 'rgba(255, 255, 255, 0.06)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-md)',
  padding: '4px'
};

const qtyButtonStyle = {
  width: '28px',
  height: '28px',
  borderRadius: '6px',
  background: 'rgba(255, 255, 255, 0.08)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ffffff',
  cursor: 'pointer'
};
