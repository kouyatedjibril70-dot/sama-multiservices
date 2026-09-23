/* =====================================================================
   OUTILS & CALCULS v2
   ---------------------------------------------------------------------
   Fonctions utilitaires partagées par tous les écrans.
   ===================================================================== */

const $ = s => document.querySelector(s);

const F = n => n.toLocaleString('fr-FR').replace(/\u202F|\u00A0/g, ' ') + ' F';

const prodById = id => state.products.find(p => p.id === id);

const ca = ss => ss.reduce((a, s) => a + s.qty * s.price, 0);

const benef = ss => ss.reduce((a, s) => a + s.qty * (s.price - prodById(s.pid).buy), 0);

const stockLevel = q =>
  q === 0 ? 'r' :
  q <= APP_CONFIG.stockCritical ? 'r' :
  q <= APP_CONFIG.stockLow ? 'o' : 'v';

const stockLabel = q =>
  q === 0 ? 'Rupture' :
  q <= APP_CONFIG.stockCritical ? 'Presque épuisé' :
  q <= APP_CONFIG.stockLow ? 'Stock bas' : 'OK';

function toast(msg){
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('show'), 2500);
}

function dayStats(){
  const ss = state.sales;
  const articles = ss.reduce((a, s) => a + s.qty, 0);

  const agg = {};
  ss.forEach(s => {
    if (!agg[s.pid]) agg[s.pid] = { qty:0, ca:0, benef:0 };
    agg[s.pid].qty   += s.qty;
    agg[s.pid].ca    += s.qty * s.price;
    agg[s.pid].benef += s.qty * (s.price - prodById(s.pid).buy);
  });
  const entries = Object.entries(agg).map(([pid, v]) => ({ p: prodById(+pid), ...v }));

  const topQty   = [...entries].sort((a, b) => b.qty - a.qty)[0]   || null;
  const topBenef = [...entries].sort((a, b) => b.benef - a.benef)[0] || null;

  const byH = {};
  ss.forEach(s => { const h = parseInt(s.time); byH[h] = (byH[h] || 0) + s.qty * s.price; });
  let bestH = null, bestV = 0;
  Object.entries(byH).forEach(([h, v]) => { if (v > bestV) { bestV = v; bestH = +h; } });

  const matin = ss.filter(s => parseInt(s.time) < 13);
  const aprem = ss.filter(s => parseInt(s.time) >= 13);

  const ruptures = state.products.filter(p => p.stock === 0);
  const bas      = state.products.filter(p => p.stock > 0 && p.stock <= APP_CONFIG.stockCritical);

  return { ss, articles, entries, topQty, topBenef, bestH, bestV, matin, aprem, ruptures, bas };
}