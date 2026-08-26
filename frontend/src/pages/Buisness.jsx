import { BarChart3, Building2, CreditCard, Globe2, ShieldCheck, Users, Wallet } from 'lucide-react'
import ServicePage from '../components/ServicePage'
import assets from '../assets/assets'

const Buisness = () => (
  <ServicePage
    serviceKey='business'
    eyebrow='Business banking'
    title='Built for business.'
    highlightedTitle='Ready for growth.'
    description='Run everyday finances, manage team spending, and keep cash flow visible from one secure business account designed to move at your pace.'
    image={assets.Buisness}
    imageAlt='Business owners reviewing their Zenvault account'
    badge='Built to scale with your team'
    highlights={[
      { icon: Wallet, title: 'Clear cash flow', text: 'See incoming and outgoing money in one organized view.' },
      { icon: Users, title: 'Team-ready access', text: 'Give the right people the right level of visibility.' },
      { icon: Globe2, title: 'Payments that travel', text: 'Keep business moving across customers and markets.' },
    ]}
    benefits={[
      { icon: Building2, title: 'One business home', text: 'Keep daily banking and essential account activity together.' },
      { icon: CreditCard, title: 'Smarter team spending', text: 'Use clear card controls to manage how business money is spent.' },
      { icon: BarChart3, title: 'Useful reporting', text: 'Turn transaction activity into a clearer view of performance.' },
      { icon: ShieldCheck, title: 'Protected access', text: 'Security controls help keep company funds and data safer.' },
    ]}
    steps={[
      { title: 'Tell us about your business', text: 'Share the essential details about your company and how it operates.' },
      { title: 'Complete your verification', text: 'Confirm the business and the people responsible for the account.' },
      { title: 'Start banking', text: 'Set up access, organize payments, and bring your team on board.' },
    ]}
  />
)

export default Buisness
