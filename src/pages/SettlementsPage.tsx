import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { formatCurrency } from '../utils/helpers';
import { ArrowRight, Share2, Info, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';

export const SettlementsPage: React.FC = () => {
  const { users, rides, getSettlements } = useAppStore();
  const settlements = getSettlements();
  const [copied, setCopied] = useState(false);

  const lastRideDate = rides.length > 0 
    ? new Date(Math.max(...rides.map(r => new Date(r.date).getTime())))
    : null;

  const dateFormatted = lastRideDate 
    ? format(lastRideDate, "dd 'de' MMM", { locale: ptBR })
    : 'Nenhum registro';

  const handleShare = async () => {
    const header = `📊 *Fechamento Uber — ${format(new Date(), 'dd/MM/yyyy')}*\n\n`;
    
    const body = settlements.map(s => {
      const from = users.find(u => u.id === s.fromUserId)?.name || 'Desconhecido';
      const to = users.find(u => u.id === s.toUserId)?.name || 'Desconhecido';
      return `🔴 ${from} deve *${formatCurrency(s.amount)}* para ${to}`;
    }).join('\n');

    const footer = '\n\n✅ Saldos zerados após as transferências';
    const text = header + body + footer;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Fechamento Uber',
          text: text,
        });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } catch (e) {
      console.error('Error sharing', e);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="bg-bg-main pt-6 pb-4 px-4 sticky top-0 z-10 shadow-sm border-b border-border-subtle">
        <h1 className="text-2xl font-bold">Acerto do Grupo</h1>
        <p className="text-text-muted text-sm mt-1">Última corrida: {dateFormatted}</p>
      </div>

      <div className="flex-1 p-4 overflow-y-auto pb-24 flex flex-col gap-4">
        {settlements.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 mt-12">
            <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mb-4 text-success">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-xl font-bold mb-2">Tudo certo!</h2>
            <p className="text-text-muted max-w-[250px]">
              Não há transferências pendentes. Os saldos estão zerados.
            </p>
          </div>
        ) : (
          <>
            <motion.div
              className="flex flex-col gap-3"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              {settlements.map((s, idx) => {
                const fromUser = users.find(u => u.id === s.fromUserId);
                const toUser = users.find(u => u.id === s.toUserId);

                if (!fromUser || !toUser) return null;

                return (
                  <motion.div
                    key={idx}
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  >
                    <Card className="flex flex-col gap-3 hover:border-primary/30 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col items-center gap-1 w-1/3">
                          <Avatar name={fromUser.name} color={fromUser.color} photoUrl={fromUser.photoUrl} className="ring-2 ring-danger ring-offset-2 ring-offset-bg-card" />
                          <span className="text-xs font-semibold text-center mt-1">{fromUser.name.split(' ')[0]}</span>
                          <span className="text-[10px] text-danger/80">deve</span>
                        </div>
                        
                        <div className="flex flex-col items-center justify-center w-1/3 gap-1">
                          <ArrowRight size={24} className="text-primary/60" />
                          <span className="bg-bg-stripe px-3 py-1 font-bold text-base rounded-full border border-primary/30 text-primary shadow-[0_0_10px_rgba(124,58,237,0.3)]">
                            {formatCurrency(s.amount)}
                          </span>
                        </div>

                        <div className="flex flex-col items-center gap-1 w-1/3">
                          <Avatar name={toUser.name} color={toUser.color} photoUrl={toUser.photoUrl} className="ring-2 ring-success ring-offset-2 ring-offset-bg-card" />
                          <span className="text-xs font-semibold text-center mt-1">{toUser.name.split(' ')[0]}</span>
                          <span className="text-[10px] text-success/80">recebe</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>

            <div className="flex items-start gap-2 bg-warning/10 border border-warning/20 text-warning text-xs p-3 rounded-xl mt-2">
              <Info size={16} className="min-w-[16px] mt-0.5" />
              <p>Aproximação para o caso mais comum minimizando transações. Verifique os saldos individuais para acertos complexos.</p>
            </div>

            <Button 
              onClick={handleShare} 
              className="mt-4 gap-2" 
              variant="primary"
            >
              <Share2 size={18} />
              {copied ? 'Copiado para a área de transferência!' : 'Compartilhar Resumo'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
