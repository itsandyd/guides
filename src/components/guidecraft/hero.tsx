import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export default function Hero() {
  return (
    <header className="container mx-auto px-4 py-16 bg-gradient-to-b from-background to-background/80 text-foreground">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4">Find Expert Guides for Your Favorite Games</h1>
      <p className="text-xl md:text-2xl text-center text-muted-foreground mb-12">
        Discover strategies, tips, and tricks for World of Warcraft, Runescape, League of Legends, Path of Exile, and more!
      </p>
      <div className="flex flex-col sm:flex-row max-w-md mx-auto space-y-4 sm:space-y-0 sm:space-x-2">
        <Input 
          placeholder="Search games..." 
          className="flex-grow rounded-md sm:rounded-r-none border-r-0 focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <Button 
          className="w-full sm:w-auto rounded-md sm:rounded-l-none bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
        >
          Search
        </Button>
      </div>
    </header>
  )
}