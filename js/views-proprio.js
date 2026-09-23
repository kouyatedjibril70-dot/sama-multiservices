/* =====================================================================
   ÉCRANS DU PROPRIÉTAIRE v2
   ---------------------------------------------------------------------
   Dashboard, Stock avec marges, Ventes, Catalogue.
   ===================================================================== */

function analyseProprio(){
  const st = dayStats();
  if (!st.ss.length){
    return `<div class="ia-card"><div class="ia-head"><span class="ia-badge">🤖 Analyse IA</span><b>Votre journée expliquée</b></div>
      <p>Aucune vente pour le moment aujourd'hui. L'analyse s'affichera dès les premières ventes.</p></div>`;
  }

  const CA = ca(st.ss), BN = benef(st.ss);
  const margePct = CA ? Math.round(BN / CA * 100) : 0;

  const caM = ca(st.matin), caA = ca(st.aprem);
  const rythme = caM > caA
    ? `C'est la <b>matinée</b> qui a porté la journée avec <span class="m">${F(caM)}</span> encaissés avant 13h, contre <span class="m">${F(caA)}</span> l'après-midi.`
    : `C'est l'<b>après-midi</b> qui a porté la journée avec <span class="m">${F(caA)}</span> encaissés après 13h, contre <span class="m">${F(caM)}</span> le matin.`;

  const impacts = [];
  st.ruptures.forEach(p => {
    impacts.push(`<b>${p.n}</b> est <span class="neg">en rupture</span> : chaque client qui le demande repart sans acheter, c'est une perte d'environ <span class="m">${F(p.sell - p.buy)}</span> de bénéfice par vente manquée`);
  });
  st.bas.forEach(p => {
    impacts.push(`<b>${p.n}</b> est presque épuisé (${p.stock} restants) : au rythme actuel il sera en rupture très bientôt`);
  });

  const aCommander = [...st.ruptures, ...st.bas];
  const reco = aCommander.length
    ? `Pensez à recommander : ${aCommander.map(p => `<b>${p.n}</b> (coût ≈ <span class="m">${F(p.buy * 10)}</span> pour 10 unités)`).join(', ')}. Ces produits se vendent bien — un stock vide, c'est du bénéfice qui part chez le concurrent d'à côté.`
    : `Aucun produit critique en stock : rien d'urgent à commander aujourd'hui.`;

  return `<div class="ia-card">
    <div class="ia-head"><span class="ia-badge">🤖 Analyse IA</span><b>Votre journée expliquée simplement</b></div>
    <p><b>L'essentiel :</b> votre boutique a encaissé <span class="m">${F(CA)}</span> aujourd'hui, dont <span class="m">${F(BN)}</span> de <b>bénéfice réel</b> (une fois le prix d'achat des produits déduit). Autrement dit, sur chaque 1 000 F encaissés, environ <span class="m">${margePct * 10} F</span> vous reviennent vraiment.</p>
    <p><b>Ce qui a marché :</b> ${st.topQty ? `<b>${st.topQty.p.n}</b> est le produit star du jour (${st.topQty.qty} vendus)` : ''}${st.topBenef && st.topQty && st.topBenef.p.id !== st.topQty.p.id ? `, mais c'est <b>${st.topBenef.p.n}</b> qui vous a rapporté le plus de bénéfice (<span class="m">${F(st.topBenef.benef)}</span>) — ce n'est pas toujours ce qui se vend le plus qui rapporte le plus` : st.topBenef ? ` et c'est aussi lui qui rapporte le plus (<span class="m">${F(st.topBenef.benef)}</span>)` : ''}. ${rythme}</p>
    ${impacts.length ? `<p><b>Points d'attention :</b> ${impacts.join('. ')}.</p>` : ''}
    <div class="ia-tip">💡 <b>Recommandation :</b> ${reco}</div>
  </div>`;
}

function vDash(){
  const st = dayStats();
  const ss = st.ss;

  const alerts = [];
  state.products.forEach(p => {
    if (p.stock === 0) alerts.push(`<div class="alert-box">🔴 <span><b>${p.n}</b> en rupture</span></div>`);
    else if (p.stock <= APP_CONFIG.stockCritical) alerts.push(`<div class="alert-box warn">🟠 <span><b>${p.n}</b> presque épuisé (${p.stock} restants)</span></div>`);
  });

  const hours = Array.from({ length: 12 }, (_, i) => i + 8);
  const byH = hours.map(h => ca(ss.filter(s => parseInt(s.time) === h)));
  const mx = Math.max(...byH, 1);

  const top = [...st.entries].sort((a, b) => b.qty - a.qty).slice(0, 4);

  return `<h2 class="sec">Les chiffres</h2>
  <div class="kpi-row">
    <div class="kpi money"><div class="lbl">Argent encaissé</div><div class="val">${F(ca(ss))}</div><div class="sub">tout ce qui est entré aujourd'hui</div></div>
    <div class="kpi money"><div class="lbl">Ton vrai bénéfice</div><div class="val">${F(benef(ss))}</div><div class="sub">ce qui te reste, prix d'achat déduit</div></div>
    <div class="kpi" style="grid-column:1/-1"><div class="lbl">Ventes</div><div class="val">${ss.length}</div><div class="sub">${st.articles} articles</div></div>
  </div>
  ${alerts.length ? `<h2 class="sec">Alertes</h2>${alerts.join('')}` : ''}
  <h2 class="sec">Ventes par heure</h2>
  <div class="card chart-wrap"><div class="chart">${hours.map((h, i) =>
    `<div class="bar" style="height:${Math.max(4, byH[i] / mx * 100)}%"><em>${h}h</em></div>`
  ).join('')}</div></div>
  <h2 class="sec">Top produits du jour</h2>
  <div class="list">${top.map((e, i) =>
    `<div class="row"><span class="topnum">${i + 1}</span><span class="emoji">${e.p.e}</span>
      <div class="grow"><div class="t">${e.p.n}</div><div class="s">${e.qty} vendus</div></div>
      <div class="end money-txt">+${F(e.benef)}</div></div>`
  ).join('')}</div>
  <h2 class="sec">Comprendre ma journée</h2>
  ${analyseProprio()}
  <p class="note">Bénéfice calculé automatiquement : prix d'achat saisi une seule fois.</p>`;
}

