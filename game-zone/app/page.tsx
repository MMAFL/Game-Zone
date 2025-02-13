// import Image from "next/image";
"use client"
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/layout/hero';
import { useAuth } from './context/authContext';

export default function Home() {
  const { user } = useAuth();
  return (
    <div>
    <Navbar/>
    <Hero/>
    </div>
  );
}
