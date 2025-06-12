'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Users, Menu, X, User } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();
  const user = session?.user;
  const isAuthenticated = !!session;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav
      style={{
        padding: '1rem 2rem',
        background: 'rgba(0, 61, 91, 0.95)',
        backdropFilter: 'blur(10px)',
        // position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderBottom: '1px solid rgba(37, 226, 204, 0.2)'
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {/* Logo Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users style={{ color: '#25E2CC', width: '2rem', height: '2rem' }} />
          <span style={{ color: 'white', fontSize: '1.5rem', fontWeight: '700' }}>
            RosterManager
          </span>
          <span
            style={{
              color: '#25E2CC',
              fontSize: '0.9rem',
              fontWeight: '500',
              marginLeft: '1rem',
              padding: '0.25rem 0.75rem',
              backgroundColor: 'rgba(37, 226, 204, 0.1)',
              borderRadius: '1rem',
              border: '1px solid rgba(37, 226, 204, 0.3)'
            }}
          >
            Concentrix Internal
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <a href="#features" className="text-white hover:text-[#25E2CC] transition-colors">
            Features
          </a>
          <a href="#support" className="text-white hover:text-[#25E2CC] transition-colors">
            Support
          </a>

          {/* Login / User Dropdown */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            {isAuthenticated ? (
              <div
                onClick={toggleDropdown}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#25E2CC',
                  color: '#003D5B',
                  fontWeight: 600,
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
              >
                <User size={18} />
                <span>{user?.name || 'User'}</span>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="bg-[#25E2CC] text-[#003D5B] font-semibold py-3 px-6 rounded-md transform transition-transform hover:bg-[#00929F] hover:scale-105"
              >
                Employee Login
              </button>
            )}

            {/* Dropdown for authenticated users */}
            {dropdownOpen && isAuthenticated && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 0.5rem)',
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '0.375rem',
                  padding: '1rem',
                  width: '200px',
                  zIndex: 100
                }}
              >
                <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{user?.name}</p>
                <p style={{ fontSize: '0.85rem', color: '#666' }}>{user?.email}</p>
                <hr style={{ margin: '0.75rem 0', borderColor: '#eee' }} />
                <a
                  href="#profile"
                  style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontSize: '0.9rem' }}
                >
                  Profile
                </a>
                <button
                  onClick={() => signOut()}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: '#333',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={toggleMenu}
          style={{
            color: 'white',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
          className="md:hidden"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#003D5B',
            padding: '1rem 2rem',
            borderBottom: '1px solid rgba(37, 226, 204, 0.2)'
          }}
          className="md:hidden"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <a href="#features" className="text-white font-medium py-2">Features</a>
            <a href="#support" className="text-white font-medium py-2">Support</a>
            {isAuthenticated ? (
              <>
                <span className="text-white font-medium">{user?.name}</span>
                <button
                  onClick={() => signOut()}
                  className="bg-white text-[#003D5B] py-3 px-6 rounded-md font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn()}
                className="bg-[#25E2CC] text-[#003D5B] py-3 px-6 rounded-md font-semibold mt-2"
              >
                Employee Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
