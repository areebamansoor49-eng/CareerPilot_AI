const crypto = require("crypto");

// ==========================================
// LINKEDIN ENDPOINTS
// ==========================================

const LINKEDIN_AUTH_URL =
  "https://www.linkedin.com/oauth/v2/authorization";

const LINKEDIN_TOKEN_URL =
  "https://www.linkedin.com/oauth/v2/accessToken";

const LINKEDIN_USERINFO_URL =
  "https://api.linkedin.com/v2/userinfo";

// ==========================================
// CREATE SECURE OAUTH STATE
// ==========================================

function createState() {
  return crypto.randomBytes(32).toString("hex");
}

// ==========================================
// VALIDATE LINKEDIN CONFIGURATION
// ==========================================

function validateLinkedInConfig() {
  const requiredVariables = [
    "LINKEDIN_CLIENT_ID",
    "LINKEDIN_CLIENT_SECRET",
    "LINKEDIN_REDIRECT_URI",
  ];

  const missingVariables =
    requiredVariables.filter(
      (variable) =>
        !process.env[variable]
    );

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing LinkedIn environment variables: ${missingVariables.join(
        ", "
      )}`
    );
  }
}

// ==========================================
// CREATE LINKEDIN AUTHORIZATION URL
// ==========================================

function getLinkedInAuthorizationUrl(
  state
) {
  if (!state) {
    throw new Error(
      "LinkedIn OAuth state is missing."
    );
  }

  validateLinkedInConfig();

  const params = new URLSearchParams({
    response_type: "code",

    client_id:
      process.env.LINKEDIN_CLIENT_ID,

    redirect_uri:
      process.env.LINKEDIN_REDIRECT_URI,

    state,

    // LinkedIn OpenID Connect
    scope: "openid profile email",
  });

  return `${LINKEDIN_AUTH_URL}?${params.toString()}`;
}

// ==========================================
// EXCHANGE AUTHORIZATION CODE FOR TOKEN
// ==========================================

async function exchangeCodeForToken(
  code
) {
  if (!code) {
    throw new Error(
      "LinkedIn authorization code is missing."
    );
  }

  validateLinkedInConfig();

  const body = new URLSearchParams({
    grant_type: "authorization_code",

    code,

    redirect_uri:
      process.env.LINKEDIN_REDIRECT_URI,

    client_id:
      process.env.LINKEDIN_CLIENT_ID,

    client_secret:
      process.env.LINKEDIN_CLIENT_SECRET,
  });

  let response;

  try {
    response = await fetch(
      LINKEDIN_TOKEN_URL,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
          Accept: "application/json",
        },

        body: body.toString(),
      }
    );
  } catch (error) {
    console.error(
      "LinkedIn token request failed:",
      error
    );

    throw new Error(
      "Unable to connect to LinkedIn token service."
    );
  }

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      "LinkedIn returned an invalid token response."
    );
  }

  if (!response.ok) {
    console.error(
      "LinkedIn token exchange error:",
      data
    );

    throw new Error(
      data.error_description ||
        data.message ||
        "Unable to obtain LinkedIn access token."
    );
  }

  if (!data.access_token) {
    throw new Error(
      "LinkedIn did not return an access token."
    );
  }

  return data;
}

// ==========================================
// GET LINKEDIN USER INFO
// ==========================================

async function getLinkedInUserInfo(
  accessToken
) {
  if (!accessToken) {
    throw new Error(
      "LinkedIn access token is missing."
    );
  }

  let response;

  try {
    response = await fetch(
      LINKEDIN_USERINFO_URL,
      {
        method: "GET",

        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );
  } catch (error) {
    console.error(
      "LinkedIn userinfo request failed:",
      error
    );

    throw new Error(
      "Unable to connect to LinkedIn profile service."
    );
  }

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      "LinkedIn returned an invalid profile response."
    );
  }

  if (!response.ok) {
    console.error(
      "LinkedIn userinfo error:",
      data
    );

    throw new Error(
      data.message ||
        data.error_description ||
        "Unable to retrieve LinkedIn profile."
    );
  }

  return data;
}

// ==========================================
// NORMALIZE LINKEDIN USER DATA
// ==========================================

function normalizeLinkedInUser(
  userInfo
) {
  if (!userInfo) {
    throw new Error(
      "LinkedIn user information is missing."
    );
  }

  return {
    id:
      userInfo.sub ||
      "",

    fullName:
      userInfo.name ||
      [
        userInfo.given_name,
        userInfo.family_name,
      ]
        .filter(Boolean)
        .join(" "),

    firstName:
      userInfo.given_name ||
      "",

    lastName:
      userInfo.family_name ||
      "",

    email:
      userInfo.email ||
      "",

    emailVerified:
      Boolean(
        userInfo.email_verified
      ),

    picture:
      userInfo.picture ||
      "",

    linkedinUrl:
      userInfo.profile_url ||
      "",
  };
}

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  createState,
  getLinkedInAuthorizationUrl,
  exchangeCodeForToken,
  getLinkedInUserInfo,
  normalizeLinkedInUser,
};