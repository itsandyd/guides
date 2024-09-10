import { Search, Zap, Users, Target } from 'lucide-react'
import { Card, CardContent } from '../ui/Card'

const benefits = [
  { icon: Search, title: 'Expert Strategies', description: 'Curated by top players and pros' },
  { icon: Zap, title: 'Up-to-date Information', description: 'Always current with the latest patches' },
  { icon: Users, title: 'Community-tested Tactics', description: 'Proven effective by our users' },
  { icon: Target, title: 'Personalized Recommendations', description: 'Tailored to your playstyle' },
]

export default function UserBenefits() {
  return (
    <section>
      <h2 className="text-3xl font-semibold text-center mb-8 text-foreground">Why Choose Us?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {benefits.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <Icon className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">{title}</h3>
              <p className="text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}