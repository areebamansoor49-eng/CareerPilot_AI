const axios = require("axios");
const {
  searchSerpApiJobs,
} = require("./serpApiJobService");
const {
  searchJoobleJobs,
  normalizeJoobleJob,
} = require("./joobleJobService");

// ======================================================
// ADZUNA SUPPORTED MARKETS
// ======================================================

const ADZUNA_COUNTRIES = {
  gb: "United Kingdom",
  us: "United States",
  ca: "Canada",
  au: "Australia",
  nz: "New Zealand",
  za: "South Africa",
  sg: "Singapore",
  in: "India",
};

// ======================================================
// ADZUNA LOCATION MAP
// ======================================================

const LOCATION_COUNTRY_MAP = {
  // United Kingdom
  uk: "gb",
  "united kingdom": "gb",
  england: "gb",
  london: "gb",
  manchester: "gb",
  birmingham: "gb",
  liverpool: "gb",
  glasgow: "gb",
  edinburgh: "gb",

  // United States
  usa: "us",
  "united states": "us",
  america: "us",
  "new york": "us",
  "los angeles": "us",
  chicago: "us",
  houston: "us",
  boston: "us",
  seattle: "us",
  "san francisco": "us",
  washington: "us",

  // Canada
  canada: "ca",
  toronto: "ca",
  vancouver: "ca",
  montreal: "ca",
  calgary: "ca",
  ottawa: "ca",

  // Australia
  australia: "au",
  sydney: "au",
  melbourne: "au",
  brisbane: "au",
  perth: "au",
  adelaide: "au",

  // New Zealand
  "new zealand": "nz",
  auckland: "nz",
  wellington: "nz",
  christchurch: "nz",

  // South Africa
  "south africa": "za",
  johannesburg: "za",
  "cape town": "za",
  durban: "za",
  pretoria: "za",

  // Singapore
  singapore: "sg",

  // India
  india: "in",
  mumbai: "in",
  delhi: "in",
  bangalore: "in",
  bengaluru: "in",
  hyderabad: "in",
  chennai: "in",
  pune: "in",
  kolkata: "in",
};

// ======================================================
// PAKISTAN
// ======================================================

const PAKISTAN_LOCATIONS = [
  "pakistan",

  // Major cities
  "karachi",
  "lahore",
  "islamabad",
  "rawalpindi",
  "faisalabad",
  "multan",
  "peshawar",
  "quetta",
  "hyderabad",
  "sialkot",
  "gujranwala",
  "bahawalpur",
  "sukkur",
  "abbottabad",
  "murree",
  "kasur",
  "sahiwal",
  "jhelum",
  "mardan",
  "swat",
  "dera ghazi khan",
  "rahim yar khan",
  "nawabshah",
  "larkana",
  "sheikhupura",
  "chakwal",
  "gujrat",
  "wah cantt",
  "wah",
  "taxila",
  "attock",
  "mansehra",
  "kohat",
  "bannu",
  "dera ismail khan",
  "mingora",
  "chitral",
  "gilgit",
  "skardu",
  "muzaffarabad",
  "mirpur",
  "kotli",
  "gwadar",
  "turbat",
  "khuzdar",
  "jacobabad",
  "shikarpur",
  "dadu",
  "thatta",
  "mirpur khas",
  "tando adam",
  "tando allahyar",

  // Karachi areas
  "shahrah-e-faisal",
  "shahra-e-faisal",
  "shahrah e faisal",
  "shahra e faisal",
  "clifton",
  "dha karachi",
  "defence karachi",
  "defence phase",
  "gulshan-e-iqbal",
  "gulshan e iqbal",
  "north nazimabad",
  "nazimabad",
  "korangi",
  "landhi",
  "malir",
  "bahadurabad",
  "pechs",
  "fb area",
  "federal b area",
  "saddar karachi",
  "site area",
  "korangi industrial area",

  // Lahore areas
  "gulberg lahore",
  "dha lahore",
  "defence lahore",
  "johar town",
  "model town lahore",
  "garden town lahore",
  "township lahore",

  // Islamabad / Rawalpindi areas
  "f-6",
  "f-7",
  "f-8",
  "f-10",
  "f-11",
  "g-6",
  "g-8",
  "g-9",
  "g-10",
  "g-11",
  "i-8",
  "i-9",
  "bahria town islamabad",
  "bahria town rawalpindi",
  "saddar rawalpindi",
];

