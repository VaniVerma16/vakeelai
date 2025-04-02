import { CheckIcon } from "@heroicons/react/20/solid";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function PricingPage() {
  const tiers = [
    {
      name: "Basic",
      id: "tier-basic",
      href: "#",
      priceMonthly: "₹49",
      description:
        "Ideal for individuals and small firms to analyze contracts efficiently.",
      features: [
        "Analyze up to 50 contracts per month",
        "Basic risk detection",
        "Standard contract templates",
        "Email support",
        "Response time within 48 hours",
      ],
      featured: false,
    },
    {
      name: "Enterprise",
      id: "tier-enterprise",
      href: "#",
      priceMonthly: "₹499",
      description:
        "Enterprise-grade AI legal analysis with premium support and automation.",
      features: [
        "Unlimited contract analysis",
        "AI-powered risk assessment & mitigation",
        "Automated compliance checks",
        "Custom workflow integrations",
        "Dedicated account manager",
        "24/7 priority support",
      ],
      featured: true,
    },
  ];

  return (
    <>
      <div className="relative isolate bg-white dark:bg-black px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base/7 font-semibold text-indigo-600 dark:text-indigo-400">
            Pricing
          </h2>
          <p className="mt-2 text-5xl font-semibold tracking-tight text-balance text-gray-900 dark:text-white sm:text-6xl">
            Choose the right plan for you
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-pretty text-gray-600 dark:text-gray-300 sm:text-xl/8">
          Choose an affordable plan that&apos;s packed with the best features
          for engaging your audience, creating customer loyalty, and driving
          sales.
        </p>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
          {tiers.map((tier, tierIdx) => (
            <div
              key={tier.id}
              className={classNames(
                tier.featured
                  ? "relative bg-gray-900 dark:bg-gray-800 shadow-2xl"
                  : "bg-white/60 dark:bg-gray-700 sm:mx-8 lg:mx-0",
                tier.featured
                  ? ""
                  : tierIdx === 0
                  ? "rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl"
                  : "sm:rounded-t-none lg:rounded-tr-3xl lg:rounded-bl-none",
                "rounded-3xl p-8 ring-1 ring-gray-900/10 dark:ring-gray-700 sm:p-10"
              )}
            >
              <h3
                id={tier.id}
                className={classNames(
                  tier.featured
                    ? "text-indigo-400"
                    : "text-indigo-600 dark:text-indigo-400",
                  "text-base/7 font-semibold"
                )}
              >
                {tier.name}
              </h3>
              <p className="mt-4 flex items-baseline gap-x-2">
                <span
                  className={classNames(
                    tier.featured
                      ? "text-white"
                      : "text-gray-900 dark:text-gray-100",
                    "text-5xl font-semibold tracking-tight"
                  )}
                >
                  {tier.priceMonthly}
                </span>
                <span
                  className={classNames(
                    tier.featured
                      ? "text-gray-400"
                      : "text-gray-500 dark:text-gray-400",
                    "text-base"
                  )}
                >
                  /month
                </span>
              </p>
              <p
                className={classNames(
                  tier.featured
                    ? "text-gray-300"
                    : "text-gray-600 dark:text-gray-400",
                  "mt-6 text-base/7"
                )}
              >
                {tier.description}
              </p>
              <ul
                role="list"
                className={classNames(
                  tier.featured
                    ? "text-gray-300"
                    : "text-gray-600 dark:text-gray-400",
                  "mt-8 space-y-3 text-sm/6 sm:mt-10"
                )}
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <div className="flex items-center">
                      <CheckIcon
                        aria-hidden="true"
                        className={classNames(
                          tier.featured
                            ? "text-indigo-400"
                            : "text-indigo-600 dark:text-indigo-400",
                          "h-6 w-5 flex-none"
                        )}
                      />
                      <span>{feature}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <a
                href={tier.href}
                aria-describedby={tier.id}
                className={classNames(
                  tier.featured
                    ? "bg-indigo-500 text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-indigo-500"
                    : "text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-200 ring-inset hover:ring-indigo-300 focus-visible:outline-indigo-600",
                  "mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10"
                )}
              >
                Get started today
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
