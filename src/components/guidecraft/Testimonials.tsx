import { Card, CardContent } from "../ui/Card"

const testimonials = [
  { name: 'Alex', quote: 'These guides helped me reach Diamond in LoL!' },
  { name: 'Sarah', quote: 'I finally completed my first Mythic+ dungeon thanks to the WoW guides.' },
  { name: 'Mike', quote: 'The Path of Exile builds here are top-notch. Highly recommended!' },
]

export default function Testimonials() {
  return (
    <section>
      <h2 className="text-3xl font-semibold text-center mb-8 text-foreground">What Our Users Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map(({ name, quote }) => (
          <Card key={name} className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <p className="text-lg mb-4 text-card-foreground">"{quote}"</p>
              <p className="font-semibold text-muted-foreground">- {name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}