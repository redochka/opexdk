## Introduction 

Welcome and thank you so much for your purchase.

I do my best to keep things easy. If despite all the efforts, you find that something is not clear as it should be, then feel free to contribute in a constructive way to make it better.

This is a quick document to introduce you to the files you downloaded.


## What to choose

You are faced with 2 folders: 

- ocmod-oneclick-install 
- vqmod-legacy-install

Each folder corresponds to an installation method. You must choose one of them. Do not install using both methods at the same time.

![](https://s.nimbusweb.me/attachment/3179634/9kt0ypc6kzlkdxxfsfu7/Rime2HhYGZ4utYkz/screenshot-onedrive.live.com-2019.08.09-12-23-21.png)

### ocmod-oneclick-install 

If you want the easy way to install the extension then we will use the ocmod-oneclick-install.

All you have to do is:

- Login into your opencart dashboard
- Go to Extensions → Extension install and click on upload
- In the "file chooser" popup navigate to ocmod-oneclick-install and choose the unique zip file (it ends with ocmod.zip)
- Refresh OCMOD cache: Go to Extensions → Modifications and click on the refresh button in the top right corner.
- Fix the permission: Go to System → Users → User group → Administrator and grant access by clicking on both "select all" buttons then click on save.
- Enable the extension setting page: Go to Extensions → Module and click on install button of the extension.
- Enter the module settings and update the setting to your needs and click on save.
- In Opencart version 3, go to Dashboard → clean theme cache as shown here: http://nimb.ws/uTiqol This step is required as soon as more than one extension is modifying the same view file.  


### vqmod-legacy-install

If you don't like the one click install process, then please read the following:


All three steps are required!


#### Step 1: copy files

- Unzip the extension you downloaded.

- With your FTP client (Ex: FileZilla), navigate to the **upload** folder of unzipped extension. You will find 4 folders: admin, catalog, system and vqmod

- Copy only the following folders: admin, catalog, system (do not copy **vqmod** folder yet) to the root folder of your opencart installation. By default the root folder of opencart is called **upload** or sometimes **public_html** or **www**.
  
No worries, you will not be erasing your directories, but files will be copied into them.

After uploading the files, you should see the module appears in the module list at Extensions → Modules in your store admin. We will get back to this later. Continue reading!


#### Step 2: Choose OCMOD or VQMOD

If you already have some modules that use OCMOD, you may know that sometimes OCMOD is not compatible with VQMOD.


##### Choice 1: I am a VQMOD user

- If you are not using OCMOD, VQMOD is perfect. Copy vqmod folder as in step 1 from **upload** folder to your **upload** folder.

##### Choice 2: I am an OCMOD user
 
This module is also available in OCMOD. Before proceeding with OCMOD flavor of this module, just make sure that the extension VQMOD files from vqmod/xml folder (files all start with tv_module_name_...) were not copied. Then follow the steps below to install OCMOD files:

- Go to Extensions → Extension Installer → Upload and navigate to compatibility/ocmod folder and upload all OCMOD files one by one.

- Go to  Extensions → modification and click on the refresh button.

                                               
#### Step 3: Enable the module and check settings

The instructions below will be done from the admin panel.

- First, let's fix the permission. Go to System → Users → User group → Administrator and grant access by clicking on both "select all" buttons then click on save.

- Go to Extensions → Module and click on install button of the extension.

- Enter the module settings and update the setting to your needs and click on save.






## Conclusion

We have seen 2 ways of installing the extension. The quick one and the legacy one which may be useful in case you want to see the details for example.

- Don't forget to rate the module 5 stars. 

- For any question, help, bug, feature request or any other development, please email the support: support@prowebtec.com

- We do our best to reply instantly.

