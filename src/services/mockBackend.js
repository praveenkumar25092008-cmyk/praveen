// Mock REST API Backend Engine
// Emulates a real Express/REST server with realistic latency, token validation, and persistence.

const INITIAL_FOODS = [
  {
    id: 'food-1',
    name: 'Artisan Truffle Burger',
    category: 'Burgers',
    price: 16.99,
    rating: 4.9,
    reviewsCount: 142,
    prepTime: '20 mins',
    calories: 780,
    isVegetarian: false,
    isSpicy: false,
    description: 'Dry-aged Black Angus patty, black truffle aioli, melted Gruyère, and caramelized balsamic onions on a brioche bun.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Black Angus Beef (200g)', 'Brioche Bun', 'Gruyère Cheese', 'Black Truffle Aioli', 'Caramelized Onions', 'Wild Arugula'],
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    chefNotes: 'Our signature burger. Beef is seared to medium rare for optimum juiciness.'
  },
  {
    id: 'food-2',
    name: 'Spicy Tonkotsu Ramen',
    category: 'Asian',
    price: 15.50,
    rating: 4.8,
    reviewsCount: 210,
    prepTime: '15 mins',
    calories: 640,
    isVegetarian: false,
    isSpicy: true,
    description: 'Rich 16-hour pork bone broth, hand-pulled noodles, chashu pork belly, marinated ajitsuke egg, and chili garlic oil.',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Handmade Ramen Noodles', 'Tonkotsu Broth', 'Braised Chashu Pork', 'Soft-boiled Egg', 'Bamboo Shoots', 'Chili Garlic Oil', 'Scallions'],
    allergens: ['Gluten', 'Soy', 'Eggs', 'Sesame'],
    chefNotes: 'Broth simmered overnight. Mildly spicy with smoky chili aroma.'
  },
  {
    id: 'food-3',
    name: 'Wood-Fired Margherita D.O.P.',
    category: 'Pizza',
    price: 14.25,
    rating: 4.7,
    reviewsCount: 185,
    prepTime: '18 mins',
    calories: 590,
    isVegetarian: true,
    isSpicy: false,
    description: 'San Marzano tomato sauce, fresh buffalo mozzarella, fragrant sweet basil, and extra virgin cold-pressed olive oil.',
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Italian 00 Flour', 'San Marzano Tomatoes', 'Buffalo Mozzarella', 'Fresh Basil', 'EVOO', 'Sea Salt'],
    allergens: ['Gluten', 'Dairy'],
    chefNotes: 'Baked in our 900°F stone oven for exactly 90 seconds for crisp leopard-spotted crust.'
  },
  {
    id: 'food-4',
    name: 'Crispy Baja Fish Tacos',
    category: 'Mexican',
    price: 13.99,
    rating: 4.6,
    reviewsCount: 98,
    prepTime: '12 mins',
    calories: 520,
    isVegetarian: false,
    isSpicy: true,
    description: 'Beer-battered fresh sea bass, purple cabbage slaw, chipotle crema, avocado slices, and pico de gallo in warm corn tortillas.',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Fresh Sea Bass', 'Corn Tortillas', 'Chipotle Crema', 'Purple Cabbage', 'Avocado', 'Pico de Gallo', 'Lime Wedge'],
    allergens: ['Fish', 'Gluten', 'Dairy'],
    chefNotes: 'Served in a trio with fresh lime wedges.'
  },
  {
    id: 'food-5',
    name: 'Mediterranean Salmon Bowl',
    category: 'Bowls',
    price: 17.50,
    rating: 4.9,
    reviewsCount: 167,
    prepTime: '15 mins',
    calories: 610,
    isVegetarian: false,
    isSpicy: false,
    description: 'Pan-seared Atlantic salmon over tri-color quinoa, roasted chickpeas, cucumber ribbons, Kalamata olives, feta, and lemon tahini.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Wild Atlantic Salmon (180g)', 'Quinoa', 'Roasted Chickpeas', 'Feta Cheese', 'Kalamata Olives', 'Lemon Tahini Dressing', 'Cucumber'],
    allergens: ['Fish', 'Dairy', 'Sesame'],
    chefNotes: 'Rich in Omega-3 and high-protein superfoods.'
  },
  {
    id: 'food-6',
    name: 'Wild Mushroom Truffle Risotto',
    category: 'Italian',
    price: 16.50,
    rating: 4.8,
    reviewsCount: 114,
    prepTime: '22 mins',
    calories: 560,
    isVegetarian: true,
    isSpicy: false,
    description: 'Creamy Carnaroli arborio rice infused with porcini broth, sautéed chanterelles, Parmigiano-Reggiano, and white truffle oil.',
    image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Carnaroli Rice', 'Porcini & Chanterelle Mushrooms', 'Parmigiano-Reggiano', 'Shallots', 'White Wine', 'White Truffle Essence'],
    allergens: ['Dairy'],
    chefNotes: 'Stirred continuously to achieve the velvety all\'onda consistency.'
  },
  {
    id: 'food-7',
    name: 'Tokyo Teriyaki Chicken Bowl',
    category: 'Asian',
    price: 14.80,
    rating: 4.7,
    reviewsCount: 130,
    prepTime: '15 mins',
    calories: 680,
    isVegetarian: false,
    isSpicy: false,
    description: 'Glazed free-range chicken thigh with house-made mirin teriyaki glaze, steamed jasmine rice, sesame broccoli, and pickled ginger.',
    image: 'https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Free-range Chicken Thigh', 'House Teriyaki Glaze', 'Jasmine Rice', 'Steamed Broccoli', 'Sesame Seeds', 'Pickled Red Ginger'],
    allergens: ['Soy', 'Sesame', 'Gluten'],
    chefNotes: 'Slow-charred chicken with sweet and savory glaze.'
  },
  {
    id: 'food-8',
    name: 'Classic Molten Lava Cake',
    category: 'Desserts',
    price: 9.50,
    rating: 4.9,
    reviewsCount: 220,
    prepTime: '10 mins',
    calories: 450,
    isVegetarian: true,
    isSpicy: false,
    description: 'Warm Valrhona 70% dark chocolate cake with a molten liquid center, served with Madagascan vanilla bean gelato.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Valrhona 70% Dark Chocolate', 'Madagascar Vanilla Bean Gelato', 'Butter', 'Free-range Eggs', 'Organic Cane Sugar', 'Fresh Raspberries'],
    allergens: ['Dairy', 'Eggs', 'Gluten'],
    chefNotes: 'Baked fresh to order. Center flows smoothly on first spoon cut.'
  }
];

