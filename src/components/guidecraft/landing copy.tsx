/**
 * v0 by Vercel.
 * @see https://v0.dev/t/K6wtsGeQ1ip
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel"


export default function Component() {
  return (
    <div className="flex flex-col min-h-dvh">
      <header className="w-full bg-[#1a1a1a] py-6 px-4 md:px-6">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <LogInIcon className="h-8 w-8 text-[#ff6b6b]" />
            <span className="text-xl font-bold text-white">GuideCraft</span>
          </Link>
          <nav className="hidden space-x-4 md:flex">
            <Link href="#" className="text-sm font-medium text-gray-400 hover:text-white" prefetch={false}>
              Features
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-400 hover:text-white" prefetch={false}>
              Pricing
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-400 hover:text-white" prefetch={false}>
              About
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-400 hover:text-white" prefetch={false}>
              Contact
            </Link>
          </nav>
          <Button className="relative overflow-hidden rounded-lg bg-gradient-to-r from-[#ff6b6b] to-[#ff3c3c] px-6 py-3 text-lg font-semibold text-white shadow-lg shadow-[#ff6b6b]/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#ff6b6b]/70">
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-[url('/gaming-background.jpg')] bg-cover bg-center blur-sm opacity-20" />
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full bg-[#1a1a1a] py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                Craft Perfect Gaming Guides Effortlessly with GuideCraft
              </h1>
              <p className="mt-4 text-lg text-gray-400">
                Transform your gaming content into polished, SEO-optimized guides with just a few clicks.
              </p>
              <div className="mt-8">
              <Button className="relative overflow-hidden rounded-lg bg-gradient-to-r from-[#ff6b6b] to-[#ff3c3c] px-6 py-3 text-lg font-semibold text-white shadow-lg shadow-[#ff6b6b]/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#ff6b6b]/70">
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-[url('/gaming-background.jpg')] bg-cover bg-center blur-sm opacity-20" />
          </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full bg-white py-20 md:py-32">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center gap-4">
                <TimerIcon className="h-12 w-12 text-[#ff6b6b]" />
                <h3 className="text-xl font-bold text-[#1a1a1a]">Save Countless Hours</h3>
                <p className="text-gray-500">
                  GuideCraft simplifies the guide creation process, saving you countless hours of manual work. With our
                  automated system, you can effortlessly transform your video content into polished, SEO-optimized
                  guides.
                </p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <RecycleIcon className="h-12 w-12 text-[#ff6b6b]" />
                <h3 className="text-xl font-bold text-[#1a1a1a]">Repurpose Your Video Content</h3>
                <p className="text-gray-500">
                  Breathe new life into your existing videos by transforming them into engaging, SEO-optimized guides.
                  GuideCraft converts your video content into detailed blog posts, expanding your reach and maximizing
                  your content's potential.
                </p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <SearchCodeIcon className="h-12 w-12 text-[#ff6b6b]" />
                <h3 className="text-xl font-bold text-[#1a1a1a]">Rank Higher on Google</h3>
                <p className="text-gray-500">
                  Ensure your guides are discoverable and rank higher in search results with our advanced SEO
                  optimization. GuideCraft optimizes your content for better rankings, driving more organic traffic to
                  your site.
                </p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <QrCodeIcon className="h-12 w-12 text-[#ff6b6b]" />
                <h3 className="text-xl font-bold text-[#1a1a1a]">Professional-Grade Quality</h3>
                <p className="text-gray-500">
                  Elevate your content with our sleek, modern design templates and high-quality formatting. The guides
                  produced by GuideCraft are polished and cohesive, ensuring a professional and engaging experience for
                  your audience.
                </p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <FlagIcon className="h-12 w-12 text-[#ff6b6b]" />
                <h3 className="text-xl font-bold text-[#1a1a1a]">User-Friendly Experience</h3>
                <p className="text-gray-500">
                  Our intuitive platform makes it easy for anyone to create professional-looking gaming guides. With a
                  user-friendly design and simple workflow, GuideCraft streamlines the guide creation process, allowing
                  you to focus on your content.
                </p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <StepBackIcon className="h-12 w-12 text-[#ff6b6b]" />
                <h3 className="text-xl font-bold text-[#1a1a1a]">Step-by-Step Guides</h3>
                <p className="text-gray-500">
                  Our guides are designed to be easy to follow, with clear step-by-step instructions and visual aids.
                  Whether you're a beginner or an experienced gamer, our guides will help you master any game or
                  challenge.
                </p>
              </div>
            </div>
          </div>
          {/* <div className="mt-8">
            <div className="relative h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div className="absolute h-full w-1/2 rounded-full bg-gradient-to-r from-[#ff6b6b] to-[#ff3c3c] animate-pulse" />
            </div>
          </div> */}
        </section>
        {/* <section className="w-full bg-[#ff6b6b] py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                Get Started Today
              </h2>
              <p className="mt-4 text-lg text-white">Transform your gaming videos into SEO-optimized guides.</p>
              <div className="mt-8">
              <Button className="relative overflow-hidden rounded-lg bg-gradient-to-r from-[#000000] to-[#050000] px-6 py-3 text-lg font-semibold text-white shadow-lg shadow-[#ff6b6b]/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#ff6b6b]/70">
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-[url('/gaming-background.jpg')] bg-cover bg-center blur-sm opacity-20" />
          </Button>
              </div>
            </div>
          </div>
        </section> */}
        {/* <section className="w-full bg-white py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-5xl">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-[#1a1a1a] sm:text-4xl md:text-5xl">
                    Trusted by Creators
                  </h2>
                  <p className="mt-4 text-gray-500">
                    GuideCraft has helped thousands of gaming creators streamline their content production and reach new
                    audiences.
                  </p>
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-4">
                      <img
                        src="/placeholder.svg"
                        width="40"
                        height="40"
                        alt="Avatar"
                        className="h-10 w-10 rounded-full"
                      />
                      <div>
                        <h4 className="text-lg font-bold text-[#1a1a1a]">John Doe</h4>
                        <p className="text-gray-500">Gaming Creator</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-4">
                      <img
                        src="/placeholder.svg"
                        width="40"
                        height="40"
                        alt="Avatar"
                        className="h-10 w-10 rounded-full"
                      />
                      <div>
                        <h4 className="text-lg font-bold text-[#1a1a1a]">Jane Smith</h4>
                        <p className="text-gray-500">Gaming Creator</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-4">
                      <img
                        src="/placeholder.svg"
                        width="40"
                        height="40"
                        alt="Avatar"
                        className="h-10 w-10 rounded-full"
                      />
                      <div>
                        <h4 className="text-lg font-bold text-[#1a1a1a]">Bob Johnson</h4>
                        <p className="text-gray-500">Gaming Creator</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-4">
                      <img
                        src="/placeholder.svg"
                        width="40"
                        height="40"
                        alt="Avatar"
                        className="h-10 w-10 rounded-full"
                      />
                      <div>
                        <h4 className="text-lg font-bold text-[#1a1a1a]">Emily Davis</h4>
                        <p className="text-gray-500">Gaming Creator</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <BarChart className="w-full aspect-[3/2]" />
                </div>
              </div>
            </div>
          </div>
        </section> */}
        {/* <section className="w-full bg-gray-100 py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-[#1a1a1a] sm:text-4xl md:text-5xl">
                What Our Customers Say
              </h2>
              <p className="mt-4 text-gray-500">
                Hear from some of our satisfied customers about their experience with GuideCraft.
              </p>
            </div>
            <div className="mt-8">
              <Carousel className="w-full max-w-4xl mx-auto">
                <CarouselContent>
                  <CarouselItem>
                    <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-lg shadow-md">
                      <img
                        src="/placeholder.svg"
                        width="80"
                        height="80"
                        alt="Avatar"
                        className="h-20 w-20 rounded-full"
                      />
                      <h3 className="text-xl font-bold text-[#1a1a1a]">John Doe</h3>
                      <p className="text-gray-500">
                        "GuideCraft has been a game-changer for my content creation process. The guides they generate
                        are\n professional, engaging, and SEO-optimized, which has helped me attract more viewers and
                        grow my\n audience."
                      </p>
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-lg shadow-md">
                      <img
                        src="/placeholder.svg"
                        width="80"
                        height="80"
                        alt="Avatar"
                        className="h-20 w-20 rounded-full"
                      />
                      <h3 className="text-xl font-bold text-[#1a1a1a]">Jane Smith</h3>
                      <p className="text-gray-500">
                        "I was skeptical at first, but GuideCraft has exceeded my expectations. The step-by-step
                        guides\n they create are easy to follow and have helped my viewers understand complex game
                        mechanics with\n ease."
                      </p>
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-lg shadow-md">
                      <img
                        src="/placeholder.svg"
                        width="80"
                        height="80"
                        alt="Avatar"
                        className="h-20 w-20 rounded-full"
                      />
                      <h3 className="text-xl font-bold text-[#1a1a1a]">Bob Johnson</h3>
                      <p className="text-gray-500">
                        "As a busy content creator, GuideCraft has been a lifesaver. I can now focus on creating great\n
                        video content while they handle the guide creation process. The SEO optimization has also
                        helped\n me rank higher on Google, driving more traffic to my site."
                      </p>
                    </div>
                  </CarouselItem>
                </CarouselContent>
                <div />
              </Carousel>
            </div>
          </div>
        </section> */}
      </main>
    </div>
  )
}


function FlagIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" x2="4" y1="22" y2="15" />
    </svg>
  )
}


function LogInIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" x2="3" y1="12" y2="12" />
    </svg>
  )
}


function QrCodeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="5" height="5" x="3" y="3" rx="1" />
      <rect width="5" height="5" x="16" y="3" rx="1" />
      <rect width="5" height="5" x="3" y="16" rx="1" />
      <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
      <path d="M21 21v.01" />
      <path d="M12 7v3a2 2 0 0 1-2 2H7" />
      <path d="M3 12h.01" />
      <path d="M12 3h.01" />
      <path d="M12 16v.01" />
      <path d="M16 12h1" />
      <path d="M21 12v.01" />
      <path d="M12 21v-1" />
    </svg>
  )
}


function RecycleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
      <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
      <path d="m14 16-3 3 3 3" />
      <path d="M8.293 13.596 7.196 9.5 3.1 10.598" />
      <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843" />
      <path d="m13.378 9.633 4.096 1.098 1.097-4.096" />
    </svg>
  )
}


function SearchCodeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m13 13.5 2-2.5-2-2.5" />
      <path d="m21 21-4.3-4.3" />
      <path d="M9 8.5 7 11l2 2.5" />
      <circle cx="11" cy="11" r="8" />
    </svg>
  )
}


function StepBackIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" x2="18" y1="20" y2="4" />
      <polygon points="14,20 4,12 14,4" />
    </svg>
  )
}


function TimerIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="10" x2="14" y1="2" y2="2" />
      <line x1="12" x2="15" y1="14" y2="11" />
      <circle cx="12" cy="14" r="8" />
    </svg>
  )
}