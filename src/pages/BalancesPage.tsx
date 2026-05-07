import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { formatCurrency } from '../utils/helpers';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

export const BalancesPage: React.FC = () => {
  const { users, getBalances } = useAppStore();
  const balances = getBalances();

  const sortedBalances = [...balances].sort((a, b) => b.balance - a.balance);

  return (
    <div className="flex flex-col h-full relative">
      <div className="bg-bg-main pt-6 pb-4 px-4 sticky top-0 z-10 shadow-sm border-b border-border-subtle">
        <h1 className="text-2xl font-bold">Saldos</h1>
        <p className="text-text-muted text-sm mt-1">Calculado pelo mês selecionado</p>
      </div>

      <div className="flex-1 p-4 overflow-y-auto pb-24">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {sortedBalances.map((b) => {
            const user = users.find(u => u.id === b.userId);
            if (!user) return null;

            const isPositive = b.balance > 0.01;
            const isNegative = b.balance < -0.01;
            const isZero = !isPositive && !isNegative;

            const max = Math.max(b.totalPaid, b.totalUsed) || 1;
            const paidPct = (b.totalPaid / max) * 100;
            const usedPct = (b.totalUsed / max) * 100;

            return (
              <motion.div
                key={b.userId}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <Card className={cn(
                  'flex flex-col gap-4 hover:border-primary/40 transition-all cursor-pointer',
                  isPositive && 'border-success/20',
                  isNegative && 'border-danger/20',
                )}>
                  <div className="flex items-center gap-3">
                    <Avatar name={user.name} color={user.color} photoUrl={user.photoUrl} size="lg" />
                    <div className="flex flex-col flex-1">
                      <span className="font-bold text-lg">{user.name}</span>
                      <div className="flex text-xs text-text-muted gap-2 mt-0.5">
                        <span>Pagou: <span className="font-medium text-white">{formatCurrency(b.totalPaid)}</span></span>
                        <span>•</span>
                        <span>Usou: <span className="font-medium text-white">{formatCurrency(b.totalUsed)}</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-end justify-between">
                      <span className="text-xs font-semibold text-text-muted">
                        {isPositive ? 'Tem a receber' : isNegative ? 'Deve pagar' : 'Saldo zerado'}
                      </span>
                      <div className={cn(
                        'flex items-center gap-1 font-bold text-xl',
                        isPositive ? 'text-success' : isNegative ? 'text-danger' : 'text-text-muted'
                      )}>
                        {isPositive && <ArrowUpRight size={20} />}
                        {isNegative && <ArrowDownRight size={20} />}
                        {isZero && <Minus size={20} />}
                        {formatCurrency(Math.abs(b.balance))}
                      </div>
                    </div>

                    {/* Visual progress bar */}
                    <div className="w-full flex gap-1 h-2 rounded-full overflow-hidden bg-border-subtle">
                      <motion.div
                        className="bg-success/70 h-full rounded-l-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${paidPct}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        title="Pagou"
                      />
                      <motion.div
                        className="bg-danger/60 h-full rounded-r-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${usedPct}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                        title="Usou"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-text-muted">
                      <span className="text-success/80">■ Pagou</span>
                      <span className="text-danger/80">■ Usou</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};
