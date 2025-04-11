"use server"

import { Button } from "@/components/ui/button"
import { Footer } from "@/components/ui/footer"
import { SignUpButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import {
  Brain,
  History,
  Sparkles,
  ArrowRight,
  Star,
  Play,
  Heart,
  Code2,
  Key,
  Infinity,
  Github
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { VideoPlayer } from "@/components/ui/video-player"
import { RevealAnimation } from "@/components/ui/reveal-animation"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Yoga Instructor",
    image: "/testimonials/sarah.jpg",
    content:
      "SoulSooth has transformed how I approach mindfulness. The personalized sessions are incredibly effective.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    image: "/testimonials/michael.jpg",
    content:
      "As someone with a busy schedule, having AI-guided meditation sessions has been a game-changer.",
    rating: 5
  },
  {
    name: "Emma Davis",
    role: "Mental Health Advocate",
    image: "/testimonials/emma.jpg",
    content:
      "The quality of meditation scripts and voice guidance is exceptional. Highly recommended!",
    rating: 5
  }
]

const howItWorks = [
  {
    title: "Share Your State",
    description: "Tell us how you're feeling and what you'd like to focus on",
    icon: Heart,
    color: "bg-pink-500/10 text-pink-500",
    gradient: "hover:border-pink-500/50 hover:bg-pink-50/50"
  },
  {
    title: "AI Generation",
    description:
      "Our AI creates a personalized meditation script and voice guidance",
    icon: Brain,
    color: "bg-blue-500/10 text-blue-500",
    gradient: "hover:border-blue-500/50 hover:bg-blue-50/50"
  },
  {
    title: "Start Meditating",
    description:
      "Follow along with your custom meditation session and let the calming guidance lead you",
    icon: Play,
    color: "bg-green-500/10 text-green-500",
    gradient: "hover:border-green-500/50 hover:bg-green-50/50"
  }
]

const features = [
  {
    title: "Free to Try",
    description:
      "Get 3 free meditation credits when you sign up. No API key needed to start",
    icon: Infinity,
    color: "bg-orange-500/10 text-orange-500",
    gradient: "hover:border-orange-500/50 hover:bg-orange-50/50"
  },
  {
    title: "Open Source",
    description:
      "Built in public, free forever. Join our community and help shape the future",
    icon: Code2,
    color: "bg-pink-500/10 text-pink-500",
    gradient: "hover:border-pink-500/50 hover:bg-pink-50/50"
  },
  {
    title: "AI-Powered Meditation",
    description:
      "Personalized meditation scripts and soothing AI voice guidance",
    icon: Brain,
    color: "bg-blue-500/10 text-blue-500",
    gradient: "hover:border-blue-500/50 hover:bg-blue-50/50"
  },
  {
    title: "Voice Generation",
    description:
      "Natural-sounding AI voices create a calming meditation experience",
    icon: Sparkles,
    color: "bg-violet-500/10 text-violet-500",
    gradient: "hover:border-violet-500/50 hover:bg-violet-50/50"
  },
  {
    title: "Progress Tracking",
    description:
      "Track your meditation journey and replay your favorite sessions",
    icon: History,
    color: "bg-emerald-500/10 text-emerald-500",
    gradient: "hover:border-emerald-500/50 hover:bg-emerald-50/50"
  },
  {
    title: "Bring Your Own Key",
    description:
      "Connect your OpenAI API key for unlimited meditation sessions",
    icon: Key,
    color: "bg-yellow-500/10 text-yellow-500",
    gradient: "hover:border-yellow-500/50 hover:bg-yellow-50/50"
  }
]

