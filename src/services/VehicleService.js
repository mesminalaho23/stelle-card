// Mock data for vehicles
export const vehiclesData = [
  {
    id: 1,
    name: 'Mercedes Classe E',
    category: 'Luxe',
    type: 'Berline',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
    price: {
      '24h': 120,
      '48h': 220,
      '1week': 700,
      '1month': 2400
    },
    features: ['GPS', 'Climatisation', 'Bluetooth', 'Caméra de recul'],
    specs: {
      passengers: 5,
      luggage: 3,
      transmission: 'Automatique',
      fuel: 'Diesel',
      doors: 4
    },
    available: true,
    withDriver: true,
    rating: 4.8,
    reviews: 124
  },
  {
    id: 2,
    name: 'BMW X5',
    category: 'SUV',
    type: 'SUV / 4x4',
    image: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800',
    price: {
      '24h': 95,
      '48h': 175,
      '1week': 580,
      '1month': 2000
    },
    features: ['GPS', 'Climatisation', 'Cuir', 'Toit panoramique'],
    specs: {
      passengers: 5,
      luggage: 4,
      transmission: 'Automatique',
      fuel: 'Diesel',
      doors: 5
    },
    available: true,
    withDriver: true,
    rating: 4.7,
    reviews: 98
  },
  {
    id: 3,
    name: 'Renault Clio',
    category: 'Économique',
    type: 'Citadine',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
    price: {
      '24h': 35,
      '48h': 65,
      '1week': 210,
      '1month': 720
    },
    features: ['Climatisation', 'Bluetooth', 'GPS'],
    specs: {
      passengers: 5,
      luggage: 2,
      transmission: 'Manuelle',
      fuel: 'Essence',
      doors: 5
    },
    available: true,
    withDriver: false,
    rating: 4.5,
    reviews: 156
  },
  {
    id: 4,
    name: 'Peugeot 3008',
    category: 'Familiale',
    type: 'SUV',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
    price: {
      '24h': 65,
      '48h': 120,
      '1week': 400,
      '1month': 1400
    },
    features: ['GPS', 'Climatisation', 'Régulateur', 'Radar de recul'],
    specs: {
      passengers: 5,
      luggage: 3,
      transmission: 'Automatique',
      fuel: 'Diesel',
      doors: 5
    },
    available: true,
    withDriver: false,
    rating: 4.6,
    reviews: 87
  },
  {
    id: 5,
    name: 'Volkswagen Touran',
    category: 'Familiale',
    type: 'Monospace',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
    price: {
      '24h': 70,
      '48h': 130,
      '1week': 430,
      '1month': 1500
    },
    features: ['GPS', 'Climatisation', '7 places', 'Grand coffre'],
    specs: {
      passengers: 7,
      luggage: 5,
      transmission: 'Automatique',
      fuel: 'Diesel',
      doors: 5
    },
    available: true,
    withDriver: false,
    rating: 4.7,
    reviews: 76
  },
  {
    id: 6,
    name: 'Porsche 911',
    category: 'Sport',
    type: 'Sportive',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
    price: {
      '24h': 250,
      '48h': 480,
      '1week': 1600,
      '1month': 5500
    },
    features: ['GPS', 'Cuir', 'Sport chrono', 'Système audio premium'],
    specs: {
      passengers: 2,
      luggage: 1,
      transmission: 'Automatique',
      fuel: 'Essence',
      doors: 2
    },
    available: true,
    withDriver: true,
    rating: 4.9,
    reviews: 45
  },
  {
    id: 7,
    name: 'Tesla Model 3',
    category: 'Électrique',
    type: 'Berline',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
    price: {
      '24h': 85,
      '48h': 160,
      '1week': 530,
      '1month': 1850
    },
    features: ['Autopilot', 'Écran tactile', 'Zéro émission', 'Supercharger'],
    specs: {
      passengers: 5,
      luggage: 2,
      transmission: 'Automatique',
      fuel: 'Électrique',
      doors: 4
    },
    available: true,
    withDriver: false,
    rating: 4.8,
    reviews: 112
  },
  {
    id: 8,
    name: 'Audi A6',
    category: 'Luxe',
    type: 'Berline',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    price: {
      '24h': 110,
      '48h': 205,
      '1week': 680,
      '1month': 2350
    },
    features: ['GPS', 'Cuir', 'Sièges chauffants', 'Bang & Olufsen'],
    specs: {
      passengers: 5,
      luggage: 3,
      transmission: 'Automatique',
      fuel: 'Diesel',
      doors: 4
    },
    available: false,
    withDriver: true,
    rating: 4.7,
    reviews: 91
  },
  {
    id: 9,
    name: 'Ford Transit',
    category: 'Utilitaire',
    type: 'Utilitaire',
    image: 'https://images.unsplash.com/photo-1562141961-c0e02dfbecf6?w=800',
    price: {
      '24h': 55,
      '48h': 100,
      '1week': 330,
      '1month': 1150
    },
    features: ['GPS', 'Climatisation', 'Grand volume', 'Assistance parking'],
    specs: {
      passengers: 3,
      luggage: 15,
      transmission: 'Manuelle',
      fuel: 'Diesel',
      doors: 4
    },
    available: true,
    withDriver: false,
    rating: 4.4,
    reviews: 63
  }
];

