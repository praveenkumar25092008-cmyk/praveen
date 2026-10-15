import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchFoods,
  deleteFood,
  setCategory,
  setSearchQuery
} from '../store/foodSlice';
import {
  Plus,
  RefreshCw,
  Edit,
  Trash2,
  Search,
  Filter,
  ShieldAlert,
  LogIn,
  AlertCircle,
  Database
} from 'lucide-react';
import CrudModal from './CrudModal';

export default function CrudPanel({ onOpenLogin }) {
  const dispatch = useDispatch();
  const {
    items,
    isLoading,
    error,
    selectedCategory,
    searchQuery,
    categories
  } = useSelector((state) => state.food);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleOpenAdd = () => {
    setEditingFood(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (food) => {
    setEditingFood(food);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async (id, name) => {
    if (window.confirm(`Are you sure you want to DELETE "${name}" from the menu? (REST DELETE /api/foods/${id})`)) {
      setDeletingId(id);
      await dispatch(deleteFood(id));
      setDeletingId(null);
    }
  };

  const handleRefresh = () => {
    dispatch(fetchFoods({ search: searchQuery, category: selectedCategory }));
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    dispatch(setSearchQuery(val));
    dispatch(fetchFoods({ search: val, category: selectedCategory }));
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    dispatch(setCategory(val));
    dispatch(fetchFoods({ search: searchQuery, category: val }));
  };

  const isAdmin = isAuthenticated && user?.role === 'admin';

  return (
    <div style={panelContainerStyle}>
      {/* Top Banner explaining Experiment 3 CRUD */}
      <div className="glass-panel" style={infoBannerStyle}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div style={iconBoxStyle}>
            <Database size={24} color="#f97316" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0 }}>
                Experiment 3: REST API CRUD Operations
              </h2>
              <span className="badge badge-primary">Admin Control Center</span>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: '4px 0 10px 0' }}>
              Performs live HTTP operations: <strong>GET</strong> to retrieve, <strong>POST</strong> to create, <strong>PUT</strong> to modify, and <strong>DELETE</strong> to remove items. All mutations are secured via Bearer token authorization.
            </p>

            {/* Endpoints badges */}
            <div style={endpointsRowStyle}>
              <span style={endpointBadgeStyle}>
                <strong style={{ color: '#38bdf8' }}>GET</strong> /api/foods
              </span>
              <span style={endpointBadgeStyle}>
                <strong style={{ color: '#34d399' }}>POST</strong> /api/foods
              </span>
              <span style={endpointBadgeStyle}>
                <strong style={{ color: '#fbbf24' }}>PUT</strong> /api/foods/:id
              </span>
              <span style={endpointBadgeStyle}>
                <strong style={{ color: '#f87171' }}>DELETE</strong> /api/foods/:id
              </span>
            </div>
          </div>
        </div>

        {/* Auth Notice if not Admin */}
        {!isAdmin && (
          <div style={authWarningStyle}>
            <ShieldAlert size={18} color="#f59e0b" />
            <div style={{ flex: 1, fontSize: '0.84rem', color: '#fde68a' }}>
              {!isAuthenticated
                ? 'Sign in as Chef Antoine (Admin) to perform POST, PUT, and DELETE operations.'
                : 'Current account role is "customer". Sign in as Chef Antoine (Admin) to modify the menu.'}
            </div>
            <button
              onClick={() => onOpenLogin('Admin credentials are required to modify the menu.')}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem', borderColor: 'rgba(245, 158, 11, 0.4)' }}
            >
              <LogIn size={13} /> Admin Sign In
            </button>
          </div>
        )}
      </div>

      {/* Control Toolbar */}
      <div style={toolbarStyle}>
        {/* Search */}
        <div style={searchWrapperStyle}>
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search food title, ingredients..."
            style={searchInputStyle}
          />
        </div>

        {/* Category filter */}
        <div style={categoryWrapperStyle}>
          <Filter size={16} color="#94a3b8" />
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            style={selectInputStyle}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Refresh List (Exp 3h) */}
        <button
          onClick={handleRefresh}
          className="btn-secondary"
          disabled={isLoading}
          title="Refresh food list from REST API (Exp 3h)"
        >
          <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          <span>Refresh List</span>
        </button>

        {/* Add New Food (Exp 3b) */}
        <button
          onClick={handleOpenAdd}
          className="btn-primary"
          id="add-food-btn"
          title="Add a new food item (POST /api/foods)"
        >
          <Plus size={16} />
          <span>Add New Food Item</span>
        </button>
      </div>

      {/* CRUD Table / Grid */}
      <div className="glass-panel" style={tableContainerStyle}>
        {isLoading ? (
          <div style={loadingStateStyle}>
            <div
              className="animate-spin"
              style={{
                width: '36px',
                height: '36px',
                border: '3px solid rgba(249, 115, 22, 0.2)',
                borderTopColor: 'var(--accent-primary)',
                borderRadius: '50%'
              }}
            />
            <span style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '12px' }}>
              Fetching food items from REST API (GET /api/foods)...
            </span>
          </div>
        ) : error ? (
          <div style={errorStateStyle}>
            <AlertCircle size={36} color="#ef4444" />
            <span style={{ color: '#fca5a5', fontSize: '0.92rem', marginTop: '8px' }}>{error}</span>
            <button onClick={handleRefresh} className="btn-secondary" style={{ marginTop: '12px' }}>
              Retry GET Request
            </button>
          </div>
        ) : items.length === 0 ? (
          <div style={emptyItemsStyle}>
            <span>No food items found matching your filters.</span>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeadRowStyle}>
                  <th style={thStyle}>Food Item</th>
                  <th style={thStyle}>Category</th>
                  <th style={thStyle}>Price</th>
                  <th style={thStyle}>Nutritional Info</th>
                  <th style={thStyle}>Tags</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>CRUD Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((food) => (
                  <tr key={food.id} style={tableRowStyle}>
                    {/* Item Name & Thumb */}
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={food.image}
                          alt={food.name}
                          style={rowThumbStyle}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.92rem' }}>
                            {food.name}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {food.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={tdStyle}>
                      <span className="badge badge-secondary">{food.category}</span>
                    </td>

                    {/* Price */}
                    <td style={tdStyle}>
                      <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                        ${Number(food.price).toFixed(2)}
                      </span>
                    </td>

                    {/* Nutrition */}
                    <td style={tdStyle}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {food.calories} kcal • {food.prepTime}
                      </div>
                    </td>

                    {/* Badges */}
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {food.isVegetarian && <span className="badge badge-success">Veg</span>}
                        {food.isSpicy && <span className="badge badge-danger">Spicy</span>}
                        {!food.isVegetarian && !food.isSpicy && <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>Standard</span>}
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        {/* Edit Button (Exp 3c) */}
                        <button
                          onClick={() => handleOpenEdit(food)}
                          style={actionBtnStyle}
                          title="Edit food info (PUT /api/foods/:id)"
                          id={`edit-food-${food.id}`}
                        >
                          <Edit size={14} color="#38bdf8" />
                          <span style={{ color: '#38bdf8' }}>Edit</span>
                        </button>

                        {/* Delete Button (Exp 3d) */}
                        <button
                          onClick={() => handleDeleteConfirm(food.id, food.name)}
                          style={{ ...actionBtnStyle, background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                          disabled={deletingId === food.id}
                          title="Delete food item (DELETE /api/foods/:id)"
                          id={`delete-food-${food.id}`}
                        >
                          {deletingId === food.id ? (
                            <span className="animate-spin" style={{ width: 14, height: 14, border: '2px solid #ef4444', borderTopColor: 'transparent', borderRadius: '50%' }} />
                          ) : (
                            <Trash2 size={14} color="#f87171" />
                          )}
                          <span style={{ color: '#f87171' }}>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CRUD Modal for Add / Edit */}
      <CrudModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingFood={editingFood}
      />
    </div>
  );
}

const panelContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '18px'
};

const infoBannerStyle = {
  padding: '20px 24px',
  borderRadius: 'var(--radius-lg)',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
};

const iconBoxStyle = {
  width: '44px',
  height: '44px',
  borderRadius: '12px',
  background: 'rgba(249, 115, 22, 0.15)',
  border: '1px solid rgba(249, 115, 22, 0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const endpointsRowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px'
};

const endpointBadgeStyle = {
  padding: '4px 10px',
  borderRadius: '6px',
  background: 'rgba(0, 0, 0, 0.4)',
  border: '1px solid var(--border-subtle)',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.78rem',
  color: '#cbd5e1'
};

const authWarningStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px 16px',
  borderRadius: 'var(--radius-md)',
  background: 'rgba(245, 158, 11, 0.1)',
  border: '1px solid rgba(245, 158, 11, 0.3)'
};

const toolbarStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap'
};

const searchWrapperStyle = {
  flex: 1,
  minWidth: '240px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  background: 'var(--bg-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-md)',
  padding: '8px 14px'
};

const searchInputStyle = {
  background: 'transparent',
  border: 'none',
  color: '#ffffff',
  fontSize: '0.88rem',
  width: '100%'
};

const categoryWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  background: 'var(--bg-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-md)',
  padding: '8px 14px'
};

const selectInputStyle = {
  background: 'transparent',
  border: 'none',
  color: '#ffffff',
  fontSize: '0.88rem',
  cursor: 'pointer'
};

const tableContainerStyle = {
  borderRadius: 'var(--radius-lg)',
  overflow: 'hidden'
};

const loadingStateStyle = {
  padding: '60px 20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
};

const errorStateStyle = {
  padding: '40px 20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
};

const emptyItemsStyle = {
  padding: '40px 20px',
  textAlign: 'center',
  color: 'var(--text-muted)'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left'
};

const tableHeadRowStyle = {
  background: 'rgba(0, 0, 0, 0.35)',
  borderBottom: '1px solid var(--border-subtle)'
};

const thStyle = {
  padding: '12px 18px',
  fontSize: '0.78rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: 'var(--text-muted)'
};

const tableRowStyle = {
  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
  transition: 'background var(--transition-fast)'
};

const tdStyle = {
  padding: '14px 18px',
  verticalAlign: 'middle'
};

const rowThumbStyle = {
  width: '46px',
  height: '46px',
  borderRadius: '8px',
  objectFit: 'cover',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  flexShrink: 0
};

const actionBtnStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  padding: '6px 10px',
  borderRadius: '6px',
  fontSize: '0.78rem',
  fontWeight: 600,
  background: 'rgba(56, 189, 248, 0.1)',
  border: '1px solid rgba(56, 189, 248, 0.25)',
  cursor: 'pointer'
};
