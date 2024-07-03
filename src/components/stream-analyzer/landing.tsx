/**
 * v0 by Vercel.
 * @see https://v0.dev/t/8yQw92WKp4a
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"

// export default function Component() {
//   return (
//     <div className="flex flex-col min-h-dvh bg-gray-900 text-white">
//       <header className="relative overflow-hidden">
//         <div className="absolute inset-0 bg-black opacity-50">
//           <div className="h-full w-full animate-pulse bg-gradient-to-br from-indigo-600 to-purple-600 opacity-20 blur-3xl" />
//         </div>
//         <div className="relative z-10 px-4 py-12 md:px-6 lg:py-20 xl:py-24">
//           <div className="mx-auto max-w-2xl text-center">
//             <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-bebas text-transparent bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text">
//               Unlock the Power of Your Gaming Tutorials
//             </h1>
//             <p className="mt-4 text-lg text-gray-300 sm:mt-6 sm:text-xl md:mt-8 md:text-2xl font-roboto">
//               Turn your YouTube videos into professional, SEO-optimized written guides - effortlessly.
//             </p>
//             <div className="mt-8 sm:mt-10">
//               <Link
//                 href="/guidecraft/create"
//                 className="inline-flex h-10 items-center justify-center rounded-md bg-indigo-500 px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative before:absolute before:-inset-1 before:-skew-y-3 before:bg-gradient-to-r before:from-indigo-500 before:to-pink-500 before:rounded-md before:blur-sm before:opacity-50"
//                 prefetch={false}
//               >
//                 Get Started Today
//               </Link>
//             </div>
//           </div>
//         </div>
//       </header>
//       <main className="flex-1">
//         {/* <section className="py-12 md:py-16 lg:py-20 xl:py-24">
//           <div className="container mx-auto px-4 md:px-6">
//             <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
//               <div>
//                 <div className="space-y-6">
//                   <div className="flex items-start gap-4">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-500">
//                       <ClockIcon className="h-6 w-6" />
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-bold font-montserrat">Time-Saving</h3>
//                       <p className="text-gray-300 font-roboto">
//                         Transform your videos into written guides in minutes, not hours. Our platform streamlines the
//                         process, saving you valuable time and effort.
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-start gap-4">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-500">
//                       <RecycleIcon className="h-6 w-6" />
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-bold font-montserrat">Content Repurposing</h3>
//                       <p className="text-gray-300 font-roboto">
//                         Maximize the value of your existing YouTube videos by repurposing them into professional written
//                         guides, reaching a broader audience and increasing engagement.
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-start gap-4">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-500">
//                       <RocketIcon className="h-6 w-6" />
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-bold font-montserrat">SEO Optimization</h3>
//                       <p className="text-gray-300 font-roboto">
//                         Our platform ensures that your written guides are optimized for search engines, boosting your
//                         visibility and helping you reach more gamers.
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-start gap-4">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-500">
//                       <BriefcaseIcon className="h-6 w-6" />
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-bold font-montserrat">Professional Quality</h3>
//                       <p className="text-gray-300 font-roboto">
//                         Elevate your content with sleek, modern written guides that match the professional quality of
//                         your YouTube videos, enhancing your brand and credibility.
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-start gap-4">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-500">
//                       <SmileIcon className="h-6 w-6" />
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-bold font-montserrat">User-Friendly Experience</h3>
//                       <p className="text-gray-300 font-roboto">
//                         Our platform is designed to be intuitive and user-friendly, ensuring a seamless experience from
//                         start to finish, even for those without technical expertise.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div>
//                 <img src="/placeholder.svg" width="640" height="360" alt="Interface Demo" className="rounded-lg" />
//                 <div className="mt-4 flex justify-center">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="aspect-video rounded-lg bg-gray-800 p-2">
//                       <img
//                         src="/placeholder.svg"
//                         width="320"
//                         height="180"
//                         alt="Interface Demo"
//                         className="rounded-lg"
//                       />
//                     </div>
//                     <div className="aspect-video rounded-lg bg-gray-800 p-2">
//                       <img
//                         src="/placeholder.svg"
//                         width="320"
//                         height="180"
//                         alt="Interface Demo"
//                         className="rounded-lg"
//                       />
//                     </div>
//                     <div className="aspect-video rounded-lg bg-gray-800 p-2">
//                       <img
//                         src="/placeholder.svg"
//                         width="320"
//                         height="180"
//                         alt="Interface Demo"
//                         className="rounded-lg"
//                       />
//                     </div>
//                     <div className="aspect-video rounded-lg bg-gray-800 p-2">
//                       <img
//                         src="/placeholder.svg"
//                         width="320"
//                         height="180"
//                         alt="Interface Demo"
//                         className="rounded-lg"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section> */}
//         <section className="bg-gray-800 py-12 md:py-16 lg:py-20 xl:py-24">
//           <div className="container mx-auto px-4 md:px-6">
//             <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
//               <div>
//                 <h2 className="text-3xl font-extrabold tracking-tighter sm:text-4xl md:text-5xl font-montserrat">
//                   Testimonials & Success Stories
//                 </h2>
//                 <div className="mt-8">
//                   <Carousel>
//                     <CarouselContent>
//                       <CarouselItem>
//                         <div className="rounded-lg bg-gray-700 p-6">
//                           <div className="flex items-start gap-4">
//                             <Avatar className="h-10 w-10">
//                               <AvatarImage src="/placeholder-user.jpg" />
//                               <AvatarFallback>JD</AvatarFallback>
//                             </Avatar>
//                             <div>
//                               <h3 className="text-lg font-bold font-montserrat">John Doe</h3>
//                               <p className="text-gray-300 font-roboto">Gamer and Content Creator</p>
//                             </div>
//                           </div>
//                           <p className="mt-4 text-gray-300 font-roboto">
//                             "Guides for Gamers has been a game-changer for my channel. The platform makes it so easy to
//                             transform my YouTube videos into professional-looking guides that rank higher in search
//                             results."
//                           </p>
//                         </div>
//                       </CarouselItem>
//                       <CarouselItem>
//                         <div className="rounded-lg bg-gray-700 p-6">
//                           <div className="flex items-start gap-4">
//                             <Avatar className="h-10 w-10">
//                               <AvatarImage src="/placeholder-user.jpg" />
//                               <AvatarFallback>JA</AvatarFallback>
//                             </Avatar>
//                             <div>
//                               <h3 className="text-lg font-bold font-montserrat">Jane Appleseed</h3>
//                               <p className="text-gray-300 font-roboto">Avid Gamer and Reviewer</p>
//                             </div>
//                           </div>
//                           <p className="mt-4 text-gray-300 font-roboto">
//                             "I love how Guides for Gamers makes it easy to create professional-looking content without
//                             any technical skills. The platform is intuitive and the results are amazing."
//                           </p>
//                         </div>
//                       </CarouselItem>
//                     </CarouselContent>
//                     <CarouselPrevious />
//                     <CarouselNext />
//                   </Carousel>
//                 </div>
//               </div>
//               <div>
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-2">
//                     <CheckIcon className="h-6 w-6 text-indigo-500" />
//                     <h3 className="text-lg font-bold font-montserrat">Over 10,000 guides generated</h3>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <CheckIcon className="h-6 w-6 text-indigo-500" />
//                     <h3 className="text-lg font-bold font-montserrat">Users report a 50% increase in traffic</h3>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <CheckIcon className="h-6 w-6 text-indigo-500" />
//                     <h3 className="text-lg font-bold font-montserrat">Improved SEO rankings for 90% of users</h3>
//                   </div>
//                 </div>
//                 <img src="/placeholder.svg" width="640" height="360" alt="Testimonial Demo" className="rounded-lg" />
//               </div>
//             </div>
//           </div>
//         </section>
//         {/* <section className="py-12 md:py-16 lg:py-20 xl:py-24">
//           <div className="container mx-auto px-4 md:px-6">
//             <div className="mx-auto max-w-2xl text-center">
//               <h2 className="text-3xl font-extrabold tracking-tighter sm:text-4xl md:text-5xl font-montserrat">
//                 Get Started Today
//               </h2>
//               <p className="mt-4 text-lg text-gray-300 sm:mt-6 sm:text-xl md:mt-8 font-roboto">
//                 Simply enter the URL of your YouTube video, and we'll handle the rest.
//               </p>
//               <form className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:gap-2">
//                 <Input
//                   type="text"
//                   placeholder="Enter YouTube URL"
//                   className="flex-1 rounded-md bg-gray-800 px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-roboto"
//                 />
//                 <Button
//                   type="submit"
//                   className="inline-flex h-10 items-center justify-center rounded-md bg-indigo-500 px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
//                 >
//                   Submit
//                 </Button>
//               </form>
//             </div>
//           </div>
//         </section> */}
//         <section className="py-12 md:py-16 lg:py-20 xl:py-24">
//           <div className="container mx-auto px-4 md:px-6">
//             <div className="text-center">
//               <h2 className="text-3xl font-extrabold tracking-tighter sm:text-4xl md:text-5xl font-montserrat">
//                 Why Choose Guides for Gamers?
//               </h2>
//             </div>
//             <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
//               <div className="flex flex-col items-center text-center">
//                 <div className="flex h-16 w-16 items-center justify-center rounded-md bg-indigo-500">
//                   <ClockIcon className="h-8 w-8" />
//                 </div>
//                 <h3 className="mt-4 text-lg font-bold font-montserrat">Save Countless Hours</h3>
//                 <p className="mt-2 text-gray-300 font-roboto">
//                   Transform your videos into written guides in minutes, not hours. Our platform streamlines the process,
//                   saving you valuable time and effort.
//                 </p>
//               </div>
//               <div className="flex flex-col items-center text-center">
//                 <div className="flex h-16 w-16 items-center justify-center rounded-md bg-indigo-500">
//                   <RecycleIcon className="h-8 w-8" />
//                 </div>
//                 <h3 className="mt-4 text-lg font-bold font-montserrat">Repurpose Your Video Content</h3>
//                 <p className="mt-2 text-gray-300 font-roboto">
//                   Maximize the value of your existing YouTube videos by repurposing them into professional written
//                   guides, reaching a broader audience and increasing engagement.
//                 </p>
//               </div>
//               <div className="flex flex-col items-center text-center">
//                 <div className="flex h-16 w-16 items-center justify-center rounded-md bg-indigo-500">
//                   <RocketIcon className="h-8 w-8" />
//                 </div>
//                 <h3 className="mt-4 text-lg font-bold font-montserrat">Rank Higher on Google</h3>
//                 <p className="mt-2 text-gray-300 font-roboto">
//                   Our platform ensures that your written guides are optimized for search engines, boosting your
//                   visibility and helping you reach more gamers.
//                 </p>
//               </div>
//               <div className="flex flex-col items-center text-center">
//                 <div className="flex h-16 w-16 items-center justify-center rounded-md bg-indigo-500">
//                   <BriefcaseIcon className="h-8 w-8" />
//                 </div>
//                 <h3 className="mt-4 text-lg font-bold font-montserrat">Professional-Grade Quality</h3>
//                 <p className="mt-2 text-gray-300 font-roboto">
//                   Elevate your content with sleek, modern written guides that match the professional quality of your
//                   YouTube videos, enhancing your brand and credibility.
//                 </p>
//               </div>
//               <div className="flex flex-col items-center text-center">
//                 <div className="flex h-16/></div></div></div></section></main></div>); }/></></></></></></>);&#xA;}&#xA;" />
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   )
// }

