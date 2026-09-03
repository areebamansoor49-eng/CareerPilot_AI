const {
  createState,
  getLinkedInAuthorizationUrl,
  exchangeCodeForToken,
  getLinkedInUserInfo,
  normalizeLinkedInUser,
} = require("../services/linkedinOAuth");

const {
  analyzeLinkedInProfile,
} = require("../services/linkedinAnalyzer");

// ==========================================
// HELPERS
// ==========================================

const isProduction =
  process.env.NODE_ENV === "production";

const frontendUrl =
  process.env.FRONTEND_URL ||
  "http://localhost:5174";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};

// ==========================================
// ANALYZE LINKEDIN PROFILE
// POST /api/linkedin/analyze
// ==========================================

const analyzeProfile = async (req, res) => {
  try {
    const profile = req.body;

    if (
      !profile ||
      typeof profile !== "object" ||
      Array.isArray(profile)
    ) {
      return res.status(400).json({
        success: false,
        message: "Profile data is required.",
      });
    }

    const result =
      analyzeLinkedInProfile(profile);

    return res.status(200).json({
      success: true,

      message:
        "LinkedIn profile analyzed successfully.",

      profile: {
        fullName:
          profile.fullName || "",

        headline:
          profile.headline || "",

        about:
          profile.about || "",

        skills:
          Array.isArray(profile.skills)
            ? profile.skills
            : [],

        experience:
          Array.isArray(profile.experience)
            ? profile.experience
            : [],

        education:
          Array.isArray(profile.education)
            ? profile.education
            : [],

        certifications:
          Array.isArray(
            profile.certifications
          )
            ? profile.certifications
            : [],

        projects:
          Array.isArray(profile.projects)
            ? profile.projects
            : [],

        linkedinUrl:
          profile.linkedinUrl || "",
      },

      analysis: result,
    });
  } catch (error) {
    console.error(
      "LinkedIn analysis error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to analyze LinkedIn profile. Please try again.",
    });
  }
};

// ==========================================
// START LINKEDIN LOGIN
// GET /api/linkedin/auth
// ==========================================

const linkedinLogin = async (
  req,
  res
) => {
  try {
    // ----------------------------------------
    // CREATE RANDOM OAUTH STATE
    // ----------------------------------------

    const state = createState();

    // ----------------------------------------
    // STORE STATE IN SIGNED HTTP-ONLY COOKIE
    // ----------------------------------------

    res.cookie(
      "linkedin_oauth_state",
      state,
      {
        ...cookieOptions,

        signed: true,

        maxAge:
          10 * 60 * 1000,
      }
    );

    // ----------------------------------------
    // CREATE LINKEDIN AUTHORIZATION URL
    // ----------------------------------------

    const authorizationUrl =
      getLinkedInAuthorizationUrl(
        state
      );

    console.log(
      "Starting LinkedIn OAuth..."
    );

    return res.redirect(
      authorizationUrl
    );
  } catch (error) {
    console.error(
      "LinkedIn login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to start LinkedIn login.",
    });
  }
};

// ==========================================
// LINKEDIN CALLBACK
// GET /api/linkedin/callback
// ==========================================

const linkedinCallback = async (
  req,
  res
) => {
  try {
    const {
      code,
      state,
      error,
      error_description,
    } = req.query;

    // ----------------------------------------
    // USER CANCELLED / DENIED AUTHORIZATION
    // ----------------------------------------

    if (error) {
      console.error(
        "LinkedIn authorization denied:",
        error,
        error_description
      );

      return res.redirect(
        `${frontendUrl}/linkedin-optimizer?linkedinError=${encodeURIComponent(
          error_description ||
            "LinkedIn authorization was cancelled."
        )}`
      );
    }

    // ----------------------------------------
    // CHECK AUTHORIZATION CODE
    // ----------------------------------------

    if (!code) {
      return res.redirect(
        `${frontendUrl}/linkedin-optimizer?linkedinError=${encodeURIComponent(
          "LinkedIn authorization code was not returned."
        )}`
      );
    }

    // ----------------------------------------
    // GET SIGNED STATE COOKIE
    // ----------------------------------------

    const savedState =
      req.signedCookies
        ?.linkedin_oauth_state;

    // ----------------------------------------
    // VERIFY STATE
    // ----------------------------------------

    if (
      !state ||
      !savedState ||
      state !== savedState
    ) {
      console.error(
        "LinkedIn OAuth state mismatch."
      );

      return res.redirect(
        `${frontendUrl}/linkedin-optimizer?linkedinError=${encodeURIComponent(
          "LinkedIn authentication could not be verified. Please try again."
        )}`
      );
    }

    // ----------------------------------------
    // CLEAR STATE COOKIE
    // ----------------------------------------

    res.clearCookie(
      "linkedin_oauth_state",
      cookieOptions
    );

    // ----------------------------------------
    // EXCHANGE CODE FOR ACCESS TOKEN
    // ----------------------------------------

    const tokenData =
      await exchangeCodeForToken(
        code
      );

    if (
      !tokenData ||
      !tokenData.access_token
    ) {
      throw new Error(
        "LinkedIn access token was not returned."
      );
    }

    // ----------------------------------------
    // GET LINKEDIN USER INFO
    // ----------------------------------------

    const userInfo =
      await getLinkedInUserInfo(
        tokenData.access_token
      );

    if (!userInfo) {
      throw new Error(
        "LinkedIn profile information was not returned."
      );
    }

    // ----------------------------------------
    // NORMALIZE USER
    // ----------------------------------------

    const linkedinUser =
      normalizeLinkedInUser(
        userInfo
      );

    if (!linkedinUser) {
      throw new Error(
        "Unable to process LinkedIn profile information."
      );
    }

    console.log(
      "LinkedIn user authenticated:",
      {
        id: linkedinUser.id,
        name:
          linkedinUser.fullName,
        email:
          linkedinUser.email || "Not available",
      }
    );

    // ----------------------------------------
    // STORE TEMPORARY USER DATA
    // ----------------------------------------
    //
    // IMPORTANT:
    // Access token is NEVER sent to frontend.
    //
    // This cookie is only temporary for the
    // current OAuth flow.
    // ----------------------------------------

    res.cookie(
      "linkedin_user",
      JSON.stringify(
        linkedinUser
      ),
      {
        ...cookieOptions,

        // Signed cookie
        signed: true,

        maxAge:
          30 * 60 * 1000,
      }
    );

    // ----------------------------------------
    // REDIRECT TO FRONTEND
    // ----------------------------------------

    return res.redirect(
      `${frontendUrl}/linkedin-optimizer?linkedin=success`
    );
  } catch (error) {
    console.error(
      "LinkedIn callback error:",
      error
    );

    return res.redirect(
      `${frontendUrl}/linkedin-optimizer?linkedinError=${encodeURIComponent(
        error.message ||
          "LinkedIn authentication failed."
      )}`
    );
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  analyzeProfile,
  linkedinLogin,
  linkedinCallback,
};