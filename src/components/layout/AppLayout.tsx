import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Car, Wallet, Handshake, Users, UserCircle, CalendarDays } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { useAppStore } from '../../store/useAppStore';
import logo from '../../assets/logo.png';

const navItems = [
  { path: '/', label: 'Corridas', icon: Car },
  { path: '/saldos', label: 'Saldos', icon: Wallet },
  { path: '/fechamento', label: 'Fechamento', icon: Handshake },
  { path: '/pessoas', label: 'Pessoas', icon: Users },
  { path: '/perfil', label: 'Perfil', icon: UserCircle },
];

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border-subtle bg-bg-card pb-safe md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors',
                isActive ? 'text-primary drop-shadow-[0_0_8px_rgba(124,58,237,0.8)]' : 'text-text-muted hover:text-text-main'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={24}
                  className={cn('mb-1 transition-transform', isActive ? 'scale-110' : '')}
                />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export const Sidebar: React.FC = () => {
  const { selectedMonth, setSelectedMonth } = useAppStore();
  return (
    <aside className="hidden w-64 flex-col border-r border-border-subtle bg-bg-card md:flex">
      <div className="p-6">
        <img src={logo} alt="Uber Share Logo" className="w-full drop-shadow-[0_0_10px_rgba(124,58,237,0.3)]" />
      </div>

      <div className="px-4 mb-6">
        <label className="text-xs text-text-muted font-semibold mb-1 flex items-center gap-1">
          <CalendarDays size={14} /> Mês de Referência
        </label>
        <input 
          type="month" 
          value={selectedMonth || ''}
          onChange={(e) => setSelectedMonth(e.target.value || null)}
          className="w-full bg-bg-stripe text-white border border-border-subtle rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition-all',
                isActive
                  ? 'bg-primary/20 text-primary shadow-[inset_4px_0_0_var(--color-primary)] bg-gradient-to-r from-primary/10 to-transparent'
                  : 'text-text-muted hover:bg-bg-stripe hover:text-text-main'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} className={isActive ? 'drop-shadow-[0_0_8px_rgba(124,58,237,0.8)]' : ''} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export const TopBarMobile: React.FC = () => {
  const { selectedMonth, setSelectedMonth } = useAppStore();
  return (
    <div className="md:hidden bg-bg-card border-b border-border-subtle p-3 flex items-center justify-between sticky top-0 z-30">
      <img src={logo} alt="Uber Share Logo" className="h-8 drop-shadow-[0_0_10px_rgba(124,58,237,0.3)]" />
      <input 
        type="month" 
        value={selectedMonth || ''}
        onChange={(e) => setSelectedMonth(e.target.value || null)}
        className="bg-bg-stripe text-white border border-border-subtle rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-primary transition-colors w-36"
      />
    </div>
  );
};

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  return (
    <div className="flex h-screen w-full bg-bg-main overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col relative h-full w-full overflow-hidden">
        <TopBarMobile />
        <div className="flex-1 overflow-y-auto pb-20 md:pb-0 no-scrollbar relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};
