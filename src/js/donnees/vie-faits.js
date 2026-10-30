// Données : « J'ai… » dans ma fiche (30/10). Chaque fait ajoute ses actions (panneau +), ses rituels, ses rappels à rythme (« La dernière fois que… ») et ses quêtes. Pas de code ici.
// {k, l: libellé, ic: icône RKI, g: groupe, fam: famille d'actions, opt: options ajoutées à une famille existante, rit: [[nom, matin|soir]], last: [[nom, n, j|s|m]], fq: [[id, titre, cat, xp, [h0,h1], {opts}]]}
const HAVE=[
  {k:"chien",l:"Un chien",ic:"chien",g:"Animaux",fam:{id:"chien",dom:"maison",cat:"maison",l:"Mon chien",xp:8,o:["Sortie","Longue balade","Nourrir","Jouer","Véto"]},rit:[["Sortir le chien","matin"],["Sortir le chien","soir"]],last:[["Vermifuge du chien",3,"m"],["Croquettes du chien",3,"s"]],fq:[["h_chien","Une longue balade avec ton chien","soi",15,[9,19],{we:1,out:1}]]},
  {k:"chat",l:"Un chat",ic:"chat",g:"Animaux",fam:{id:"chat",dom:"maison",cat:"maison",l:"Mon chat",xp:5,o:["Litière","Nourrir","Jouer","Véto"]},last:[["Litière du chat",3,"j"],["Croquettes du chat",3,"s"],["Véto du chat",12,"m"]]},
  {k:"petit",l:"Petit animal ou poissons",ic:"poisson",g:"Animaux",fam:{id:"petitanimal",dom:"maison",cat:"maison",l:"Mon petit animal",xp:5,o:["Nourrir","Nettoyer la cage","Nettoyer l'aquarium"]},last:[["Nettoyer la cage ou l'aquarium",2,"s"]]},
  {k:"plantes",l:"Des plantes",ic:"plante",g:"Maison",fam:{id:"plantes",dom:"maison",cat:"maison",l:"Mes plantes",xp:3,o:["Arroser","Rempoter","Tailler"]},last:[["Arroser les plantes",4,"j"]],fq:[["h_rempot","Rempoter une plante qui étouffe","maison",10,[10,20],{short:1}]]},
  {k:"jardin",l:"Un jardin ou un balcon",ic:"panier",g:"Maison",fam:{id:"jardin",dom:"maison",cat:"maison",l:"Jardin, balcon",xp:10,o:["Tondre","Désherber","Ranger le balcon"]},last:[["Tondre ou désherber",2,"s"]]},
  {k:"lavev",l:"Un lave-vaisselle",ic:"assiette",g:"Maison",opt:{vaisselle:["Lancer le lave-vaisselle","Vider le lave-vaisselle"]}},
  {k:"voiture",l:"Une voiture",ic:"voiture",g:"Transport",fam:{id:"voiture",dom:"maison",cat:"maison",l:"Ma voiture",xp:5,o:["Plein","Pression des pneus","Nettoyer","Garage"]},last:[["Pression des pneus",1,"m"],["Contrôle technique",24,"m"],["Assurance voiture",12,"m"]]},
  {k:"velo",l:"Un vélo",ic:"velo",g:"Transport",last:[["Regonfler et graisser le vélo",1,"m"]]},
  {k:"tc",l:"Transports en commun",ic:"ticket",g:"Transport",last:[["Recharger l'abonnement",1,"m"]]},
  {k:"lentilles",l:"Des lentilles",ic:"lunettes",g:"Santé",last:[["Changer de lentilles",1,"m"],["Racheter des lentilles",3,"m"]]},
  {k:"traitement",l:"Un traitement",ic:"sante",g:"Santé",rit:[["Prendre mon traitement","matin"]],last:[["Racheter mon traitement",1,"m"]]},
  {k:"vege",l:"Je mange végé",ic:"legume",g:"Santé",fq:[["h_vege","Tester une recette végé que tu ne connais pas","nourriture",15,[11,21],{in:1}]]},
  {k:"gluten",l:"Je mange sans gluten",ic:"pain",g:"Santé"},
  {k:"enfant",l:"Un enfant à garder",ic:"enfant",g:"Famille",fam:{id:"enfant",dom:"proches",cat:"famille",l:"Avec mon enfant",xp:10,o:["École","Devoirs","Jeux","Bain","Histoire du soir"]},rit:[["Histoire du soir","soir"]]},
  {k:"club",l:"Du sport en club",ic:"ballon",g:"Activité",fam:{id:"club",dom:"sport",cat:"sport",l:"Mon club",xp:20,o:["Entraînement","Match","Préparer mon sac"]},fq:[["h_club","Préparer ton sac pour l'entraînement","sport",5,[17,23],{short:1}]]},
  {k:"instru",l:"Un instrument",ic:"notec",g:"Activité",fam:{id:"instru",dom:"creer",cat:"perso",l:"Mon instrument",xp:10,o:["Pratiquer","Apprendre un morceau","Jouer pour quelqu'un"]},fq:[["h_instru","15 min de pratique sur ton instrument","perso",10,[10,22],{short:1}]]}
];
const HAVE_G=["Animaux","Maison","Transport","Santé","Famille","Activité"];
