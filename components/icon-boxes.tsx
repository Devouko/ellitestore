import { Truck, Shield, Headphones, RotateCcw } from 'lucide-react'

export default function IconBoxes() {
  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free shipping on orders over $50'
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure payment processing'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Dedicated customer support'
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      description: '30-day return policy'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-12">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
          <feature.icon className="h-8 w-8 text-primary" />
          <div>
            <h3 className="font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}