// ======================================================
// UAE
// ======================================================

const UAE_LOCATIONS = [
  "uae",
  "u.a.e",
  "united arab emirates",
  "dubai",
  "abu dhabi",
  "sharjah",
  "ajman",
  "ras al khaimah",
  "fujairah",
  "umm al quwain",
  "al ain",
];

// ======================================================
// SAUDI ARABIA
// ======================================================

const SAUDI_LOCATIONS = [
  "saudi arabia",
  "kingdom of saudi arabia",
  "ksa",
  "riyadh",
  "jeddah",
  "makkah",
  "mecca",
  "madinah",
  "madina",
  "medina",
  "dammam",
  "khobar",
  "al khobar",
  "taif",
  "tabuk",
  "abha",
  "jubail",
];

// ======================================================
// CITY / COUNTRY HELPERS
// ======================================================

const PAKISTAN_CITY_MAP = {
  karachi: "Karachi, Pakistan",
  lahore: "Lahore, Pakistan",
  islamabad: "Islamabad, Pakistan",
  rawalpindi: "Rawalpindi, Pakistan",
  faisalabad: "Faisalabad, Pakistan",
  multan: "Multan, Pakistan",
  peshawar: "Peshawar, Pakistan",
  quetta: "Quetta, Pakistan",
  hyderabad: "Hyderabad, Pakistan",
  sialkot: "Sialkot, Pakistan",
  gujranwala: "Gujranwala, Pakistan",
  bahawalpur: "Bahawalpur, Pakistan",
  sukkur: "Sukkur, Pakistan",
  abbottabad: "Abbottabad, Pakistan",
  murree: "Murree, Pakistan",
  sahiwal: "Sahiwal, Pakistan",
  jhelum: "Jhelum, Pakistan",
  mardan: "Mardan, Pakistan",
  swat: "Swat, Pakistan",
  "dera ghazi khan": "Dera Ghazi Khan, Pakistan",
  "rahim yar khan": "Rahim Yar Khan, Pakistan",
  nawabshah: "Nawabshah, Pakistan",
  larkana: "Larkana, Pakistan",
  sheikhupura: "Sheikhupura, Pakistan",
  chakwal: "Chakwal, Pakistan",
  gujrat: "Gujrat, Pakistan",
  "wah cantt": "Wah Cantt, Pakistan",
  wah: "Wah, Pakistan",
  taxila: "Taxila, Pakistan",
  attock: "Attock, Pakistan",
  mansehra: "Mansehra, Pakistan",
  kohat: "Kohat, Pakistan",
  bannu: "Bannu, Pakistan",
  "dera ismail khan": "Dera Ismail Khan, Pakistan",
  mingora: "Mingora, Pakistan",
  chitral: "Chitral, Pakistan",
  gilgit: "Gilgit, Pakistan",
  skardu: "Skardu, Pakistan",
  muzaffarabad: "Muzaffarabad, Pakistan",
  mirpur: "Mirpur, Pakistan",
  kotli: "Kotli, Pakistan",
  gwadar: "Gwadar, Pakistan",
  turbat: "Turbat, Pakistan",
  khuzdar: "Khuzdar, Pakistan",
  jacobabad: "Jacobabad, Pakistan",
  shikarpur: "Shikarpur, Pakistan",
  dadu: "Dadu, Pakistan",
  thatta: "Thatta, Pakistan",
  "mirpur khas": "Mirpur Khas, Pakistan",
  "tando adam": "Tando Adam, Pakistan",
  "tando allahyar": "Tando Allahyar, Pakistan",
};

const UAE_CITY_MAP = {
  dubai: "Dubai, United Arab Emirates",
  "abu dhabi": "Abu Dhabi, United Arab Emirates",
  sharjah: "Sharjah, United Arab Emirates",
  ajman: "Ajman, United Arab Emirates",
  "ras al khaimah": "Ras Al Khaimah, United Arab Emirates",
  fujairah: "Fujairah, United Arab Emirates",
  "umm al quwain": "Umm Al Quwain, United Arab Emirates",
  "al ain": "Al Ain, United Arab Emirates",
};

