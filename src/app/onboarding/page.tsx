'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Sword, Wand, Zap, Cog, Loader2, Sparkles, User, Check } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/client'
import { useAuthStore } from '@/store/use-auth-store'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const CLASSES = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Warrior',
    language: 'C++',
    description: 'High HP and strong memory management skills. Brute force is your specialty.',
    icon: Sword,
    color: 'from-red-500 to-orange-600',
    shadow: 'shadow-red-500/20',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Mage',
    language: 'Python',
    description: 'High MP and powerful data manipulation spells. Logic is your magic.',
    icon: Wand,
    color: 'from-blue-500 to-purple-600',
    shadow: 'shadow-blue-500/20',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Assassin',
    language: 'JavaScript',
    description: 'High speed and event-driven agility. Strike fast, strike once.',
    icon: Zap,
    color: 'from-yellow-400 to-orange-500',
    shadow: 'shadow-yellow-500/20',
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Engineer',
    language: 'C#',
    description: 'Balanced stats with strong structural design. Built for reliability.',
    icon: Cog,
    color: 'from-emerald-500 to-teal-600',
    shadow: 'shadow-emerald-500/20',
  },
]

const AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [charName, setCharName] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0])
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const router = useRouter()
  const { user } = useAuthStore()
  const supabase = createClient()

  useEffect(() => {
    if (user?.user_metadata?.username && !charName) {
      setCharName(user.user_metadata.username)
    }
  }, [user, charName])

  const handleCreateAccount = async () => {
    if (!selectedClass || !charName) {
      toast.error('Please complete all selections.')
      return
    }

    setIsSubmitting(true)

    try {
      // 1. Update Profile Metadata
      const { error: profileError } = await supabase.auth.updateUser({
        data: { 
          full_name: charName,
          avatar_url: selectedAvatar,
        }
      })

      if (profileError) throw profileError

      // 2. Create Character
      const { error: charError } = await supabase.from('characters').insert({
        profile_id: user?.id,
        class_id: selectedClass,
        hp: CLASSES.find(c => c.id === selectedClass)?.name === 'Warrior' ? 150 : 100,
        mp: CLASSES.find(c => c.id === selectedClass)?.name === 'Mage' ? 100 : 50,
      })

      if (charError) throw charError

      toast.success('Your legend begins now!')
      router.push('/adventure')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create character.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden bg-background py-10">
      {/* Background Particles Decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-primary/20"
            animate={{
              y: [Math.random() * 1000, -20],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              ease: 'linear',
              delay: Math.random() * 10,
            }}
            style={{
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 mx-auto max-w-5xl px-4">
        <div className="mb-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl"
          >
            Create Your <span className="text-primary">Legend</span>
          </motion.h1>
          <p className="mt-2 text-muted-foreground">Define your path in the realm of code.</p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left: Selection Area */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="space-y-8"
                >
                  <section className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Basic Information
                    </h2>
                    <div className="space-y-2">
                      <Label htmlFor="charName">Character Name</Label>
                      <Input
                        id="charName"
                        placeholder="Enter your hero's name"
                        value={charName}
                        onChange={(e) => setCharName(e.target.value)}
                        className="h-12 text-lg"
                      />
                    </div>
                  </section>

                  <section className="space-y-4">
                    <Label>Choose Your Avatar</Label>
                    <div className="flex flex-wrap gap-4">
                      {AVATARS.map((avatar) => (
                        <motion.button
                          key={avatar}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedAvatar(avatar)}
                          className={cn(
                            "relative rounded-full border-4 transition-all duration-300 overflow-hidden",
                            selectedAvatar === avatar ? "border-primary shadow-lg scale-110" : "border-transparent opacity-60 grayscale hover:grayscale-0"
                          )}
                        >
                          <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                            <AvatarImage src={avatar} />
                            <AvatarFallback>?</AvatarFallback>
                          </Avatar>
                          {selectedAvatar === avatar && (
                            <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                              <Check className="h-8 w-8 text-white" />
                            </div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </section>

                  <Button 
                    className="w-full h-12 text-lg" 
                    onClick={() => step < 2 && setStep(2)}
                    disabled={!charName}
                  >
                    Next: Choose Your Class
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Select Your Class
                    </h2>
                    <Button variant="ghost" size="sm" onClick={() => setStep(1)}>Back</Button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {CLASSES.map((cls) => (
                      <motion.div
                        key={cls.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, translateY: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedClass(cls.id)}
                        className={cn(
                          "group relative cursor-pointer overflow-hidden rounded-2xl border p-6 transition-all duration-300",
                          cls.shadow,
                          selectedClass === cls.id 
                            ? "border-primary bg-primary/5 ring-1 ring-primary" 
                            : "bg-card hover:border-primary/50"
                        )}
                      >
                        {/* Glow Effect */}
                        <div className={cn(
                          "absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-20",
                          cls.color
                        )} />

                        <div className="flex items-start justify-between">
                          <div className={cn(
                            "mb-4 rounded-xl p-3 bg-gradient-to-br text-white",
                            cls.color
                          )}>
                            <cls.icon className="h-6 w-6" />
                          </div>
                          {selectedClass === cls.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="rounded-full bg-primary p-1 text-white"
                            >
                              <Check className="h-4 w-4" />
                            </motion.div>
                          )}
                        </div>

                        <h3 className="text-xl font-bold">{cls.name}</h3>
                        <p className="text-sm font-semibold text-primary">{cls.language}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{cls.description}</p>
                      </motion.div>
                    ))}
                  </div>

                  <Button 
                    className="w-full h-12 text-lg shadow-xl shadow-primary/20" 
                    onClick={handleCreateAccount}
                    disabled={!selectedClass || isSubmitting}
                  >
                    {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sword className="mr-2 h-5 w-5" />}
                    Embark on Adventure
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Character Preview */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24"
            >
              <Card className="overflow-hidden border-2 border-primary/20 shadow-2xl">
                <div className={cn(
                  "h-3 bg-gradient-to-r transition-all duration-500",
                  selectedClass 
                    ? CLASSES.find(c => c.id === selectedClass)?.color 
                    : "from-muted to-muted"
                )} />
                <CardHeader className="text-center">
                  <div className="mx-auto relative h-32 w-32 mb-4 group">
                    {/* Character Avatar Glow */}
                    <div className={cn(
                      "absolute inset-0 rounded-full blur-2xl opacity-20 transition-all duration-500 scale-125",
                      selectedClass 
                        ? CLASSES.find(c => c.id === selectedClass)?.color 
                        : "bg-muted"
                    )} />
                    <Avatar className="h-full w-full border-4 border-background shadow-xl">
                      <AvatarImage src={selectedAvatar} />
                      <AvatarFallback>?</AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-2xl font-black uppercase tracking-widest">
                    {charName || 'New Hero'}
                  </CardTitle>
                  <CardDescription className="font-bold text-primary">
                    {selectedClass ? CLASSES.find(c => c.id === selectedClass)?.name : 'Class Not Selected'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase text-muted-foreground">
                      <span>Health Points</span>
                      <span>{selectedClass && CLASSES.find(c => c.id === selectedClass)?.name === 'Warrior' ? '150' : '100'} HP</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        className="h-full rounded-full bg-red-500" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase text-muted-foreground">
                      <span>Mana Points</span>
                      <span>{selectedClass && CLASSES.find(c => c.id === selectedClass)?.name === 'Mage' ? '100' : '50'} MP</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        className="h-full rounded-full bg-blue-500" 
                      />
                    </div>
                  </div>

                  <div className="rounded-lg bg-secondary/50 p-4 border border-border/50">
                    <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Passive Ability</h4>
                    <p className="text-xs italic">
                      {selectedClass 
                        ? `Expertise in ${CLASSES.find(c => c.id === selectedClass)?.language} grants unique buffs to coding challenges.`
                        : 'Select a class to reveal unique abilities.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
