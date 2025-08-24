export interface Club {
  id: string;
  name: string;
  country: string;
  league: string;
  badgeUrl: string;
}

export interface League {
  id: string;
  name: string;
  country: string;
  clubs: Club[];
}

// Using a free API service for club badges - Logo.dev provides free logos
const BADGE_BASE_URL = "https://logo.clearbit.com";
const FALLBACK_BADGE = "https://img.icons8.com/color/48/football.png";

export const leagues: League[] = [
  {
    id: "premier-league",
    name: "Premier League",
    country: "England",
    clubs: [
      { id: "arsenal", name: "Arsenal", country: "England", league: "Premier League", badgeUrl: `${BADGE_BASE_URL}/arsenal.com` },
      { id: "aston-villa", name: "Aston Villa", country: "England", league: "Premier League", badgeUrl: `${BADGE_BASE_URL}/avfc.co.uk` },
      { id: "bournemouth", name: "AFC Bournemouth", country: "England", league: "Premier League", badgeUrl: `${BADGE_BASE_URL}/afcb.co.uk` },
      { id: "brentford", name: "Brentford", country: "England", league: "Premier League", badgeUrl: `${BADGE_BASE_URL}/brentfordfc.com` },
      { id: "brighton", name: "Brighton & Hove Albion", country: "England", league: "Premier League", badgeUrl: `${BADGE_BASE_URL}/brightonandhovealbion.com` },
      { id: "chelsea", name: "Chelsea", country: "England", league: "Premier League", badgeUrl: `${BADGE_BASE_URL}/chelseafc.com` },
      { id: "crystal-palace", name: "Crystal Palace", country: "England", league: "Premier League", badgeUrl: `${BADGE_BASE_URL}/cpfc.co.uk` },
      { id: "everton", name: "Everton", country: "England", league: "Premier League", badgeUrl: `${BADGE_BASE_URL}/evertonfc.com` },
      { id: "fulham", name: "Fulham", country: "England", league: "Premier League", badgeUrl: `${BADGE_BASE_URL}/fulhamfc.com` },
      { id: "ipswich", name: "Ipswich Town", country: "England", league: "Premier League", badgeUrl: `${BADGE_BASE_URL}/itfc.co.uk` },
      { id: "leicester", name: "Leicester City", country: "England", league: "Premier League", badgeUrl: `${BADGE_BASE_URL}/lcfc.com` },
      { id: "liverpool", name: "Liverpool", country: "England", league: "Premier League", badgeUrl: `${BADGE_BASE_URL}/liverpoolfc.com` },
      { id: "manchester-city", name: "Manchester City", country: "England", league: "Premier League", badgeUrl: `${BADGE_BASE_URL}/mancity.com` },
      { id: "manchester-united", name: "Manchester United", country: "England", league: "Premier League", badgeUrl: `${BADGE_BASE_URL}/manutd.com` },
      { id: "newcastle", name: "Newcastle United", country: "England", league: "Premier League", badgeUrl: `${BADGE_BASE_URL}/nufc.co.uk` },
      { id: "nottingham-forest", name: "Nottingham Forest", country: "England", league: "Premier League", badgeUrl: `${BADGE_BASE_URL}/nottinghamforest.co.uk` },
      { id: "southampton", name: "Southampton", country: "England", league: "Premier League", badgeUrl: `${BADGE_BASE_URL}/southamptonfc.com` },
      { id: "tottenham", name: "Tottenham Hotspur", country: "England", league: "Premier League", badgeUrl: `${BADGE_BASE_URL}/tottenhamhotspur.com` },
      { id: "west-ham", name: "West Ham United", country: "England", league: "Premier League", badgeUrl: `${BADGE_BASE_URL}/whufc.com` },
      { id: "wolves", name: "Wolverhampton Wanderers", country: "England", league: "Premier League", badgeUrl: `${BADGE_BASE_URL}/wolves.co.uk` },
    ]
  },
  {
    id: "championship",
    name: "Championship", 
    country: "England",
    clubs: [
      { id: "burnley", name: "Burnley", country: "England", league: "Championship", badgeUrl: `${BADGE_BASE_URL}/burnleyfc.com` },
      { id: "leeds", name: "Leeds United", country: "England", league: "Championship", badgeUrl: `${BADGE_BASE_URL}/leedsunited.com` },
      { id: "sheffield-united", name: "Sheffield United", country: "England", league: "Championship", badgeUrl: `${BADGE_BASE_URL}/sufc.co.uk` },
      { id: "west-brom", name: "West Bromwich Albion", country: "England", league: "Championship", badgeUrl: `${BADGE_BASE_URL}/wba.co.uk` },
      { id: "middlesbrough", name: "Middlesbrough", country: "England", league: "Championship", badgeUrl: `${BADGE_BASE_URL}/boro.co.uk` },
      { id: "coventry", name: "Coventry City", country: "England", league: "Championship", badgeUrl: `${BADGE_BASE_URL}/ccfc.co.uk` },
      { id: "norwich", name: "Norwich City", country: "England", league: "Championship", badgeUrl: `${BADGE_BASE_URL}/canaries.co.uk` },
      { id: "swansea", name: "Swansea City", country: "Wales", league: "Championship", badgeUrl: `${BADGE_BASE_URL}/swanseacity.com` },
    ]
  },
  {
    id: "la-liga",
    name: "La Liga",
    country: "Spain",
    clubs: [
      { id: "real-madrid", name: "Real Madrid", country: "Spain", league: "La Liga", badgeUrl: `${BADGE_BASE_URL}/realmadrid.com` },
      { id: "barcelona", name: "FC Barcelona", country: "Spain", league: "La Liga", badgeUrl: `${BADGE_BASE_URL}/fcbarcelona.com` },
      { id: "atletico-madrid", name: "Atlético Madrid", country: "Spain", league: "La Liga", badgeUrl: `${BADGE_BASE_URL}/atleticodemadrid.com` },
      { id: "sevilla", name: "Sevilla", country: "Spain", league: "La Liga", badgeUrl: `${BADGE_BASE_URL}/sevillafc.es` },
      { id: "real-sociedad", name: "Real Sociedad", country: "Spain", league: "La Liga", badgeUrl: `${BADGE_BASE_URL}/realsociedad.eus` },
      { id: "villarreal", name: "Villarreal", country: "Spain", league: "La Liga", badgeUrl: `${BADGE_BASE_URL}/villarrealcf.es` },
      { id: "real-betis", name: "Real Betis", country: "Spain", league: "La Liga", badgeUrl: `${BADGE_BASE_URL}/realbetisbalompie.es` },
      { id: "valencia", name: "Valencia", country: "Spain", league: "La Liga", badgeUrl: `${BADGE_BASE_URL}/valenciacf.com` },
      { id: "athletic-bilbao", name: "Athletic Bilbao", country: "Spain", league: "La Liga", badgeUrl: `${BADGE_BASE_URL}/athletic-club.eus` },
      { id: "osasuna", name: "CA Osasuna", country: "Spain", league: "La Liga", badgeUrl: `${BADGE_BASE_URL}/osasuna.es` },
      { id: "getafe", name: "Getafe", country: "Spain", league: "La Liga", badgeUrl: `${BADGE_BASE_URL}/getafecf.com` },
      { id: "celta", name: "Celta Vigo", country: "Spain", league: "La Liga", badgeUrl: `${BADGE_BASE_URL}/celtavigo.net` },
      { id: "rayo", name: "Rayo Vallecano", country: "Spain", league: "La Liga", badgeUrl: `${BADGE_BASE_URL}/rayovallecano.es` },
      { id: "mallorca", name: "RCD Mallorca", country: "Spain", league: "La Liga", badgeUrl: `${BADGE_BASE_URL}/rcdmallorca.es` },
      { id: "girona", name: "Girona FC", country: "Spain", league: "La Liga", badgeUrl: `${BADGE_BASE_URL}/girona.cat` },
      { id: "las-palmas", name: "UD Las Palmas", country: "Spain", league: "La Liga", badgeUrl: `${BADGE_BASE_URL}/udlaspalmas.es` },
      { id: "espanyol", name: "Espanyol", country: "Spain", league: "La Liga", badgeUrl: `${BADGE_BASE_URL}/espanyol.com` },
      { id: "alaves", name: "Deportivo Alavés", country: "Spain", league: "La Liga", badgeUrl: `${BADGE_BASE_URL}/deportivoalaves.com` },
      { id: "leganes", name: "CD Leganés", country: "Spain", league: "La Liga", badgeUrl: `${BADGE_BASE_URL}/deportivoleganes.com` },
      { id: "valladolid", name: "Real Valladolid", country: "Spain", league: "La Liga", badgeUrl: `${BADGE_BASE_URL}/realvalladolid.es` },
    ]
  },
  {
    id: "serie-a",
    name: "Serie A",
    country: "Italy",
    clubs: [
      { id: "juventus", name: "Juventus", country: "Italy", league: "Serie A", badgeUrl: `${BADGE_BASE_URL}/juventus.com` },
      { id: "inter-milan", name: "Inter Milan", country: "Italy", league: "Serie A", badgeUrl: `${BADGE_BASE_URL}/inter.it` },
      { id: "ac-milan", name: "AC Milan", country: "Italy", league: "Serie A", badgeUrl: `${BADGE_BASE_URL}/acmilan.com` },
      { id: "napoli", name: "Napoli", country: "Italy", league: "Serie A", badgeUrl: `${BADGE_BASE_URL}/sscnapoli.it` },
      { id: "roma", name: "AS Roma", country: "Italy", league: "Serie A", badgeUrl: `${BADGE_BASE_URL}/asroma.com` },
      { id: "lazio", name: "Lazio", country: "Italy", league: "Serie A", badgeUrl: `${BADGE_BASE_URL}/sslazio.it` },
      { id: "atalanta", name: "Atalanta", country: "Italy", league: "Serie A", badgeUrl: `${BADGE_BASE_URL}/atalanta.it` },
      { id: "fiorentina", name: "Fiorentina", country: "Italy", league: "Serie A", badgeUrl: `${BADGE_BASE_URL}/acffiorentina.com` },
      { id: "bologna", name: "Bologna", country: "Italy", league: "Serie A", badgeUrl: `${BADGE_BASE_URL}/bolognafc.it` },
      { id: "torino", name: "Torino", country: "Italy", league: "Serie A", badgeUrl: `${BADGE_BASE_URL}/torinofc.it` },
      { id: "udinese", name: "Udinese", country: "Italy", league: "Serie A", badgeUrl: `${BADGE_BASE_URL}/udinese.it` },
      { id: "sassuolo", name: "Sassuolo", country: "Italy", league: "Serie A", badgeUrl: `${BADGE_BASE_URL}/sassuolocalcio.it` },
      { id: "genoa", name: "Genoa", country: "Italy", league: "Serie A", badgeUrl: `${BADGE_BASE_URL}/genoacfc.it` },
      { id: "parma", name: "Parma", country: "Italy", league: "Serie A", badgeUrl: `${BADGE_BASE_URL}/parmacalcio1913.com` },
      { id: "hellas-verona", name: "Hellas Verona", country: "Italy", league: "Serie A", badgeUrl: `${BADGE_BASE_URL}/hellasverona.it` },
      { id: "cagliari", name: "Cagliari", country: "Italy", league: "Serie A", badgeUrl: `${BADGE_BASE_URL}/cagliaricalcio.com` },
      { id: "lecce", name: "Lecce", country: "Italy", league: "Serie A", badgeUrl: `${BADGE_BASE_URL}/uslecce.it` },
      { id: "empoli", name: "Empoli", country: "Italy", league: "Serie A", badgeUrl: `${BADGE_BASE_URL}/empolifc.it` },
      { id: "venezia", name: "Venezia", country: "Italy", league: "Serie A", badgeUrl: `${BADGE_BASE_URL}/veneziafc.it` },
      { id: "como", name: "Como 1907", country: "Italy", league: "Serie A", badgeUrl: `${BADGE_BASE_URL}/comocalcio.it` },
    ]
  },
  {
    id: "bundesliga",
    name: "Bundesliga",
    country: "Germany",
    clubs: [
      { id: "bayern-munich", name: "Bayern Munich", country: "Germany", league: "Bundesliga", badgeUrl: `${BADGE_BASE_URL}/fcbayern.com` },
      { id: "borussia-dortmund", name: "Borussia Dortmund", country: "Germany", league: "Bundesliga", badgeUrl: `${BADGE_BASE_URL}/bvb.de` },
      { id: "rb-leipzig", name: "RB Leipzig", country: "Germany", league: "Bundesliga", badgeUrl: `${BADGE_BASE_URL}/rbleipzig.com` },
      { id: "bayer-leverkusen", name: "Bayer Leverkusen", country: "Germany", league: "Bundesliga", badgeUrl: `${BADGE_BASE_URL}/bayer04.de` },
      { id: "eintracht-frankfurt", name: "Eintracht Frankfurt", country: "Germany", league: "Bundesliga", badgeUrl: `${BADGE_BASE_URL}/eintracht.de` },
      { id: "borussia-monchengladbach", name: "Borussia Mönchengladbach", country: "Germany", league: "Bundesliga", badgeUrl: `${BADGE_BASE_URL}/borussia.de` },
      { id: "schalke", name: "FC Schalke 04", country: "Germany", league: "Bundesliga", badgeUrl: `${BADGE_BASE_URL}/schalke04.de` },
      { id: "werder-bremen", name: "Werder Bremen", country: "Germany", league: "Bundesliga", badgeUrl: `${BADGE_BASE_URL}/werder.de` },
      { id: "vfb-stuttgart", name: "VfB Stuttgart", country: "Germany", league: "Bundesliga", badgeUrl: `${BADGE_BASE_URL}/vfb.de` },
      { id: "wolfsburg", name: "VfL Wolfsburg", country: "Germany", league: "Bundesliga", badgeUrl: `${BADGE_BASE_URL}/vfl-wolfsburg.de` },
      { id: "union-berlin", name: "Union Berlin", country: "Germany", league: "Bundesliga", badgeUrl: `${BADGE_BASE_URL}/fc-union-berlin.de` },
      { id: "freiburg", name: "SC Freiburg", country: "Germany", league: "Bundesliga", badgeUrl: `${BADGE_BASE_URL}/scfreiburg.com` },
      { id: "mainz", name: "FSV Mainz 05", country: "Germany", league: "Bundesliga", badgeUrl: `${BADGE_BASE_URL}/mainz05.de` },
      { id: "hoffenheim", name: "TSG Hoffenheim", country: "Germany", league: "Bundesliga", badgeUrl: `${BADGE_BASE_URL}/achtzehn99.de` },
      { id: "augsburg", name: "FC Augsburg", country: "Germany", league: "Bundesliga", badgeUrl: `${BADGE_BASE_URL}/fcaugsburg.de` },
      { id: "heidenheim", name: "FC Heidenheim", country: "Germany", league: "Bundesliga", badgeUrl: `${BADGE_BASE_URL}/fc-heidenheim.de` },
      { id: "st-pauli", name: "FC St. Pauli", country: "Germany", league: "Bundesliga", badgeUrl: `${BADGE_BASE_URL}/fcstpauli.com` },
      { id: "holstein-kiel", name: "Holstein Kiel", country: "Germany", league: "Bundesliga", badgeUrl: `${BADGE_BASE_URL}/holstein-kiel.de` },
    ]
  },
  {
    id: "ligue-1",
    name: "Ligue 1",
    country: "France",
    clubs: [
      { id: "psg", name: "Paris Saint-Germain", country: "France", league: "Ligue 1", badgeUrl: `${BADGE_BASE_URL}/psg.fr` },
      { id: "marseille", name: "Olympique Marseille", country: "France", league: "Ligue 1", badgeUrl: `${BADGE_BASE_URL}/om.net` },
      { id: "lyon", name: "Olympique Lyon", country: "France", league: "Ligue 1", badgeUrl: `${BADGE_BASE_URL}/ol.fr` },
      { id: "monaco", name: "AS Monaco", country: "France", league: "Ligue 1", badgeUrl: `${BADGE_BASE_URL}/asmonaco.com` },
      { id: "lille", name: "Lille", country: "France", league: "Ligue 1", badgeUrl: `${BADGE_BASE_URL}/losc.fr` },
      { id: "rennes", name: "Stade Rennais", country: "France", league: "Ligue 1", badgeUrl: `${BADGE_BASE_URL}/staderennais.com` },
      { id: "nice", name: "OGC Nice", country: "France", league: "Ligue 1", badgeUrl: `${BADGE_BASE_URL}/ogcnice.com` },
      { id: "strasbourg", name: "RC Strasbourg", country: "France", league: "Ligue 1", badgeUrl: `${BADGE_BASE_URL}/rcstrasbourg.fr` },
      { id: "lens", name: "RC Lens", country: "France", league: "Ligue 1", badgeUrl: `${BADGE_BASE_URL}/rclens.fr` },
      { id: "nantes", name: "FC Nantes", country: "France", league: "Ligue 1", badgeUrl: `${BADGE_BASE_URL}/fcnantes.com` },
      { id: "montpellier", name: "Montpellier", country: "France", league: "Ligue 1", badgeUrl: `${BADGE_BASE_URL}/mhscfoot.com` },
      { id: "toulouse", name: "Toulouse FC", country: "France", league: "Ligue 1", badgeUrl: `${BADGE_BASE_URL}/toulousefc.com` },
      { id: "reims", name: "Stade de Reims", country: "France", league: "Ligue 1", badgeUrl: `${BADGE_BASE_URL}/stade-de-reims.com` },
      { id: "brest", name: "Stade Brestois", country: "France", league: "Ligue 1", badgeUrl: `${BADGE_BASE_URL}/stade-brestois29.fr` },
      { id: "angers", name: "Angers SCO", country: "France", league: "Ligue 1", badgeUrl: `${BADGE_BASE_URL}/angers-sco.fr` },
      { id: "auxerre", name: "AJ Auxerre", country: "France", league: "Ligue 1", badgeUrl: `${BADGE_BASE_URL}/aja.fr` },
    ]
  },
  {
    id: "scottish-premiership",
    name: "Scottish Premiership",
    country: "Scotland",
    clubs: [
      { id: "celtic", name: "Celtic", country: "Scotland", league: "Scottish Premiership", badgeUrl: `${BADGE_BASE_URL}/celticfc.net` },
      { id: "rangers", name: "Rangers", country: "Scotland", league: "Scottish Premiership", badgeUrl: `${BADGE_BASE_URL}/rangers.co.uk` },
      { id: "aberdeen", name: "Aberdeen", country: "Scotland", league: "Scottish Premiership", badgeUrl: `${BADGE_BASE_URL}/afc.co.uk` },
      { id: "hearts", name: "Heart of Midlothian", country: "Scotland", league: "Scottish Premiership", badgeUrl: `${BADGE_BASE_URL}/heartsfc.co.uk` },
      { id: "hibs", name: "Hibernian", country: "Scotland", league: "Scottish Premiership", badgeUrl: `${BADGE_BASE_URL}/hibernianfc.co.uk` },
      { id: "motherwell", name: "Motherwell", country: "Scotland", league: "Scottish Premiership", badgeUrl: `${BADGE_BASE_URL}/motherwellfc.co.uk` },
      { id: "st-mirren", name: "St Mirren", country: "Scotland", league: "Scottish Premiership", badgeUrl: `${BADGE_BASE_URL}/stmirren.com` },
      { id: "dundee-united", name: "Dundee United", country: "Scotland", league: "Scottish Premiership", badgeUrl: `${BADGE_BASE_URL}/dundeeunitedfc.co.uk` },
    ]
  },
  {
    id: "eredivisie",
    name: "Eredivisie",
    country: "Netherlands", 
    clubs: [
      { id: "ajax", name: "Ajax", country: "Netherlands", league: "Eredivisie", badgeUrl: `${BADGE_BASE_URL}/ajax.nl` },
      { id: "psv", name: "PSV Eindhoven", country: "Netherlands", league: "Eredivisie", badgeUrl: `${BADGE_BASE_URL}/psv.nl` },
      { id: "feyenoord", name: "Feyenoord", country: "Netherlands", league: "Eredivisie", badgeUrl: `${BADGE_BASE_URL}/feyenoord.nl` },
      { id: "az-alkmaar", name: "AZ Alkmaar", country: "Netherlands", league: "Eredivisie", badgeUrl: `${BADGE_BASE_URL}/az.nl` },
      { id: "fc-twente", name: "FC Twente", country: "Netherlands", league: "Eredivisie", badgeUrl: `${BADGE_BASE_URL}/fctwente.nl` },
      { id: "utrecht", name: "FC Utrecht", country: "Netherlands", league: "Eredivisie", badgeUrl: `${BADGE_BASE_URL}/fc-utrecht.nl` },
      { id: "vitesse", name: "Vitesse", country: "Netherlands", league: "Eredivisie", badgeUrl: `${BADGE_BASE_URL}/vitesse.nl` },
    ]
  },
  {
    id: "primeira-liga",
    name: "Primeira Liga",
    country: "Portugal",
    clubs: [
      { id: "porto", name: "FC Porto", country: "Portugal", league: "Primeira Liga", badgeUrl: `${BADGE_BASE_URL}/fcporto.pt` },
      { id: "benfica", name: "Benfica", country: "Portugal", league: "Primeira Liga", badgeUrl: `${BADGE_BASE_URL}/slbenfica.pt` },
      { id: "sporting", name: "Sporting CP", country: "Portugal", league: "Primeira Liga", badgeUrl: `${BADGE_BASE_URL}/sporting.pt` },
      { id: "braga", name: "SC Braga", country: "Portugal", league: "Primeira Liga", badgeUrl: `${BADGE_BASE_URL}/scbraga.pt` },
      { id: "vitoria-guimaraes", name: "Vitória SC", country: "Portugal", league: "Primeira Liga", badgeUrl: `${BADGE_BASE_URL}/vsc.pt` },
    ]
  },
  {
    id: "mls",
    name: "Major League Soccer",
    country: "USA/Canada",
    clubs: [
      { id: "inter-miami", name: "Inter Miami", country: "USA", league: "MLS", badgeUrl: `${BADGE_BASE_URL}/intermiamicf.com` },
      { id: "lafc", name: "Los Angeles FC", country: "USA", league: "MLS", badgeUrl: `${BADGE_BASE_URL}/lafc.com` },
      { id: "la-galaxy", name: "LA Galaxy", country: "USA", league: "MLS", badgeUrl: `${BADGE_BASE_URL}/lagalaxy.com` },
      { id: "atlanta-united", name: "Atlanta United", country: "USA", league: "MLS", badgeUrl: `${BADGE_BASE_URL}/atlutd.com` },
      { id: "seattle-sounders", name: "Seattle Sounders", country: "USA", league: "MLS", badgeUrl: `${BADGE_BASE_URL}/soundersfc.com` },
      { id: "portland-timbers", name: "Portland Timbers", country: "USA", league: "MLS", badgeUrl: `${BADGE_BASE_URL}/timbers.com` },
      { id: "toronto-fc", name: "Toronto FC", country: "Canada", league: "MLS", badgeUrl: `${BADGE_BASE_URL}/torontofc.ca` },
      { id: "nycfc", name: "New York City FC", country: "USA", league: "MLS", badgeUrl: `${BADGE_BASE_URL}/nycfc.com` },
      { id: "dc-united", name: "D.C. United", country: "USA", league: "MLS", badgeUrl: `${BADGE_BASE_URL}/dcunited.com` },
    ]
  }
];

export const customOptions = [
  { id: "custom", name: "Enter custom team name", country: "Custom", league: "Custom", badgeUrl: FALLBACK_BADGE },
];

export function findClubById(clubId: string): Club | null {
  for (const league of leagues) {
    const club = league.clubs.find(c => c.id === clubId);
    if (club) return club;
  }
  return customOptions.find(c => c.id === clubId) || null;
}

export function findClubByName(name: string): Club | null {
  for (const league of leagues) {
    const club = league.clubs.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (club) return club;
  }
  return null;
}

export function getAllClubs(): Club[] {
  return leagues.flatMap(league => league.clubs).concat(customOptions);
}