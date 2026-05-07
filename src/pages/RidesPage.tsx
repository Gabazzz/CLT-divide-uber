import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { RideCard } from '../components/rides/RideCard';
import { RideFormModal } from '../components/rides/RideFormModal';
import { motion } from 'framer-motion';
import { FAB } from '../components/ui/FAB';
import { Car, Plus } from 'lucide-react';
import type { Ride } from '../types';
import { formatCurrency } from '../utils/helpers';

export const RidesPage: React.FC = () => {
  const { rides, users, addRide, updateRide, deleteRide, currentUser, selectedMonth } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRide, setEditingRide] = useState<Ride | undefined>(undefined);
  const isAdmin = currentUser?.role === 'admin';

  const filteredRides = selectedMonth 
    ? rides.filter(r => r.date.startsWith(selectedMonth))
    : rides;

  const handleOpenModal = (ride?: Ride) => {
    if (!isAdmin) return;
    setEditingRide(ride);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setEditingRide(undefined), 200); // clear after animation
  };

  const handleSave = (ride: Ride) => {
    if (editingRide) {
      updateRide(ride);
    } else {
      addRide(ride);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta corrida?')) {
      deleteRide(id);
      handleCloseModal();
    }
  };

  const totalValue = filteredRides.reduce((acc, ride) => acc + ride.totalValue, 0);
  const avgPerPerson = filteredRides.length > 0
    ? filteredRides.reduce((acc, ride) => acc + (ride.totalValue / (ride.participantIds.length || 1)), 0) / filteredRides.length
    : 0;

  return (
    <div className="flex flex-col h-full relative">
      {/* Header and Summary */}
      <div className="bg-bg-main pt-6 pb-4 px-4 sticky top-0 z-10 shadow-sm border-b border-border-subtle">
        <h1 className="text-2xl font-bold mb-4">Corridas</h1>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
          <div className="bg-bg-card border border-border-subtle rounded-xl p-3 min-w-[120px] flex flex-col items-center justify-center">
            <span className="text-text-muted text-xs font-semibold mb-1">Total</span>
            <span className="text-white font-bold">{filteredRides.length} corridas</span>
          </div>
          <div className="bg-bg-card border border-border-subtle rounded-xl p-3 min-w-[140px] flex flex-col items-center justify-center">
            <span className="text-text-muted text-xs font-semibold mb-1">Custo Total</span>
            <span className="text-white font-bold text-lg">{formatCurrency(totalValue)}</span>
          </div>
          <div className="bg-bg-card border border-border-subtle rounded-xl p-3 min-w-[140px] flex flex-col items-center justify-center">
            <span className="text-text-muted text-xs font-semibold mb-1">Média/Pessoa</span>
            <span className="text-white font-bold">{formatCurrency(avgPerPerson)}</span>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 p-4 overflow-y-auto pb-24">
        {filteredRides.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 mt-12">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Car size={40} className="text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">Nenhuma corrida</h2>
            <p className="text-text-muted max-w-[250px]">
              Adicione a primeira corrida para começar a dividir os custos com o grupo.
            </p>
          </div>
        ) : (
          <motion.div
            className="flex flex-col gap-3"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          >
            {filteredRides.map((ride) => (
              <motion.div
                key={ride.id}
                variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <RideCard
                  ride={ride}
                  payer={users.find(u => u.id === ride.payerId)}
                  participants={ride.participantIds.map(id => users.find(u => u.id === id)).filter((u): u is typeof users[0] => !!u)}
                  onClick={() => handleOpenModal(ride)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {isAdmin && (
        <FAB onClick={() => handleOpenModal()}>
          <Plus size={28} />
        </FAB>
      )}

      <RideFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        users={users}
        rideToEdit={editingRide}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
};