const SAUDI_CITY_MAP = {
  riyadh: "Riyadh, Saudi Arabia",
  jeddah: "Jeddah, Saudi Arabia",
  makkah: "Makkah, Saudi Arabia",
  mecca: "Makkah, Saudi Arabia",
  madinah: "Madinah, Saudi Arabia",
  madina: "Madinah, Saudi Arabia",
  medina: "Madinah, Saudi Arabia",
  dammam: "Dammam, Saudi Arabia",
  khobar: "Khobar, Saudi Arabia",
  "al khobar": "Khobar, Saudi Arabia",
  taif: "Taif, Saudi Arabia",
  tabuk: "Tabuk, Saudi Arabia",
  abha: "Abha, Saudi Arabia",
  jubail: "Jubail, Saudi Arabia",
};

// ======================================================
// FIND PAKISTAN CITY FOR AN AREA
// ======================================================

const getPakistanSearchLocations = (location) => {
  const value = location.toLowerCase();

  // Exact Pakistan country
  if (value === "pakistan") {
    return ["Pakistan"];
  }

  // Karachi areas
  const karachiAreas = [
    "shahrah-e-faisal",
    "shahra-e-faisal",
    "shahrah e faisal",
    "shahra e faisal",
    "clifton",
    "dha karachi",
    "defence karachi",
    "defence phase",
    "gulshan-e-iqbal",
    "gulshan e iqbal",
    "north nazimabad",
    "nazimabad",
    "korangi",
    "landhi",
    "malir",
    "bahadurabad",
    "pechs",
    "fb area",
    "federal b area",
    "saddar karachi",
    "site area",
    "korangi industrial area",
  ];

  if (karachiAreas.some((area) => value.includes(area))) {
    return [location, "Karachi, Pakistan", "Pakistan"];
  }

  // Lahore areas
  const lahoreAreas = [
    "gulberg lahore",
    "dha lahore",
    "defence lahore",
    "johar town",
    "model town lahore",
    "garden town lahore",
    "township lahore",
  ];

  if (lahoreAreas.some((area) => value.includes(area))) {
    return [location, "Lahore, Pakistan", "Pakistan"];
  }

  // Islamabad / Rawalpindi areas
  const islamabadAreas = [
    "f-6",
    "f-7",
    "f-8",
    "f-10",
    "f-11",
    "g-6",
    "g-8",
    "g-9",
    "g-10",
    "g-11",
    "i-8",
    "i-9",
    "bahria town islamabad",
  ];

  if (islamabadAreas.some((area) => value.includes(area))) {
    return [location, "Islamabad, Pakistan", "Pakistan"];
  }

  if (value.includes("bahria town rawalpindi")) {
    return [location, "Rawalpindi, Pakistan", "Pakistan"];
  }

  if (value.includes("saddar rawalpindi")) {
    return [location, "Rawalpindi, Pakistan", "Pakistan"];
  }

  // Known Pakistan city
  for (const [city, fullLocation] of Object.entries(
    PAKISTAN_CITY_MAP
  )) {
    if (value === city || value.includes(city)) {
      return [fullLocation, "Pakistan"];
    }
  }

  return [location, "Pakistan"];
};

// ======================================================
// LOCATION DETECTION
// ======================================================

