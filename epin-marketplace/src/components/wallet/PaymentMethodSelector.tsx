'use client';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onSelectMethod: (methodId: string) => void;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'credit_card',
    name: 'Credit/Debit Card',
    description: 'Secure payment via Stripe',
    icon: 'credit_card',
  },
  {
    id: 'digital_wallets',
    name: 'Digital Wallets',
    description: 'Pay with Papara, and more',
    icon: 'account_balance_wallet',
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    description: 'Use BTC, ETH, and other coins',
    icon: 'currency_bitcoin',
  },
];

export default function PaymentMethodSelector({ selectedMethod, onSelectMethod }: PaymentMethodSelectorProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-black dark:text-white text-base font-medium leading-normal">Choose Your Payment Method</p>
      <div className="grid grid-cols-1 gap-4">
        {PAYMENT_METHODS.map((method) => {
          const isSelected = selectedMethod === method.id;
          return (
            <div
              key={method.id}
              onClick={() => onSelectMethod(method.id)}
              className={`cursor-pointer p-6 rounded-xl border-2 flex items-center gap-6 transition-colors ${
                isSelected
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 dark:border-white/10 bg-transparent hover:border-gray-300 dark:hover:border-white/20'
              }`}
            >
              <div
                className={`flex-shrink-0 size-16 rounded-full flex items-center justify-center ${
                  isSelected ? 'bg-primary' : 'bg-gray-200 dark:bg-white/10'
                }`}
              >
                <span className={`material-symbols-outlined text-4xl ${isSelected ? 'text-white' : 'text-black dark:text-white'}`}>
                  {method.icon}
                </span>
              </div>
              <div className="flex-grow">
                <h3 className={`text-lg font-bold ${isSelected ? 'text-primary' : 'text-black dark:text-white'}`}>
                  {method.name}
                </h3>
                <p className={`text-sm ${isSelected ? 'text-primary/80' : 'text-gray-500 dark:text-gray-400'}`}>
                  {method.description}
                </p>
              </div>
              <span className={`material-symbols-outlined text-3xl ml-auto ${
                isSelected ? 'text-primary' : 'text-gray-400 dark:text-gray-500'
              }`}>
                arrow_forward_ios
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

