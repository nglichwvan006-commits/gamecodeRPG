'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sword, Shield, Zap, Terminal } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center space-y-20 py-20">
      {/* Hero Section */}
      <section className="container flex flex-col items-center text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
            Master Code. <br />
            <span className="text-primary">Conquer the Realm.</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Embark on an epic RPG journey where your coding skills are your greatest weapons.
            Solve puzzles, defeat bugs, and level up your career.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/adventure">Start Your Quest</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link href="/about">Learn More</Link>
          </Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: 'Coding Quests',
            description: 'Solve real-world programming challenges to progress through the story.',
            icon: Sword,
            color: 'text-red-500',
          },
          {
            title: 'Refactor Shield',
            description: 'Protect your codebase by writing clean, maintainable, and efficient code.',
            icon: Shield,
            color: 'text-blue-500',
          },
          {
            title: 'Optimization Zap',
            description: 'Boost performance and speed with advanced algorithms and data structures.',
            icon: Zap,
            color: 'text-yellow-500',
          },
          {
            title: 'Debugger Terminal',
            description: 'Master the art of debugging and hunt down elusive bugs in the dungeon.',
            icon: Terminal,
            color: 'text-green-500',
          },
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all hover:shadow-lg"
          >
            <div className={`mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-secondary ${feature.color}`}>
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </section>

      {/* RPG Stats Mockup */}
      <section className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="rounded-3xl border bg-card/50 p-8 backdrop-blur"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Your Character</h2>
              <div className="h-40 w-full rounded-xl bg-secondary animate-pulse" />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Level 15 JavaScript Wizard</span>
                  <span>XP: 75%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                  <div className="h-full w-[75%] bg-primary" />
                </div>
              </div>
            </div>
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-2xl font-bold">Recent Achievements</h2>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="h-10 w-10 rounded-full bg-secondary" />
                    <div>
                      <p className="font-bold text-sm text-foreground">Achievement {i}</p>
                      <p className="text-xs text-muted-foreground">Completed 2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
