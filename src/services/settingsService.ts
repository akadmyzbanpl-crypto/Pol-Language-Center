import { AcademySettings } from '../types';
import { store } from './storeService';

export const settingsService = {
  getSettings(): AcademySettings {
    return store.getSettings();
  },

  updateSettings(data: Partial<AcademySettings>): AcademySettings {
    const current = store.getSettings();
    const updated = { ...current, ...data };
    store.saveSettings(updated);
    return updated;
  },
};
