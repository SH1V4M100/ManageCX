'use client'
import React from 'react';
import {  Users,  Calendar,  BarChart3,  Shield,  Clock,  CheckCircle} from 'lucide-react';
import Navbar from '@/components/Navbar';

function App() {

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#003D5B',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* Navigation */}
      <Navbar/>

      {/* Hero Section */}
      <section
        style={{
          padding: '8rem 2rem 4rem',
          background: `linear-gradient(135deg, #003D5B 0%, #09347A 100%)`,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center'
          }}
          className="grid-cols-1 lg:grid-cols-2"
        >
          <div>
            <h1
              style={{
                fontSize: '3.5rem',
                fontWeight: '800',
                color: 'white',
                marginBottom: '1.5rem',
                lineHeight: '1.1',
                letterSpacing: '-0.02em'
              }}
              className="text-4xl md:text-6xl"
            >
              Streamline Your{' '}
              <span style={{ color: '#25E2CC' }}>Team Operations</span>
            </h1>
            <p
              style={{
                fontSize: '1.25rem',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '2rem',
                lineHeight: '1.6'
              }}
            >
              Concentrix's intelligent roster management system. Optimize scheduling,
              track performance, and manage your team with enterprise-grade tools
              designed for operational excellence.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => window.location.href = "/admin"}
                className="bg-[#25E2CC] text-[#003D5B] py-4 px-8 rounded-xl text-lg font-semibold transform transition-transform hover:bg-[#00929F] hover:scale-105"
              >
                Admin Panel
              </button>
              <button
                className="bg-transparent text-white py-4 px-8 border-2 border-[#25E2CC] rounded-xl text-lg font-semibold transition-colors hover:bg-[rgba(37,226,204,0.1)]"
              >
                View Documentation
              </button>
            </div>
            {/* Stats */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '2rem',
                marginTop: '3rem',
                padding: '2rem 0',
                borderTop: '1px solid rgba(37, 226, 204, 0.2)'
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#25E2CC',
                    marginBottom: '0.5rem'
                  }}
                >
                  500+
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem'
                  }}
                >
                  Active Teams
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#25E2CC',
                    marginBottom: '0.5rem'
                  }}
                >
                  99.9%
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem'
                  }}
                >
                  Uptime
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#25E2CC',
                    marginBottom: '0.5rem'
                  }}
                >
                  24/7
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem'
                  }}
                >
                  IT Support
                </div>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div
            style={{
              background: 'rgba(37, 226, 204, 0.1)',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid rgba(37, 226, 204, 0.2)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                marginBottom: '1rem',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem'
                }}
              >
                <h3
                  style={{
                    color: '#003D5B',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    margin: 0
                  }}
                >
                  Today's Schedule
                </h3>
                <Calendar style={{ color: '#25E2CC', width: '1.5rem', height: '1.5rem' }} />
              </div>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {['Team Alpha - Morning Shift', 'Team Beta - Afternoon', 'Team Gamma - Night Shift'].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      backgroundColor: i === 0 ? '#25E2CC' : '#f8fafc',
                      borderRadius: '0.5rem',
                      color: i === 0 ? 'white' : '#003D5B'
                    }}
                  >
                    <CheckCircle size={16} />
                    <span style={{ fontSize: '0.9rem' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem'
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  textAlign: 'center'
                }}
              >
                <BarChart3 style={{ color: '#FF6325', width: '1.5rem', height: '1.5rem', margin: '0 auto 0.5rem' }} />
                <div style={{ color: '#003D5B', fontSize: '0.9rem', fontWeight: '600' }}>
                  Analytics
                </div>
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  textAlign: 'center'
                }}
              >
                <Shield style={{ color: '#C0D62E', width: '1.5rem', height: '1.5rem', margin: '0 auto 0.5rem' }} />
                <div style={{ color: '#003D5B', fontSize: '0.9rem', fontWeight: '600' }}>
                  Enterprise
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section id="features" style={{ padding: '6rem 2rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2
              style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#003D5B',
                marginBottom: '1rem'
              }}
            >
              Enterprise-Grade Team Management
            </h2>
            <p
              style={{
                fontSize: '1.1rem',
                color: '#64748b',
                maxWidth: '600px',
                margin: '0 auto'
              }}
            >
              Built specifically for Concentrix operations with advanced features for
              large-scale team coordination.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}
          >
            {[
              {
                icon: Calendar,
                color: '#25E2CC',
                title: 'Intelligent Scheduling',
                description:
                  'AI-powered scheduling that considers skills, availability, and business requirements across multiple time zones.'
              },
              {
                icon: Users,
                color: '#FF6325',
                title: 'Team Coordination',
                description:
                  'Centralized management for large teams with role-based access and hierarchical oversight capabilities.'
              },
              {
                icon: BarChart3,
                color: '#C0D62E',
                title: 'Performance Insights',
                description:
                  'Real-time analytics and reporting for operational efficiency, productivity metrics, and resource optimization.'
              },
              {
                icon: Clock,
                color: '#00929F',
                title: 'Time Management',
                description:
                  'Comprehensive time tracking with automated compliance reporting and overtime management.'
              },
              {
                icon: Shield,
                color: '#09347A',
                title: 'Enterprise Security',
                description:
                  'Bank-level security with SSO integration, audit trails, and compliance with corporate policies.'
              },
              {
                icon: CheckCircle,
                color: '#25E2CC',
                title: 'Workflow Automation',
                description:
                  'Streamlined processes with automated notifications, approvals, and escalation procedures.'
              }
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'white',
                  padding: '2rem',
                  borderRadius: '1rem',
                  border: '1px solid #e2e8f0',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                className="transition-all transform hover:-translate-y-1 hover:shadow-xl cursor-pointer"
              >
                <div
                  style={{
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: `${feature.color}20`,
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem'
                  }}
                >
                  <feature.icon style={{ color: feature.color, width: '1.5rem', height: '1.5rem' }} />
                </div>
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#003D5B',
                    marginBottom: '1rem'
                  }}
                >
                  {feature.title}
                </h3>
                <p style={{ color: '#64748b', lineHeight: '1.6' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Support Section */}
      <section
        id="support"
        style={{
          padding: '6rem 2rem',
          background: `linear-gradient(135deg, #003D5B 0%, #09347A 100%)`,
          position: 'relative'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(37, 226, 204, 0.1) 0%, transparent 50%), 
                              radial-gradient(circle at 80% 20%, rgba(255, 99, 37, 0.1) 0%, transparent 50%)`
          }}
        ></div>
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center',
            position: 'relative'
          }}
        >
          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: 'white',
              marginBottom: '1.5rem'
            }}
          >
            Need Help Getting Started?
          </h2>
          <p
            style={{
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '2.5rem',
              lineHeight: '1.6'
            }}
          >
            Our IT support team is available 24/7 to help you with RosterPro.
            Access training materials, submit tickets, or contact support directly.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="bg-[#25E2CC] text-[#003D5B] py-4 px-8 rounded-xl text-lg font-semibold transform transition-transform hover:bg-[#00929F] hover:scale-105"
            >
              Contact IT Support
            </button>
            <button
              className="bg-transparent text-white py-4 px-8 border-2 border-[#25E2CC] rounded-xl text-lg font-semibold transition-colors hover:bg-[rgba(37,226,204,0.1)]"
            >
              Training Resources
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: '#003D5B',
          padding: '3rem 2rem 2rem',
          borderTop: '1px solid rgba(37, 226, 204, 0.2)'
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Users style={{ color: '#25E2CC', width: '2rem', height: '2rem' }} />
              <span style={{ color: 'white', fontSize: '1.5rem', fontWeight: '700' }}>RosterPro</span>
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.6', marginBottom: '1rem' }}>
              Concentrix's enterprise team management solution for operational excellence.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'white', fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
              Quick Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['Employee Portal', 'Manager Dashboard', 'Reports', 'Settings'].map(link => (
                <a
                  key={link}
                  href="#"
                  className="text-[rgba(255,255,255,0.7)] hover:text-[#25E2CC] transition-colors"
                  style={{ textDecoration: 'none' }}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ color: 'white', fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
              Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['IT Helpdesk', 'User Guide', 'System Status', 'Training'].map(link => (
                <a
                  key={link}
                  href="#"
                  className="text-[rgba(255,255,255,0.7)] hover:text-[#25E2CC] transition-colors"
                  style={{ textDecoration: 'none' }}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(37, 226, 204, 0.2)',
            paddingTop: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
            © 2024 Concentrix. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <a
              href="#"
              className="text-[rgba(255,255,255,0.7)] hover:text-[#25E2CC] transition-colors text-sm"
              style={{ textDecoration: 'none' }}
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-[rgba(255,255,255,0.7)] hover:text-[#25E2CC] transition-colors text-sm"
              style={{ textDecoration: 'none' }}
            >
              Terms of Use
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
