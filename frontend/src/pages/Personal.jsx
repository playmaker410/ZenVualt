
import { Bell, Globe2, PiggyBank, Send, ShieldCheck, Smartphone, Zap } from 'lucide-react'
import ServicePage from '../components/ServicePage'
import assets from '../assets/assets'

const Personal = () => (
  <ServicePage
    serviceKey='personal'
    eyebrow='Personal banking'
    title='Everyday money.'
    highlightedTitle='Made effortless.'
    description='Spend, save, and manage your money with a personal account that keeps the important things simple, visible, and within reach.'
    image={assets.personal}
    imageAlt='Customer using her Zenvault personal banking account'
    badge='Your money, clearly organized'
    highlights={[
      { icon: Zap, title: 'Quick everyday banking', text: 'Handle the essentials without unnecessary steps.' },
      { icon: ShieldCheck, title: 'Secure by design', text: 'Built-in safeguards help protect your account activity.' },
      { icon: Globe2, title: 'There when you need it', text: 'Stay connected to your money wherever you are.' },
    ]}
    benefits={[
      { icon: Smartphone, title: 'Simple mobile control', text: 'See balances, review activity, and manage your account on the go.' },
      { icon: Send, title: 'Easy money movement', text: 'Send money with a clear experience from start to finish.' },
      { icon: PiggyBank, title: 'Better saving habits', text: 'Keep goals visible and make room for what matters next.' },
      { icon: Bell, title: 'Helpful notifications', text: 'Stay aware of important account activity as it happens.' },
    ]}
    steps={[
      { title: 'Create your profile', text: 'Enter your details and choose the account that fits your needs.' },
      { title: 'Verify your identity', text: 'Complete a secure identity check to protect your new account.' },
      { title: 'Make it yours', text: 'Add money, set your preferences, and start banking your way.' },
    ]}
  />
)

export default Personal
