import { useEffect } from "react";
import { usePouch } from "use-pouchdb";
import { useLocalStorage } from "./settings";
import PouchDB from "pouchdb-browser";

export interface CouchdbSettings {
  database: string;
  server: string;
  username: string;
  password: string;
}

export const defaultSettings = {
  database: "bookeeper",
  server: "",
  username: "",
  password: "",
};

const usePouchSync = () => {
  const [settings, _] = useLocalStorage<CouchdbSettings>("couchdb", defaultSettings);
  const db = usePouch();

  useEffect(() => {
    if (settings.database && settings.server && settings.username && settings.password) {
      const url = `https://${settings.server}/${settings.database}`;
      const remoteDB = new PouchDB(url, {
        auth: {
          username: settings.username,
          password: settings.password,
        },
      });
      const sync = db.sync(remoteDB, { live: true, retry: true });

      return () => sync.cancel();
    }
  }, [settings]);
};

export default usePouchSync;
