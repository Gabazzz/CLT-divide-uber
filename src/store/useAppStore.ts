import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Ride, User, Balance, Settlement } from '../types';
import { generateInitialUsers } from '../utils/helpers';

interface AppState {
  users: User[];
  rides: Ride[];
  currentUser: User | null;
  selectedMonth: string | null;
  
  // Auth Actions
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  updateProfile: (user: Partial<User>) => void;
  setSelectedMonth: (month: string | null) => void;

  // Actions
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  
  addRide: (ride: Ride) => void;
  updateRide: (ride: Ride) => void;
  deleteRide: (id: string) => void;

  // Selectors/Computed
  getBalances: () => Balance[];
  getSettlements: () => Settlement[];
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      users: generateInitialUsers(),
      rides: [],
      currentUser: null,
      selectedMonth: new Date().toISOString().substring(0, 7), // yyyy-MM

      login: (email, pass) => {
        const user = get().users.find(u => u.email === email && u.password === pass);
        if (user) {
          set({ currentUser: user });
          return true;
        }
        return false;
      },

      logout: () => set({ currentUser: null }),
      setSelectedMonth: (month) => set({ selectedMonth: month }),

      updateProfile: (updates) => set((state) => {
        if (!state.currentUser) return state;
        const updatedUser = { ...state.currentUser, ...updates };
        return {
          currentUser: updatedUser,
          users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u)
        };
      }),

      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      updateUser: (updatedUser) => set((state) => ({
        users: state.users.map((u) => u.id === updatedUser.id ? updatedUser : u),
        currentUser: state.currentUser?.id === updatedUser.id ? updatedUser : state.currentUser
      })),
      deleteUser: (id) => set((state) => ({
        users: state.users.filter((u) => u.id !== id)
      })),

      addRide: (ride) => set((state) => ({ rides: [ride, ...state.rides] })),
      updateRide: (updatedRide) => set((state) => ({
        rides: state.rides.map((r) => r.id === updatedRide.id ? updatedRide : r)
      })),
      deleteRide: (id) => set((state) => ({
        rides: state.rides.filter((r) => r.id !== id)
      })),

      getBalances: () => {
        const { users, rides, selectedMonth } = get();
        const balancesMap: Record<string, Balance> = {};

        users.forEach(u => {
          balancesMap[u.id] = { userId: u.id, totalPaid: 0, totalUsed: 0, balance: 0 };
        });

        const filteredRides = selectedMonth 
          ? rides.filter(r => r.date.startsWith(selectedMonth))
          : rides;

        filteredRides.forEach(ride => {
          const isPaidOrPartial = ride.status === 'pago' || ride.status === 'parcial';
          
          if (isPaidOrPartial && balancesMap[ride.payerId]) {
            balancesMap[ride.payerId].totalPaid += ride.totalValue;
          }

          if (ride.participantIds.length > 0) {
            const costPerPerson = ride.totalValue / ride.participantIds.length;
            ride.participantIds.forEach(pId => {
              if (balancesMap[pId]) {
                balancesMap[pId].totalUsed += costPerPerson;
              }
            });
          }
        });

        const balances = Object.values(balancesMap).map(b => ({
          ...b,
          balance: b.totalPaid - b.totalUsed
        }));

        return balances;
      },

      getSettlements: () => {
        const balances = get().getBalances();
        
        const debtors = balances.filter(b => b.balance < -0.01).map(b => ({ ...b })).sort((a, b) => a.balance - b.balance);
        const creditors = balances.filter(b => b.balance > 0.01).map(b => ({ ...b })).sort((a, b) => b.balance - a.balance);

        const settlements: Settlement[] = [];

        let i = 0;
        let j = 0;

        while (i < debtors.length && j < creditors.length) {
          const debtor = debtors[i];
          const creditor = creditors[j];

          const amountToSettle = Math.min(Math.abs(debtor.balance), creditor.balance);

          if (amountToSettle > 0.01) {
            settlements.push({
              fromUserId: debtor.userId,
              toUserId: creditor.userId,
              amount: amountToSettle
            });
          }

          debtor.balance += amountToSettle;
          creditor.balance -= amountToSettle;

          if (Math.abs(debtor.balance) < 0.01) i++;
          if (creditor.balance < 0.01) j++;
        }

        return settlements;
      }
    }),
    {
      name: 'uber-shared-storage',
    }
  )
);