const EUROPE_LOCATION_MAP = {
  uk: "gb", "united kingdom": "gb", england: "gb", london: "gb", manchester: "gb",
  germany: "de", berlin: "de", munich: "de", frankfurt: "de", hamburg: "de",
  france: "fr", paris: "fr", lyon: "fr", marseille: "fr",
  italy: "it", rome: "it", milan: "it",
  spain: "es", madrid: "es", barcelona: "es",
  netherlands: "nl", holland: "nl", amsterdam: "nl",
  belgium: "be", brussels: "be",
  switzerland: "ch", zurich: "ch", geneva: "ch",
  austria: "at", vienna: "at",
  ireland: "ie", dublin: "ie",
  portugal: "pt", lisbon: "pt",
  denmark: "dk", copenhagen: "dk",
  sweden: "se", stockholm: "se",
  norway: "no", oslo: "no",
  finland: "fi", helsinki: "fi",
  poland: "pl", warsaw: "pl", krakow: "pl",
  czechia: "cz", "czech republic": "cz", prague: "cz",
  greece: "gr", athens: "gr",
  hungary: "hu", budapest: "hu",
  romania: "ro", bucharest: "ro",
  bulgaria: "bg", sofia: "bg",
  croatia: "hr", zagreb: "hr",
  slovakia: "sk", bratislava: "sk",
  slovenia: "si", ljubljana: "si",
  estonia: "ee", tallinn: "ee",
  latvia: "lv", riga: "lv",
  lithuania: "lt", vilnius: "lt",
  luxembourg: "lu",
  iceland: "is", reykjavik: "is",
  serbia: "rs", belgrade: "rs",
  ukraine: "ua", kyiv: "ua",
  moldova: "md",
  turkey: "tr", istanbul: "tr", ankara: "tr"
};

const detectLocationType = (location = "") => {
  const value = location
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

  if (!value) {
    return {
      type: "worldwide",
      country: null,
    };
  }

  if (
    PAKISTAN_LOCATIONS.some((item) =>
      value.includes(item)
    )
  ) {
    return {
      type: "pakistan",
      country: "pk",
    };
  }

  if (
    UAE_LOCATIONS.some((item) =>
      value.includes(item)
    )
  ) {
    return {
      type: "uae",
      country: "ae",
    };
  }

  if (
    SAUDI_LOCATIONS.some((item) =>
      value.includes(item)
    )
  ) {
    return {
      type: "saudi",
      country: "sa",
    };
  }

  for (const [name, code] of Object.entries(EUROPE_LOCATION_MAP)) {
    if (value.includes(name)) {
      return {
        type: "europe",
        country: code,
      };
    }
  }

  for (const [name, code] of Object.entries(
    LOCATION_COUNTRY_MAP
  )) {
    if (value.includes(name)) {
      return {
        type: "adzuna",
        country: code,
      };
    }
  }

  return {
    type: "location",
    country: null,
  };
};

// ======================================================
// ADZUNA SEARCH
// ======================================================

const searchAdzuna = async ({
  country,
  query,
  location,
  page = 1,
  resultsPerPage = 20,
}) => {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    throw new Error(
      "ADZUNA_APP_ID or ADZUNA_APP_KEY is missing from backend/.env"
    );
  }

  const url =
    `https://api.adzuna.com/v1/api/jobs/` +
    `${country}/search/${page}`;

  const params = {
    app_id: appId,
    app_key: appKey,
    results_per_page: resultsPerPage,
    what: query,
  };

  if (location) {
    params.where = location;
  }

  try {
    const response = await axios.get(url, {
      params,
      timeout: 15000,
    });

    return response.data || {
      count: 0,
      results: [],
    };
  } catch (error) {
    console.error("---------------------------------");
    console.error(
      `ADZUNA ${country.toUpperCase()} ERROR`
    );
    console.error(
      "Status:",
      error.response?.status
    );
    console.error(
      "Response:",
      error.response?.data || error.message
    );
    console.error("---------------------------------");

    return {
      count: 0,
      results: [],
    };
  }
};

// ======================================================
// NORMALIZE ADZUNA
// ======================================================

const normalizeAdzunaJob = (job, country) => {
  return {
    id: `${country}-${job.id || Math.random()}`,

    title:
      job.title ||
      "Untitled Position",

    company:
      job.company?.display_name ||
      "Company not specified",

    location:
      job.location?.display_name ||
      "Location not specified",

    description:
      job.description ||
      "No description available.",

    salaryMin:
      job.salary_min ?? null,

    salaryMax:
      job.salary_max ?? null,

    salaryIsPredicted:
      job.salary_is_predicted === 1 ||
      job.salary_is_predicted === "1",

    contractType:
      job.contract_type || null,

    contractTime:
      job.contract_time || null,

    category:
      job.category?.label || null,

    created:
      job.created || null,

    redirectUrl:
      job.redirect_url || "",

    source: "Adzuna",

    country:
      country.toUpperCase(),
  };
};

