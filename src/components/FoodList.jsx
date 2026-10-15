import React, { memo } from 'react';
import FoodCard from './FoodCard';
import { Search, RefreshCw, AlertTriangle, ShoppingBag, SlidersHorizontal } from 'lucide-react';
import { sanitizeInput } from '../utils/security';

/**
 * EXPERIMENT 1a, 1b, 1c: Reusable FoodList Component
 * EXPERIMENT 2c: Memoized with React.memo to prevent unnecessary component rendering
 * EXPERIMENT 2e: Accessibility roles, labels, and keyboard support
 */
function FoodList({
  foods = [],
  categories = ['All', 'Burgers', 'Asian', 'Pizza', 'Mexican', 'Bowls', 'Italian', 'Desserts'],
  selectedCategory = 'All',
  searchQuery = '',
  isLoading = false,
  error = null,
  onSearchChange,
  onCategorySelect,
  onRefresh,
  onSelectDetails,
  onAddToCart,
  onEditFood,
  onDeleteFood,
  showAdminActions = false
}) {
  const handleSearchInput = (e) => {
    const rawVal = e.target.value;
    // Security sanitization (Exp 2f)
    const sanitized = sanitizeInput(rawVal);
    if (onSearchChange) {
      onSearchChange(sanitized);
    }
  };

  return (
    <section
      role="region"
      aria-label="Food Menu Section"
      style={containerStyle}
      data-testid="food-list-section"
    >
      {/* Search and Category Filter Toolbar */}
      <div className="glass-panel" style={toolbarStyle} role="search" aria-label="Menu Filters">
        <div style={toolbarRowStyle}>
          {/* Search Box */}
          <div style={searchWrapperStyle}>
            <Search size={18} color="#94a3b8" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={handleSearchInput}
              placeholder="Search dishes, ingredients, or flavors..."
              aria-label="Search food menu items"
              style={searchInputStyle}
              data-testid="search-input"
              id="food-search-box"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange && onSearchChange('')}
                aria-label="Clear search query"
                style={clearButtonStyle}
                data-testid="clear-search-btn"
              >
                Clear
              </button>
            )}
          </div>

          {/* Refresh Action */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="btn-secondary"
              disabled={isLoading}
              aria-label="Refresh menu items"
              style={{ padding: '8px 14px' }}
              data-testid="refresh-menu-btn"
            >
              <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} aria-hidden="true" />
              <span>Refresh</span>
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div
          role="tablist"
          aria-label="Filter food by category"
          style={categoryListStyle}
          data-testid="category-filter-list"
        >
          <div style={categoryLabelStyle}>
            <SlidersHorizontal size={14} aria-hidden="true" />
            <span>Category:</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => onCategorySelect && onCategorySelect(cat)}
                  style={isSelected ? activePillStyle : inactivePillStyle}
                  data-testid={`category-pill-${cat.toLowerCase()}`}
                  aria-label={`Filter by ${cat}`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Loading Skeleton Indicator */}
      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          aria-label="Loading food items"
          style={gridStyle}
          data-testid="loading-indicator"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-panel" style={skeletonCardStyle}>
              <div className="skeleton" style={{ width: '100%', height: '180px' }} />
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="skeleton" style={{ width: '30%', height: '16px' }} />
                <div className="skeleton" style={{ width: '70%', height: '22px' }} />
                <div className="skeleton" style={{ width: '100%', height: '36px' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div
          role="alert"
          aria-live="assertive"
          className="glass-panel"
          style={errorContainerStyle}
          data-testid="error-message"
        >
          <AlertTriangle size={42} color="#ef4444" aria-hidden="true" />
          <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginTop: '12px' }}>
            Failed to Load Food Menu
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', maxWidth: '420px', marginTop: '6px' }}>
            {error}
          </p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="btn-primary"
              style={{ marginTop: '16px' }}
              aria-label="Retry loading food menu"
              data-testid="retry-btn"
            >
              <RefreshCw size={15} aria-hidden="true" /> Retry Fetch
            </button>
          )}
        </div>
      )}

      {/* Food Cards Grid */}
      {!isLoading && !error && (
        foods.length === 0 ? (
          <div
            role="status"
            className="glass-panel"
            style={emptyContainerStyle}
            data-testid="empty-message"
          >
            <ShoppingBag size={48} color="#64748b" aria-hidden="true" />
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginTop: '14px' }}>
              No dishes found
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '340px', textAlign: 'center', marginTop: '4px' }}>
              No menu items match your search or category filter. Try clearing filters.
            </p>
            {onCategorySelect && (
              <button
                onClick={() => onCategorySelect('All')}
                className="btn-secondary"
                style={{ marginTop: '14px' }}
                aria-label="Reset filters to All"
              >
                Reset to All
              </button>
            )}
          </div>
        ) : (
          <div
            role="list"
            aria-label="Available Food Items"
            style={gridStyle}
            data-testid="food-grid"
          >
            {foods.map((food) => (
              <div role="listitem" key={food.id} style={{ display: 'flex' }}>
                <FoodCard
                  food={food}
                  onSelectDetails={onSelectDetails}
                  onAddToCart={onAddToCart}
                  onEdit={onEditFood}
                  onDelete={onDeleteFood}
                  showAdminActions={showAdminActions}
                />
              </div>
            ))}
          </div>
        )
      )}
    </section>
  );
}

// React.memo optimization to avoid unnecessary re-renders (Exp 2c)
export default memo(FoodList);

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  width: '100%'
};

const toolbarStyle = {
  padding: '16px 20px',
  borderRadius: 'var(--radius-lg)',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
};

const toolbarRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '14px',
  flexWrap: 'wrap'
};

const searchWrapperStyle = {
  flex: 1,
  minWidth: '280px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  background: 'var(--bg-input)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-md)',
  padding: '8px 14px'
};

const searchInputStyle = {
  background: 'transparent',
  border: 'none',
  color: '#ffffff',
  fontSize: '0.9rem',
  width: '100%',
  outline: 'none'
};

const clearButtonStyle = {
  fontSize: '0.74rem',
  color: 'var(--text-muted)',
  cursor: 'pointer',
  padding: '2px 6px',
  borderRadius: '4px',
  background: 'rgba(255, 255, 255, 0.05)'
};

const categoryListStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap'
};

const categoryLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  color: 'var(--text-dim)',
  fontSize: '0.8rem'
};

const inactivePillStyle = {
  padding: '6px 14px',
  borderRadius: 'var(--radius-full)',
  fontSize: '0.82rem',
  fontWeight: 600,
  background: 'rgba(255, 255, 255, 0.05)',
  color: 'var(--text-muted)',
  border: '1px solid var(--border-subtle)',
  cursor: 'pointer',
  transition: 'all var(--transition-fast)'
};

const activePillStyle = {
  ...inactivePillStyle,
  background: 'var(--accent-gradient)',
  color: '#ffffff',
  borderColor: 'transparent',
  boxShadow: '0 2px 10px rgba(249, 115, 22, 0.35)'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
  gap: '20px'
};

const skeletonCardStyle = {
  borderRadius: 'var(--radius-lg)',
  overflow: 'hidden',
  height: '340px'
};

const errorContainerStyle = {
  padding: '60px 20px',
  borderRadius: 'var(--radius-xl)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
};

const emptyContainerStyle = {
  padding: '60px 20px',
  borderRadius: 'var(--radius-xl)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
};
