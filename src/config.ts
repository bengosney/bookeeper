interface Confg {
  build: string;
}

interface ConfigObject {
  dev: Confg;
  prod: Confg;
  defaults: Confg;
}

type Env = keyof ConfigObject;

const dev: Confg = { build: "dev" };
const prod: Confg = { build: "%%date%%" };
const defaults: Confg = { ...prod };

const config: ConfigObject = { dev: { ...dev }, prod: { ...prod }, defaults: { ...defaults } };
const isEnv = (env: string | undefined): env is Env => (env as string) in config;
const env: Env = isEnv(process.env.REACT_APP_STAGE) ? process.env.REACT_APP_STAGE : "prod";
export const getEnv = () => env;
export const getConfig = <T>(key: keyof Confg, defaultValue: T) => config[env][key] || defaultValue;
