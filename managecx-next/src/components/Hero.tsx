'use client';
import React from 'react';
import { ArrowRight } from 'lucide-react';
import Button from './ui/button';
import LoginButton from './login-btn';
import {TextGenerateEffect} from '@/components/ui/text-generate-effect';
const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden pt-32 pb-20 bg-gradient-to-br from-blue-50 to-indigo-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="flex flex-col items-center justify-center text-center min-h-[60vh]">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
        Welcome to <span className="text-blue-600">ManageCX</span>
      </h1>
      <TextGenerateEffect words=
        "Access and manage your Concentrix roster schedules efficiently in one place."
      className="text-4xl font-bold text-gray-800" />
      <div className="mt-8">
      <LoginButton size="lg">
        Login to Dashboard <ArrowRight className="h-5 w-5 ml-2" />
      </LoginButton>
    </div>
    </div>
  </div>
</div>

  );
};

export default Hero;