export default async function LandingPage() {
  const { userId } = await auth()

  return (
    <>
      <div className="container">
        {/* Hero Section */}
        <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
          <div className="relative z-10 py-12">
            <div className="text-center">
              <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl lg:text-6xl">
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  SoulSooth
                </span>
              </h1>
              <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
                Your personal AI meditation guide - completely free. Share your
                emotional state and let SoulSooth create a custom meditation
                experience with personalized scripts and soothing audio
                guidance.
              </p>
              {userId ? (
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="gap-2 bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-4 text-base"
                  >
                    <Link href="/meditate">
                      <Brain className="size-4" />
                      Start Meditating
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="gap-2 px-5 py-4 text-base"
                  >
                    <Link href="/dashboard">
                      <History className="size-4" />
                      View History
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <SignUpButton mode="modal">
                    <Button
                      size="lg"
                      className="gap-2 bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-4 text-base"
                    >
                      <Sparkles className="size-4" />
                      Get 3 Free Sessions
                      <ArrowRight className="size-4" />
                    </Button>
                  </SignUpButton>
                </div>
              )}
              <p className="text-muted-foreground mt-4 text-sm">
                No credit card required. Just bring your OpenAI API key.
              </p>
            </div>
          </div>

          {/* Enhanced Background decoration */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-[500px] w-[900px] rounded-full bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-violet-500/20 blur-3xl" />
            </div>
            <div className="absolute left-1/2 top-0 -translate-x-1/2">
              <div className="h-[400px] w-[800px] rounded-full bg-gradient-to-r from-blue-400/10 to-violet-400/10 blur-2xl" />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12">
          <RevealAnimation>
            <div className="text-center">
              <h2 className="mb-2 text-3xl font-bold sm:text-4xl">
                How It Works
              </h2>
              <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
                Get started with SoulSooth in three simple steps
              </p>
            </div>
          </RevealAnimation>

          <div className="relative">
            {/* Connection Lines */}
            <div className="absolute inset-x-0 top-1/2 -z-10 hidden -translate-y-1/2 lg:block">
              <div className="flex h-1 w-full items-center justify-between space-x-4">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-gray-200" />
                <div className="h-px w-full bg-gradient-to-r from-gray-200 to-transparent" />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {howItWorks.map((step, index) => {
                const Icon = step.icon
                return (
                  <RevealAnimation key={index} delay={index * 0.2}>
                    <div
                      className={`group relative rounded-xl border bg-white p-6 shadow-sm transition-all duration-300 ${step.gradient}`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex size-14 items-center justify-center rounded-xl ${step.color}`}
                        >
                          <Icon className="size-7" />
                        </div>
                        <div className="flex size-7 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600">
                          {index + 1}
                        </div>
                      </div>

                      <div className="mt-4">
                        <h3 className="mb-2 text-xl font-semibold">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {step.description}
                        </p>
                      </div>

                      {/* Mobile-only divider */}
                      {index < howItWorks.length - 1 && (
                        <div className="my-6 block border-b lg:hidden" />
                      )}

                      {/* Desktop arrow */}
                      {index < howItWorks.length - 1 && (
                        <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 lg:block">
                          <div className="flex size-6 items-center justify-center rounded-full bg-gray-100">
                            <ArrowRight className="size-3 text-gray-400" />
                          </div>
                        </div>
                      )}
                    </div>
                  </RevealAnimation>
                )
              })}
            </div>
          </div>
        </section>

        {/* Example Meditations Section */}
        <section className="py-12">
          <RevealAnimation>
            <div className="text-center">
              <h2 className="mb-3 text-3xl font-bold sm:text-4xl">
                Example Meditations
              </h2>
              <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-lg">
                Watch how SoulSooth creates personalized meditation experiences
              </p>
            </div>
          </RevealAnimation>

          <div className="grid gap-8 sm:grid-cols-2">
            <RevealAnimation delay={0.2}>
              <VideoPlayer
                title="Relationship Meditation"
                description="Had a minor disagreement with my partner and feeling a bit unsettled"
                src="/examples/relationship-meditation.mp4"
                poster="/examples/relationship-meditation-poster.jpg"
              />
            </RevealAnimation>

            <RevealAnimation delay={0.4}>
              <VideoPlayer
                title="Presentation Meditation"
                description="I have a team presentation in 30 minutes and feeling slightly nervous"
                src="/examples/presentation-meditation.mp4"
                poster="/examples/presentation-meditation-poster.jpg"
              />
            </RevealAnimation>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12">
          <RevealAnimation>
            <div className="text-center">
              <h2 className="mb-3 text-3xl font-bold sm:text-4xl">
                Powerful Features
              </h2>
              <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-lg">
                Everything you need for a personalized meditation experience
              </p>
            </div>
          </RevealAnimation>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <RevealAnimation key={index} delay={index * 0.1}>
                  <div
                    className={`group relative rounded-xl border bg-white p-6 shadow-sm transition-all duration-300 ${feature.gradient}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex size-14 items-center justify-center rounded-xl ${feature.color}`}
                      >
                        <Icon className="size-7" />
                      </div>
                    </div>

                    <div className="mt-4">
                      <h3 className="mb-2 text-xl font-semibold">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </RevealAnimation>
              )
            })}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12">
          <RevealAnimation>
            <div className="text-center">
              <h2 className="mb-3 text-3xl font-bold sm:text-4xl">
                What Our Users Say
              </h2>
              <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-lg">
                Join thousands of people who have transformed their meditation
                practice with SoulSooth
              </p>
            </div>
          </RevealAnimation>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <RevealAnimation key={index} delay={index * 0.2}>
                <div className="group relative rounded-lg border p-6 transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg">
                  <div className="mb-4 flex items-center gap-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground">{testimonial.content}</p>
                </div>
              </RevealAnimation>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
