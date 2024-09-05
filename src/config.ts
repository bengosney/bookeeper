interface Config {
  build: string;
}

interface ConfigObject {
  dev: Config;
  prod: Config;
  defaults: Config;
}

type Env = keyof ConfigObject;

const dev: Config = { build: "dev" };
const prod: Config = { build: "%%date%%" };
const defaults: Config = { ...prod };

const config: ConfigObject = { dev: { ...dev }, prod: { ...prod }, defaults: { ...defaults } };
const isEnv = (env: string | undefined): env is Env => (env as string) in config;
const env: Env = isEnv(process.env.REACT_APP_STAGE) ? process.env.REACT_APP_STAGE : "prod";
export const getEnv = () => env;
export const getConfig = (key: keyof Config) => config[env][key];
