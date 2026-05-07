import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { User } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { generateColor } from '../../utils/helpers';
import { cn } from '../../utils/cn';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: User;
  currentUserId?: string;
  onSave: (user: User) => void;
  onDelete?: (id: string) => void;
}

interface FormValues {
  name: string;
  pixKey: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  userToEdit,
  currentUserId,
  onSave,
  onDelete,
}) => {
  const isEditing = !!userToEdit;
  const isSelf = isEditing && userToEdit?.id === currentUserId;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      pixKey: '',
      email: '',
      password: '',
      role: 'user',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (userToEdit) {
        reset({
          name: userToEdit.name,
          pixKey: userToEdit.pixKey || '',
          email: userToEdit.email || '',
          password: userToEdit.password || '',
          role: userToEdit.role || 'user',
        });
      } else {
        reset({ name: '', pixKey: '', email: '', password: '', role: 'user' });
      }
    }
  }, [isOpen, userToEdit, reset]);

  const onSubmit = (data: FormValues) => {
    const userData: User = {
      id: isEditing ? userToEdit.id : data.name.toLowerCase().replace(/\s+/g, '-'),
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      pixKey: data.pixKey || undefined,
      color: isEditing && userToEdit.color ? userToEdit.color : generateColor(data.name),
      photoUrl: isEditing ? userToEdit.photoUrl : undefined,
    };
    onSave(userData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Pessoa' : 'Nova Pessoa'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 pb-6">
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Nome é obrigatório' }}
          render={({ field }) => (
            <Input
              {...field}
              label="Nome"
              placeholder="Ex: João Silva"
              error={errors.name?.message}
            />
          )}
        />
        
        <Controller
          name="email"
          control={control}
          rules={{ required: 'Email é obrigatório' }}
          render={({ field }) => (
            <Input
              {...field}
              label="E-mail de Acesso"
              type="email"
              placeholder="joao@divideuber.com"
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Senha"
              type="text" // Show password here since it's admin editing
              placeholder="123"
            />
          )}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-text-muted">Nível de Acesso</label>
          <Controller
            name="role"
            control={control}
            render={({ field: { value, onChange } }) => (
              <div className="flex bg-border-subtle rounded-lg p-1 h-11 relative">
                {isSelf && (
                  <div className="absolute inset-0 bg-bg-card/50 z-10 flex items-center justify-center rounded-lg backdrop-blur-[1px]">
                    <span className="text-[10px] text-text-muted uppercase font-bold tracking-tighter">Você não pode alterar seu próprio nível</span>
                  </div>
                )}
                <button
                  type="button"
                  disabled={isSelf}
                  onClick={() => onChange('user')}
                  className={cn(
                    'flex-1 rounded-md text-sm font-medium transition-all',
                    value === 'user' ? 'bg-bg-card shadow text-white' : 'text-text-muted hover:text-white',
                    isSelf && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  Usuário Comum
                </button>
                <button
                  type="button"
                  disabled={isSelf}
                  onClick={() => onChange('admin')}
                  className={cn(
                    'flex-1 rounded-md text-sm font-medium transition-all',
                    value === 'admin' ? 'bg-bg-card shadow text-white' : 'text-text-muted hover:text-white',
                    isSelf && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  Administrador
                </button>
              </div>
            )}
          />
        </div>

        <Controller
          name="pixKey"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Chave PIX (opcional)"
              placeholder="CPF, Telefone, Email..."
            />
          )}
        />

        <div className="flex gap-4 mt-2">
          {isEditing && onDelete && (
            <Button type="button" variant="danger" onClick={() => onDelete(userToEdit.id)} className="px-4">
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
