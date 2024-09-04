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
    <div className="form">
      {message ? <div>{message}</div> : null}
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
        <button onClick={() => toggleQR()}>{showQR ? "Hide" : "Show"} Settings QR Code</button>
        {showQR ? (
          <div className="qr-code">
            <QRCode value={JSON.stringify(settings)} />
          </div>
        ) : null}
      </div>
      <div>
        <button onClick={() => toggleScan()}>{showScan ? "Hide" : "Show"} Settings QR Scanner</button>
        {showScan ? (
          <div className="qr-scanner">
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
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Settings;
