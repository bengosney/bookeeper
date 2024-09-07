import { QrScanner } from "@yudiel/react-qr-scanner";
import { ReactNode, useEffect, useReducer, useState } from "react";
import QRCode from "react-qr-code";
import { CouchdbSettings, defaultSettings as couchdbDefaultSettings } from "./hooks/pouchSync";
import { useLocalStorage } from "./hooks/settings";
import { getConfig } from "./config";
import { useSettings, useUpdateSettings, Settings as SettingsType, defaultSettings } from "./documents/settings";

import "./Settings.scss";

interface SettingsActionBase {
  field: keyof typeof defaultSettings;
  value: string | boolean;
}

interface SettingsActionCorsProxy extends SettingsActionBase {
  field: "corsProxy";
  value: string;
}

interface SettingsActionUseCorsProxy extends SettingsActionBase {
  field: "useCorsProxy";
  value: boolean;
}

type SettingsAction = SettingsActionCorsProxy | SettingsActionUseCorsProxy;

interface CouchdbSettingAction {
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
  const [couchdbSettings, setCouchdbSettings] = useLocalStorage<CouchdbSettings>("couchdb", couchdbDefaultSettings);
  const [couchdbState, couchdbDispatch] = useReducer((state: CouchdbSettings, action: CouchdbSettingAction) => {
    const newState = { ...state };
    newState[action.field] = action.value;

    return newState;
  }, couchdbSettings);

  const { settings, loading, error } = useSettings();
  const [settingsState, settingsDispatch] = useReducer((state: Required<SettingsType>, action: SettingsAction) => {
    const newState = { ...state };
    switch (action.field) {
      case "corsProxy":
        newState.corsProxy = action.value;
        break;
      case "useCorsProxy":
        newState.useCorsProxy = action.value;
        break;
    }

    return newState;
  }, defaultSettings);

  useEffect(() => {
    if (settings) {
      if (settings.corsProxy !== undefined) {
        settingsDispatch({ field: "corsProxy", value: settings.corsProxy });
      }
      if (settings.useCorsProxy !== undefined) {
        settingsDispatch({ field: "useCorsProxy", value: settings.useCorsProxy });
      }
    }
  }, [settings]);

  const updateSettings = useUpdateSettings();

  const [message, setMessage] = useState<string | undefined>();
  const [showQR, setShowQR] = useState<boolean>(false);
  const toggleQR = () => setShowQR((cur) => !cur);

  const [showScan, setShowScan] = useState<boolean>(false);
  const toggleScan = () => setShowScan((cur) => !cur);

  const save = () => {
    setCouchdbSettings(couchdbState);
    setMessage("Saved: OK");
    updateSettings(settingsState);
  };

  return (
    <div className="form">
      {message ? <div>{message}</div> : null}
      <fieldset>
        <legend>CouchDB Sync Settings</legend>
        <Input
          name="couchdb_database"
          value={couchdbState.database}
          onChange={(e) => couchdbDispatch({ field: "database", value: e.target.value })}
        >
          Sync Database
        </Input>
        <Input
          name="couchdb_server"
          value={couchdbState.server}
          onChange={(e) => couchdbDispatch({ field: "server", value: e.target.value })}
        >
          Sync Server
        </Input>
        <Input
          name="couchdb_username"
          autoComplete="off"
          value={couchdbState.username}
          onChange={(e) => couchdbDispatch({ field: "username", value: e.target.value })}
        >
          Username
        </Input>
        <Input
          type="password"
          name="couchdb_password"
          autoComplete="off"
          value={couchdbState.password}
          onChange={(e) => couchdbDispatch({ field: "password", value: e.target.value })}
        >
          Password
        </Input>
      </fieldset>
      <fieldset>
        {error ? <div>{error.message}</div> : null}
        <legend>CORS Proxy</legend>
        <Input
          name="use_cors_proxy"
          value="use_cors_proxy"
          checked={settingsState?.useCorsProxy || false}
          type="checkbox"
          onChange={(e) => settingsDispatch({ field: "useCorsProxy", value: e.target.checked })}
        >
          Use CORS Proxy
        </Input>
        <Input
          name="cors_proxy"
          value={settingsState?.corsProxy || ""}
          onChange={(e) => settingsDispatch({ field: "corsProxy", value: e.target.value })}
          disabled={loading || error != null}
        >
          CORS Proxy Server
        </Input>
      </fieldset>
      <div>
        <button onClick={() => save()}>Save</button>
      </div>
      <hr />
      <div>
        <button onClick={() => toggleQR()}>{showQR ? "Hide" : "Show"} Settings QR Code</button>
        {showQR ? (
          <div className="qr-code">
            <QRCode value={JSON.stringify(couchdbSettings)} />
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
                    couchdbDispatch({ field: key, value: scannedSettings[key] });
                  }
                });
              }}
              onError={(error) => setMessage(error?.message)}
            />
          </div>
        ) : null}
      </div>
      <hr />
      <small>Build: {getConfig("build")}</small>
    </div>
  );
};

export default Settings;
