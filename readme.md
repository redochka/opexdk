### Synopsis

OPEXDK (Opencart Extension Development Kit) is a tool that helps developers creating Opencart extensions.

OPEXDK helps you in all the steps required to create, develop and package your extension.

### Installation

Install globally

```sh
sudo npm install -g @prowebtec/opexdk
```

When developing, you can clone the project and cd into, make changes to the code, then install globally:

```sh
sudo npm uninstall -g ; sudo npm install -g .
```

Test quickly:

```sh
opexdk test
```

Output:

```sh
Required param args.m not found. Aborting!
✘ Extension: undefined not found.
Going to call task:  test
inside the test task
```

If you see this, then the command is installed successfully.

Then create environment variables:

```sh
# OPEXDK env definition inside ~/.bashrc
export OPEXDK_SRC_PATH=/path/to/your/extensions-workspace
export OPEXDK_VHOST_PATH=/path/to/your/www
export OPEXDK_SERVERS_INVENTORY=/path/to/your/servers/inventory
```

- `OPEXDK_SRC_PATH`

  Example: `/path/to/your/extensions-workspace`. This variable accepts multiple paths comma separated.
  
- `OPEXDK_VHOST_PATH`

  Example: `/home/reda/www`
  
- `OPEXDK_SERVERS_INVENTORY`
  
  Example: `/path/to/ftp-servers-inventories`

- `OPEXDK_OUTPUT_DIR`

  By default, it is in a custom directory in the OS temp directory: `/tmp/opexdk-output`

You can export variable in your `.bashrc`. Example:

```sh
export OPEXDK_SRC_PATH=/path/to/your/extensions-workspace
```

### Extension format

Inside your workspace, you can have several extensions.

An extension must be in a folder, eg: `myextension` which contains a `public/module` folder, inside which we find the usual opencart structure:

- `admin` folder
- `catalog` folder
- `system` folder
- `vqmod` folder (for extensions using `vqmod`)

Moreover, `vqmod` files must have the `.vqmod.xml` suffix in their name.

### Usage

- Watch changes in `my-extension` folder and push changes to `www` folder (inside `OPEXDK_VHOST_PATH`)

```sh
opexdk watch -m my-extension -o www

# Use the `--yes`           flag to skip the confirmation.
# Use the `--vq2oc2sys`     flag to convert vqmod files to ocmod and push them to the `system` folder
# Use the `--exclude-vqmod` flag to skip/ignore/exclude vqmod files.
# Use the `--oru="URL"`     flag to call the URL that refreshes OCMOD after ocmod file modification (used in conjunction with `vq2oc2sys`). ORU stands for Ocmod Refresh Url.
# Use the `--oru-silent`    flag to avoid displaying ocmod refresh output to console.
```

- Watch changes in `my-extension` folder and push to FTP server:

```sh
opexdk watch-ftp -m my-extension --server my-ftp-server.ftp.xml 
```

- Watch changes in `my-extension` folder and push to SFTP server:

```sh
opexdk watch-sftp -m my-extension --server my-sftp-server.sftp.xml 
```

- Deploy all files from `my-extension` folder:

```sh
opexdk deploy -m my-extension -o www 
```

- Deploy all files from `my-extension` to ftp:

```sh
opexdk deploy-compiled-ftp -m my-extension --server server.ftp.xml
```

The `deploy-compiled-xxx` will compile the extension before deploying it. Compilation means for example, replace the `__VERSION__` variable in various places by its real value so that in admin dashboard displays nicely.

- Deploy all files from `my-extension` to sftp server:

```sh
opexdk deploy-compiled-sftp -m my-extension --server server.sftp.xml
```

- Package extension

```sh
opexdk package -m my-extension --ocmod
```

### Notes

watch tasks (local, ftp or sftp) need to be restarted on file creation. This needs to be fixed.   

### Run tasks using node command:

If you don’t want to install opexdk globally you can run it using this style:

```sh
node bin/index-global.js -t package -m my-extension --ocmod --cloud
```

### Integration with phpstorm

Examples above must be run from the terminal. If you want opexdk to be run from phpstorm directly, vote here:

https://youtrack.jetbrains.com/issue/IDEA-112256?_ga=2.20275761.820340710.1605016380-1934743903.1584903037