// ======================================================
// SERPAPI SEARCH HELPER
// ======================================================

const searchSerpApi = async ({
  query,
  locations,
  page = 1,
  resultsPerPage = 20,
  countryCode = "",
}) => {
  const searchLocations = Array.isArray(
    locations
  )
    ? locations
    : [locations];

  for (const location of searchLocations) {
    if (!location) continue;

    console.log("---------------------------------");
    console.log("SEARCH SOURCE: SERPAPI GOOGLE JOBS");
    console.log("QUERY:", query);
    console.log("LOCATION:", location);
    console.log("PAGE:", page);
    console.log("---------------------------------");

    try {
      const result =
        await searchSerpApiJobs({
          query,
          location,
          page,
          resultsPerPage,
          countryCode,
        });

      const jobs = Array.isArray(
        result?.jobs
      )
        ? result.jobs
        : [];

      console.log(
        "SERPAPI TOTAL:",
        result?.count || 0
      );

      console.log(
        "SERPAPI RETURNED:",
        jobs.length
      );

      if (jobs.length > 0) {
        return {
          count:
            Number(result?.count) ||
            jobs.length,
          jobs,
          searchedLocation: location,
        };
      }
    } catch (error) {
      console.error(
        "SerpAPI search failed:",
        error.message
      );
    }
  }

  return {
    count: 0,
    jobs: [],
    searchedLocation:
      searchLocations[0] || "",
  };
};

// ======================================================
// PAKISTAN SEARCH
// ======================================================

const searchPakistanJobs = async ({
  query,
  location,
  page,
  resultsPerPage,
}) => {
  const locations =
    getPakistanSearchLocations(
      location
    );

  console.log("---------------------------------");
  console.log("PAKISTAN JOB SEARCH");
  console.log("USER LOCATION:", location);
  console.log(
    "SEARCH LOCATIONS:",
    locations
  );
  console.log("---------------------------------");

  return searchSerpApi({
    query,
    locations,
    page,
    resultsPerPage,
  });
};

// ======================================================
// UAE SEARCH
// ======================================================

const searchUaeJobs = async ({
  query,
  location,
  page,
  resultsPerPage,
}) => {
  const value =
    location.toLowerCase();

  let locations = [
    location,
    "United Arab Emirates",
  ];

  for (const [city, fullLocation] of Object.entries(
    UAE_CITY_MAP
  )) {
    if (value.includes(city)) {
      locations = [
        fullLocation,
        "United Arab Emirates",
      ];
      break;
    }
  }

  return searchSerpApi({
    query,
    locations,
    page,
    resultsPerPage,
  });
};

// ======================================================
// SAUDI SEARCH
// ======================================================

const searchSaudiJobs = async ({
  query,
  location,
  page,
  resultsPerPage,
}) => {
  const value =
    location.toLowerCase();

  let locations = [
    location,
    "Saudi Arabia",
  ];

  for (const [city, fullLocation] of Object.entries(
    SAUDI_CITY_MAP
  )) {
    if (value.includes(city)) {
      locations = [
        fullLocation,
        "Saudi Arabia",
      ];
      break;
    }
  }

  return searchSerpApi({
    query,
    locations,
    page,
    resultsPerPage,
  });
};

// ======================================================
// MAIN SEARCH
// ======================================================

const EUROPE_GOOGLE_LOCATIONS = {
  gb: "London, United Kingdom",
  de: "Berlin, Germany",
  fr: "Paris, France",
  it: "Rome, Italy",
  es: "Madrid, Spain",
  nl: "Amsterdam, Netherlands",
  be: "Brussels, Belgium",
  ch: "Zurich, Switzerland",
  at: "Vienna, Austria",
  ie: "Dublin, Ireland",
  pt: "Lisbon, Portugal",
  dk: "Copenhagen, Denmark",
  se: "Stockholm, Sweden",
  no: "Oslo, Norway",
  fi: "Helsinki, Finland",
  pl: "Warsaw, Poland",
  cz: "Prague, Czech Republic",
  gr: "Athens, Greece",
  hu: "Budapest, Hungary",
  ro: "Bucharest, Romania",
  bg: "Sofia, Bulgaria",
  hr: "Zagreb, Croatia",
  sk: "Bratislava, Slovakia",
  si: "Ljubljana, Slovenia",
  ee: "Tallinn, Estonia",
  lv: "Riga, Latvia",
  lt: "Vilnius, Lithuania",
  lu: "Luxembourg",
  is: "Reykjavik, Iceland",
  rs: "Belgrade, Serbia",
  ua: "Kyiv, Ukraine",
  md: "Chisinau, Moldova",
  tr: "Istanbul, Turkey"
};

