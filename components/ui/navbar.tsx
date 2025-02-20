"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Code } from "lucide-react"

const DURATION = 0.25;
const STAGGER = 0.025;

const FlipLink = ({ children, href }) => {
  return (
    <motion.a
      initial="initial"
      whileHover="hovered"
      href={href}
      className="relative block overflow-hidden whitespace-nowrap text-sm text-[#888] hover:text-white/90 transition-colors cursor-none"
    >
      <div>
        {children.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: { y: 0 },
              hovered: { y: "-100%" },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0">
        {children.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: { y: "100%" },
              hovered: { y: 0 },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </div>
    </motion.a>
  );
};

export default function Navbar() {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 sensitive-cursor">
      <div className="backdrop-blur-sm bg-white/[0.06] rounded-lg border border-white/[0.25] px-4 py-2.5">
        <div className="flex items-center gap-8 cursor-none">
          <Link href="/" className="flex items-center text-white cursor-none">
          <Code className="h-6 w-6 text-white cursor-none" />          
            <span className="text-white text-lg font-bold ml-2 cursor-none">
              grindX
            </span>
          </Link>
          <nav className="flex items-center gap-8">
            <FlipLink href="/">Home</FlipLink>
            <FlipLink href="/dashboard">Dashboard</FlipLink>
            <FlipLink href="/about">About</FlipLink>
          </nav>
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 2 }}
              whileTap={{ scale: 0.9, rotate: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-[#141414] border border-white/[0.1] text-white text-sm font-normal hover:bg-[#1a1a1a] px-4 py-1.5 h-auto rounded-lg shadow-lg cursor-none">
              Start grinding
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
}
