/* =====================================================================
   ÉCRANS DE LA GÉRANTE v2
   ---------------------------------------------------------------------
   Caisse, Stock, Ma journée — design amélioré avec animations.
   ===================================================================== */

function vCaisse(){
  return `<h2 class="sec">Nouvelle vente</h2>
  <div class="prod-grid">${state.products.map(p => {
    const inCart = state.cart[p.id] || 0;
    return `<button class="prod-btn ${p.stock === 0 ? 'out' : ''}" data-add="${p.id}">
      ${inCart ? `<span class="inCart">${inCart}</span>` : ''}
      <span class="pq">×${p.stock}</span>
      <div class="pe">${p.e}</div>
      <div class="pn">${p.n}</div>
      <div class="pp">${F(p.sell)}</div>
    </button>`;
  }).join('')}</div>
  <p class="note">Touchez un produit pour l'ajouter au panier.<br>Le stock se met à jour automatiquement.</p>`;
}

function vStockGerant(){
  return `<h2 class="sec">Stock de la boutique</h2>
  <div class="locked">🔒 Les prix d'achat et les marges ne sont visibles que par le propriétaire.</div>
  <div class="list">${state.products.map(p =>
    `<div class="row"><span class="emoji">${p.e}</span>
      <div class="grow"><div class="t">${p.n}</div><div class="s">Prix de vente : ${F(p.sell)}</div></div>
      <div class="end"><span class="badge ${stockLevel(p.stock)}">${p.stock === 0 ? 'Rupture' : p.stock + ' restants'}</span></div>
    </div>`
  ).join('')}</div>`;
}

function analyseGerante(){
  const st = dayStats();
  if (!st.ss.length){
    return `<div class="ia-card"><div class="ia-head"><span class="ia-badge">Analyse</span><b>Ta journée</b></div>
      <p>Aucune vente enregistrée pour le moment. Dès ta première vente, un résumé s'affichera ici.</p></div>`;
  }

  const rythme = st.matin.length > st.aprem.length
    ? `La matinée a été plus active (<b>${st.matin.length} ventes</b> avant 13h contre <b>${st.aprem.length}</b> après).`
    : `L'après-midi a été plus actif (<b>${st.aprem.length} ventes</b> après 13h contre <b>${st.matin.length}</b> avant).`;

  const signalements = [];
  st.ruptures.forEach(p => signalements.push(`<b>${p.n}</b> est en rupture`));
  st.bas.forEach(p => signalements.push(`<b>${p.n}</b> est presque épuisé (${p.stock} restants)`));

  return `<div class="ia-card">
    <div class="ia-head"><span class="ia-badge">Analyse</span><b>Ta journée en résumé</b></div>
    <p>Tu as validé <b>${st.ss.length} ventes</b> aujourd'hui, soit <b>${st.articles} articles</b> au total. ${rythme}</p>
    <p>Le produit le plus demandé est <b>${st.topQty.p.n}</b> avec <b>${st.topQty.qty} unités</b> vendues${st.bestH !== null ? `, et l'heure la plus animée a été autour de <b>${st.bestH}h</b>` : ''}.</p>
    ${signalements.length ? `<div class="ia-tip">⚠️ À signaler au propriétaire : ${signalements.join(' · ')}.</div>` : ''}
  </div>`;
}

function vJourGerant(){
  const st = dayStats();
  return `<h2 class="sec">Ma journée</h2>
  <div class="kpi-row">
    <div class="kpi"><div class="lbl">Ventes validées</div><div class="val">${st.ss.length}</div></div>
    <div class="kpi"><div class="lbl">Articles vendus</div><div class="val">${st.articles}</div></div>
  </div>
  <h2 class="sec">Analyse de la journée</h2>
  ${analyseGerante()}
  <h2 class="sec">Détail</h2>
  <div class="list">${[...st.ss].reverse().map(s => {
    const p = prodById(s.pid);
    return `<div class="row"><span class="emoji">${p.e}</span>
      <div class="grow"><div class="t">${p.n} × ${s.qty}</div><div class="s">${s.time}</div></div>
      <div class="end money-txt">${F(s.qty * s.price)}</div></div>`;
  }).join('')}</div>`;
}