const MOCK_USERS = [
  {
    id: 'usr-admin-1',
    email: 'admin@foodie.com',
    password: 'admin123',
    name: 'Chef Antoine Laurent',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'usr-cust-2',
    email: 'user@foodie.com',
    password: 'user123',
    name: 'Sarah Jenkins',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
  }
];

const STORAGE_KEY = 'gourmet_pulse_foods_v1';

// Seed or retrieve from localStorage
function getStoredFoods() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read stored foods, using defaults:', err);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FOODS));
  return [...INITIAL_FOODS];
}

function saveFoods(foods) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(foods));
  } catch (err) {
    console.error('Failed to save foods to storage:', err);
  }
}

// Emulate network latency
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

// Validate Bearer Token
function verifyToken(token) {
  if (!token) return null;
  const cleanToken = token.replace('Bearer ', '').trim();
  if (cleanToken.startsWith('expired-token-simulated')) {
    return { error: 'Token expired', status: 401 };
  }
  if (cleanToken.includes('admin')) {
    return { user: MOCK_USERS[0], status: 200 };
  }
  if (cleanToken.includes('customer') || cleanToken.includes('token')) {
    return { user: MOCK_USERS[1], status: 200 };
  }
  return { error: 'Invalid or missing authentication token', status: 401 };
}

