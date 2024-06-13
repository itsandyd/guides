import { InitialForm } from "@/components/admin/initialForm";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";


export default async function CreatePage() {
    return (
      <div className="bg-[#1a1a1a] text-white w-full min-h-screen flex flex-col items-center py-12 md:py-16 lg:py-20">
        <div className="space-y-6 w-full max-w-4xl px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">Submit Your YouTube URL</h1>
            <p className="mt-3 text-gray-500 dark:text-gray-400 text-lg md:text-xl">
              Effortlessly convert your video tutorials into polished written guides.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-950 rounded-lg shadow-lg p-6 md:p-8 lg:p-10 space-y-6 flex items-center justify-center">
            <InitialForm />
          </div>
        </div>
      </div>
    );
  }

// return (
//     <div className="w-full max-w-5xl mx-auto py-12 md:py-16 lg:py-20">
//       <div className="space-y-6">
//         <div className="text-center">
//           <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">Submit Your YouTube URL</h1>
//           <p className="mt-3 text-gray-500 dark:text-gray-400 text-lg md:text-xl">
//             Effortlessly convert your video tutorials into polished written guides.
//           </p>
//         </div>
//         <div className="bg-white dark:bg-gray-950 rounded-lg shadow-lg p-6 md:p-8 lg:p-10 space-y-6 relative flex items-center justify-center">
//           {/* <div className="absolute top-0 left-0 w-full h-full opacity-10">
//             <img
//               src="/placeholder.svg"
//               alt="Guide-themed graphic"
//               width={500}
//               height={500}
//               className="object-cover object-center"
//             />
//           </div> */}
//           {/* <div className="flex flex-col items-center space-y-4 z-10">
//             <Input
//               type="text"
//               placeholder="Enter your YouTube video URL here..."
//               className="flex-1 h-12 px-4 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 w-full max-w-xl"
//             />
//             <div className="text-red-500 text-sm hidden">Please enter a valid YouTube URL.</div>
//             <Button
//               type="submit"
//               className="inline-flex items-center justify-center h-12 px-6 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
//             >
//               Generate My Guide
//             </Button>
//           </div>
//           <div className="space-y-4 z-10">
//             <div className="flex items-center space-x-2">
//               <div className="h-2 bg-blue-500 rounded-full flex-1" />
//               <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Transcribing Video...</div>
//             </div>
//             <div className="flex items-center space-x-2">
//               <div className="h-2 bg-blue-500 rounded-full flex-1" />
//               <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Optimizing for SEO...</div>
//             </div>
//             <div className="flex items-center space-x-2">
//               <div className="h-2 bg-blue-500 rounded-full flex-1" />
//               <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Finalizing Guide...</div>
//             </div>
//           </div>
//           <div className="text-center z-10">
//             <div className="inline-flex items-center justify-center h-12 px-6 rounded-md bg-green-500 text-white font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950">
//               <CheckIcon className="mr-2 h-5 w-5" />
//               View Your Guide
//             </div>
//             <div className="mt-4 space-x-4">
//               <Button
//                 variant="outline"
//                 className="inline-flex items-center justify-center h-12 px-6 rounded-md border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
//               >
//                 Start New
//               </Button>
//               <Button
//                 variant="outline"
//                 className="inline-flex items-center justify-center h-12 px-6 rounded-md border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
//               >
//                 <ShareIcon className="mr-2 h-5 w-5" />
//                 Share
//               </Button>
//             </div> */}
//           {/* </div> */}
//           <InitialForm />
//         </div>
//         {/* <div className="space-y-6">
//           <div>
//             <h2 className="text-2xl font-bold mb-4">How It Works</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="flex items-center space-x-4">
//                 <div className="bg-blue-500 rounded-full p-2">
//                   <UploadIcon className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold">Submit URL</h3>
//                   <p className="text-gray-500 dark:text-gray-400 text-sm">
//                     Paste your YouTube video URL to get started.
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-4">
//                 <div className="bg-blue-500 rounded-full p-2">
//                   <CopyIcon className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold">Transcribe Video</h3>
//                   <p className="text-gray-500 dark:text-gray-400 text-sm">Our AI transcribes the audio into text.</p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-4">
//                 <div className="bg-blue-500 rounded-full p-2">
//                   <MaximizeIcon className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold">Optimize for SEO</h3>
//                   <p className="text-gray-500 dark:text-gray-400 text-sm">The guide is optimized for search engines.</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold mb-4">Benefits</h2>
//             <ul className="list-disc list-inside space-y-2">
//               <li>
//                 <span className="font-semibold">Time-saving:</span> Convert videos to guides in minutes.
//               </li>
//               <li>
//                 <span className="font-semibold">SEO-optimized:</span> Guides are optimized for search engines.
//               </li>
//               <li>
//                 <span className="font-semibold">Professional quality:</span> Get polished, well-formatted guides.
//               </li>
//               <li>
//                 <span className="font-semibold">Repurpose content:</span> Turn videos into evergreen written content.
//               </li>
//             </ul>
//           </div>
//         </div> */}
//       </div>
//       {/* <footer className="py-6 border-t">
//         <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
//           <nav className="flex space-x-4 mb-4 md:mb-0">
//             <Link
//               href="#"
//               className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
//               prefetch={false}
//             >
//               Home
//             </Link>
//             <Link
//               href="#"
//               className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
//               prefetch={false}
//             >
//               FAQs
//             </Link>
//             <Link
//               href="#"
//               className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
//               prefetch={false}
//             >
//               Support
//             </Link>
//           </nav>
//           <div className="flex space-x-4 mb-4 md:mb-0">
//             <Link
//               href="#"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
//               prefetch={false}
//             >
//               <TwitterIcon className="w-6 h-6" />
//             </Link>
//             <Link
//               href="#"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
//               prefetch={false}
//             >
//               <FacebookIcon className="w-6 h-6" />
//             </Link>
//             <Link
//               href="#"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
//               prefetch={false}
//             >
//               <InstagramIcon className="w-6 h-6" />
//             </Link>
//           </div>
//           <div className="mt-4 md:mt-0 text-sm text-gray-500 dark:text-gray-400">
//             &copy; 2024 Your Company. All rights reserved.{" "}
//             <Link href="#" className="underline" prefetch={false}>
//               Terms of Service
//             </Link>{" "}
//             and{" "}
//             <Link href="#" className="underline" prefetch={false}>
//               Privacy Policy
//             </Link>
//           </div>
//         </div>
//       </footer> */}
//     </div>
//   )
// }

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


function CopyIcon(props: any) {
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
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  )
}


function FacebookIcon(props: any) {
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
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}


function InstagramIcon(props: any) {
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
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}


function MaximizeIcon(props: any) {
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
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  )
}


function ShareIcon(props: any) {
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
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  )
}


function TwitterIcon(props: any) {
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
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )
}


function UploadIcon(props: any) {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}