import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from '../services/api/config';

// Types cho Socket events
interface LocationUpdate {
  busId: number;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp: string;
  busInfo?: any;
}

interface StatusUpdate {
  busId: number;
  status: string;
  message?: string;
  timestamp: string;
  busInfo?: any;
}

interface EmergencyAlert {
  id: number;
  busId: number;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location?: { latitude: number; longitude: number };
  timestamp: string;
  busInfo?: any;
}

interface AttendanceUpdate {
  studentId: number;
  busId: number;
  status: string;
  timestamp: string;
}

interface RoomData {
  schoolId?: number;
  busId?: number;
  role: 'parent' | 'driver' | 'admin';
}

// Socket Context Interface
interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (roomData: RoomData) => void;
  sendLocationUpdate: (data: Omit<LocationUpdate, 'timestamp'>) => void;
  sendStatusUpdate: (data: Omit<StatusUpdate, 'timestamp'>) => void;
  sendEmergencyAlert: (data: Omit<EmergencyAlert, 'id' | 'timestamp'>) => void;
  sendAttendanceUpdate: (data: Omit<AttendanceUpdate, 'timestamp'>) => void;
  
  // Event listeners
  onLocationUpdate: (callback: (data: LocationUpdate) => void) => void;
  onStatusUpdate: (callback: (data: StatusUpdate) => void) => void;
  onEmergencyAlert: (callback: (data: EmergencyAlert) => void) => void;
  onAttendanceUpdate: (callback: (data: AttendanceUpdate) => void) => void;
  
  // Cleanup listeners
  offLocationUpdate: (callback: (data: LocationUpdate) => void) => void;
  offStatusUpdate: (callback: (data: StatusUpdate) => void) => void;
  offEmergencyAlert: (callback: (data: EmergencyAlert) => void) => void;
  offAttendanceUpdate: (callback: (data: AttendanceUpdate) => void) => void;
}

// Create Socket Context
const SocketContext = createContext<SocketContextType | null>(null);

// Socket Provider Props
interface SocketProviderProps {
  children: ReactNode;
  autoConnect?: boolean;
}

// Socket Provider Component
export const SocketProvider: React.FC<SocketProviderProps> = ({ 
  children, 
  autoConnect = true 
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (autoConnect) {
      const newSocket = io(API_CONFIG.SOCKET_URL, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true,
      });

      // Connection event handlers
      newSocket.on('connect', () => {
        console.log('🔌 Connected to Socket.IO server');
        setIsConnected(true);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('❌ Disconnected from Socket.IO server:', reason);
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('🚨 Socket connection error:', error);
        setIsConnected(false);
      });

      newSocket.on('roomJoined', (data) => {
        console.log('🏠 Joined rooms successfully:', data);
      });

      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        console.log('🧹 Cleaning up socket connection');
        newSocket.close();
      };
    }
  }, [autoConnect]);

  // Socket methods
  const joinRoom = (roomData: RoomData) => {
    if (socket && isConnected) {
      socket.emit('joinRoom', roomData);
      console.log('📡 Joining room:', roomData);
    } else {
      console.warn('⚠️ Socket not connected, cannot join room');
    }
  };

  const sendLocationUpdate = (data: Omit<LocationUpdate, 'timestamp'>) => {
    if (socket && isConnected) {
      const locationData = {
        ...data,
        timestamp: new Date().toISOString(),
      };
      socket.emit('busLocationUpdate', locationData);
      console.log('📍 Sent location update:', locationData);
    } else {
      console.warn('⚠️ Socket not connected, cannot send location update');
    }
  };

  const sendStatusUpdate = (data: Omit<StatusUpdate, 'timestamp'>) => {
    if (socket && isConnected) {
      const statusData = {
        ...data,
        timestamp: new Date().toISOString(),
      };
      socket.emit('busStatusChange', statusData);
      console.log('🚌 Sent status update:', statusData);
    } else {
      console.warn('⚠️ Socket not connected, cannot send status update');
    }
  };

  const sendEmergencyAlert = (data: Omit<EmergencyAlert, 'id' | 'timestamp'>) => {
    if (socket && isConnected) {
      const alertData = {
        ...data,
        timestamp: new Date().toISOString(),
      };
      socket.emit('emergencyAlert', alertData);
      console.log('🚨 Sent emergency alert:', alertData);
    } else {
      console.warn('⚠️ Socket not connected, cannot send emergency alert');
    }
  };

  const sendAttendanceUpdate = (data: Omit<AttendanceUpdate, 'timestamp'>) => {
    if (socket && isConnected) {
      const attendanceData = {
        ...data,
        timestamp: new Date().toISOString(),
      };
      socket.emit('attendanceUpdate', attendanceData);
      console.log('✅ Sent attendance update:', attendanceData);
    } else {
      console.warn('⚠️ Socket not connected, cannot send attendance update');
    }
  };

  // Event listeners
  const onLocationUpdate = (callback: (data: LocationUpdate) => void) => {
    if (socket) {
      socket.on('locationUpdate', callback);
      socket.on('busLocationUpdate', callback);
    }
  };

  const onStatusUpdate = (callback: (data: StatusUpdate) => void) => {
    if (socket) {
      socket.on('statusUpdate', callback);
      socket.on('busStatusUpdate', callback);
    }
  };

  const onEmergencyAlert = (callback: (data: EmergencyAlert) => void) => {
    if (socket) {
      socket.on('emergencyAlert', callback);
    }
  };

  const onAttendanceUpdate = (callback: (data: AttendanceUpdate) => void) => {
    if (socket) {
      socket.on('attendanceUpdate', callback);
    }
  };

  // Cleanup listeners
  const offLocationUpdate = (callback: (data: LocationUpdate) => void) => {
    if (socket) {
      socket.off('locationUpdate', callback);
      socket.off('busLocationUpdate', callback);
    }
  };

  const offStatusUpdate = (callback: (data: StatusUpdate) => void) => {
    if (socket) {
      socket.off('statusUpdate', callback);
      socket.off('busStatusUpdate', callback);
    }
  };

  const offEmergencyAlert = (callback: (data: EmergencyAlert) => void) => {
    if (socket) {
      socket.off('emergencyAlert', callback);
    }
  };

  const offAttendanceUpdate = (callback: (data: AttendanceUpdate) => void) => {
    if (socket) {
      socket.off('attendanceUpdate', callback);
    }
  };

  // Context value
  const contextValue: SocketContextType = {
    socket,
    isConnected,
    joinRoom,
    sendLocationUpdate,
    sendStatusUpdate,
    sendEmergencyAlert,
    sendAttendanceUpdate,
    onLocationUpdate,
    onStatusUpdate,
    onEmergencyAlert,
    onAttendanceUpdate,
    offLocationUpdate,
    offStatusUpdate,
    offEmergencyAlert,
    offAttendanceUpdate,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook để sử dụng Socket Context
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

// Export types
export type {
  LocationUpdate,
  StatusUpdate,
  EmergencyAlert,
  AttendanceUpdate,
  RoomData,
  SocketContextType,
};