import { Bell, Globe2, LockKeyhole, ShieldCheck, SlidersHorizontal, Smartphone, Zap } from 'lucide-react'
import ServicePage from '../components/ServicePage'
import assets from '../assets/assets'

const Card = () => (
  <ServicePage
    serviceKey='card'
    eyebrow='Zenvault cards'
    title='A smarter card.'
    highlightedTitle='You stay in control.'
    description='Pay confidently at home or away with a card experience that pairs everyday convenience with clear controls and thoughtful protection.'
    image={assets.compressed}
    imageAlt='Zenvault payment card and digital card controls'
    badge='Control your card in a few taps'
    highlights={[
      { icon: LockKeyhole, title: 'Quick card controls', text: 'Manage access to your card whenever you need to.' },
      { icon: Bell, title: 'Timely alerts', text: 'Keep up with important spending and security activity.' },
      { icon: Globe2, title: 'Ready for the world', text: 'A card designed to support life beyond borders.' },
    ]}
    benefits={[
      { icon: Smartphone, title: 'Manage it digitally', text: 'View and control your card from a clear mobile experience.' },
      { icon: ShieldCheck, title: 'Protection built in', text: 'Thoughtful security features help keep every payment safer.' },
      { icon: SlidersHorizontal, title: 'Controls that make sense', text: 'Adjust card preferences without calling or waiting in line.' },
      { icon: Zap, title: 'Fast and convenient', text: 'Designed to make everyday payments feel quick and natural.' },
    ]}
    steps={[
      { title: 'Choose your card', text: 'Select the card option that works best for the way you spend.' },
      { title: 'Confirm your details', text: 'Complete a simple, secure review of your account information.' },
      { title: 'Activate and go', text: 'Set your preferences, activate your card, and start using it.' },
    ]}
  />
)

export default Card
