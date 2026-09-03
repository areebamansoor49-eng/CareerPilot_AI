import { FaArrowLeft, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface BackToDashboardProps {
  text?: string;
}

function BackToDashboard({
  text = "Back to Dashboard",
}: BackToDashboardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/dashboard")}
      className="
        inline-flex
        items-center
        gap-3
        rounded-xl
        border
        border-slate-700
        bg-slate-900
        px-5
        py-3
        text-slate-300
        font-semibold
        hover:border-blue-500
        hover:text-white
        hover:bg-slate-800
        transition
      "
    >
      <FaArrowLeft />
      {text}
    </button>
  );
}

export default BackToDashboard;