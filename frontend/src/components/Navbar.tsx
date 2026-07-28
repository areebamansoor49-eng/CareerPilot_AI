function Navbar() {
  return (
    <nav className="flex justify-between items-center p-6">
      <h1 className="text-2xl font-bold">
        CareerPilot AI
      </h1>

      <div className="space-x-6">
        <a href="#">Home</a>
        <a href="#">Features</a>
        <a href="#">About</a>

        <button className="bg-white text-black px-4 py-2 rounded-lg">
          Login
        </button>
      </div>
    </nav>
  );
}

export default Navbar;