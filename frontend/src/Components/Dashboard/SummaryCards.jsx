import { memo } from "react";
import { TrendingUp, TrendingDown, Wallet, Target, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Card from "../ui/Card";

const SummaryCards = memo(function SummaryCards({ data }) {
  const { totalIncome, totalExpenses, remainingBalance, activeGoals, currency } = data;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace(currency, `${currency} `);
  };

  const cards = [
    {
      title: "Total Income",
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      trend: "+12.5%",
      trendUp: true,
      colorClass: "text-neon-green",
      bgClass: "bg-neon-green/10",
      borderClass: "border-neon-green/20",
      glowClass: "bg-neon-green"
    },
    {
      title: "Total Expenses",
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
      trend: "+8.2%",
      trendUp: false,
      colorClass: "text-neon-magenta",
      bgClass: "bg-neon-magenta/10",
      borderClass: "border-neon-magenta/20",
      glowClass: "bg-neon-magenta"
    },
    {
      title: "Remaining Balance",
      value: formatCurrency(remainingBalance),
      icon: Wallet,
      trend: "+4.3%",
      trendUp: true,
      colorClass: "text-neon-cyan",
      bgClass: "bg-neon-cyan/10",
      borderClass: "border-neon-cyan/20",
      glowClass: "bg-neon-cyan"
    },
    {
      title: "Active Goals",
      value: activeGoals.toString(),
      icon: Target,
      trend: "2 completed",
      trendUp: true,
      colorClass: "text-neon-blue",
      bgClass: "bg-neon-blue/10",
      borderClass: "border-neon-blue/20",
      glowClass: "bg-neon-blue"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={card.title}>
          <Card className="p-6 hover:scale-105 transition-transform duration-300" hover={false}>
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.bgClass} border ${card.borderClass}`}>
                  <card.icon className={`w-6 h-6 ${card.colorClass}`} />
                </div>
                
                <div className={`flex items-center gap-1 text-sm ${
                  card.trendUp ? 'text-neon-green' : 'text-neon-magenta'
                }`}>
                  {card.trendUp ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span className="font-medium">{card.trend}</span>
                </div>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">{card.title}</h3>
                <p className="text-2xl font-bold text-gray-100">{card.value}</p>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
});

export default SummaryCards;