function vStockProprio(){
  if (state.produitFiche) return vFicheProduit(prodById(state.produitFiche));

  const val = state.products.reduce((a, p) => a + p.stock * p.buy, 0);
  const pot = state.products.reduce((a, p) => a + p.stock * (p.sell - p.buy), 0);
  return `<div class="kpi-row">
    <div class="kpi"><div class="lbl">Argent dans les marchandises</div><div class="val">${F(val)}</div><div class="sub">ce que ton stock t'a coûté</div></div>
    <div class="kpi money"><div class="lbl">Gain si tu vends tout</div><div class="val">${F(pot)}</div><div class="sub">si tout est vendu</div></div>
  </div>
  <h2 class="sec">Produits</h2>
  <div class="list">${state.products.map(p =>
    `<div class="row" style="cursor:pointer" data-fiche="${p.id}"><span class="emoji">${p.e}</span>
      <div class="grow"><div class="t">${p.n}</div>
      <div class="s">Achat ${F(p.buy)} → Vente ${F(p.sell)} · marge <b>${F(p.sell - p.buy)}</b></div></div>
      <div class="end"><div class="money-txt">×${p.stock}</div><span class="badge ${stockLevel(p.stock)}">${stockLabel(p.stock)}</span></div>
    </div>`
  ).join('')}</div>`;
}

