import { Card, CardContent } from '../ui/Card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar'

const testimonials = [
  { name: 'Alex', avatar: '/avatars/alex.jpg', text: 'These guides helped me reach Diamond in LoL!' },
  { name: 'Sarah', avatar: '/avatars/sarah.jpg', text: 'I finally completed my first WoW Mythic raid thanks to GuidesForGamers!' },
  { name: 'Mike', avatar: '/avatars/mike.jpg', text: 'The PoE builds here are top-notch. Highly recommended!' },
]

export default function Testimonials() {
  return (
    <section className="py-12 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name}>
              <CardContent className="flex flex-col items-center text-center p-6">
                <Avatar className="w-20 h-20 mb-4">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                </Avatar>
                <p className="mb-2">"{testimonial.text}"</p>
                <p className="font-semibold">{testimonial.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}