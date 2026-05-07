import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { Ride, RideStatus, RideType, User } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { Avatar } from '../ui/Avatar';
import { formatCurrency } from '../../utils/helpers';
import { cn } from '../../utils/cn';
import { format } from 'date-fns';

interface RideFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  rideToEdit?: Ride;
  onSave: (ride: Ride) => void;
  onDelete?: (id: string) => void;
}

interface FormValues {
  date: string;
  type: RideType;
  payerId: string;
  participantIds: string[];
  totalValue: string; // Handle as string in input to allow masking/empty
  status: RideStatus;
  notes: string;
}

export const RideFormModal: React.FC<RideFormModalProps> = ({
  isOpen,
  onClose,
  users,
  rideToEdit,
  onSave,
  onDelete,
}) => {
  const isEditing = !!rideToEdit;

  const defaultValues: FormValues = {
    date: format(new Date(), 'yyyy-MM-dd'),
    type: 'ida',
    payerId: '',
    participantIds: [],
    totalValue: '',
    status: 'pago',
    notes: '',
  };

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues });

  useEffect(() => {
    if (isOpen) {
      if (rideToEdit) {
        reset({
          date: rideToEdit.date.split('T')[0], // simplistic date handling for type=date
          type: rideToEdit.type,
          payerId: rideToEdit.payerId,
          participantIds: rideToEdit.participantIds,
          totalValue: rideToEdit.totalValue.toString(),
          status: rideToEdit.status,
          notes: rideToEdit.notes || '',
        });
      } else {
        reset(defaultValues);
      }
    }
  }, [isOpen, rideToEdit, reset]);

  const totalValueStr = watch('totalValue');
  const participantIds = watch('participantIds');
  
  const totalValueNum = parseFloat(totalValueStr.replace(',', '.')) || 0;
  const costPerPerson = participantIds.length > 0 ? totalValueNum / participantIds.length : 0;

  const toggleParticipant = (id: string) => {
    if (participantIds.includes(id)) {
      setValue('participantIds', participantIds.filter((pId) => pId !== id), { shouldValidate: true });
    } else {
      setValue('participantIds', [...participantIds, id], { shouldValidate: true });
    }
  };

  const onSubmit = (data: FormValues) => {
    const rideData: Ride = {
      id: isEditing ? rideToEdit.id : crypto.randomUUID(),
      date: new Date(data.date).toISOString(),
      type: data.type,
      payerId: data.payerId,
      participantIds: data.participantIds,
      totalValue: parseFloat(data.totalValue.replace(',', '.')),
      status: data.status,
      notes: data.notes,
    };
    onSave(rideData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Corrida' : 'Nova Corrida'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 pb-6">
        {/* Date and Type Row */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Controller
              name="date"
              control={control}
              rules={{ required: 'Data é obrigatória' }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="date"
                  label="Data"
                  error={errors.date?.message}
                />
              )}
            />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-sm font-semibold text-text-muted">Tipo</label>
            <Controller
              name="type"
              control={control}
              render={({ field: { value, onChange } }) => (
                <div className="flex bg-border-subtle rounded-lg p-1 h-11">
                  <button
                    type="button"
                    onClick={() => onChange('ida')}
                    className={cn(
                      'flex-1 rounded-md text-sm font-medium transition-all',
                      value === 'ida' ? 'bg-bg-card shadow text-white' : 'text-text-muted hover:text-white'
                    )}
                  >
                    Ida
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange('volta')}
                    className={cn(
                      'flex-1 rounded-md text-sm font-medium transition-all',
                      value === 'volta' ? 'bg-bg-card shadow text-white' : 'text-text-muted hover:text-white'
                    )}
                  >
                    Volta
                  </button>
                </div>
              )}
            />
          </div>
        </div>

        {/* Payer Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-text-muted">Quem pagou?</label>
          <Controller
            name="payerId"
            control={control}
            rules={{ required: 'Selecione quem pagou' }}
            render={({ field: { value, onChange } }) => (
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {users.map((user) => (
                  <div key={user.id} className="flex flex-col items-center gap-1 min-w-[64px]" onClick={() => onChange(user.id)}>
                    <Avatar
                      name={user.name}
                      color={user.color}
                      selected={value === user.id}
                      className="cursor-pointer"
                    />
                    <span className={cn('text-xs transition-colors text-center', value === user.id ? 'text-primary font-medium' : 'text-text-muted')}>
                      {user.name.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          />
          {errors.payerId && <span className="text-xs text-danger">{errors.payerId.message}</span>}
        </div>

        {/* Participants Selection */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-end">
            <label className="text-sm font-semibold text-text-muted">Quem participou?</label>
            <span className="text-xs text-text-muted">{participantIds.length} selecionados</span>
          </div>
          <Controller
            name="participantIds"
            control={control}
            rules={{ validate: (val) => val.length > 0 || 'Selecione pelo menos um participante' }}
            render={() => (
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {users.map((user) => {
                  const isSelected = participantIds.includes(user.id);
                  return (
                    <div key={user.id} className="flex flex-col items-center gap-1 min-w-[64px]" onClick={() => toggleParticipant(user.id)}>
                      <Avatar
                        name={user.name}
                        color={user.color}
                        selected={isSelected}
                        className={cn('cursor-pointer', !isSelected && 'opacity-60 saturate-50')}
                      />
                      <span className={cn('text-xs transition-colors text-center', isSelected ? 'text-white font-medium' : 'text-text-muted')}>
                        {user.name.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          />
          {errors.participantIds && <span className="text-xs text-danger">{errors.participantIds.message}</span>}
        </div>

        {/* Value inputs */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Controller
              name="totalValue"
              control={control}
              rules={{ 
                required: 'Valor obrigatório',
                validate: (val) => parseFloat(val.replace(',','.')) > 0 || 'Deve ser maior que 0'
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  label="Valor Total (R$)"
                  placeholder="0.00"
                  error={errors.totalValue?.message}
                />
              )}
            />
          </div>
          <div className="flex-1">
            <Input
              readOnly
              label="Por Pessoa"
              value={formatCurrency(costPerPerson)}
              className="bg-bg-stripe text-success font-semibold"
            />
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-text-muted">Status</label>
          <Controller
            name="status"
            control={control}
            render={({ field: { value, onChange } }) => (
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => onChange('pago')}
                  className={cn(
                    'py-2 px-1 rounded-lg text-sm font-medium border flex items-center justify-center gap-1 transition-all',
                    value === 'pago' ? 'bg-success/20 border-success/50 text-success' : 'border-border-subtle text-text-muted'
                  )}
                >
                  ✅ Pago
                </button>
                <button
                  type="button"
                  onClick={() => onChange('pendente')}
                  className={cn(
                    'py-2 px-1 rounded-lg text-sm font-medium border flex items-center justify-center gap-1 transition-all',
                    value === 'pendente' ? 'bg-warning/20 border-warning/50 text-warning' : 'border-border-subtle text-text-muted'
                  )}
                >
                  ⏳ Pendente
                </button>
                <button
                  type="button"
                  onClick={() => onChange('parcial')}
                  className={cn(
                    'py-2 px-1 rounded-lg text-sm font-medium border flex items-center justify-center gap-1 transition-all',
                    value === 'parcial' ? 'bg-orange/20 border-orange/50 text-orange' : 'border-border-subtle text-text-muted'
                  )}
                >
                  ⚠️ Parcial
                </button>
              </div>
            )}
          />
        </div>

        {/* Notes */}
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label="Observação (opcional)"
              placeholder="Ex: corrida do almoço"
            />
          )}
        />

        {/* Actions */}
        <div className="flex gap-4 mt-2">
          {isEditing && onDelete && (
            <Button type="button" variant="danger" onClick={() => onDelete(rideToEdit.id)} className="px-4">
              Excluir
            </Button>
          )}
          <Button type="submit" fullWidth className="flex-1">
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  );
};
