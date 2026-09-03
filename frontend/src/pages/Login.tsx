import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import {
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

interface GoogleUser {
  name: string;
  email: string;
  picture: string;
}

interface GoogleToken {
  name?: string;
  email?: string;
  picture?: string;
}

interface LoginLocationState {
  redirectTo?: string;
}

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  /* =========================================================
     CHECK EXISTING LOGIN
  ========================================================= */

  const storedUser =
    localStorage.getItem("user");

  /* =========================================================
     GET REDIRECT LOCATION
  ========================================================= */

  const state =
    location.state as
      | LoginLocationState
      | null;

  const redirectTo =
    state?.redirectTo ||
    "/dashboard";

  /* =========================================================
     ALREADY LOGGED IN
  ========================================================= */

  if (storedUser) {
    return (
      <Navigate
        to={redirectTo}
        replace
      />
    );
  }

  /* =========================================================
     GOOGLE LOGIN SUCCESS
  ========================================================= */

  const handleGoogleSuccess = (
    credential: string
  ) => {
    try {
      const googleUser =
        jwtDecode<GoogleToken>(
          credential
        );

      if (!googleUser.email) {
        throw new Error(
          "Google account email was not received."
        );
      }

      const loggedInUser: GoogleUser = {
        name:
          googleUser.name ||
          "User",

        email:
          googleUser.email,

        picture:
          googleUser.picture ||
          "",
      };

      /* =====================================================
         SAVE USER
      ===================================================== */

      localStorage.setItem(
        "user",
        JSON.stringify(loggedInUser)
      );

      /* =====================================================
         NOTIFY OTHER COMPONENTS
      ===================================================== */

      window.dispatchEvent(
        new Event("storage")
      );

      /* =====================================================
         REDIRECT
      ===================================================== */

      navigate(
        redirectTo,
        {
          replace: true,
        }
      );

    } catch (error) {
      console.error(
        "Google login error:",
        error
      );
    }
  };

  /* =========================================================
     GOOGLE LOGIN ERROR
  ========================================================= */

  const handleGoogleError = () => {
    console.error(
      "Google Login Failed"
    );
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#020617] text-white">

      {/* =====================================================
          LOGIN CONTENT
      ===================================================== */}

      <main className="flex min-h-screen items-center justify-center px-6 py-24">

        <div className="w-full max-w-md">

          {/* =================================================
              LOGO
          ================================================= */}

          <div className="mb-8 flex justify-center">

            <div
              className="
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-3xl
                bg-gradient-to-r
                from-blue-600
                via-cyan-500
                to-purple-600
                shadow-2xl
                shadow-blue-500/20
              "
            >
              <span className="text-4xl font-bold text-white">
                C
              </span>
            </div>

          </div>

          {/* =================================================
              LOGIN CARD
          ================================================= */}

          <div
            className="
              rounded-3xl
              border
              border-slate-800
              bg-slate-900/80
              p-8
              shadow-2xl
              backdrop-blur-xl
              sm:p-10
            "
          >

            {/* =================================================
                TITLE
            ================================================= */}

            <div className="text-center">

              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                Welcome Back
              </h1>

              <p className="mt-3 text-slate-400">
                Sign in to continue using CareerPilot AI
              </p>

            </div>

            {/* =================================================
                GOOGLE LOGIN
            ================================================= */}

            <div className="mt-10 flex justify-center">

              <GoogleLogin
                theme="filled_blue"
                size="large"
                shape="pill"

                onSuccess={(response) => {

                  if (
                    !response.credential
                  ) {
                    console.error(
                      "Google login did not return a credential."
                    );

                    return;
                  }

                  handleGoogleSuccess(
                    response.credential
                  );
                }}

                onError={
                  handleGoogleError
                }
              />

            </div>

            {/* =================================================
                DIVIDER
            ================================================= */}

            <div className="my-8 flex items-center gap-4">

              <div className="h-px flex-1 bg-slate-800" />

              <span className="text-xs text-slate-500">
                SECURE LOGIN
              </span>

              <div className="h-px flex-1 bg-slate-800" />

            </div>

            {/* =================================================
                SECURITY INFO
            ================================================= */}

            <div
              className="
                rounded-2xl
                border
                border-blue-500/20
                bg-blue-500/5
                p-4
              "
            >

              <p className="text-center text-sm text-slate-400">

                Secure login powered by{" "}

                <span className="font-medium text-blue-400">
                  Google OAuth 2.0
                </span>

              </p>

            </div>

            {/* =================================================
                BACK HOME
            ================================================= */}

            <button
              type="button"
              onClick={() =>
                navigate("/")
              }
              className="
                mt-6
                w-full
                rounded-xl
                border
                border-slate-700
                bg-slate-800/50
                py-3
                text-sm
                font-medium
                text-slate-300
                transition
                hover:bg-slate-800
                hover:text-white
              "
            >
              ← Back to Home
            </button>

          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <p className="mt-6 text-center text-xs text-slate-600">
            © {new Date().getFullYear()} CareerPilot AI.
            All rights reserved.
          </p>

        </div>

      </main>

    </div>
  );
}

export default Login;