const searchEuropeJobs = async ({
  query,
  location,
  countryCode,
  page = 1,
  resultsPerPage = 20,
}) => {
  const googleLocation =
    EUROPE_GOOGLE_LOCATIONS[countryCode] || location;

  const googleQuery =
    `${query} jobs in ${location}`;

  console.log("---------------------------------");
  console.log("EUROPE GOOGLE JOBS PRIMARY");
  console.log("QUERY:", googleQuery);
  console.log("GOOGLE LOCATION:", googleLocation);
  console.log("COUNTRY CODE:", countryCode);
  console.log("---------------------------------");

  const googleResult = await searchSerpApi({
    query: googleQuery,
    locations: [googleLocation],
    page,
    resultsPerPage,
    countryCode,
  });

  let jobs = googleResult.jobs || [];

  console.log("EUROPE GOOGLE RESULTS:", jobs.length);

  // SECONDARY: Adzuna where this country is supported
  if (
    jobs.length < resultsPerPage &&
    ADZUNA_COUNTRIES[countryCode]
  ) {
    console.log("---------------------------------");
    console.log("EUROPE FALLBACK: ADZUNA");
    console.log("COUNTRY:", countryCode);
    console.log("---------------------------------");

    const data = await searchAdzuna({
      country: countryCode,
      query,
      location,
      page,
      resultsPerPage,
    });

    const adzunaJobs = (data.results || []).map((job) =>
      normalizeAdzunaJob(job, countryCode)
    );

    jobs = jobs.concat(adzunaJobs);
  }

  // FINAL FALLBACK: Jooble
  if (jobs.length < resultsPerPage) {
    console.log("---------------------------------");
    console.log("EUROPE FINAL FALLBACK: JOOBLE");
    console.log("LOCATION:", location);
    console.log("---------------------------------");

    const result = await searchJoobleJobs({
      query,
      location,
      page,
      resultsPerPage,
    });

    const joobleJobs = (result.jobs || []).map(
      normalizeJoobleJob
    );

    jobs = jobs.concat(joobleJobs);
  }

  return {
    count: jobs.length,
    jobs: jobs.slice(0, resultsPerPage),
    sourceStatus: {
      europe: true,
      serpapi: googleResult.jobs.length > 0,
      adzuna: jobs.some(
        (job) => job.source === "Adzuna"
      ),
      jooble: jobs.some((job) =>
        String(job.source || "")
          .toLowerCase()
          .includes("jooble")
      ),
    },
  };
};

