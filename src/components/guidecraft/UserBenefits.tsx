import { CheckCircle, Zap, Users, Sparkles } from 'lucide-react'

const benefits = [
  { title: 'Expert Strategies', description: 'Curated by top players and pros', icon: CheckCircle },
  { title: 'Up-to-date Information', description: 'Always current with the latest patches', icon: Zap },
  { title: 'Community-tested Tactics', description: 'Proven effective by our user base', icon: Users },
  { title: 'Personalized Recommendations', description: 'Tailored to your playstyle', icon: Sparkles },
]

export default function UserBenefits() {
  return (
    <section className="py-12 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose Us?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex flex-col items-center text-center space-y-2">
              <benefit.icon className="text-primary h-12 w-12" />
              <h3 className="text-xl font-semibold">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}