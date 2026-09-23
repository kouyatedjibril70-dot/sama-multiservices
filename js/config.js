/* =====================================================================
   SAMA MULTISERVICES v2 — Configuration
   ---------------------------------------------------------------------
   Fichier unique à modifier pour personnaliser l'application.
   (Pour les couleurs, voir css/style.css → :root)
   ===================================================================== */
const APP_CONFIG = {

  appName: 'Sama Multiservices',
  gerantName: 'Fatou',

  stockCritical: 3,
  stockLow: 6,

  // NOTE: en production, ces cumuls viennent de la BDD (historique des achats et des ventes), pas de la config.
  products: [
    {id:1, e:'🔌', n:'Chargeur Type C',     buy:800,   sell:1500,   stock:38, totalAchete:180, totalVendu:142},
    {id:2, e:'📱', n:'Coque Samsung',       buy:900,   sell:2000,   stock:21, totalAchete:110, totalVendu:89},
    {id:3, e:'🎧', n:'Écouteurs Bluetooth', buy:2200,  sell:3500,   stock:2,  totalAchete:60,  totalVendu:58},
    {id:4, e:'💾', n:'Carte mémoire 32Go',  buy:2500,  sell:4000,   stock:14, totalAchete:90,  totalVendu:76},
    {id:5, e:'🔋', n:'Powerbank 10000mAh',  buy:5500,  sell:8000,   stock:0,  totalAchete:40,  totalVendu:40},
    {id:6, e:'🛡️', n:'Verre trempé',        buy:500,   sell:1500,   stock:3,  totalAchete:150, totalVendu:147},
    {id:7, e:'🔗', n:'Câble USB',           buy:400,   sell:1000,   stock:27, totalAchete:200, totalVendu:173},
    {id:8, e:'📲', n:'Samsung A16',         buy:95000, sell:120000, stock:4,  totalAchete:25,  totalVendu:21},
  ],

  seedSales: [
    [1,3,'08:15'], [7,2,'08:40'], [2,1,'09:05'],
    [1,2,'09:30'], [4,1,'10:10'], [8,1,'10:45'],
    [1,4,'11:20'], [3,1,'11:50'], [6,2,'12:15'],
    [2,2,'13:05'], [1,3,'14:30'], [7,3,'15:10'],
  ],

};