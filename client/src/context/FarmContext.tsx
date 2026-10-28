import React, { createContext, useContext, useState, useEffect } from 'react';
import { Plot, UserProfile } from '../types';
import { fetchPlots, fetchUserProfile } from '../api/plots';

interface FarmContextType {
  isOnline: boolean;
  user: UserProfile | null;
  plots: Plot[];
  selectedPlot: Plot | null;
  setSelectedPlot: (plot: Plot | null) => void;
  isLoadingPlots: boolean;
  refreshPlots: () => Promise<void>;
  isDistressModalOpen: boolean;
  openDistressModal: () => void;
  closeDistressModal: () => void;
}

const FarmContext = createContext<FarmContextType>({
  isOnline: true,
  user: null,
  plots: [],
  selectedPlot: null,
  setSelectedPlot: () => {},
  isLoadingPlots: false,
  refreshPlots: async () => {},
  isDistressModalOpen: false,
  openDistressModal: () => {},
  closeDistressModal: () => {}
});

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [isLoadingPlots, setIsLoadingPlots] = useState(false);
  const [isDistressModalOpen, setIsDistressModalOpen] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadData = async () => {
    try {
      setIsLoadingPlots(true);
      const [userData, plotsData] = await Promise.all([
        fetchUserProfile().catch(() => null),
        fetchPlots().catch(() => [])
      ]);

      if (userData?.user) {
        setUser(userData.user);
      }
      if (plotsData && Array.isArray(plotsData)) {
        setPlots(plotsData);
        if (plotsData.length > 0 && !selectedPlot) {
          setSelectedPlot(plotsData[0]);
        }
      }
    } catch (e) {
      console.warn('Could not fetch farm state:', e);
    } finally {
      setIsLoadingPlots(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <FarmContext.Provider
      value={{
        isOnline,
        user,
        plots,
        selectedPlot,
        setSelectedPlot,
        isLoadingPlots,
        refreshPlots: loadData,
        isDistressModalOpen,
        openDistressModal: () => setIsDistressModalOpen(true),
        closeDistressModal: () => setIsDistressModalOpen(false)
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => useContext(FarmContext);
