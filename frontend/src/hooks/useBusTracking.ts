// Bus tracking hook for Smart School Bus System
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { BusLocation } from '../types';
import { useAppData } from '../contexts/AppDataContext';
import { AUTO_REFRESH_INTERVAL } from '../constants';

export const useBusTracking = () => {
  // Get bus locations from global context
  const { busLocations, setBusLocations } = useAppData();
  
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedBus, setSelectedBus] = useState<number | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Update bus locations with random movement (preserving status and students for consistency)
  const updateBusLocations = useCallback(() => {
    setBusLocations(prev => prev.map(bus => ({
      ...bus,
      lat: bus.lat + (Math.random() - 0.5) * 0.001,
      lng: bus.lng + (Math.random() - 0.5) * 0.001,
      speed: Math.max(0, bus.speed + (Math.random() - 0.5) * 10),
      lastUpdate: new Date().toLocaleTimeString('vi-VN'),
      // Preserve status and students for consistency - don't randomize
    })));
  }, [setBusLocations]);

  // Preserve selectedBus when data updates - reset only if bus no longer exists
  useEffect(() => {
    if (selectedBus !== null) {
      const stillExists = busLocations.some(bus => bus.id === selectedBus);
      if (!stillExists) {
        setSelectedBus(null);
      }
    }
  }, [busLocations, selectedBus]);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(updateBusLocations, AUTO_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [autoRefresh, updateBusLocations]);

  // Search functionality
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    return busLocations.filter(bus =>
      bus.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.driver.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [busLocations, searchQuery]);

  // Filtered buses (stable filtering) - ensure unique IDs
  const filteredBuses = useMemo(() => {
    let buses = filterStatus === 'all' ? busLocations : busLocations.filter(bus => 
      bus.status.toLowerCase().includes(filterStatus.toLowerCase())
    );
    
    // Debug log to check for duplicates
    console.log('Original buses count:', buses.length);
    const uniqueBuses = buses.filter((bus, index, self) => 
      index === self.findIndex(b => b.id === bus.id)
    );
    console.log('Unique buses count:', uniqueBuses.length);
    
    if (buses.length !== uniqueBuses.length) {
      console.warn('Found duplicate bus IDs in data!');
    }
    
    return uniqueBuses;
  }, [busLocations, filterStatus]);

  // Search handlers
  const handleSearchSelect = useCallback((bus: BusLocation) => {
    setSelectedBus(bus.id);
    setSearchQuery('');
    setShowSearchResults(false);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setShowSearchResults(false);
  }, []);

  // Filter handler
  const handleFilterChange = useCallback((status: string) => {
    setFilterStatus(status);
  }, []);

  return {
    // States
    busLocations,
    filteredBuses,
    filterStatus,
    selectedBus,
    autoRefresh,
    searchQuery,
    searchResults,
    showSearchResults,

    // Actions
    setFilterStatus: handleFilterChange,
    setSelectedBus,
    setAutoRefresh,
    setSearchQuery,
    setShowSearchResults,
    updateBusLocations,
    handleSearchSelect,
    clearSearch
  };
};