export const categories = [
  { id: 'all', label: 'Tous', icon: '✦' },
  { id: 'Économique', label: 'Économique', icon: '◈' },
  { id: 'Familiale', label: 'Familiale', icon: '⌂' },
  { id: 'SUV', label: 'SUV', icon: '◉' },
  { id: 'Luxe', label: 'Luxe', icon: '♛' },
  { id: 'Sport', label: 'Sport', icon: '⚡' },
  { id: 'Électrique', label: 'Électrique', icon: '⏣' },
  { id: 'Utilitaire', label: 'Utilitaire', icon: '⬡' }
];

export const getVehicles = (filters = {}) => {
  let filtered = [...vehiclesData];

  // Filter by category
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(v => v.category === filters.category);
  }

  // Filter by availability
  if (filters.available !== undefined) {
    filtered = filtered.filter(v => v.available === filters.available);
  }

  // Filter by with driver
  if (filters.withDriver !== undefined) {
    filtered = filtered.filter(v => v.withDriver === filters.withDriver);
  }

  // Filter by price range
  if (filters.maxPrice) {
    filtered = filtered.filter(v => v.price['24h'] <= filters.maxPrice);
  }

  // Search by name
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(v => 
      v.name.toLowerCase().includes(searchLower) ||
      v.category.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
};

export const getVehicleById = (id) => {
  return vehiclesData.find(v => v.id === parseInt(id));
};

