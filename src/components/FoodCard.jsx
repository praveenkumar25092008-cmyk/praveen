import React, { useState, memo } from 'react';
import { Star, Clock, Flame, Leaf, Plus, Info, Edit3, Trash2 } from 'lucide-react';

function FoodCard({
  food,
  onSelectDetails,
  onAddToCart,
  onEdit,
  onDelete,
  showAdminActions = false
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <article
      className="glass-panel"
      style={cardContainerStyle}
      role="article"
      aria-label={food.name}
      data-testid={`food-card-${food.id}`}
    >
      {/* Food Image Container */}
      <div style={imageWrapperStyle}>
        {!imageLoaded && (
          <div className="skeleton" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />
        )}
        <img
          src={food.image}
          alt={food.name}
          style={{
            ...imageStyle,
            opacity: imageLoaded ? 1 : 0
          }}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
          decoding="async"
        />

        {/* Overlay Badges */}
        <div style={badgeOverlayStyle}>
          <span className="badge badge-primary">{food.category}</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {food.isVegetarian && (
              <span className="badge badge-success" title="Vegetarian">
                <Leaf size={11} /> Veg
              </span>
            )}
            {food.isSpicy && (
              <span className="badge badge-danger" title="Spicy">
                <Flame size={11} /> Spicy
              </span>
            )}
          </div>
        </div>

        {/* Admin Quick Overlay Actions */}
        {showAdminActions && (
          <div style={adminQuickActionsStyle}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(food);
              }}
              style={adminActionButtonStyle}
              title="Edit Food (PUT/PATCH)"
            >
              <Edit3 size={14} color="#ffffff" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(food.id);
              }}
              style={{ ...adminActionButtonStyle, background: 'rgba(239, 68, 68, 0.85)' }}
              title="Delete Food (DELETE)"
            >
              <Trash2 size={14} color="#ffffff" />
            </button>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div style={contentStyle}>
        {/* Rating and Meta */}
        <div style={metaRowStyle}>
          <div style={ratingStyle}>
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <span style={{ fontWeight: 700, fontSize: '0.86rem', color: '#f8fafc' }}>
              {food.rating}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              ({food.reviewsCount || 48})
            </span>
          </div>

          <div style={timeCaloriesStyle}>
            <span style={pillMetaStyle}>
              <Clock size={12} /> {food.prepTime || '15m'}
            </span>
            <span style={pillMetaStyle}>
              <Flame size={12} color="#f97316" /> {food.calories || 520} kcal
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 style={titleStyle} title={food.name}>
          {food.name}
        </h3>

        {/* Description */}
        <p style={descriptionStyle}>
          {food.description}
        </p>

        {/* Bottom Actions: Price, Details, Add to Cart */}
        <div style={footerStyle}>
          <div style={priceContainerStyle}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Price</span>
            <span style={priceValueStyle}>${Number(food.price).toFixed(2)}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* View Details Button (Exp 1g) */}
            <button
              onClick={() => onSelectDetails(food.id)}
              style={infoButtonStyle}
              title="Fetch Individual Food Details (GET /api/foods/:id)"
              aria-label={`View culinary details for ${food.name}`}
              id={`details-btn-${food.id}`}
            >
              <Info size={15} aria-hidden="true" />
              <span>Details</span>
            </button>

            {/* Add to Cart Button (Exp 2b) */}
            <button
              onClick={() => onAddToCart(food)}
              className="btn-primary"
              style={addCartButtonStyle}
              title="Add item to Redux cart"
              aria-label={`Add ${food.name} to cart for $${Number(food.price).toFixed(2)}`}
              id={`add-cart-btn-${food.id}`}
            >
              <Plus size={16} aria-hidden="true" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default memo(FoodCard);

const cardContainerStyle = {
  borderRadius: 'var(--radius-lg)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal)',
  border: '1px solid var(--border-subtle)',
  background: 'var(--bg-card)',
  height: '100%'
};

const imageWrapperStyle = {
  position: 'relative',
  width: '100%',
  height: '190px',
  overflow: 'hidden',
  background: '#151d30'
};

const imageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease'
};

const badgeOverlayStyle = {
  position: 'absolute',
  top: '12px',
  left: '12px',
  right: '12px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  pointerEvents: 'none'
};

const adminQuickActionsStyle = {
  position: 'absolute',
  bottom: '10px',
  right: '10px',
  display: 'flex',
  gap: '6px'
};

const adminActionButtonStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  background: 'rgba(15, 23, 42, 0.85)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  backdropFilter: 'blur(8px)'
};

const contentStyle = {
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: '10px'
};

const metaRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};

const ratingStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '5px'
};

const timeCaloriesStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px'
};

const pillMetaStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '3px',
  fontSize: '0.73rem',
  color: 'var(--text-muted)',
  background: 'rgba(255, 255, 255, 0.04)',
  padding: '2px 6px',
  borderRadius: '6px'
};

const titleStyle = {
  fontSize: '1.08rem',
  fontWeight: 700,
  lineHeight: 1.3,
  color: 'var(--text-main)',
  margin: 0,
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden'
};

const descriptionStyle = {
  fontSize: '0.84rem',
  color: 'var(--text-muted)',
  lineHeight: 1.45,
  margin: 0,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  flex: 1
};

const footerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '8px',
  paddingTop: '12px',
  borderTop: '1px solid rgba(255, 255, 255, 0.06)'
};

const priceContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  lineHeight: 1.1
};

const priceValueStyle = {
  fontSize: '1.25rem',
  fontWeight: 800,
  fontFamily: 'var(--font-heading)',
  color: '#ffffff'
};

const infoButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  background: 'rgba(255, 255, 255, 0.06)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-muted)',
  padding: '7px 11px',
  borderRadius: 'var(--radius-md)',
  fontSize: '0.82rem',
  fontWeight: 600,
  transition: 'all var(--transition-fast)'
};

const addCartButtonStyle = {
  padding: '7px 14px',
  fontSize: '0.85rem'
};
