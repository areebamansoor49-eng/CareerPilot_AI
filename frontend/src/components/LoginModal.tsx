import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaRobot } from "react-icons/fa";

interface GoogleUser {
  name?: string;
  email?: string;
  picture?: string;
}

interface LoginModalProps {
  onClose: () => void;
}

function LoginModal({ onClose }: LoginModalProps) {
  const navigate = useNavigate();

  const handleGoogleSuccess = (credential: string) => {
    try {
      const googleUser = jwtDecode<GoogleUser>(credential);

      if (!googleUser.email) {
        throw new Error("Google account email was not received.");
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: googleUser.name || "User",
          email: googleUser.email,
          picture: googleUser.picture || "",
        })
      );

      onClose();

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-slate-950 border border-white/10 p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}

        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 w-9 h-9 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition flex items-center justify-center"
          aria-label="Close login"
        >
          <FaTimes />
        </button>

        {/* Icon */}

        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <FaRobot className="text-3xl text-blue-400" />
          </div>
        </div>

        {/* Heading */}

        <h2 className="mt-6 text-3xl font-bold text-white text-center">
          Welcome Back
        </h2>

        <p className="mt-3 text-slate-400 text-center">
          Sign in to continue using CareerPilot AI
        </p>

        {/* Google Login */}

        <div className="mt-8 flex justify-center">
          <GoogleLogin
            theme="filled_blue"
            size="large"
            shape="pill"
            onSuccess={(response) => {
              if (!response.credential) {
                console.error(
                  "Google login did not return a credential."
                );
                return;
              }

              handleGoogleSuccess(response.credential);
            }}
            onError={() => {
              console.error("Google Login Failed");
            }}
          />
        </div>

        <p className="mt-7 text-center text-xs text-slate-500">
          Secure login powered by Google OAuth 2.0
        </p>
      </div>
    </div>
  );
}

export default LoginModal;