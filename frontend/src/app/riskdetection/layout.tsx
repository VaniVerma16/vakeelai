// src/app/riskdetection/layout.tsx
export const metadata = {
    title: 'Legal Contract Risk Detection',
    description: 'AI-powered legal contract analysis tool',
  }
  
  export default function RiskDetectionLayout({
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
  