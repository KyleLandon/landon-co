export interface LocationConfig {
  city: string;
  state: string;
  slug: string;
  intro: string;
  market: string;
  neighborhoods: string[];
  industries: string[];
}

export const SAN_ANTONIO: LocationConfig = {
  city: "San Antonio",
  state: "TX",
  slug: "web-design-san-antonio",
  intro:
    "From the Pearl to Stone Oak, San Antonio small businesses need websites that load fast, look modern, and turn local searches into booked work. Landon & Co. designs and builds them — fixed price, no jargon.",
  market:
    "San Antonio is one of the fastest-growing metros in Texas, with a deep mix of restaurants, contractors, healthcare practices, and service businesses competing for the same local searches. A modern, fast website with proper local SEO is the difference between showing up on page one and getting buried.",
  neighborhoods: [
    "Downtown & Pearl District",
    "Stone Oak & North Central",
    "Alamo Heights",
    "Westover Hills",
    "New Braunfels & Boerne",
    "Schertz & Cibolo",
  ],
  industries: [
    "Restaurants & hospitality",
    "Contractors & home services",
    "Healthcare & dental",
    "Real estate & property",
    "Retail & e-commerce",
    "Professional services",
  ],
};

export const CORPUS_CHRISTI: LocationConfig = {
  city: "Corpus Christi",
  state: "TX",
  slug: "web-design-corpus-christi",
  intro:
    "Coastal businesses move at their own pace — your website should keep up. We design Corpus Christi websites that look great on every device and bring in real bookings, calls, and orders.",
  market:
    "From tourism on the bayfront to the industrial corridor along the port, Corpus Christi businesses serve everyone from beach-week visitors to long-time locals. Your site has to work for both — fast on a phone in a parking lot, easy to book from, and ranking when someone searches “best near me.”",
  neighborhoods: [
    "Downtown & Bayfront",
    "Padre Island & Flour Bluff",
    "Calallen & Annaville",
    "Portland & Ingleside",
    "Rockport & Aransas Pass",
    "Kingsville",
  ],
  industries: [
    "Tourism & hospitality",
    "Marine & fishing charters",
    "Restaurants & bars",
    "Construction & trades",
    "Healthcare",
    "Professional services",
  ],
};

export const VICTORIA: LocationConfig = {
  city: "Victoria",
  state: "TX",
  slug: "web-design-victoria-tx",
  intro:
    "Victoria sits in the middle of the South Texas triangle and has the small-business backbone to prove it. We build the kind of sites that win local trust — clean, fast, and easy to update.",
  market:
    "Victoria’s market is built on relationships, but more buyers than ever start on Google before they ever pick up the phone. A modern site with strong local SEO turns those searches into walk-ins, calls, and quote requests.",
  neighborhoods: [
    "Downtown Victoria",
    "Northside & Loop 463",
    "Cuero & Yoakum",
    "Goliad & Refugio",
    "Port Lavaca",
    "Edna & Ganado",
  ],
  industries: [
    "Oil & gas services",
    "Agriculture & ranching",
    "Construction & trades",
    "Restaurants & retail",
    "Healthcare",
    "Manufacturing",
  ],
};
