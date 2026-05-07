import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Camera, LogOut, Shield, User as UserIcon, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateProfile, logout } = useAppStore();
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === 'admin';

  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState(currentUser?.password || '');
  const [isSaved, setIsSaved] = useState(false);

  // Sync when currentUser updates (e.g. after photo upload)
  useEffect(() => {
    setEmail(currentUser?.email || '');
    setPassword(currentUser?.password || '');
  }, [currentUser?.id]);

  if (!currentUser) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ email, password });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="bg-bg-main pt-6 pb-4 px-4 sticky top-0 z-10 shadow-sm border-b border-border-subtle flex justify-between items-center">
        <h1 className="text-2xl font-bold">Meu Perfil</h1>
        <button onClick={handleLogout} className="text-danger flex items-center gap-2 p-2 hover:bg-danger/10 rounded-lg transition-colors">
          <LogOut size={20} />
          <span className="hidden md:inline font-medium">Sair</span>
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto pb-24 flex flex-col gap-5 items-center">
        <motion.div
          className="w-full max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Card className="flex flex-col items-center p-8">
            {/* Avatar + upload */}
            <div className="relative mb-5">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary/40 shadow-[0_0_20px_rgba(124,58,237,0.4)]">
                {currentUser.photoUrl ? (
                  <img src={currentUser.photoUrl} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <Avatar name={currentUser.name} color={currentUser.color} size="lg" className="!w-28 !h-28 !text-3xl" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-[0_0_12px_rgba(124,58,237,0.6)]">
                <Camera size={18} />
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>

            <h2 className="text-2xl font-bold text-white mb-1">{currentUser.name}</h2>
            <div className={cn(
              'flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider mb-8',
              isAdmin ? 'bg-primary/20 text-primary' : 'bg-bg-stripe text-text-muted'
            )}>
              {isAdmin ? <Shield size={12} /> : <UserIcon size={12} />}
              {isAdmin ? 'Administrador' : 'Usuário Comum'}
            </div>

            {/* Form – always editable (it's the user's own profile) */}
            <form onSubmit={handleSave} className="w-full flex flex-col gap-4">
              <Input
                label="E-mail de Acesso"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                required
              />

              <motion.div whileTap={{ scale: 0.98 }}>
                <Button type="submit" fullWidth className={cn('mt-2', isSaved && 'bg-success hover:bg-success')}>
                  {isSaved ? '✓ Salvo com sucesso!' : 'Salvar Alterações'}
                </Button>
              </motion.div>
            </form>
          </Card>

          {/* Info card for non-admins */}
          {!isAdmin && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 flex items-start gap-3 bg-warning/10 border border-warning/30 rounded-xl p-4"
            >
              <Lock size={18} className="text-warning mt-0.5 shrink-0" />
              <p className="text-sm text-warning/90 leading-relaxed">
                Você pode alterar seu próprio e-mail, senha e foto. Para mudar o nível de acesso, peça ao administrador.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
