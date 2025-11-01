// Central type definitions for Smart School Bus System

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'parent' | 'driver';
  permissions?: string[];  // Added permissions property for API integration
  avatar?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BusLocation {
  id: number;
  busNumber: string;
  driver: string;
  route: string;
  lat: number;
  lng: number;
  speed: number;
  direction: number;
  status: 'Đang di chuyển' | 'Dừng đón khách' | 'Sự cố' | 'Nghỉ trưa';
  students: number;
  lastUpdate: string;
  nextStop: string;
  estimatedArrival: string;
  routeStops: string[];
  currentStopIndex: number;
}

export interface Schedule {
  id: number;
  route: string;
  time: string;
  students: number;
  driver: string;
  bus: string;
  status: string;
}

export interface Student {
  id: number;
  name: string;
  grade: string;
  bus: string;
  pickup: string;
  dropoff: string;
  pickupTime: string;
  dropoffTime: string;
  parent: string;
  phone: string;
  status: string;
}

export interface Driver {
  id: number;
  name: string;
  license: string;
  phone: string;
  bus: string;
  experience: string;
  rating: number;
  status: string;
}

export interface Bus {
  id: number;
  number: string;
  capacity: number;
  driver: string;
  route: string;
  status: string;
  lastMaintenance: string;
  nextMaintenance: string;
}

export interface Notification {
  id: number;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  busNumber?: string;
  route?: string;
}

export interface FormField {
  name: string;
  type: 'text' | 'time' | 'number' | 'select' | 'date';
  label?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  defaultValue?: string | number;
}