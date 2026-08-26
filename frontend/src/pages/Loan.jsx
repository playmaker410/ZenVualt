import { Calendar, CheckCircle2, Clock3, FileText, HandCoins, ShieldCheck, Wallet } from 'lucide-react'
import ServicePage from '../components/ServicePage'
import assets from '../assets/assets'

const Loan = () => (
  <ServicePage
    serviceKey='loan'
    eyebrow='Flexible financing'
    title='Plans need funding.'
    highlightedTitle='Keep moving forward.'
    description='Explore straightforward lending designed around clear information, a simple digital process, and repayment that is easier to understand.'
    image={assets.whychooseimg}
    imageAlt='Customers reviewing a financial plan together'
    imageClassName='object-cover rounded-[1.5rem]'
    badge='Clear steps from request to decision'
    highlights={[
      { icon: FileText, title: 'Clear information', text: 'Understand the key details before making a decision.' },
      { icon: Clock3, title: 'A simpler process', text: 'Move through your request without unnecessary complexity.' },
      { icon: ShieldCheck, title: 'Private and protected', text: 'Your personal and financial information is handled securely.' },
    ]}
    benefits={[
      { icon: HandCoins, title: 'Flexible possibilities', text: 'Explore financing for personal plans and important next steps.' },
      { icon: Calendar, title: 'Visible repayment plan', text: 'Know what is expected with a schedule that is easy to follow.' },
      { icon: CheckCircle2, title: 'Straightforward review', text: 'A guided application keeps the required information clear.' },
      { icon: Wallet, title: 'Manage it in one place', text: 'Keep your loan information close to the rest of your banking.' },
    ]}
    steps={[
      { title: 'Share what you need', text: 'Choose an amount and tell us a little about your financing goal.' },
      { title: 'Complete the application', text: 'Provide the requested details through a secure digital form.' },
      { title: 'Review your decision', text: 'See the available terms clearly before choosing how to proceed.' },
    ]}
  />
)

export default Loan
