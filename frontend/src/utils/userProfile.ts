/* =========================================================
   USER PROFILE STORAGE
   Each user's profile is stored separately using email.
========================================================= */

export interface UserNotifications {
  internshipAlerts: boolean;
  careerRecommendations: boolean;
  interviewReminders: boolean;
  resumeAlerts: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  picture: string;

  phone: string;
  location: string;

  targetCareer: string;
  education: string;
  experienceLevel: string;
  careerGoal: string;
  bio: string;

  jobType: string;
  workPreference: string;

  skills: string[];

  notifications: UserNotifications;
}

/* =========================================================
   DEFAULT NOTIFICATIONS
========================================================= */

export const DEFAULT_NOTIFICATIONS: UserNotifications = {
  internshipAlerts: true,
  careerRecommendations: true,
  interviewReminders: true,
  resumeAlerts: true,
};

/* =========================================================
   EMPTY PROFILE
========================================================= */

export const EMPTY_USER_PROFILE: UserProfile = {
  name: "",
  email: "",
  picture: "",

  phone: "",
  location: "",

  targetCareer: "",
  education: "",
  experienceLevel: "",
  careerGoal: "",
  bio: "",

  jobType: "",
  workPreference: "",

  skills: [],

  notifications: {
    ...DEFAULT_NOTIFICATIONS,
  },
};

/* =========================================================
   CURRENT USER
========================================================= */

interface LoggedInUser {
  name?: string;
  email?: string;
  picture?: string;
}

/* =========================================================
   GET CURRENT USER
========================================================= */

const getCurrentUser = (): LoggedInUser | null => {
  try {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    const user = JSON.parse(savedUser);

    if (!user || typeof user !== "object") {
      return null;
    }

    return user;
  } catch (error) {
    console.error(
      "Failed to read current user:",
      error
    );

    return null;
  }
};

/* =========================================================
   USER STORAGE KEY
========================================================= */

const getProfileStorageKey = (
  email?: string
): string | null => {
  const currentUser = getCurrentUser();

  const userEmail =
    email ||
    currentUser?.email ||
    "";

  const normalizedEmail =
    userEmail.trim().toLowerCase();

  if (!normalizedEmail) {
    return null;
  }

  return `careerProfile_${encodeURIComponent(
    normalizedEmail
  )}`;
};

/* =========================================================
   NORMALIZE NOTIFICATIONS
   Makes old saved profiles compatible.
========================================================= */

const normalizeNotifications = (
  notifications?: Partial<UserNotifications>
): UserNotifications => {
  return {
    internshipAlerts:
      notifications?.internshipAlerts ??
      DEFAULT_NOTIFICATIONS.internshipAlerts,

    careerRecommendations:
      notifications?.careerRecommendations ??
      DEFAULT_NOTIFICATIONS.careerRecommendations,

    interviewReminders:
      notifications?.interviewReminders ??
      DEFAULT_NOTIFICATIONS.interviewReminders,

    resumeAlerts:
      notifications?.resumeAlerts ??
      DEFAULT_NOTIFICATIONS.resumeAlerts,
  };
};

/* =========================================================
   GET USER PROFILE
========================================================= */

export const getUserProfile = (): UserProfile => {
  const currentUser = getCurrentUser();

  /*
    No logged-in user:
    return a completely empty profile.
  */
  if (!currentUser?.email) {
    return {
      ...EMPTY_USER_PROFILE,
      skills: [],
      notifications: {
        ...DEFAULT_NOTIFICATIONS,
      },
    };
  }

  const storageKey =
    getProfileStorageKey(
      currentUser.email
    );

  if (!storageKey) {
    return {
      ...EMPTY_USER_PROFILE,

      name: currentUser.name || "",
      email: currentUser.email || "",
      picture: currentUser.picture || "",

      skills: [],

      notifications: {
        ...DEFAULT_NOTIFICATIONS,
      },
    };
  }

  try {
    const savedProfile =
      localStorage.getItem(storageKey);

    /*
      BRAND NEW USER
      Only account information is populated.
      Career/profile fields stay EMPTY.
    */
    if (!savedProfile) {
      return {
        ...EMPTY_USER_PROFILE,

        name: currentUser.name || "",
        email: currentUser.email || "",
        picture: currentUser.picture || "",

        phone: "",
        location: "",

        targetCareer: "",
        education: "",
        experienceLevel: "",
        careerGoal: "",
        bio: "",

        jobType: "",
        workPreference: "",

        skills: [],

        notifications: {
          ...DEFAULT_NOTIFICATIONS,
        },
      };
    }

    const parsedProfile =
      JSON.parse(savedProfile);

    if (
      !parsedProfile ||
      typeof parsedProfile !== "object"
    ) {
      return {
        ...EMPTY_USER_PROFILE,

        name: currentUser.name || "",
        email: currentUser.email || "",
        picture: currentUser.picture || "",

        skills: [],

        notifications: {
          ...DEFAULT_NOTIFICATIONS,
        },
      };
    }

    /*
      Merge saved profile with empty defaults.
      This prevents undefined fields in old profiles.
    */
    return {
      ...EMPTY_USER_PROFILE,

      ...parsedProfile,

      /*
        Identity always belongs to the currently
        logged-in account.
      */
      name:
        currentUser.name ||
        parsedProfile.name ||
        "",

      email:
        currentUser.email ||
        parsedProfile.email ||
        "",

      picture:
        currentUser.picture ||
        parsedProfile.picture ||
        "",

      phone:
        typeof parsedProfile.phone === "string"
          ? parsedProfile.phone
          : "",

      location:
        typeof parsedProfile.location === "string"
          ? parsedProfile.location
          : "",

      targetCareer:
        typeof parsedProfile.targetCareer === "string"
          ? parsedProfile.targetCareer
          : "",

      education:
        typeof parsedProfile.education === "string"
          ? parsedProfile.education
          : "",

      experienceLevel:
        typeof parsedProfile.experienceLevel === "string"
          ? parsedProfile.experienceLevel
          : "",

      careerGoal:
        typeof parsedProfile.careerGoal === "string"
          ? parsedProfile.careerGoal
          : "",

      bio:
        typeof parsedProfile.bio === "string"
          ? parsedProfile.bio
          : "",

      jobType:
        typeof parsedProfile.jobType === "string"
          ? parsedProfile.jobType
          : "",

      workPreference:
        typeof parsedProfile.workPreference === "string"
          ? parsedProfile.workPreference
          : "",

      skills:
        Array.isArray(parsedProfile.skills)
          ? parsedProfile.skills
          : [],

      notifications:
        normalizeNotifications(
          parsedProfile.notifications
        ),
    };
  } catch (error) {
    console.error(
      "Failed to load user profile:",
      error
    );

    return {
      ...EMPTY_USER_PROFILE,

      name: currentUser.name || "",
      email: currentUser.email || "",
      picture: currentUser.picture || "",

      skills: [],

      notifications: {
        ...DEFAULT_NOTIFICATIONS,
      },
    };
  }
};

