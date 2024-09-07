import { useDoc, usePouch } from "use-pouchdb";
import { PouchDocument } from "./types";

export interface Settings {
  corsProxy?: string;
  useCorsProxy?: boolean;
}

export interface SettingsDoc extends Omit<PouchDocument<Settings>, "_rev"> {
  type: "settings";
}

export const settingsToDoc = (settings: Settings): SettingsDoc => {
  return {
    ...settings,
    type: "settings",
    _id: "settings",
  };
};

export interface SettingsState {
  settings: Settings | null;
  loading: boolean;
  error: PouchDB.Core.Error | null;
}

export const useSettings = (): SettingsState => {
  const { doc: settings, loading: _loading, error: _error } = useDoc<SettingsDoc>("settings");

  const loading = _loading && settings == null;
  const error = _error && _error.status !== 404 ? _error : null;

  return { settings, loading, error };
};

type UpdateSettings = (settings: Settings) => void;

export const useUpdateSettings = (): UpdateSettings => {
  const db = usePouch();

  return (settings: Settings) => db.upsert("settings", (doc) => ({ ...doc, ...settings }));
};

export const defaultSettings: Required<Settings> = { corsProxy: "", useCorsProxy: false };
