-- Données de démarrage : goodies du club (les annonces d'occasion sont créées
-- par les membres). Les photos pointent vers les images du site en attendant
-- les vraies photos produits, à déposer dans le bucket `product-photos`.

insert into public.products (slug, name, category, description, images, price_cents, team, team_only, published, size_note, sort_order) values
  ('polo-club-bayard', 'Polo Club Bayard', 'textile',
   'Le polo officiel du club, en piqué de coton bleu marine, logo brodé sur le cœur. Coupe unisexe.',
   '{/team.jpg,/compet_1.jpg}', 3200, null, false, true,
   'Taille normalement. Entre deux tailles, prenez la taille au-dessus.', 1),
  ('sweat-capuche-club-bayard', 'Sweat à capuche Club Bayard', 'textile',
   'Sweat à capuche molletonné, logo Club Bayard imprimé sur la poitrine et « Équitation Paris » dans le dos.',
   '{/history.jpg,/slide_1.jpg}', 4500, null, false, true, null, 2),
  ('casquette-club-bayard', 'Casquette Club Bayard', 'accessoires-cavalier',
   'Casquette bleu marine brodée, réglable. Taille unique.',
   '{/offer_2.jpg}', 1800, null, false, true, null, 3),
  ('tapis-selle-club-bayard', 'Tapis de selle Club Bayard', 'accessoires-cheval',
   'Tapis de selle mixte bleu marine, liseré blanc, logo brodé sur les deux côtés.',
   '{/dressage.jpg,/infr_1.jpg}', 3900, null, false, true, null, 4),
  ('veste-concours-equipe-cce', 'Veste de concours Équipe CCE', 'tenue-equipe',
   'Veste de concours officielle de l''équipe CCE, bleu marine, passepoil bleu ciel et écusson du club. Sur commande.',
   '{/compet_1.jpg,/compet_4.jpg}', 14900, 'cce', true, true,
   'Essayage possible au secrétariat le samedi matin avant de précommander.', 5),
  ('polo-equipe-pony-games', 'Polo Équipe Pony-Games', 'tenue-equipe',
   'Polo bleu ciel de l''équipe Pony-Games, logo brodé, nom du cavalier possible au dos.',
   '{/compet_5.jpg,/compet_6.jpg}', 2800, 'pony-games', true, true, null, 6),
  ('tour-de-cou-club-bayard', 'Tour de cou polaire Club Bayard', 'accessoires-cavalier',
   'Tour de cou polaire bleu marine, logo brodé.',
   '{/activity_1.jpg}', 1200, null, false, true, null, 7),
  ('gourde-club-bayard', 'Gourde isotherme Club Bayard', 'divers',
   'Gourde inox 500 ml, double paroi, gravure Club Bayard.',
   '{/activity_2.jpg}', 2200, null, false, true, null, 8),
  ('polo-equipe-hunter', 'Polo Équipe Hunter', 'tenue-equipe',
   'Polo bleu marine de l''équipe Hunter, logo brodé sur la manche.',
   '{/compet_8.jpg}', 2800, 'hunter', false, true, null, 9),
  ('bonnet-club-bayard', 'Bonnet tricot Club Bayard', 'accessoires-cavalier',
   'Bonnet en maille bleu marine avec pompon blanc, écusson tissé.',
   '{/activity_3.jpg}', 1500, null, false, true, null, 10),
  ('sac-pansage-club-bayard', 'Sac de pansage Club Bayard', 'accessoires-cheval',
   'Sac de pansage bleu marine à compartiments, logo brodé. Livré vide.',
   '{/activity_5.jpg}', 2900, null, false, true, null, 11),
  ('veste-softshell-equipe-dressage', 'Veste softshell Équipe Dressage', 'tenue-equipe',
   'Veste softshell bleu marine, liseré blanc, brodée « Équipe Dressage ».',
   '{/dressage.jpg}', 6900, 'dressage', false, true, null, 12)
on conflict (slug) do nothing;

insert into public.product_variants (product_id, label, stock, on_order, lead_time, sort_order)
select p.id, v.label, v.stock, v.on_order, v.lead_time, v.sort_order
from (values
  ('polo-club-bayard', 'XS', 2, false, null, 1),
  ('polo-club-bayard', 'S', 5, false, null, 2),
  ('polo-club-bayard', 'M', 0, false, null, 3),
  ('polo-club-bayard', 'L', 4, false, null, 4),
  ('polo-club-bayard', 'XL', 3, false, null, 5),
  ('sweat-capuche-club-bayard', '8 ans', 3, false, null, 1),
  ('sweat-capuche-club-bayard', '10 ans', 4, false, null, 2),
  ('sweat-capuche-club-bayard', '12 ans', 2, false, null, 3),
  ('sweat-capuche-club-bayard', 'S', 6, false, null, 4),
  ('sweat-capuche-club-bayard', 'M', 5, false, null, 5),
  ('sweat-capuche-club-bayard', 'L', 1, false, null, 6),
  ('casquette-club-bayard', 'Taille unique', 12, false, null, 1),
  ('tapis-selle-club-bayard', 'Poney', 3, false, null, 1),
  ('tapis-selle-club-bayard', 'Cob', 2, false, null, 2),
  ('tapis-selle-club-bayard', 'Full', 4, false, null, 3),
  ('veste-concours-equipe-cce', 'XS', 0, true, '6 à 8 semaines', 1),
  ('veste-concours-equipe-cce', 'S', 0, true, '6 à 8 semaines', 2),
  ('veste-concours-equipe-cce', 'M', 0, true, '6 à 8 semaines', 3),
  ('veste-concours-equipe-cce', 'L', 0, true, '6 à 8 semaines', 4),
  ('polo-equipe-pony-games', '6 ans', 2, false, null, 1),
  ('polo-equipe-pony-games', '8 ans', 4, false, null, 2),
  ('polo-equipe-pony-games', '10 ans', 5, false, null, 3),
  ('polo-equipe-pony-games', '12 ans', 3, false, null, 4),
  ('polo-equipe-pony-games', '14 ans', 1, false, null, 5),
  ('polo-equipe-pony-games', 'S', 2, false, null, 6),
  ('polo-equipe-pony-games', 'M', 2, false, null, 7),
  ('tour-de-cou-club-bayard', 'Taille unique', 20, false, null, 1),
  ('gourde-club-bayard', 'Bleu marine', 8, false, null, 1),
  ('gourde-club-bayard', 'Blanc', 0, false, null, 2),
  ('polo-equipe-hunter', 'S', 3, false, null, 1),
  ('polo-equipe-hunter', 'M', 3, false, null, 2),
  ('polo-equipe-hunter', 'L', 2, false, null, 3),
  ('bonnet-club-bayard', 'Taille unique', 10, false, null, 1),
  ('sac-pansage-club-bayard', 'Taille unique', 4, false, null, 1),
  ('veste-softshell-equipe-dressage', 'S', 1, false, null, 1),
  ('veste-softshell-equipe-dressage', 'M', 2, false, null, 2),
  ('veste-softshell-equipe-dressage', 'L', 0, false, null, 3)
) as v(slug, label, stock, on_order, lead_time, sort_order)
join public.products p on p.slug = v.slug
on conflict (product_id, label) do nothing;

-- Pour promouvoir un membre administrateur après son inscription :
-- update public.profiles set role = 'admin' where email = 'secretariat@clubbayard.com';