const searchJobs = async ({
  query = "internship",
  location = "",
  page = 1,
  resultsPerPage = 20,
}) => {
  const cleanQuery =
    typeof query === "string" &&
    query.trim()
      ? query.trim()
      : "internship";

  const cleanLocation =
    typeof location === "string"
      ? location.trim()
      : "";

  const detected =
    detectLocationType(
      cleanLocation
    );

  console.log("=================================");
  console.log("JOB SEARCH");
  console.log("Query:", cleanQuery);
  console.log(
    "Location:",
    cleanLocation || "WORLDWIDE"
  );
  console.log(
    "Detected type:",
    detected.type
  );
  console.log(
    "Detected country:",
    detected.country || "N/A"
  );
  console.log("=================================");

  // ====================================================
  // PAKISTAN
  // ====================================================

  if (
    detected.type === "europe"
  ) {
    const result =
      await searchEuropeJobs({
        query: cleanQuery,
        location: cleanLocation,
        countryCode: detected.country,
        page,
        resultsPerPage,
      });

    return result;
  }

  if (
    detected.type === "pakistan"
  ) {
    const result =
      await searchPakistanJobs({
        query: cleanQuery,
        location: cleanLocation,
        page,
        resultsPerPage,
      });

    return {
      count: result.count,
      jobs: result.jobs,
      sourceStatus: {
        pakistan: true,
        serpapi: true,
        adzuna: false,
        jooble: false,
      },
    };
  }

  // ====================================================
  // UAE
  // ====================================================

  if (
    detected.type === "uae"
  ) {
    const result =
      await searchUaeJobs({
        query: cleanQuery,
        location: cleanLocation,
        page,
        resultsPerPage,
      });

    return {
      count: result.count,
      jobs: result.jobs,
      sourceStatus: {
        uae: true,
        serpapi: true,
        adzuna: false,
        jooble: false,
      },
    };
  }

  // ====================================================
  // SAUDI ARABIA
  // ====================================================

  if (
    detected.type === "saudi"
  ) {
    const result =
      await searchSaudiJobs({
        query: cleanQuery,
        location: cleanLocation,
        page,
        resultsPerPage,
      });

    return {
      count: result.count,
      jobs: result.jobs,
      sourceStatus: {
        saudi: true,
        serpapi: true,
        adzuna: false,
        jooble: false,
      },
    };
  }

  // ====================================================
  // ADZUNA COUNTRIES
  // ====================================================

  if (
    detected.type === "adzuna" &&
    detected.country
  ) {
    console.log("---------------------------------");
    console.log("SEARCH SOURCE: ADZUNA");
    console.log(
      "COUNTRY:",
      detected.country
    );
    console.log("---------------------------------");

    const data =
      await searchAdzuna({
        country:
          detected.country,
        query: cleanQuery,
        location:
          cleanLocation,
        page,
        resultsPerPage,
      });

    const jobs =
      Array.isArray(
        data.results
      )
        ? data.results.map(
            (job) =>
              normalizeAdzunaJob(
                job,
                detected.country
              )
          )
        : [];

    return {
      count:
        Number(data.count) ||
        jobs.length,

      jobs,

      sourceStatus: {
        adzuna: true,
        serpapi: false,
        jooble: false,
      },
    };
  }

  // ====================================================
  // UNKNOWN LOCATION
  // ====================================================

  if (
    detected.type === "location"
  ) {
    console.log(
      "Unknown location -> SerpAPI"
    );

    const result =
      await searchSerpApi({
        query: cleanQuery,
        locations: [
          cleanLocation,
        ],
        page,
        resultsPerPage,
      });

    return {
      count: result.count,
      jobs: result.jobs,

      sourceStatus: {
        serpapi: true,
        adzuna: false,
        jooble: false,
      },
    };
  }

  // ====================================================
  // WORLDWIDE
  // ====================================================

  console.log("---------------------------------");
  console.log(
    "SEARCH SOURCE: WORLDWIDE / ADZUNA"
  );
  console.log("---------------------------------");

  const worldwideCountries = [
    "gb",
    "us",
    "ca",
    "au",
  ];

  const requests =
    worldwideCountries.map(
      (country) =>
        searchAdzuna({
          country,
          query: cleanQuery,
          location: "",
          page: 1,
          resultsPerPage: 5,
        })
    );

  const responses =
    await Promise.all(
      requests
    );

  let jobs = [];
  let count = 0;

  responses.forEach(
    (data, index) => {
      const country =
        worldwideCountries[index];

      const countryJobs =
        Array.isArray(
          data.results
        )
          ? data.results.map(
              (job) =>
                normalizeAdzunaJob(
                  job,
                  country
                )
            )
          : [];

      jobs.push(
        ...countryJobs
      );

      count +=
        Number(data.count) ||
        0;
    }
  );

  return {
    count:
      count || jobs.length,

    jobs:
      jobs.slice(
        0,
        resultsPerPage
      ),

    sourceStatus: {
      worldwide: true,
      adzuna: true,
      serpapi: false,
      jooble: false,
    },
  };
};

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  searchJobs,
  detectLocationType,
};