export default function Component() {
  return (
    <div className="flex flex-col min-h-dvh bg-gray-900 text-white">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50">
          <div className="h-full w-full animate-pulse bg-gradient-to-br from-indigo-600 to-purple-600 opacity-20 blur-3xl" />
        </div>
        <div className="relative z-10 px-4 py-12 md:px-6 lg:py-20 xl:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-bebas text-transparent bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text">
              Enhance Your Twitch Streams with AI
            </h1>
            <p className="mt-4 text-lg text-gray-300 sm:mt-6 sm:text-xl md:mt-8 md:text-2xl font-roboto">
              Automatically analyze your Twitch VODs and highlight key moments effortlessly.
            </p>
            <div className="mt-8 sm:mt-10">
              <Link
                href="/stream-analyzer/create"
                className="inline-flex h-10 items-center justify-center rounded-md bg-indigo-500 px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative before:absolute before:-inset-1 before:-skew-y-3 before:bg-gradient-to-r before:from-indigo-500 before:to-pink-500 before:rounded-md before:blur-sm before:opacity-50"
                prefetch={false}
              >
                Get Started Today
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-white">How It Works</h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <BriefcaseIcon className="w-12 h-12 text-indigo-500" />
                <h3 className="mt-4 text-xl font-semibold text-white">Upload Your VOD</h3>
                <p className="mt-2 text-gray-300 text-center">Easily upload your Twitch VOD for analysis.</p>
              </div>
              <div className="flex flex-col items-center">
                <RocketIcon className="w-12 h-12 text-indigo-500" />
                <h3 className="mt-4 text-xl font-semibold text-white">AI Analysis</h3>
                <p className="mt-2 text-gray-300 text-center">Our AI scans your video to find the most exciting moments.</p>
              </div>
              <div className="flex flex-col items-center">
                <SmileIcon className="w-12 h-12 text-indigo-500" />
                <h3 className="mt-4 text-xl font-semibold text-white">Get Highlights</h3>
                <p className="mt-2 text-gray-300 text-center">Receive a summary of key moments to share with your audience.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function BriefcaseIcon(props: any) {
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
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  )
}


function CheckIcon(props: any) {
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}


function ClockIcon(props: any) {
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
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


function RocketIcon(props: any) {
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
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  )
}


function SmileIcon(props: any) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  )
}