function vFicheProduit(p){
  const margeUnit = p.sell - p.buy;
  const gagne = p.totalVendu * margeUnit;
  const immobilise = p.stock * p.buy;

  return `<div class="card" style="cursor:pointer;border:2px dashed var(--line);box-shadow:none;background:transparent;text-align:center" data-fiche-back>
    <b style="color:var(--primary)">← Retour à la liste</b>
  </div>
  <h2 class="sec">${p.e} ${p.n}</h2>
  <div class="kpi-row">
    <div class="kpi"><div class="lbl">Acheté en tout</div><div class="val">${p.totalAchete}</div><div class="sub">unités depuis le début</div></div>
    <div class="kpi"><div class="lbl">Vendu en tout</div><div class="val">${p.totalVendu}</div><div class="sub">unités depuis le début</div></div>
    <div class="kpi" style="grid-column:1/-1"><div class="lbl">En stock maintenant</div><div class="val">${p.stock}</div><div class="sub">unités restantes</div></div>
  </div>
  <h2 class="sec">Prix</h2>
  <div class="list">
    <div class="row"><div class="grow"><div class="t">Prix d'achat</div><div class="s">ce que ça te coûte l'unité</div></div>
      <div class="end">${F(p.buy)}</div></div>
    <div class="row"><div class="grow"><div class="t">Prix de vente</div><div class="s">ce que tu factures l'unité</div></div>
      <div class="end">${F(p.sell)}</div></div>
    <div class="row"><div class="grow"><div class="t">Marge unitaire</div><div class="s">ce que tu gagnes par unité vendue</div></div>
      <div class="end">${F(margeUnit)}</div></div>
  </div>
  <h2 class="sec">Bilan depuis le début</h2>
  <div class="list">
    <div class="row"><div class="grow"><div class="t">Gagné depuis le début</div><div class="s">${p.totalVendu} vendus × ${F(margeUnit)} de marge</div></div>
      <div class="end money-txt">${F(gagne)}</div></div>
    <div class="row"><div class="grow"><div class="t">Argent encore immobilisé</div><div class="s">ce que le stock restant t'a coûté</div></div>
      <div class="end">${F(immobilise)}</div></div>
  </div>
  <div class="ia-card">
    <div class="ia-head"><span class="ia-badge">🤖 Analyse IA</span><b>En clair</b></div>
    <p>Depuis le début, ce produit t'a rapporté <span class="m">${F(gagne)}</span>. Il te reste <b>${p.stock}</b> unité${p.stock > 1 ? 's' : ''} en stock.</p>
  </div>`;
}

function vVentes(){
  const ss = [...state.sales].reverse();
  return `<h2 class="sec">Journal des ventes — aujourd'hui</h2>
  <div class="list">${ss.map(s => {
    const p = prodById(s.pid);
    return `<div class="row"><span class="emoji">${p.e}</span>
      <div class="grow"><div class="t">${p.n} × ${s.qty}</div>
      <div class="s">${s.time} · vendu par <b>${s.by}</b></div></div>
      <div class="end"><div class="money-txt">${F(s.qty * s.price)}</div>
      <div class="s">bénéf. ${F(s.qty * (s.price - p.buy))}</div></div>
    </div>`;
  }).join('')}</div>
  <p class="note">Chaque vente est tracée : produit, heure, gérante, montant.<br>Rien ne peut être effacé discrètement.</p>`;
}

function vProds(){
  if (state.produitFiche) return vFicheProduit(prodById(state.produitFiche));

  return `<div class="locked">🔒 Écran réservé au propriétaire — la gérante ne peut ni créer un produit, ni changer un prix.</div>
  <h2 class="sec">Catalogue</h2>
  <div class="list">${state.products.map(p => `
    <div class="row" style="cursor:pointer" data-fiche="${p.id}"><span class="emoji">${p.e}</span>
      <div class="grow"><div class="t">${p.n}</div>
      <div class="s">Achat ${F(p.buy)} · Vente ${F(p.sell)}</div></div>
      <div class="end"><span class="badge v">Modifier</span></div>
    </div>`).join('')}</div>
  <div class="card" style="text-align:center;border:2px dashed var(--line);box-shadow:none;background:transparent;cursor:pointer">
    <b style="color:var(--primary)">＋ Ajouter un produit</b>
    <div class="s" style="font-size:.75rem;color:var(--ink-soft);margin-top:4px">Nom · prix d'achat · prix de vente · stock de départ</div>
  </div>`;
}