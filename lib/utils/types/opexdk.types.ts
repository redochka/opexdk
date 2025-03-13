export interface ExtensionManifestPackaging extends ExtensionManifest {
  dir: any;
  private_dist_dir: string
}

export interface ExtensionManifest {
  devSpec: {
    watchTask: {
      ocmodRefreshUrl: string;
      defaultTarget: string;
    };
  };
  opexBuilder: {
    readme : {
      inject: boolean
    }
  }
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