Phpstorm supports running gulp tasks. You can create gulp task to run opexdk tasks by calling gulp directly, see below.

#### Run tasks using gulp from command line

Either run from a terminal. Make sure gulp is installed globally. 

```sh
# cd opexdk where there is the gulpfile.js
# gulp deploy-compiled-sftp -m my-extension --server server.sftp.xml
node bin/index-global.js translate-to-vqmod --path /path/to/files 
```

#### Run tasks using gulp from phpstorm

Create a Gulp run configuration in Phpstorm, name it for example `watch my extension` 

- Gulpfile: Specify the `gulpfile.js` found in the opexdk repository
- Task: `watch`
- Arguments: `-m my-extension -o www`
- Gulp package: `opexdk/node_modules/gulp`
- Environment: Enter all the environment variables described above.

Click on save. Now you can watch files while developing by hitting `ALT+SHIFT+F10` and select `watch my extension`

### Debugging

We use the https://www.npmjs.com/package/debug module. 

To enable verbose log for the `package` task (See `task-package.js`)

`DEBUG=package,xxx gulp package -m testsimple`

This package uses natives (system) dependencies. Be careful, with errors due to package-lock.json 

### Extension generator

We have our own extension-duplicator, some similar projects:

- https://github.com/eykrehbein/cook

There are two types of scaffolding: light and fully fledged 

#### Create an extension from a light scaffolding 

This kind of extension will not have an admin controller nor a setting page. 
- Useful to create file structure that will hold your php files and vqmod files to get started testing things.
- Useful also for library extensions.

```sh
opexdk create-simple -m my-lib-extension
```

Output:

```sh
tree
.
├── manifest.json
└── public
    └── module
        ├── admin
        ├── catalog
        ├── system
        └── vqmod
            └── xml

7 directories, 1 file
```

#### Create an extension from the fully fledged scaffolding

Here you will have an extension ready to use with a setting page, controller, model etc, ...
Once deployed to Opencart, the extension will be visible in the extension → modules. You can click on the install button to enter setting page.  

```sh
gulp create --skel skel_oc30 \
            --displayName "My Extension" \
            --finalName my-extension-oc3 \
            --shortName myext \
            --capitalCamel Myext \
            --underscore my_ext
```

Available skeletons are:

- skel_oc22: produces an extension compatible with opencart 2.2 and below (opencart 2.0)
- skel_oc23: produces an extension compatible with all opencart 2.3.x.y versions
- skel_oc30: produces an extension compatible with all opencart 3.x versions
- skel_crud_oc3: **work in progress**, produces an extension that allow creating/updating/deleting records in the database.

### opex manifest schema

See `opex/_commons/ide-libs/opex-manifest-schema.json`

The schema was generated on: https://jsonschema.net/home

### Make extension depends on other extension

```json
{
    "version": "1.0.0",
    "finalName": "my-extension",
    "shortName": "my-extension",
    "dependencies": [
        "my-lib",
        "!my-excluded-lib-thanks-to-exclamation-mark"
    ]
} 
```

- `my-lib` is the shortname of the lib extension.

- By adding the `!` you can quickly skip the dependency from being included.


### Make files common for both admin and catalog

Use the suffix: `-coca`

`-coca` which means Common On Catalog and Admin.

Example:

```sh
reda@xps15:~/Work/WorkspaceOpencart/opex/my-extension-for-opencart/my-extension-coca$ tree
.
├── manifest.json
└── public
    └── module
        └── common
            ├── language
            │   ├── de-de
            │   │   └── module
            │   │       └── my_extension_pdf_common.php
            │   └── english
            │       └── module
            │           └── my_extension_pdf_common.php
            └── model
                ├── catalog
                │   └── my_extension_customer_common.php
                └── module
                    ├── my_extension_dao_order_product_common.php
                    ├── my_extension_dao_product_common.php
                    ├── my_extension_dao_redeem_templates_common.php
                    ├── my_extension_pdf_common.php
                    └── my_extension_quantity_manager.php

11 directories, 9 files
```

When changes are detected or when packaging, files in `public/module/common` will be copied to both `admin` and `catalog`
