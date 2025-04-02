export const metadata = {
    title: 'Pricing Plans',  
    description: 'Flexible pricing options for every need'      
  }
  
  export default function PricingLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <section>
        {children}
      </section>
    )
  }