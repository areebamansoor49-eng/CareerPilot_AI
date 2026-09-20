import { useNavigate } from "react-router-dom";
import SubscriptionModal from "../components/SubscriptionModal";

function Subscription() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-blue-950">
      <SubscriptionModal
        featureName="CareerPilot Premium"
        onClose={() =>
          navigate("/dashboard", {
            replace: true,
          })
        }
      />
    </div>
  );
}

export default Subscription;