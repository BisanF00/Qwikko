import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Footer() {
  const isDarkMode = useSelector((state) => state.deliveryTheme.darkMode);

  return (
    <footer
      className="py-4"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Left */}
        <div className="flex items-center">
          <img
            src={isDarkMode ? "/darklogo.png" : "/logo.png"}
            alt="Qwikko Logo"
            className="h-9"
          />
        </div>

        {/* Links Center */}
        <div className="flex flex-col items-center">
          <div className="flex space-x-6 text-sm mb-1">
            <Link
              to="/contact"
              className="transition hover:underline"
              style={{ color: "var(--primary)" }}
            >
              Contact Us
            </Link>
            <Link
              to="/about"
              className="transition hover:underline"
              style={{ color: "var(--primary)" }}
            >
              About Us
            </Link>
          </div>
          <p
            className="text-xs"
            style={{ color: isDarkMode ? "#ffffff" : "292e2c" }}
          >
            2025 © All rights reserved
          </p>
        </div>

        {/* Social Icons Right */}
        <div className="flex space-x-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--primary)] hover:text-white transition-all duration-200 shadow-sm"
          >
            <FaGithub size={18} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--primary)] hover:text-white transition-all duration-200 shadow-sm"
          >
            <FaLinkedin size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
