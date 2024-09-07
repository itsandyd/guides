import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

export default function Newsletter() {
  return (
    <section className="py-12 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Stay Updated</h2>
        <p className="text-center mb-8">Subscribe to our newsletter for the latest gaming guides and tips.</p>
        <form className="max-w-md mx-auto flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            className="flex-grow bg-primary-foreground text-primary"
          />
          <Button type="submit" variant="secondary">Subscribe</Button>
        </form>
      </div>
    </section>
  )
}