export const getFeaturedVehicles = (limit = 6) => {
  return vehiclesData
    .filter(v => v.available)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

export const reviewsData = {
  1: [
    { id: 1, user: 'Sophie M.', rating: 5, date: '2024-12-15', comment: 'Véhicule impeccable, service au top. La Mercedes était en parfait état.' },
    { id: 2, user: 'Karim B.', rating: 4, date: '2024-11-28', comment: 'Très bon véhicule, juste un peu de retard à la livraison.' },
    { id: 3, user: 'Marie L.', rating: 5, date: '2024-11-10', comment: 'Expérience parfaite du début à la fin. Je recommande !' }
  ],
  2: [
    { id: 4, user: 'Thomas D.', rating: 5, date: '2024-12-20', comment: 'Le BMW X5 est un régal à conduire. Spacieux et confortable.' },
    { id: 5, user: 'Léa R.', rating: 4, date: '2024-12-05', comment: 'Très bon SUV pour la famille. Coffre spacieux.' }
  ],
  3: [
    { id: 6, user: 'Ahmed K.', rating: 5, date: '2024-12-18', comment: 'Parfait pour la ville ! Économique et facile à garer.' },
    { id: 7, user: 'Julie P.', rating: 4, date: '2024-11-30', comment: 'Bon rapport qualité/prix pour une location courte.' }
  ],
  6: [
    { id: 8, user: 'Marc F.', rating: 5, date: '2024-12-22', comment: 'La Porsche 911 est un rêve. Sensations garanties !' },
    { id: 9, user: 'Nicolas V.', rating: 5, date: '2024-12-01', comment: 'Expérience incroyable. Le son du moteur est magique.' }
  ],
  7: [
    { id: 10, user: 'Claire D.', rating: 5, date: '2024-12-10', comment: 'Tesla silencieuse et performante. L\'autopilot est bluffant.' },
    { id: 11, user: 'Paul G.', rating: 4, date: '2024-11-25', comment: 'Super véhicule mais il faut planifier les recharges.' }
  ]
};

export const getVehicleReviews = (vehicleId) => {
  return reviewsData[vehicleId] || [];
};

// Admin: add a custom vehicle (persisted in localStorage)
export const getCustomVehicles = () => {
  const stored = localStorage.getItem('customVehicles');
  return stored ? JSON.parse(stored) : [];
};

export const addCustomVehicle = (vehicleData) => {
  const customs = getCustomVehicles();
  const newVehicle = {
    id: Date.now(),
    ...vehicleData,
    available: true,
    rating: 0,
    reviews: 0
  };
  customs.push(newVehicle);
  localStorage.setItem('customVehicles', JSON.stringify(customs));
  vehiclesData.push(newVehicle);
  return newVehicle;
};

export const updateVehicle = (id, updates) => {
  const idx = vehiclesData.findIndex(v => v.id === id);
  if (idx !== -1) {
    vehiclesData[idx] = { ...vehiclesData[idx], ...updates };
    // Also update in custom vehicles if it's there
    const customs = getCustomVehicles();
    const cIdx = customs.findIndex(v => v.id === id);
    if (cIdx !== -1) {
      customs[cIdx] = { ...customs[cIdx], ...updates };
      localStorage.setItem('customVehicles', JSON.stringify(customs));
    }
    return vehiclesData[idx];
  }
  return null;
};

export const deleteCustomVehicle = (id) => {
  let customs = getCustomVehicles();
  customs = customs.filter(v => v.id !== id);
  localStorage.setItem('customVehicles', JSON.stringify(customs));
  const index = vehiclesData.findIndex(v => v.id === id);
  if (index !== -1) vehiclesData.splice(index, 1);
};

// Admin: delete ANY vehicle (including built-in)
export const deleteAnyVehicle = (id) => {
  // Remove from custom vehicles if it's there
  let customs = getCustomVehicles();
  customs = customs.filter(v => v.id !== id);
  localStorage.setItem('customVehicles', JSON.stringify(customs));
  // Remove from vehiclesData array
  const index = vehiclesData.findIndex(v => v.id === id);
  if (index !== -1) vehiclesData.splice(index, 1);
  // Track deleted built-in vehicles
  const deleted = JSON.parse(localStorage.getItem('deletedVehicles') || '[]');
  if (!deleted.includes(id)) {
    deleted.push(id);
    localStorage.setItem('deletedVehicles', JSON.stringify(deleted));
  }
};

// Load custom vehicles and remove deleted ones on init
(() => {
  // Remove deleted built-in vehicles
  const deleted = JSON.parse(localStorage.getItem('deletedVehicles') || '[]');
  deleted.forEach(id => {
    const idx = vehiclesData.findIndex(v => v.id === id);
    if (idx !== -1) vehiclesData.splice(idx, 1);
  });
  // Add custom vehicles
  const customs = getCustomVehicles();
  customs.forEach(v => {
    if (!vehiclesData.find(existing => existing.id === v.id)) {
      vehiclesData.push(v);
    }
  });
})();