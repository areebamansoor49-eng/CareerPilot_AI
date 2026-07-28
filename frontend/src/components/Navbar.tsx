function Navbar() {
  return (
    <nav className="flex justify-between items-center p-6 sticky top-0 backdrop-blur-md bg-white/10 border-b border-white/20">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        CareerPilot AI
      </h1>

      <div className="flex gap-6 items-center">
        <a
          href="#"
          className="hover:text-blue-400 transition duration-300"
        >
          Home
        </a>

        <a
          href="#"
          className="hover:text-blue-400 transition duration-300"
        >
          Features
        </a>

        <a
          href="#"
          className="hover:text-blue-400 transition duration-300"
        >
          About
        </a>

        <a
          href="#"
          className="hover:text-blue-400 transition duration-300"
        >
          Contact
        </a>

        <button className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition duration-300">
          Login
        </button>
      </div>
    </nav>
  );
}

export default Navbar;