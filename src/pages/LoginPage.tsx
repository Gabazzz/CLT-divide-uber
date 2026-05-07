import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Car } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, currentUser } = useAppStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simulate network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    const success = login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('E-mail ou senha inválidos.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-bg-main relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[100px] pointer-events-none" />

      <Card className="w-full max-w-md p-8 shadow-2xl relative z-10 border-border-subtle/50 bg-bg-card/80 backdrop-blur-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-4 shadow-[var(--shadow-glow)]">
            <Car size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Uber Share</h1>
          <p className="text-text-muted text-sm mt-1">Faça login para continuar</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@admin.com"
            required
            autoComplete="email"
          />
          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />

          {error && <p className="text-sm text-danger text-center">{error}</p>}

          <Button type="submit" fullWidth isLoading={isLoading} className="mt-2">
            Entrar
          </Button>
        </form>

        <div className="mt-8 text-center text-xs text-text-muted">
          <p>Dica: O email master é admin@admin.com</p>
          <p>Senha padrão: 123</p>
        </div>
      </Card>
    </div>
  );
};