/* =========================================================
   SAVE USER PROFILE
========================================================= */

export const saveUserProfile = (
  profile: Partial<UserProfile>
): UserProfile => {
  const currentUser = getCurrentUser();

  if (!currentUser?.email) {
    console.warn(
      "Cannot save profile: no logged-in user."
    );

    return {
      ...EMPTY_USER_PROFILE,
      notifications: {
        ...DEFAULT_NOTIFICATIONS,
      },
    };
  }

  const storageKey =
    getProfileStorageKey(
      currentUser.email
    );

  if (!storageKey) {
    return {
      ...EMPTY_USER_PROFILE,
      notifications: {
        ...DEFAULT_NOTIFICATIONS,
      },
    };
  }

  const existingProfile =
    getUserProfile();

  const updatedProfile: UserProfile = {
    ...EMPTY_USER_PROFILE,

    ...existingProfile,

    ...profile,

    /*
      Never allow profile form to overwrite
      the currently logged-in user's identity.
    */
    name:
      currentUser.name ||
      profile.name ||
      existingProfile.name ||
      "",

    email:
      currentUser.email,

    picture:
      currentUser.picture ||
      profile.picture ||
      existingProfile.picture ||
      "",

    phone:
      profile.phone ??
      existingProfile.phone ??
      "",

    location:
      profile.location ??
      existingProfile.location ??
      "",

    targetCareer:
      profile.targetCareer ??
      existingProfile.targetCareer ??
      "",

    education:
      profile.education ??
      existingProfile.education ??
      "",

    experienceLevel:
      profile.experienceLevel ??
      existingProfile.experienceLevel ??
      "",

    careerGoal:
      profile.careerGoal ??
      existingProfile.careerGoal ??
      "",

    bio:
      profile.bio ??
      existingProfile.bio ??
      "",

    jobType:
      profile.jobType ??
      existingProfile.jobType ??
      "",

    workPreference:
      profile.workPreference ??
      existingProfile.workPreference ??
      "",

    skills:
      Array.isArray(profile.skills)
        ? profile.skills
        : Array.isArray(existingProfile.skills)
        ? existingProfile.skills
        : [],

    notifications:
      normalizeNotifications(
        profile.notifications ??
        existingProfile.notifications
      ),
  };

  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify(updatedProfile)
    );

    window.dispatchEvent(
      new Event("careerProfileUpdated")
    );

    window.dispatchEvent(
      new Event("profileUpdated")
    );

    return updatedProfile;
  } catch (error) {
    console.error(
      "Failed to save user profile:",
      error
    );

    return existingProfile;
  }
};

/* =========================================================
   CLEAR CURRENT USER PROFILE
========================================================= */

export const clearCurrentUserProfile = (): void => {
  const currentUser = getCurrentUser();

  if (!currentUser?.email) {
    return;
  }

  const storageKey =
    getProfileStorageKey(
      currentUser.email
    );

  if (!storageKey) {
    return;
  }

  localStorage.removeItem(storageKey);

  window.dispatchEvent(
    new Event("careerProfileUpdated")
  );

  window.dispatchEvent(
    new Event("profileUpdated")
  );
};

/* =========================================================
   CLEAR OLD GLOBAL PROFILE KEYS
========================================================= */

export const clearLegacyProfileData = (): void => {
  const legacyKeys = [
    "profile",
    "userProfile",
    "careerProfile",
    "profileData",
  ];

  legacyKeys.forEach((key) => {
    localStorage.removeItem(key);
  });
};