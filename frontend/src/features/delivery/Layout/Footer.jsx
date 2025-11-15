import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Footer() {
  // 👇 هون بنقرأ من السلايس تاعتك بالضبط
  const isDark = useSelector((state) => state.deliveryTheme?.darkMode);

  return (
    <footer
      className={`py-6 px-4 border-t ${
        isDark
          ? "bg-[var(--div)] border-[var(--border)] text-[var(--text)]"
          : "bg-gradient-to-br from-[var(--button)] to-gray-700 border-[var(--button)] text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* الصف الأول: اللوغو واللينكات */}
        <div className="flex flex-col lg:flex-row items-center gap-4 mb-4">
          {/* Logo */}
          <div className="lg:flex-1 flex justify-start">
            <img src="/LogoDark.png" alt="Qwikko Logo" className="h-7" />
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-xs md:text-sm lg:flex-1">
            <Link
              to="/delivery/dashboard/contact"
              className={`hover:underline transition-colors duration-200 font-medium ${
                isDark ? "hover:text-[var(--primary)]" : "hover:text-white/80"
              }`}
            >
              Contact
            </Link>
            <Link
              to="/delivery/dashboard/about"
              className={`hover:underline transition-colors duration-200 font-medium ${
                isDark ? "hover:text-[var(--primary)]" : "hover:text-white/80"
              }`}
            >
              About
            </Link>
            <Link
              to="/delivery/dashboard/privacy"
              className={`hover:underline transition-colors duration-200 font-medium ${
                isDark ? "hover:text-[var(--primary)]" : "hover:text-white/80"
              }`}
            >
              Privacy
            </Link>
            <Link
              to="/delivery/dashboard/terms"
              className={`hover:underline transition-colors duration-200 font-medium ${
                isDark ? "hover:text-[var(--primary)]" : "hover:text-white/80"
              }`}
            >
              Terms
            </Link>
          </div>

          {/* مساحة فاضية لتوسيط اللينكات */}
          <div className="lg:flex-1 hidden lg:block"></div>
        </div>

        {/* الصف الثاني: حقوق النشر */}
        <div
          className={`text-center border-t pt-2 ${
            isDark ? "border-[var(--border)]" : "border-white/30"
          }`}
        >
          <p
            className={`text-xs ${
              isDark ? "text-[var(--light-gray)]" : "text-white/80"
            }`}
          >
            © 2025 Qwikko. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
