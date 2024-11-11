export interface ExtensionManifestPackaging extends ExtensionManifest {
  dir: any;
}

export interface ExtensionManifest {
  devSpec: {
    watchTask: {
      ocmodRefreshUrl: string;
      defaultTarget: string;
    };
  };
  dependencies: string[];
  finalName: string;
  version: string;
}

export interface ServerConfig {
  pass: string;
  user: string;
  port: string;
  host: string;
  remoteDir: string;
}