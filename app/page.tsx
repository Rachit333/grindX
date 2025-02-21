"use client"

import { useEffect, useState, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import "@/styles/scrollEffect.css"

import { motion } from "framer-motion"
import { Pacifico } from "next/font/google"
import { cn } from "@/lib/utils"

import Test from "@/components/ui/PortalRing"
import BackGround from "@/components/ui/bg"

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
})

gsap.registerPlugin(ScrollTrigger)

const colors = [
  "text-red-500",
  "text-orange-500",
  "text-amber-500",
  "text-yellow-500",
  "text-lime-500",
  "text-green-500",
  "text-emerald-500",
  "text-teal-500",
  "text-cyan-500",
  "text-sky-500",
  "text-blue-500",
  "text-indigo-500",
  "text-violet-500",
  "text-purple-500",
  "text-fuchsia-500",
  "text-pink-500",
  "text-rose-500",
]

function CodingShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
  shape = "curly",
}: {
  className?: string
  delay?: number
  width?: number
  height?: number
  rotate?: number
  gradient?: string
  shape?: "curly" | "angle" | "slash"
}) {
  const getPath = () => {
    switch (shape) {
      case "curly":
        return "M0,50 Q25,0 50,50 T100,50"
      case "angle":
        return "M0,100 L50,0 L100,100"
      case "slash":
        return "M0,100 L100,0"
      default:
        return "M0,50 Q25,0 50,50 T100,50"
    }
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <svg width={width} height={height} viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d={getPath()} fill="none" stroke="url(#gradient)" strokeWidth="4" vectorEffect="non-scaling-stroke" />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" className={cn("stop-color-from", gradient)} />
              <stop offset="100%" className="stop-color-to" style={{ stopColor: "transparent" }} />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </motion.div>
  )
}

export default function ScrollEffect() {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  }

  const [config, setConfig] = useState({
    theme: "dark",
    animate: true,
    snap: true,
    start: gsap.utils.random(0, 100, 1),
    end: gsap.utils.random(900, 1000, 1),
    scroll: true,
    debug: false,
  })

  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = config.theme
    document.documentElement.dataset.syncScrollbar = config.scroll ? "true" : "false"
    document.documentElement.dataset.animate = config.animate ? "true" : "false"
    document.documentElement.dataset.snap = config.snap ? "true" : "false"
    document.documentElement.dataset.debug = config.debug ? "true" : "false"

    document.documentElement.style.setProperty("--start", config.start.toString())
    document.documentElement.style.setProperty("--hue", config.start.toString())
    document.documentElement.style.setProperty("--end", config.end.toString())

    if (listRef.current) {
      const items = gsap.utils.toArray<HTMLLIElement>(listRef.current.querySelectorAll("li"))
      gsap.set(items, { opacity: (i) => (i !== 0 ? 0.2 : 1) })

      const dimmer = gsap
        .timeline()
        .to(items.slice(1), {
          opacity: 1,
          stagger: 0.5,
        })
        .to(
          items.slice(0, items.length - 1),
          {
            opacity: 0.2,
            stagger: 0.5,
          },
          0,
        )

      ScrollTrigger.create({
        trigger: items[0],
        endTrigger: items[items.length - 1],
        start: "center center",
        end: "center center",
        animation: dimmer,
        scrub: 0.2,
      })

      ScrollTrigger.create({
        trigger: items[0],
        endTrigger: items[items.length - 1],
        start: "center center",
        end: "center center",
        animation: gsap.fromTo(
          document.documentElement,
          { "--hue": config.start },
          { "--hue": config.end, ease: "none" },
        ),
        scrub: 0.2,
      })
    }
  }, [config])

  return (
    <main>
      <BackGround />
      <header>
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-center w-full">
          <div className="relative z-10 container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
                <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                    Elevate Your
                  </span>
                  <br />
                  <span
                    className={cn(
                      "bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-white/90 to-purple-300 pr-11",
                      pacifico.className,
                    )}
                  >
                    Coding Journey
                  </span>
                </h1>
              </motion.div>
              <br />
              <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
                <p className="text-base sm:text-lg md:text-xl text-white/40 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
                  Track, analyze, and improve your competitive programming skills.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </header>
      <section className="content fluid">
        <h2>you can&nbsp;</h2>
        <ul ref={listRef}>
          {[
            "solve",
            "build",
            "develop",
            "debug",
            "learn",
            "collaborate",
            "follow",
            "test",
            "optimize",
            "visualize",
            "do it",
          ].map((text, i) => (
            <li key={i} className={colors[i % colors.length]}>
              {text}.
            </li>
          ))}
        </ul>
      </section>
      <section>
        <Test />
      </section>
    </main>
  )
}

