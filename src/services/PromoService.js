const STORAGE_KEY = 'stelle_promos';

const getPromos = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const savePromos = (promos) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(promos));
};

export const promoService = {
  getAll: () => getPromos(),

  create: (promoData) => {
    const promos = getPromos();
    const newPromo = {
      id: Date.now().toString(),
      code: promoData.code.toUpperCase(),
      discount: Number(promoData.discount),
      type: promoData.type || 'percent', // 'percent' or 'fixed'
      minAmount: Number(promoData.minAmount) || 0,
      maxUses: Number(promoData.maxUses) || 0,
      usedCount: 0,
      active: true,
      expiresAt: promoData.expiresAt || null,
      createdAt: new Date().toISOString(),
    };
    promos.push(newPromo);
    savePromos(promos);
    return newPromo;
  },

  toggle: (id) => {
    const promos = getPromos();
    const idx = promos.findIndex(p => p.id === id);
    if (idx !== -1) {
      promos[idx].active = !promos[idx].active;
      savePromos(promos);
      return promos[idx];
    }
    return null;
  },

  delete: (id) => {
    const promos = getPromos().filter(p => p.id !== id);
    savePromos(promos);
  },

  validate: (code, amount) => {
    const promos = getPromos();
    const promo = promos.find(p => p.code === code.toUpperCase() && p.active);
    if (!promo) return { valid: false, message: 'Code promo invalide' };
    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) return { valid: false, message: 'Code promo expiré' };
    if (promo.maxUses > 0 && promo.usedCount >= promo.maxUses) return { valid: false, message: 'Code promo épuisé' };
    if (promo.minAmount > 0 && amount < promo.minAmount) return { valid: false, message: `Montant minimum: ${promo.minAmount}€` };
    const discount = promo.type === 'percent' ? Math.round(amount * promo.discount / 100) : promo.discount;
    return { valid: true, discount, promo };
  },
};
