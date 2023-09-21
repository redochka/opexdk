export interface ExtensionManifestPackaging extends ExtensionManifest{
  dir: any;
}

export interface ExtensionManifest {
  devSpec: {
    watchTask: {
      defaultTarget: string;
    };
  };
  dependencies: string[];
  finalName: string;
  version: string;
}