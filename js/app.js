/* =====================================================================
   MOTEUR DE L'APPLICATION v2
   ---------------------------------------------------------------------
   Rendu, navigation, panier, validation — avec animations améliorées.
   ===================================================================== */

function renderHeader(){
  const sb = $('#subbar');
  if (state.role === 'gerant'){
    sb.innerHTML = `<span class="who"><span class="live-dot"></span>${state.gerant} · gérante</span>`;
  } else {
    sb.innerHTML = `<span class="who"><span class="live-dot"></span>Ma boutique · en temps réel</span>`;
  }
}

function renderTabs(){
  const tabs = state.role === 'gerant'
    ? [['caisse','🧾','Caisse'], ['stock','📦','Stock'], ['jour','☀️','Ma journée']]
    : [['dash','📊','Aujourd\u2019hui'], ['pstock','📦','Stock'], ['ventes','🧾','Ventes'], ['prods','🏷️','Produits']];

  if (!tabs.some(t => t[0] === state.tab)) state.tab = tabs[0][0];

  $('#tabbar').innerHTML = tabs.map(([id, ic, lb]) =>
    `<button class="${state.tab === id ? 'active' : ''}" data-tab="${id}"><span class="ic">${ic}</span>${lb}</button>`
  ).join('');

  document.querySelectorAll('#tabbar button').forEach(b =>
    b.onclick = () => { state.tab = b.dataset.tab; state.produitFiche = null; render(); }
  );
}

function renderCart(){
  const ids = Object.keys(state.cart);
  const bar = $('#cartbar');

  if (state.role !== 'gerant' || state.tab !== 'caisse' || !ids.length){
    bar.classList.remove('show');
    return;
  }

  bar.classList.add('show');
  $('#cartLines').innerHTML = ids.map(id => {
    const p = prodById(+id), q = state.cart[id];
    return `<div class="cart-line"><span>${p.e}</span><span class="cn">${p.n}</span>
      <div class="qty-ctl">
        <button data-dec="${id}">−</button><b>${q}</b><button data-inc="${id}">+</button>
      </div>
      <span class="money-txt" style="color:#B97A0D">${F(q * p.sell)}</span></div>`;
  }).join('');

  $('#cartTotal').textContent = F(ids.reduce((a, id) => a + state.cart[id] * prodById(+id).sell, 0));

  document.querySelectorAll('[data-inc]').forEach(b => b.onclick = () => addToCart(+b.dataset.inc));
  document.querySelectorAll('[data-dec]').forEach(b => b.onclick = () => {
    const id = +b.dataset.dec;
    if (--state.cart[id] <= 0) delete state.cart[id];
    render();
  });
}

function addToCart(id){
  const p = prodById(id);
  const inCart = state.cart[id] || 0;
  if (inCart >= p.stock){ toast('Stock insuffisant'); return; }
  state.cart[id] = inCart + 1;
  render();
}

function validateSale(){
  const ids = Object.keys(state.cart);
  if (!ids.length) return;

  const now = new Date();
  const time = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

  ids.forEach(id => {
    const p = prodById(+id), q = state.cart[id];
    p.stock -= q;
    state.sales.push({ pid: p.id, qty: q, price: p.sell, time, by: state.gerant });
  });

  state.cart = {};
  toast('✓ Vente enregistrée — le propriétaire est informé');
  render();
}

function render(){
  renderHeader();
  renderTabs();

  const views = {
    caisse: vCaisse, stock: vStockGerant, jour: vJourGerant,
    dash: vDash, pstock: vStockProprio, ventes: vVentes, prods: vProds,
  };

  $('#main').innerHTML = `<div class="screen active">${views[state.tab]()}</div>`;
  document.querySelectorAll('[data-add]').forEach(b => b.onclick = () => addToCart(+b.dataset.add));
  document.querySelectorAll('[data-fiche]').forEach(b => b.onclick = () => { state.produitFiche = +b.dataset.fiche; render(); });
  document.querySelectorAll('[data-fiche-back]').forEach(b => b.onclick = () => { state.produitFiche = null; render(); });
  renderCart();
}

function init(){
  document.title = APP_CONFIG.appName;
  $('#appName').innerHTML = APP_CONFIG.appName + '<span>.</span>';

  document.querySelectorAll('#roleSwitch button').forEach(b =>
    b.onclick = () => {
      state.role = b.dataset.role;
      document.querySelectorAll('#roleSwitch button').forEach(x => x.classList.toggle('active', x === b));
      state.tab = state.role === 'gerant' ? 'caisse' : 'dash';
      state.produitFiche = null;
      render();
    }
  );

  $('#validateBtn').onclick = validateSale;

  render();
}

init();