export const mockBackend = {
  // Reset database back to default seed
  async resetDatabase() {
    await delay(200);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FOODS));
    return [...INITIAL_FOODS];
  },

  // GET /api/foods
  async getFoods({ search = '', category = 'All' } = {}) {
    await delay(350);
    let foods = getStoredFoods();

    if (category && category !== 'All') {
      foods = foods.filter(
        (f) => f.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      foods = foods.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q)
      );
    }

    return {
      status: 200,
      data: foods,
      total: foods.length
    };
  },

  // GET /api/foods/:id
  async getFoodById(id) {
    await delay(300);
    const foods = getStoredFoods();
    const item = foods.find((f) => String(f.id) === String(id));
    if (!item) {
      throw {
        response: {
          status: 404,
          data: { message: `Food item with ID "${id}" was not found.` }
        }
      };
    }
    return {
      status: 200,
      data: item
    };
  },

  // POST /api/foods (Requires Auth Token)
  async createFood(newFoodData, authHeader) {
    await delay(450);
    const auth = verifyToken(authHeader);
    if (!auth || auth.error) {
      throw {
        response: {
          status: 401,
          data: { message: auth?.error || 'Authentication required to add food items. Please login.' }
        }
      };
    }

    if (!newFoodData.name || !newFoodData.price) {
      throw {
        response: {
          status: 400,
          data: { message: 'Validation Error: Food Name and Price are mandatory fields.' }
        }
      };
    }

    const foods = getStoredFoods();
    const newFood = {
      id: `food-${Date.now()}`,
      name: newFoodData.name.trim(),
      category: newFoodData.category || 'Other',
      price: parseFloat(newFoodData.price) || 9.99,
      rating: parseFloat(newFoodData.rating) || 4.5,
      reviewsCount: 1,
      prepTime: newFoodData.prepTime || '15 mins',
      calories: parseInt(newFoodData.calories) || 500,
      isVegetarian: Boolean(newFoodData.isVegetarian),
      isSpicy: Boolean(newFoodData.isSpicy),
      description: newFoodData.description || 'Freshly prepared specialty dish.',
      image: newFoodData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      ingredients: Array.isArray(newFoodData.ingredients)
        ? newFoodData.ingredients
        : (newFoodData.ingredients || 'Fresh produce, Spices').split(',').map((s) => s.trim()),
      allergens: Array.isArray(newFoodData.allergens)
        ? newFoodData.allergens
        : (newFoodData.allergens || 'None').split(',').map((s) => s.trim()),
      chefNotes: newFoodData.chefNotes || 'Chef recommended special.'
    };

    foods.unshift(newFood);
    saveFoods(foods);

    return {
      status: 201,
      data: newFood,
      message: 'Food item successfully created'
    };
  },

  // PUT /api/foods/:id (Requires Auth Token)
  async updateFood(id, updateData, authHeader) {
    await delay(450);
    const auth = verifyToken(authHeader);
    if (!auth || auth.error) {
      throw {
        response: {
          status: 401,
          data: { message: auth?.error || 'Authentication required to update food items. Please login.' }
        }
      };
    }

    const foods = getStoredFoods();
    const index = foods.findIndex((f) => String(f.id) === String(id));
    if (index === -1) {
      throw {
        response: {
          status: 404,
          data: { message: `Food item "${id}" not found.` }
        }
      };
    }

    const updated = {
      ...foods[index],
      ...updateData,
      price: updateData.price ? parseFloat(updateData.price) : foods[index].price,
      calories: updateData.calories ? parseInt(updateData.calories) : foods[index].calories,
      id: foods[index].id // preserve ID
    };

    foods[index] = updated;
    saveFoods(foods);

    return {
      status: 200,
      data: updated,
      message: 'Food item successfully updated'
    };
  },

  // DELETE /api/foods/:id (Requires Auth Token)
  async deleteFood(id, authHeader) {
    await delay(400);
    const auth = verifyToken(authHeader);
    if (!auth || auth.error) {
      throw {
        response: {
          status: 401,
          data: { message: auth?.error || 'Authentication required to delete food items. Please login.' }
        }
      };
    }

    const foods = getStoredFoods();
    const exists = foods.some((f) => String(f.id) === String(id));
    if (!exists) {
      throw {
        response: {
          status: 404,
          data: { message: `Food item with ID "${id}" does not exist.` }
        }
      };
    }

    const filtered = foods.filter((f) => String(f.id) !== String(id));
    saveFoods(filtered);

    return {
      status: 200,
      data: { id },
      message: 'Food item successfully removed from menu'
    };
  },

  // POST /api/auth/login
  async login(credentials) {
    await delay(450);
    const { email, password } = credentials || {};
    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === (email || '').toLowerCase().trim()
    );

    if (!user || user.password !== password) {
      throw {
        response: {
          status: 401,
          data: { message: 'Invalid email address or password. Try demo credentials.' }
        }
      };
    }

    const token = `fake-jwt-${user.role}-${Date.now()}`;
    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    };

    return {
      status: 200,
      data: {
        token,
        user: userProfile
      },
      message: 'Login successful'
    };
  },

  // GET /api/auth/me
  async getProfile(authHeader) {
    await delay(250);
    const auth = verifyToken(authHeader);
    if (!auth || auth.error) {
      throw {
        response: {
          status: 401,
          data: { message: auth?.error || 'Session expired or invalid token.' }
        }
      };
    }

    const user = auth.user;
    return {
      status: 200,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    };
  },

  // POST /api/orders (Protected)
  async placeOrder(orderData, authHeader) {
    await delay(500);
    const auth = verifyToken(authHeader);
    if (!auth || auth.error) {
      throw {
        response: {
          status: 401,
          data: { message: 'You must be logged in to place an order and checkout.' }
        }
      };
    }

    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    return {
      status: 201,
      data: {
        orderId,
        itemsCount: orderData.items?.length || 0,
        total: orderData.total,
        status: 'Confirmed',
        estimatedDelivery: '30-40 mins',
        user: auth.user.name,
        placedAt: new Date().toISOString()
      },
      message: 'Order placed successfully!'
    };
  }
};
