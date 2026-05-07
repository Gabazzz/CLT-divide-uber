import React from 'react';
import type { Ride, User } from '../../types';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Avatar } from '../ui/Avatar';
import { formatCurrency } from '../../utils/helpers';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText } from 'lucide-react';

interface RideCardProps {
  ride: Ride;
  payer: User | undefined;
  participants: User[];
  onClick: () => void;
}

export const RideCard: React.FC<RideCardProps> = ({ ride, payer, participants, onClick }) => {
  const dateFormatted = format(parseISO(ride.date), "dd 'de' MMM", { locale: ptBR });
  const costPerPerson = ride.totalValue / (ride.participantIds.length || 1);

  const getStatusProps = (status: Ride['status']) => {
    switch (status) {
      case 'pago': return { variant: 'success' as const, label: '✅ Pago' };
      case 'pendente': return { variant: 'warning' as const, label: '⏳ Pendente' };
      case 'parcial': return { variant: 'orange' as const, label: '⚠️ Parcial' };
    }
  };

  const statusProps = getStatusProps(ride.status);

  return (
    <Card 
      onClick={onClick} 
      className="cursor-pointer hover:bg-bg-stripe transition-colors active:scale-[0.98]"
    >
      <div className="flex flex-col gap-3">
        {/* Row 1: ID, Date, Type, Status */}
        <div className="flex items-center justify-between text-xs text-text-muted">
          <div className="flex items-center gap-2">
            <span className="font-mono text-primary font-medium">#{ride.id.substring(0,6)}</span>
            <span>•</span>
            <span>{dateFormatted}</span>
            <span>•</span>
            <Chip>{ride.type === 'ida' ? 'Ida' : 'Volta'}</Chip>
          </div>
          <Chip variant={statusProps.variant}>{statusProps.label}</Chip>
        </div>

        {/* Row 2: Payer + Total */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-lg text-white">
            {payer?.name || 'Desconhecido'} pagou
          </span>
          <span className="font-bold text-xl text-white">
            {formatCurrency(ride.totalValue)}
          </span>
        </div>

        {/* Row 3: Per person */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-success font-medium">
            Por pessoa: {formatCurrency(costPerPerson)}
          </span>
          <span className="text-text-muted">
            {ride.participantIds.length} {ride.participantIds.length === 1 ? 'pessoa' : 'pessoas'}
          </span>
        </div>

        {/* Row 4: Notes and Avatars */}
        <div className="flex items-end justify-between mt-1">
          <div className="flex-1">
            {ride.notes && (
              <div className="flex items-start gap-1 text-xs text-text-muted mt-2">
                <FileText size={14} className="min-w-[14px] mt-0.5" />
                <span className="line-clamp-2">{ride.notes}</span>
              </div>
            )}
          </div>
          <div className="flex -space-x-2">
            {participants.slice(0, 4).map((p) => (
              <Avatar 
                key={p.id} 
                name={p.name} 
                color={p.color}
                photoUrl={p.photoUrl}
                size="sm" 
                className="border-2 border-bg-card" 
              />
            ))}
            {participants.length > 4 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-border-subtle border-2 border-bg-card text-xs font-medium text-text-main">
                +{participants.length - 4}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
