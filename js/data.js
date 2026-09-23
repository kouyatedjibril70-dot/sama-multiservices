/* =====================================================================
   ÉTAT DE L'APPLICATION v2
   ---------------------------------------------------------------------
   Construit à partir de APP_CONFIG. Ne pas modifier directement.
   ===================================================================== */
const state = {
  role: 'gerant',
  tab: 'caisse',
  cart: {},
  produitFiche: null,
  gerant: APP_CONFIG.gerantName,
  products: APP_CONFIG.products.map(p => ({ ...p })),
  sales: [],
};

(function seedSales(){
  APP_CONFIG.seedSales.forEach(([pid, qty, time]) => {
    const p = state.products.find(x => x.id === pid);
    if (!p) return;
    state.sales.push({ pid, qty, price: p.sell, time, by: state.gerant });
  });
})();