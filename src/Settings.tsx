import { QrScanner } from "@yudiel/react-qr-scanner";
import { HTMLInputTypeAttribute, HTMLProps, InputHTMLAttributes, ReactNode, useReducer, useState } from "react";
import QRCode from "react-qr-code";
import { CouchdbSettings, defaultSettings } from "./hooks/pouchSync";
import { useLocalStorage } from "./hooks/settings";

import "./Settings.scss";

interface SettingAction {
  field: keyof CouchdbSettings;
  value: string;
}

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  children: ReactNode;
}

const Input = ({ children, name, ...props }: InputProps) => {
  return (
    <div>
      <label htmlFor={name}>{children}</label>
      <input id={name} name={name} {...props} />
    </div>
  );
};

const Settings = () => {
  const [settings, setSettings] = useLocalStorage<CouchdbSettings>("couchdb", defaultSettings);
  const [state, dispatch] = useReducer((state: CouchdbSettings, action: SettingAction) => {
    const newState = { ...state };
    newState[action.field] = action.value;

    return newState;
  }, settings);

  const [message, setMessage] = useState<string | undefined>();
  const [showQR, setShowQR] = useState<boolean>(false);
  const toggleQR = () => setShowQR((cur) => !cur);

  const [showScan, setShowScan] = useState<boolean>(false);
  const toggleScan = () => setShowScan((cur) => !cur);

  const save = () => {
    setSettings(state);
    setMessage("Saved: OK");
  };

  return (
    <div>
      {message ? <div>{message}</div> : null}
      <div>
        {showQR ? (
          <div style={{ background: "white", padding: "16px" }}>
            <QRCode value={JSON.stringify(settings)} />
          </div>
        ) : null}
        <button onClick={() => toggleQR()}>{showQR ? "Hide" : "Show"} QR Code</button>
      </div>
      <Input
        name="couchdb_database"
        value={state.database}
        onChange={(e) => dispatch({ field: "database", value: e.target.value })}
      >
        Sync Database
      </Input>

      <Input
        name="couchdb_server"
        value={state.server}
        onChange={(e) => dispatch({ field: "server", value: e.target.value })}
      >
        Sync Server
      </Input>
      <Input
        name="couchdb_username"
        autoComplete="off"
        value={state.username}
        onChange={(e) => dispatch({ field: "username", value: e.target.value })}
      >
        Username
      </Input>
      <Input
        type="password"
        name="couchdb_password"
        autoComplete="off"
        value={state.password}
        onChange={(e) => dispatch({ field: "password", value: e.target.value })}
      >
        Password
      </Input>
      <div>
        <button onClick={() => save()}>Save</button>
      </div>
      <hr />
      <div>
        {showScan ? (
          <QrScanner
            onDecode={(result) => {
              const scannedSettings = JSON.parse(result);
              const keys: Array<keyof CouchdbSettings> = ["database", "password", "server", "username"];
              keys.forEach((key) => {
                if (key in scannedSettings) {
                  dispatch({ field: key, value: scannedSettings[key] });
                }
              });
            }}
            onError={(error) => setMessage(error?.message)}
          />
        ) : null}
        <button onClick={() => toggleScan()}>{showScan ? "Hide" : "Show"} QR Scanner</button>
      </div>
    </div>
  );
};

export default Settings;
