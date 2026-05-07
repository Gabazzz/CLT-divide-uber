export type RideStatus = 'pago' | 'pendente' | 'parcial';
export type RideType = 'ida' | 'volta';

export interface User {
  id: string;
  name: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'user';
  photoUrl?: string;
  pixKey?: string;
  color?: string;
}

export interface Ride {
  id: string;
  date: string; // ISO string
  type: RideType;
  payerId: string;
  participantIds: string[];
  totalValue: number;
  status: RideStatus;
  notes?: string;
}

export interface Balance {
  userId: string;
  totalPaid: number;
  totalUsed: number;
  balance: number; // totalPaid - totalUsed
}

export interface Settlement {
  fromUserId: string;
  toUserId: string;
  amount: number;
}
