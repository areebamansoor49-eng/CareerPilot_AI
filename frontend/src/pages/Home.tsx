import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Features from "../components/Features";
import TrustedBy from "../components/TrustedBy";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-black via-slate-900 to-blue-950">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <TrustedBy />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default Home;