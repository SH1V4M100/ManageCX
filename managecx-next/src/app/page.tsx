'use client'
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/features';
import Footer from '@/components/Footer';

function App() {
  useEffect(() => {
    document.title = 'ManageCX - Concentrix Roster Management';
    // const fetchData = async () => {
    //   const res = await fetch('/api/immediate-subordinates?start_date=2024-01-01&end_date=2025-12-31');
    //   const result = await res.json();
    //   console.log(result);
    // };
    // fetchData();
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => {
      observer.observe(el);
    });

    return () => {
      animateElements.forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="font-sans antialiased">
      <Navbar />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}

export default App;