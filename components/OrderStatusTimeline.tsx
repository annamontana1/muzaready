'use client';

interface OrderStatusStep {
  status: string;
  label: string;
  description: string;
  icon: string;
}

const STATUS_STEPS: Record<string, OrderStatusStep> = {
  pending: {
    status: 'pending',
    label: 'Čeká na platbu',
    description: 'Vaše objednávka byla přijata a čeká na potvrzení platby',
    icon: '⏳',
  },
  paid: {
    status: 'paid',
    label: 'Zaplaceno',
    description: 'Platba byla potvrzena. Připravujeme Vaši objednávku k odeslání',
    icon: '✓',
  },
  shipped: {
    status: 'shipped',
    label: 'Odesláno',
    description: 'Vaše objednávka byla odeslána',
    icon: '📦',
  },
  delivered: {
    status: 'delivered',
    label: 'Doručeno',
    description: 'Vaše objednávka byla doručena',
    icon: '✓✓',
  },
  cancelled: {
    status: 'cancelled',
    label: 'Zrušeno',
    description: 'Objednávka byla zrušena',
    icon: '✕',
  },
};

const STATUS_ORDER = ['pending', 'paid', 'shipped', 'delivered'];

interface OrderStatusTimelineProps {
  currentStatus: string;
}

export default function OrderStatusTimeline({ currentStatus }: OrderStatusTimelineProps) {
  const isCancelled = currentStatus === 'cancelled';
  const displaySteps = isCancelled ? [STATUS_STEPS['cancelled']] : STATUS_ORDER.map((s) => STATUS_STEPS[s]);

  const currentStepIndex = isCancelled ? -1 : STATUS_ORDER.indexOf(currentStatus);

  return (
    <div className="w-full">
      {isCancelled ? (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✕</span>
            <div>
              <p className="font-semibold text-red-900">Objednávka zrušena</p>
              <p className="text-sm text-red-700">Vaše objednávka byla zrušena</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {displaySteps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isActive = index === currentStepIndex;
            const isUpcoming = index > currentStepIndex;

            return (
              <div key={step.status} className="flex gap-4">
                {/* Timeline dot and line */}
                <div className="flex flex-col items-center">
                  {/* Dot */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isActive
                          ? 'bg-burgundy text-white ring-2 ring-burgundy ring-offset-2'
                          : 'bg-gray-200 text-text-soft'
                    }`}
                  >
                    {step.icon}
                  </div>
                  {/* Connecting line */}
                  {index < displaySteps.length - 1 && (
                    <div
                      className={`w-0.5 h-12 ${
                        isCompleted || isActive ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>

                {/* Step content */}
                <div className={`flex-1 pt-1 ${isUpcoming ? 'opacity-50' : ''}`}>
                  <p
                    className={`font-semibold transition-colors ${
                      isCompleted || isActive ? 'text-burgundy' : 'text-text-mid'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-sm text-text-mid mt-1">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
