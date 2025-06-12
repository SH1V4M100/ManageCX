import { useState, useRef, useEffect } from 'react';
import { User } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const user = session?.user;
  const isAuthenticated = !!session;

  return (
  <header className="bg-[#003D5B] border-b border-[#002A40] shadow-sm z-30">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-20">
        {/* Left - Logo and Nav */}
        <div className="flex items-center gap-6 flex-grow">
          <h1 className="text-2xl font-bold text-white">RosterManager</h1>

          <nav className="hidden md:flex items-center gap-6 ml-6">
            <a
              href="/dashboard"
              className="text-sm font-medium text-white hover:text-[#25E2CC] transition-colors"
            >
              Dashboard
            </a>
            <a
              href="/admin"
              className="text-sm font-medium text-white hover:text-[#25E2CC] transition-colors"
            >
              Admin
            </a>
          </nav>
        </div>

        {/* Right - User & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          {isAuthenticated ? (
            <div
              className="flex items-center gap-3 cursor-pointer select-none"
              onClick={toggleDropdown}
            >
              <div className="w-9 h-9 bg-[#25E2CC] rounded-full flex items-center justify-center text-[#003D5B] shadow-sm">
                <User size={18} />
              </div>
              <div className="hidden md:flex flex-col items-start text-right">
                <p className="text-sm font-medium text-white">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-200">
                  {user?.email}
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="text-sm font-medium text-white hover:text-[#25E2CC] transition cursor-pointer"
            >
              Sign in
            </button>
          )}

          {dropdownOpen && isAuthenticated && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg p-3 z-50">
              <p className="text-sm font-semibold text-gray-800">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
              <div className="mt-2 border-t border-gray-100 pt-2">
                <a
                  href="#"
                  className="block text-sm text-gray-600 hover:text-[#25E2CC] transition-colors"
                >
                  Profile
                </a>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left text-sm text-gray-600 hover:text-[#25E2CC] transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </header>
);


};

export default Navbar;
