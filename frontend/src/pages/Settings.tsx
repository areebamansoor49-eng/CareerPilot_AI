import {
  FaArrowLeft,
  FaBriefcase,
  FaCheckCircle,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaPhone,
  FaSave,
  FaShieldAlt,
  FaUser,
  FaTrash,
  FaUserEdit,
} from "react-icons/fa";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getUserProfile,
  saveUserProfile,
  type UserProfile,
} from "../utils/userProfile";

function Settings() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile>(
    getUserProfile()
  );

  const [saved, setSaved] = useState(false);
  const [skillsInput, setSkillsInput] = useState("");

  // =========================================================
  // LOAD PROFILE
  // =========================================================

  useEffect(() => {
    setProfile(getUserProfile());

    const handleProfileUpdate = () => {
      setProfile(getUserProfile());
    };

    window.addEventListener(
      "careerProfileUpdated",
      handleProfileUpdate
    );

    window.addEventListener(
      "profileUpdated",
      handleProfileUpdate
    );

    return () => {
      window.removeEventListener(
        "careerProfileUpdated",
        handleProfileUpdate
      );

      window.removeEventListener(
        "profileUpdated",
        handleProfileUpdate
      );
    };
  }, []);

  // =========================================================
  // UPDATE FIELD
  // =========================================================

  const updateField = (
    field: keyof UserProfile,
    value: string
  ) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSaved(false);
  };

  // =========================================================
  // ADD SKILL
  // =========================================================

  const addSkill = () => {
    const skill = skillsInput.trim();

    if (!skill) {
      return;
    }

    const currentSkills = profile.skills || [];

    const alreadyExists = currentSkills.some(
      (item) =>
        item.toLowerCase() === skill.toLowerCase()
    );

    if (alreadyExists) {
      setSkillsInput("");
      return;
    }

    setProfile((previous) => ({
      ...previous,
      skills: [...(previous.skills || []), skill],
    }));

    setSkillsInput("");
    setSaved(false);
  };

  // =========================================================
  // REMOVE SKILL
  // =========================================================

  const removeSkill = (skillToRemove: string) => {
    setProfile((previous) => ({
      ...previous,
      skills: (previous.skills || []).filter(
        (skill) => skill !== skillToRemove
      ),
    }));

    setSaved(false);
  };

  // =========================================================
  // SAVE PROFILE
  // =========================================================

  const handleSave = () => {
    const updatedProfile = saveUserProfile({
      ...profile,
      skills: profile.skills || [],
    });

    setProfile(updatedProfile);

    window.dispatchEvent(
      new Event("careerProfileUpdated")
    );

    window.dispatchEvent(
      new Event("profileUpdated")
    );

    window.dispatchEvent(
      new Event("userDataUpdated")
    );

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  // =========================================================
  // RESET PROFILE
  // =========================================================

  const handleClearData = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset your career preferences?"
    );

    if (!confirmed) {
      return;
    }

    const currentProfile = getUserProfile();

    /*
      Reset profile.

      IMPORTANT:
      notifications is required by UserProfile,
      so it must be included here.
    */

    const resetProfile: UserProfile = {
      name: currentProfile.name || "",
      email: currentProfile.email || "",
      picture: currentProfile.picture || "",

      phone: "",
      location: "",

      targetCareer: "Software Engineer",
      education: "",
      experienceLevel: "Student",
      careerGoal: "",
      bio: "",

      jobType: "Internship",
      workPreference: "Remote",

      skills: [],

      notifications: currentProfile.notifications ?? true,
    };

    const updatedProfile =
      saveUserProfile(resetProfile);

    setProfile(updatedProfile);

    window.dispatchEvent(
      new Event("careerProfileUpdated")
    );

    window.dispatchEvent(
      new Event("profileUpdated")
    );

    window.dispatchEvent(
      new Event("userDataUpdated")
    );

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  // =========================================================
  // GO TO DASHBOARD
  // =========================================================

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  // =========================================================
  // GO TO PROFILE
  // =========================================================

  const goToProfile = () => {
    navigate("/profile");
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">

          <div className="flex items-center gap-4">

            {/* BACK */}

            <button
              type="button"
              onClick={goToDashboard}
              title="Back to Dashboard"
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-slate-700
                bg-slate-900
                text-slate-300
                transition
                hover:border-blue-500
                hover:bg-slate-800
                hover:text-white
              "
            >
              <FaArrowLeft />
            </button>

            <div>
              <h1 className="text-2xl font-bold">
                Settings
              </h1>

              <p className="text-sm text-slate-500">
                Personalize your CareerPilot experience
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3">

            {/* PROFILE */}

            <button
              type="button"
              onClick={goToProfile}
              className="
                hidden
                items-center
                gap-2
                rounded-xl
                border
                border-slate-700
                bg-slate-900
                px-4
                py-3
                text-sm
                font-semibold
                text-slate-300
                transition
                hover:border-blue-500
                hover:text-blue-400
                sm:inline-flex
              "
            >
              <FaUserEdit />
              Profile
            </button>

            {/* SAVE */}

            <button
              type="button"
              onClick={handleSave}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                from-blue-600
                to-violet-600
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                shadow-lg
                shadow-blue-900/20
                transition
                hover:from-blue-500
                hover:to-violet-500
              "
            >
              <FaSave />

              <span className="hidden sm:inline">
                Save Changes
              </span>

              <span className="sm:hidden">
                Save
              </span>
            </button>

          </div>

        </div>

      </header>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">

        {/* =====================================================
            SUCCESS MESSAGE
        ===================================================== */}

        {saved && (
          <div
            className="
              mb-8
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-green-500/20
              bg-green-500/10
              px-5
              py-4
              text-green-400
            "
          >
            <FaCheckCircle />

            <span className="font-medium">
              Settings saved successfully.
            </span>
          </div>
        )}

        {/* =====================================================
            INTRO
        ===================================================== */}

        <div className="mb-10">

          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            CareerPilot Settings
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            Make CareerPilot work for you.
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-400">
            Manage your profile, career preferences,
            skills and personal information. These
            preferences help CareerPilot personalize
            your career recommendations.
          </p>

        </div>

        <div className="space-y-8">

          {/* =================================================
              PROFILE INFORMATION
          ================================================= */}

          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-7 shadow-xl sm:p-9">

            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                  <FaUser />
                </div>

                <div>

                  <h3 className="text-xl font-bold">
                    Profile Information
                  </h3>

                  <p className="text-sm text-slate-500">
                    Manage your basic account information.
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={goToProfile}
                className="
                  hidden
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-700
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-slate-300
                  transition
                  hover:border-blue-500
                  hover:text-blue-400
                  sm:inline-flex
                "
              >
                <FaUserEdit />
                Edit Profile
              </button>

            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">

              {/* NAME */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Full Name
                </label>

                <input
                  value={profile.name || ""}
                  onChange={(event) =>
                    updateField(
                      "name",
                      event.target.value
                    )
                  }
                  placeholder="Your full name"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-950
                    px-4
                    py-3.5
                    text-white
                    outline-none
                    transition
                    placeholder:text-slate-600
                    focus:border-blue-500
                    focus:ring-1
                    focus:ring-blue-500
                  "
                />

              </div>

              {/* EMAIL */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Email
                </label>

                <input
                  value={profile.email || ""}
                  readOnly
                  className="
                    w-full
                    cursor-not-allowed
                    rounded-xl
                    border
                    border-slate-800
                    bg-slate-950/60
                    px-4
                    py-3.5
                    text-slate-500
                    outline-none
                  "
                />

                <p className="mt-2 text-xs text-slate-600">
                  Email is managed through your account.
                </p>

              </div>

              {/* PHONE */}

              <div>

                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
                  <FaPhone className="text-blue-400" />
                  Phone
                </label>

                <input
                  type="tel"
                  value={profile.phone || ""}
                  onChange={(event) =>
                    updateField(
                      "phone",
                      event.target.value
                    )
                  }
                  placeholder="e.g. +92 300 1234567"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-950
                    px-4
                    py-3.5
                    text-white
                    outline-none
                    transition
                    placeholder:text-slate-600
                    focus:border-blue-500
                    focus:ring-1
                    focus:ring-blue-500
                  "
                />

              </div>

              {/* LOCATION */}

              <div>

                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
                  <FaMapMarkerAlt className="text-red-400" />
                  Location
                </label>

                <input
                  value={profile.location || ""}
                  onChange={(event) =>
                    updateField(
                      "location",
                      event.target.value
                    )
                  }
                  placeholder="e.g. Karachi, Pakistan"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-950
                    px-4
                    py-3.5
                    text-white
                    outline-none
                    transition
                    placeholder:text-slate-600
                    focus:border-blue-500
                    focus:ring-1
                    focus:ring-blue-500
                  "
                />

              </div>

              {/* EDUCATION */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Education
                </label>

                <input
                  value={profile.education || ""}
                  onChange={(event) =>
                    updateField(
                      "education",
                      event.target.value
                    )
                  }
                  placeholder="e.g. BS Computer Science"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-950
                    px-4
                    py-3.5
                    text-white
                    outline-none
                    transition
                    placeholder:text-slate-600
                    focus:border-blue-500
                    focus:ring-1
                    focus:ring-blue-500
                  "
                />

              </div>

              {/* EXPERIENCE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Experience Level
                </label>

                <select
                  value={
                    profile.experienceLevel ||
                    "Student"
                  }
                  onChange={(event) =>
                    updateField(
                      "experienceLevel",
                      event.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-950
                    px-4
                    py-3.5
                    text-white
                    outline-none
                    focus:border-blue-500
                  "
                >
                  <option value="Student">
                    Student
                  </option>

                  <option value="Beginner">
                    Beginner
                  </option>

                  <option value="Intermediate">
                    Intermediate
                  </option>

                  <option value="Experienced">
                    Experienced
                  </option>
                </select>

              </div>

            </div>

            {/* BIO */}

            <div className="mt-7">

              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Professional Bio
              </label>

              <textarea
                value={profile.bio || ""}
                onChange={(event) =>
                  updateField(
                    "bio",
                    event.target.value
                  )
                }
                rows={4}
                placeholder="Write a short professional introduction about yourself..."
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-950
                  px-4
                  py-3.5
                  text-white
                  outline-none
                  transition
                  placeholder:text-slate-600
                  focus:border-blue-500
                  focus:ring-1
                  focus:ring-blue-500
                "
              />

            </div>

          </section>

          {/* =================================================
              CAREER PREFERENCES
          ================================================= */}

          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-7 shadow-xl sm:p-9">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
                <FaBriefcase />
              </div>

              <div>

                <h3 className="text-xl font-bold">
                  Career Preferences
                </h3>

                <p className="text-sm text-slate-500">
                  These preferences personalize your career tools.
                </p>

              </div>

            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">

              {/* TARGET CAREER */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Target Career
                </label>

                <select
                  value={
                    profile.targetCareer ||
                    "Software Engineer"
                  }
                  onChange={(event) =>
                    updateField(
                      "targetCareer",
                      event.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-950
                    px-4
                    py-3.5
                    text-white
                    outline-none
                    focus:border-purple-500
                  "
                >
                  <option>Software Engineer</option>
                  <option>Frontend Developer</option>
                  <option>Backend Developer</option>
                  <option>Full Stack Developer</option>
                  <option>Mobile App Developer</option>
                  <option>Data Scientist</option>
                  <option>Data Analyst</option>
                  <option>AI / Machine Learning Engineer</option>
                  <option>Cybersecurity Specialist</option>
                  <option>Cloud Engineer</option>
                  <option>DevOps Engineer</option>
                  <option>UI/UX Designer</option>
                  <option>Product Manager</option>
                  <option>Business Analyst</option>
                  <option>Marketing Specialist</option>
                  <option>Finance</option>
                  <option>Human Resources</option>
                  <option>Entrepreneurship</option>
                </select>

              </div>

              {/* JOB TYPE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Job Type
                </label>

                <select
                  value={
                    profile.jobType ||
                    "Internship"
                  }
                  onChange={(event) =>
                    updateField(
                      "jobType",
                      event.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-950
                    px-4
                    py-3.5
                    text-white
                    outline-none
                    focus:border-purple-500
                  "
                >
                  <option>Internship</option>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Freelance</option>
                </select>

              </div>

              {/* WORK PREFERENCE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Work Preference
                </label>

                <select
                  value={
                    profile.workPreference ||
                    "Remote"
                  }
                  onChange={(event) =>
                    updateField(
                      "workPreference",
                      event.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-950
                    px-4
                    py-3.5
                    text-white
                    outline-none
                    focus:border-purple-500
                  "
                >
                  <option>Remote</option>
                  <option>On-site</option>
                  <option>Hybrid</option>
                  <option>Any</option>
                </select>

              </div>

              {/* PREFERRED LOCATION */}

              <div>

                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
                  <FaMapMarkerAlt className="text-red-400" />
                  Preferred Location
                </label>

                <input
                  value={profile.location || ""}
                  onChange={(event) =>
                    updateField(
                      "location",
                      event.target.value
                    )
                  }
                  placeholder="e.g. Karachi, Pakistan"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-950
                    px-4
                    py-3.5
                    text-white
                    outline-none
                    focus:border-purple-500
                  "
                />

              </div>

            </div>

            {/* SKILLS */}

            <div className="mt-7">

              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Skills
              </label>

              <div className="flex gap-3">

                <input
                  value={skillsInput}
                  onChange={(event) =>
                    setSkillsInput(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="e.g. React, Python, SQL"
                  className="
                    min-w-0
                    flex-1
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-950
                    px-4
                    py-3.5
                    text-white
                    outline-none
                    focus:border-purple-500
                  "
                />

                <button
                  type="button"
                  onClick={addSkill}
                  className="
                    rounded-xl
                    bg-purple-600
                    px-5
                    font-semibold
                    text-white
                    transition
                    hover:bg-purple-500
                  "
                >
                  Add
                </button>

              </div>

              <div className="mt-4 flex flex-wrap gap-2">

                {(profile.skills || []).length === 0 ? (
                  <p className="text-sm text-slate-600">
                    No skills added yet.
                  </p>
                ) : (
                  (profile.skills || []).map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() =>
                        removeSkill(skill)
                      }
                      title="Remove skill"
                      className="
                        rounded-full
                        border
                        border-purple-500/20
                        bg-purple-500/10
                        px-4
                        py-2
                        text-sm
                        text-purple-300
                        transition
                        hover:border-red-500/30
                        hover:bg-red-500/10
                        hover:text-red-300
                      "
                    >
                      {skill} ×
                    </button>
                  ))
                )}

              </div>

            </div>

            {/* CAREER GOAL */}

            <div className="mt-7">

              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Career Goal
              </label>

              <textarea
                value={profile.careerGoal || ""}
                onChange={(event) =>
                  updateField(
                    "careerGoal",
                    event.target.value
                  )
                }
                rows={4}
                placeholder="Describe what you want to achieve in your career..."
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-950
                  px-4
                  py-3.5
                  text-white
                  outline-none
                  focus:border-purple-500
                "
              />

            </div>

          </section>

          {/* =================================================
              ACCOUNT SECURITY
          ================================================= */}

          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-7 shadow-xl sm:p-9">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
                <FaShieldAlt />
              </div>

              <div>

                <h3 className="text-xl font-bold">
                  Account & Security
                </h3>

                <p className="text-sm text-slate-500">
                  Manage your CareerPilot account.
                </p>

              </div>

            </div>

            <div className="mt-7 rounded-2xl border border-slate-800 bg-slate-950 p-5">

              <p className="text-sm text-slate-500">
                Signed in as
              </p>

              <p className="mt-1 font-semibold text-white">
                {profile.email ||
                  "CareerPilot Account"}
              </p>

              <p className="mt-2 text-xs text-green-400">
                ✓ Account authentication connected
              </p>

            </div>

          </section>

          {/* =================================================
              DATA MANAGEMENT
          ================================================= */}

          <section className="rounded-3xl border border-red-500/10 bg-red-500/[0.03] p-7 sm:p-9">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                <FaTrash />
              </div>

              <div>

                <h3 className="text-xl font-bold">
                  Data Management
                </h3>

                <p className="text-sm text-slate-500">
                  Reset your career preferences to default values.
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={handleClearData}
              className="
                mt-7
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-red-500/30
                bg-red-500/10
                px-5
                py-3
                text-sm
                font-semibold
                text-red-400
                transition
                hover:bg-red-500/20
              "
            >
              <FaTrash />
              Reset Career Preferences
            </button>

          </section>

        </div>

        {/* =====================================================
            BOTTOM SAVE
        ===================================================== */}

        <div
          className="
            mt-10
            flex
            flex-col
            items-center
            justify-between
            gap-5
            rounded-3xl
            border
            border-slate-800
            bg-slate-900
            p-6
            sm:flex-row
          "
        >

          <div className="flex items-center gap-3">

            <FaGraduationCap className="text-2xl text-blue-400" />

            <div>

              <p className="font-semibold">
                Your career profile powers CareerPilot AI.
              </p>

              <p className="text-sm text-slate-500">
                Keep it updated for better recommendations.
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={handleSave}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-blue-600
              px-6
              py-3
              font-semibold
              text-white
              transition
              hover:bg-blue-500
            "
          >
            <FaSave />
            Save Profile
          </button>

        </div>

      </main>

    </div>
  );
}

export default Settings;