import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchFoods,
  setCategory,
  setSearchQuery
} from '../store/foodSlice';
import { addToCart } from '../store/cartSlice';
import FoodCard from './FoodCard';
import {
  Search,
  RefreshCw,
  AlertTriangle,
  ShoppingBag,
  SlidersHorizontal
} from 'lucide-react';

export default function StorefrontView({ onSelectDetails, onEditFood, onDeleteFood, showAdminActions = false }) {
  const dispatch = useDispatch();
  const {
    items,
    categories,
    selectedCategory,
    searchQuery,
    isLoading,
    error
  } = useSelector((state) => state.food);

  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(localSearch));
    dispatch(fetchFoods({ search: localSearch, category: selectedCategory }));
  };

  const handleCategorySelect = (category) => {
    dispatch(setCategory(category));
    dispatch(fetchFoods({ search: localSearch, category }));
  };

  const handleRefresh = () => {
    dispatch(fetchFoods({ search: localSearch, category: selectedCategory }));
  };

  return (
    <div style={storefrontContainerStyle}>
      {/* Search and Category Filter Toolbar (Exp 1e) */}
      <div className="glass-panel" style={toolbarCardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} style={searchFormStyle}>
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                // Also trigger live search as user types
                dispatch(setSearchQuery(e.target.value));
                dispatch(fetchFoods({ search: e.target.value, category: selectedCategory }));
              }}
              placeholder="Search gourmet menu items, cuisines, keywords..."
              style={searchInputStyle}
              id="search-input"
            />
            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch('');
                  dispatch(setSearchQuery(''));
                  dispatch(fetchFoods({ search: '', category: selectedCategory }));
                }}
                style={clearSearchBtnStyle}
              >
                Clear
              </button>
            )}
          </form>

          {/* Quick Refresh Button */}
          <button
            onClick={handleRefresh}
            className="btn-secondary"
            disabled={isLoading}
            title="Refresh menu using Axios GET /api/foods"
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
            <span>Fetch Data</span>
          </button>
        </div>

        {/* Category Pills (Exp 1e) */}
        <div style={categoryListWrapperStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dim)', fontSize: '0.8rem', paddingLeft: '4px' }}>
            <SlidersHorizontal size={14} />
            <span>Category:</span>
          </div>
          <div style={categoryPillsStyle}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  style={isSelected ? activeCategoryPillStyle : categoryPillStyle}
                  id={`cat-pill-${cat.toLowerCase()}`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Loading Skeleton & Spinner (Exp 1f) */}
      {isLoading && (
        <div style={loadingGridStyle}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="glass-panel" style={skeletonCardStyle}>
              <div className="skeleton" style={{ width: '100%', height: '180px' }} />
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="skeleton" style={{ width: '40%', height: '14px' }} />
                <div className="skeleton" style={{ width: '80%', height: '22px' }} />
                <div className="skeleton" style={{ width: '100%', height: '36px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  <div className="skeleton" style={{ width: '25%', height: '26px' }} />
                  <div className="skeleton" style={{ width: '35%', height: '34px', borderRadius: '8px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error Message (Exp 1f) */}
      {error && !isLoading && (
        <div className="glass-panel" style={errorContainerStyle}>
          <AlertTriangle size={42} color="#ef4444" />
          <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginTop: '12px' }}>
            Unable to fetch food menu
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '420px', textAlign: 'center', marginTop: '6px' }}>
            {error}
          </p>
          <button
            onClick={handleRefresh}
            className="btn-primary"
            style={{ marginTop: '16px' }}
          >
            <RefreshCw size={15} /> Retry API Request
          </button>
        </div>
      )}

      {/* Food Items Grid (Exp 1d Reusable FoodCard components) */}
      {!isLoading && !error && (
        items.length === 0 ? (
          <div className="glass-panel" style={emptyResultsStyle}>
            <ShoppingBag size={48} color="#64748b" />
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginTop: '14px' }}>
              No culinary items match your criteria
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '360px', textAlign: 'center', marginTop: '4px' }}>
              Try searching for something else or reset your category filter to "All".
            </p>
            <button
              onClick={() => handleCategorySelect('All')}
              className="btn-secondary"
              style={{ marginTop: '14px' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={foodGridStyle}>
            {items.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                onSelectDetails={() => onSelectDetails(food.id)}
                onAddToCart={(item) => dispatch(addToCart(item))}
                onEdit={onEditFood}
                onDelete={onDeleteFood}
                showAdminActions={showAdminActions}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}

const storefrontContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const toolbarCardStyle = {
  padding: '16px 20px',
  borderRadius: 'var(--radius-lg)',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
};

const searchFormStyle = {
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
  width: '100%'
};

const clearSearchBtnStyle = {
  fontSize: '0.74rem',
  color: 'var(--text-muted)',
  cursor: 'pointer'
};

const categoryListWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  overflowX: 'auto',
  paddingBottom: '2px'
};

const categoryPillsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const categoryPillStyle = {
  padding: '6px 14px',
  borderRadius: 'var(--radius-full)',
  fontSize: '0.82rem',
  fontWeight: 600,
  background: 'rgba(255, 255, 255, 0.05)',
  color: 'var(--text-muted)',
  border: '1px solid var(--border-subtle)',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'all var(--transition-fast)'
};

const activeCategoryPillStyle = {
  ...categoryPillStyle,
  background: 'var(--accent-gradient)',
  color: '#ffffff',
  borderColor: 'transparent',
  boxShadow: '0 2px 10px rgba(249, 115, 22, 0.35)'
};

const foodGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
  gap: '20px'
};

const loadingGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
  gap: '20px'
};

const skeletonCardStyle = {
  borderRadius: 'var(--radius-lg)',
  overflow: 'hidden',
  height: '380px'
};

const errorContainerStyle = {
  padding: '60px 20px',
  borderRadius: 'var(--radius-xl)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
};

const emptyResultsStyle = {
  padding: '60px 20px',
  borderRadius: 'var(--radius-xl)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
};
