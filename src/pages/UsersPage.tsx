import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { FAB } from '../components/ui/FAB';
import { UserFormModal } from '../components/users/UserFormModal';
import type { User } from '../types';
import { Edit2, Plus, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

export const UsersPage: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, currentUser } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  const isAdmin = currentUser?.role === 'admin';

  const handleOpenModal = (user?: User) => {
    if (!isAdmin) return;
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setEditingUser(undefined), 200);
  };

  const handleSave = (user: User) => {
    if (editingUser) {
      updateUser(user);
    } else {
      addUser(user);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta pessoa?')) {
      deleteUser(id);
      handleCloseModal();
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="bg-bg-main pt-6 pb-4 px-4 sticky top-0 z-10 shadow-sm border-b border-border-subtle flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Pessoas</h1>
          <p className="text-text-muted text-sm mt-1">{users.length} cadastradas</p>
        </div>
        
        {isAdmin && (
          <button 
            onClick={() => handleOpenModal()}
            className="hidden md:flex items-center gap-2 justify-center bg-primary hover:bg-primary/90 text-white rounded-xl px-5 h-10 font-medium transition-all shadow-[0_0_15px_rgba(124,58,237,0.4)] hover:shadow-[0_0_25px_rgba(124,58,237,0.7)]"
          >
            <Plus size={16} />
            Nova Pessoa
          </button>
        )}
      </div>

      <div className="flex-1 p-4 overflow-y-auto pb-24">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {users.map((user) => (
            <motion.div
              key={user.id}
              variants={{ hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <Card className="flex items-center justify-between group hover:border-primary/30 transition-all">
                <div className="flex items-center gap-3">
                  <Avatar name={user.name} color={user.color} photoUrl={user.photoUrl} />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold">{user.name}</span>
                      {user.role === 'admin' && (
                        <Shield size={13} className="text-primary" />
                      )}
                    </div>
                    <span className="text-xs text-text-muted font-mono truncate max-w-[140px]">
                      {user.email || 'sem email'}
                    </span>
                  </div>
                </div>
                {isAdmin && (
                  <button 
                    onClick={() => handleOpenModal(user)}
                    className={cn(
                      'p-2 text-text-muted hover:text-white hover:bg-bg-stripe rounded-full transition-colors',
                      'opacity-0 group-hover:opacity-100 md:opacity-100'
                    )}
                  >
                    <Edit2 size={18} />
                  </button>
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {isAdmin && (
        <div className="md:hidden">
          <FAB onClick={() => handleOpenModal()}>
            <Plus size={28} />
          </FAB>
        </div>
      )}

      <UserFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        userToEdit={editingUser}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
};
