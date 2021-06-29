v__VERSION__


# Installation instructions


All three steps are required!


## Step 1: copy files

- Unzip the extension you downloaded.

- With your FTP client (Ex: FileZilla), navigate to the **upload** folder of unzipped extension. You will find 4 folders: admin, catalog, system and vqmod

- Copy only the following folders: admin, catalog, system (do not copy **vqmod** folder yet) to the root folder of your opencart installation. By default the root folder of opencart is called **upload** or sometimes **public_html** or **www**.
  
No worries, you will not be erasing your directories, but files will be copied into them.

After uploading the files, you should see the module appears in the module list at Extensions → Modules in your store admin. We will get back to this later. Continue reading!


## Step 2: Choose OCMOD or VQMOD

If you already have some modules that use OCMOD, you may know that sometimes OCMOD is not compatible with VQMOD.


### Choice 1: I am a VQMOD user

- If you are not using OCMOD, VQMOD is perfect. Copy vqmod folder as in step 1 from **upload** folder to your **upload** folder.

### Choice 2: I am an OCMOD user
 
This module is also available in OCMOD. Before proceeding with OCMOD flavor of this module, just make sure that the extension VQMOD files from vqmod/xml folder (files all start with tv_module_name_...) were not copied. Then follow the steps below to install OCMOD files:

- Go to Extensions → Extension Installer → Upload and navigate to compatibility/ocmod folder and upload all OCMOD files one by one.

- Go to  Extensions → modification and click on the refresh button.

                                               
## Step 3: Enable the module and check settings

The instructions below will be done from the admin panel.

- First, let's fix the permission. Go to System → Users → User group → Administrator and grant access by clicking on both "select all" buttons then click on save.

- Go to Extensions → Module and click on install button of the extension.

- Enter the module settings and update the setting to your needs and click on save.


      ___ _   _  ___  ___ ___ ___ ___ 
     / __| | | |/ __|/ __| __/ __/ __|
     \__ \ |_| | (__| (__| _|\__ \__ \
     |___/\___/ \___|\___|___|___/___/
                                   

Don't forget to rate the module 5 stars. 


       ____            _             _   
      / ___|___  _ __ | |_ __ _  ___| |_ 
     | |   / _ \| '_ \| __/ _` |/ __| __|
     | |__| (_) | | | | || (_| | (__| |_ 
      \____\___/|_| |_|\__\__,_|\___|\__|
                                                        

For any question, help, bug, feature request or any other development, please email the support: support@prowebtec.com

We do our best to reply instantly.