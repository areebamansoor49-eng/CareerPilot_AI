function Navbar() {
  return (
    <nav className="flex justify-between items-center p-6">
      <h1 className="text-3xl font-bold">CareerPilot AI</h1>

      <div className="flex gap-6 items-center">
        <a href="#">Home</a>
        <a href="#">Features</a>
        <a href="#">About</a>
        <a href="#">Contact</a>

        <button className="px-5 py-2 rounded-lg bg-white text-black">
          Login
        </button>
      </div>
    </nav>
  );
}

export default Navbar;