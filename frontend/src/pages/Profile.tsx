import {
  FaArrowLeft,
  FaBriefcase,
  FaEnvelope,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaPhone,
  FaSave,
  FaUser,
} from "react-icons/fa";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

import {
  getUserProfile,
  saveUserProfile,
  type UserProfile,
} from "../utils/userProfile";

/*
|--------------------------------------------------------------------------
| PROFILE TYPE
|--------------------------------------------------------------------------
| Your existing UserProfile type does not currently contain phone/bio.
| We extend it here so Profile.tsx can safely use those fields.
*/

type ProfileForm = UserProfile & {
  phone?: string;
  bio?: string;
};

function Profile() {
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const [profile, setProfile] = useState<ProfileForm>(
    getUserProfile() as ProfileForm
  );

  const [saved, setSaved] = useState(false);

  // =========================================================
  // LOGIN CHECK
  // =========================================================

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      navigate("/login", {
        replace: true,
      });
    }
  }, [navigate]);

  // =========================================================
  // LOAD PROFILE
  // =========================================================

  useEffect(() => {
    try {
      const savedProfile = getUserProfile() as ProfileForm;

      setProfile(savedProfile);
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  }, []);

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (
    field: keyof ProfileForm,
    value: string
  ) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSaved(false);
  };

  // =========================================================
  // SAVE PROFILE
  // =========================================================

  const handleSave = () => {
    try {
      /*
       * saveUserProfile expects UserProfile.
       * ProfileForm extends UserProfile, so the base profile
       * remains compatible with the existing utility.
       */
      saveUserProfile(profile);

      // Notify Dashboard and other components
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

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  // =========================================================
  // BACK TO DASHBOARD
  // =========================================================

  const goBack = () => {
    setMobileSidebarOpen(false);
    navigate("/dashboard");
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() =>
          setMobileSidebarOpen(false)
        }
      />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="flex min-w-0 flex-1 flex-col">

        {/* ===================================================
            TOPBAR
        =================================================== */}

        <Topbar
          onMenuClick={() =>
            setMobileSidebarOpen(true)
          }
        />

        {/* ===================================================
            CONTENT
        =================================================== */}

        <main className="flex-1 overflow-y-auto">

          <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                {/* BACK BUTTON */}

                <button
                  type="button"
                  onClick={goBack}
                  className="
                    mb-4
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-900
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-slate-300
                    transition
                    hover:border-blue-500
                    hover:text-blue-400
                  "
                >
                  <FaArrowLeft />
                  Dashboard
                </button>

                <div className="flex items-center gap-4">

                  <div
                    className="
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      bg-gradient-to-br
                      from-blue-600
                      to-purple-600
                    "
                  >
                    <FaUser className="text-2xl" />
                  </div>

                  <div>

                    <h1 className="text-3xl font-bold sm:text-4xl">
                      My Profile
                    </h1>

                    <p className="mt-1 text-slate-400">
                      Manage your career profile and personal information.
                    </p>

                  </div>

                </div>

              </div>

              {/* SAVE */}

              <button
                type="button"
                onClick={handleSave}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-gradient-to-r
                  from-blue-600
                  to-violet-600
                  px-6
                  py-3
                  font-semibold
                  text-white
                  transition
                  hover:from-blue-500
                  hover:to-violet-500
                "
              >
                <FaSave />
                Save Profile
              </button>

            </div>

            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            {saved && (
              <div
                className="
                  mb-6
                  rounded-2xl
                  border
                  border-green-500/30
                  bg-green-500/10
                  px-5
                  py-4
                  text-sm
                  font-semibold
                  text-green-400
                "
              >
                ✓ Profile updated successfully.
              </div>
            )}

            {/* =================================================
                PROFILE CARD
            ================================================= */}

            <div
              className="
                overflow-hidden
                rounded-3xl
                border
                border-slate-800
                bg-slate-900
              "
            >

              {/* =================================================
                  PROFILE HEADER
              ================================================= */}

              <div
                className="
                  border-b
                  border-slate-800
                  bg-gradient-to-r
                  from-blue-600/10
                  to-purple-600/10
                  p-7
                "
              >

                <div className="flex items-center gap-5">

                  {/* PROFILE IMAGE */}

                  {profile.picture ? (
                    <img
                      src={profile.picture}
                      alt={profile.name || "Profile"}
                      className="
                        h-20
                        w-20
                        rounded-2xl
                        border
                        border-slate-700
                        object-cover
                      "
                    />
                  ) : (
                    <div
                      className="
                        flex
                        h-20
                        w-20
                        items-center
                        justify-center
                        rounded-2xl
                        bg-gradient-to-br
                        from-blue-600
                        to-purple-600
                        text-3xl
                        font-bold
                      "
                    >
                      {(profile.name || "C")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}

                  <div>

                    <h2 className="text-2xl font-bold">
                      {profile.name || "Career Explorer"}
                    </h2>

                    <p className="mt-1 text-slate-400">
                      {profile.email ||
                        "Add your email address"}
                    </p>

                  </div>

                </div>

              </div>

              {/* =================================================
                  FORM
              ================================================= */}

              <div className="p-7">

                {/* =================================================
                    PERSONAL INFORMATION
                ================================================= */}

                <h2 className="mb-6 text-xl font-bold">
                  Personal Information
                </h2>

                <div className="grid gap-6 md:grid-cols-2">

                  {/* NAME */}

                  <div>

                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Full Name
                    </label>

                    <div className="relative">

                      <FaUser
                        className="
                          pointer-events-none
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-slate-500
                        "
                      />

                      <input
                        type="text"
                        value={profile.name || ""}
                        onChange={(event) =>
                          handleChange(
                            "name",
                            event.target.value
                          )
                        }
                        placeholder="Enter your name"
                        className="
                          w-full
                          rounded-2xl
                          border
                          border-slate-700
                          bg-slate-950
                          py-3
                          pl-11
                          pr-4
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

                  </div>

                  {/* EMAIL */}

                  <div>

                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Email
                    </label>

                    <div className="relative">

                      <FaEnvelope
                        className="
                          pointer-events-none
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-slate-500
                        "
                      />

                      <input
                        type="email"
                        value={profile.email || ""}
                        onChange={(event) =>
                          handleChange(
                            "email",
                            event.target.value
                          )
                        }
                        placeholder="Enter your email"
                        className="
                          w-full
                          rounded-2xl
                          border
                          border-slate-700
                          bg-slate-950
                          py-3
                          pl-11
                          pr-4
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

                  </div>

                  {/* PHONE */}

                  <div>

                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Phone
                    </label>

                    <div className="relative">

                      <FaPhone
                        className="
                          pointer-events-none
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-slate-500
                        "
                      />

                      <input
                        type="text"
                        value={profile.phone || ""}
                        onChange={(event) =>
                          handleChange(
                            "phone",
                            event.target.value
                          )
                        }
                        placeholder="Enter your phone number"
                        className="
                          w-full
                          rounded-2xl
                          border
                          border-slate-700
                          bg-slate-950
                          py-3
                          pl-11
                          pr-4
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

                  </div>

                  {/* LOCATION */}

                  <div>

                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Location
                    </label>

                    <div className="relative">

                      <FaMapMarkerAlt
                        className="
                          pointer-events-none
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-slate-500
                        "
                      />

                      <input
                        type="text"
                        value={profile.location || ""}
                        onChange={(event) =>
                          handleChange(
                            "location",
                            event.target.value
                          )
                        }
                        placeholder="e.g. Karachi, Pakistan"
                        className="
                          w-full
                          rounded-2xl
                          border
                          border-slate-700
                          bg-slate-950
                          py-3
                          pl-11
                          pr-4
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

                  </div>

                </div>

                {/* =================================================
                    CAREER INFORMATION
                ================================================= */}

                <div className="mt-10">

                  <h2 className="mb-6 text-xl font-bold">
                    Career Information
                  </h2>

                  <div className="grid gap-6 md:grid-cols-2">

                    {/* TARGET CAREER */}

                    <div>

                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Target Career
                      </label>

                      <div className="relative">

                        <FaBriefcase
                          className="
                            pointer-events-none
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            text-slate-500
                          "
                        />

                        <input
                          type="text"
                          value={
                            profile.targetCareer || ""
                          }
                          onChange={(event) =>
                            handleChange(
                              "targetCareer",
                              event.target.value
                            )
                          }
                          placeholder="e.g. Frontend Developer"
                          className="
                            w-full
                            rounded-2xl
                            border
                            border-slate-700
                            bg-slate-950
                            py-3
                            pl-11
                            pr-4
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

                    </div>

                    {/* EDUCATION */}

                    <div>

                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Education
                      </label>

                      <div className="relative">

                        <FaGraduationCap
                          className="
                            pointer-events-none
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            text-slate-500
                          "
                        />

                        <input
                          type="text"
                          value={
                            profile.education || ""
                          }
                          onChange={(event) =>
                            handleChange(
                              "education",
                              event.target.value
                            )
                          }
                          placeholder="e.g. BS Computer Science"
                          className="
                            w-full
                            rounded-2xl
                            border
                            border-slate-700
                            bg-slate-950
                            py-3
                            pl-11
                            pr-4
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

                    </div>

                    {/* EXPERIENCE */}

                    <div>

                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Experience Level
                      </label>

                      <select
                        value={
                          profile.experienceLevel ||
                          "Student"
                        }
                        onChange={(event) =>
                          handleChange(
                            "experienceLevel",
                            event.target.value
                          )
                        }
                        className="
                          w-full
                          rounded-2xl
                          border
                          border-slate-700
                          bg-slate-950
                          px-4
                          py-3
                          text-white
                          outline-none
                          focus:border-blue-500
                          focus:ring-1
                          focus:ring-blue-500
                        "
                      >
                        <option value="Student">
                          Student
                        </option>

                        <option value="Entry Level">
                          Entry Level
                        </option>

                        <option value="Junior">
                          Junior
                        </option>

                        <option value="Mid Level">
                          Mid Level
                        </option>

                        <option value="Senior">
                          Senior
                        </option>
                      </select>

                    </div>

                    {/* CAREER GOAL */}

                    <div>

                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Career Goal
                      </label>

                      <input
                        type="text"
                        value={
                          profile.careerGoal || ""
                        }
                        onChange={(event) =>
                          handleChange(
                            "careerGoal",
                            event.target.value
                          )
                        }
                        placeholder="What do you want to achieve?"
                        className="
                          w-full
                          rounded-2xl
                          border
                          border-slate-700
                          bg-slate-950
                          px-4
                          py-3
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

                  </div>

                </div>

                {/* =================================================
                    BIO
                ================================================= */}

                <div className="mt-10">

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Bio
                  </label>

                  <textarea
                    value={profile.bio || ""}
                    onChange={(event) =>
                      handleChange(
                        "bio",
                        event.target.value
                      )
                    }
                    rows={5}
                    placeholder="Tell us a little about yourself..."
                    className="
                      w-full
                      resize-none
                      rounded-2xl
                      border
                      border-slate-700
                      bg-slate-950
                      px-4
                      py-3
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

                {/* =================================================
                    BOTTOM BUTTONS
                ================================================= */}

                <div
                  className="
                    mt-8
                    flex
                    flex-col
                    justify-end
                    gap-3
                    border-t
                    border-slate-800
                    pt-6
                    sm:flex-row
                  "
                >

                  <button
                    type="button"
                    onClick={goBack}
                    className="
                      rounded-2xl
                      border
                      border-slate-700
                      px-6
                      py-3
                      font-semibold
                      text-slate-300
                      transition
                      hover:bg-slate-800
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-2xl
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
                    Save Changes
                  </button>

                </div>

              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}

export default Profile;