import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import ReviewSlider from "../components/ReviewSlider";

import TrustedBy from "../components/TrustedBy";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-blue-950 text-white">
      <Navbar />
      <main>
        <Hero />
        <Stats />
       
        <TrustedBy />
        <Testimonials />
        <ReviewSlider />
      </main>
      <Footer />
    </div>
  );
}

export default Home;