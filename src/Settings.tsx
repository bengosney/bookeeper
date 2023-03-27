import { useReducer, useState } from "react";
import { CouchdbSettings, defaultSettings } from "./hooks/pouchSync";
import { useLocalStorage } from "./hooks/settings";

interface SettingAction {
  field: keyof CouchdbSettings;
  value: string;
}

const Settings = () => {
  const [settings, setSettings] = useLocalStorage<CouchdbSettings>("couchdb", defaultSettings);
  const [state, dispatch] = useReducer((state: CouchdbSettings, action: SettingAction) => {
    const newState = { ...state };
    newState[action.field] = action.value;

    return newState;
  }, settings);

  const [message, setMessage] = useState<string | undefined>();

  const save = () => {
    setSettings(state);
    setMessage("Saved: OK");
  };

  return (
    <div>
      {message ? <div>{message}</div> : null}
      <div>
        <label htmlFor="couchdb_database">Sync Database</label>
        <input
          name="couchdb_database"
          value={state.database}
          onChange={(e) => dispatch({ field: "database", value: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="couchdb_server">Sync Server</label>
        <input
          name="couchdb_server"
          value={state.server}
          onChange={(e) => dispatch({ field: "server", value: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="couchdb_username">Username</label>
        <input
          name="couchdb_username"
          autoComplete="off"
          value={state.username}
          onChange={(e) => dispatch({ field: "username", value: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="couchdb_password">Password</label>
        <input
          type="password"
          name="couchdb_password"
          autoComplete="off"
          value={state.password}
          onChange={(e) => dispatch({ field: "password", value: e.target.value })}
        />
      </div>
      <div>
        <button onClick={() => save()}>Save</button>
      </div>
    </div>
  );
};

export default Settings;
