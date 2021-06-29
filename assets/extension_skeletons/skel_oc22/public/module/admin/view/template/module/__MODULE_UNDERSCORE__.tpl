<?php echo $header; ?><?php echo $column_left; ?>

<div id="content">
  <div class="page-header">
    <div class="container-fluid">
      <div class="pull-right">
        <button type="submit" form="tv-module-form" data-toggle="tooltip" title="<?php echo $button_save; ?>" class="btn btn-primary"><i class="fa fa-save"></i></button>
        <a href="<?php echo $cancel; ?>" data-toggle="tooltip" title="<?php echo $button_cancel; ?>" class="btn btn-default"><i class="fa fa-reply"></i></a></div>
      <h1><?php echo $heading_title; ?> __VERSION__</h1>
      <ul class="breadcrumb">
        <?php foreach ($breadcrumbs as $breadcrumb) { ?>
        <li><a href="<?php echo $breadcrumb['href']; ?>"><?php echo $breadcrumb['text']; ?></a></li>
        <?php } ?>
      </ul>
    </div>
  </div>
  
  <div class="container-fluid">
    <?php if (isset($error['error_warning'])) { ?>
    <div class="alert alert-danger"><i class="fa fa-exclamation-circle"></i> <?php echo $error['error_warning']; ?>
      <button type="button" class="close" data-dismiss="alert">&times;</button>
    </div>
    <?php } ?>
    
    <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title"><i class="fa fa-pencil"></i> <?php echo $heading_title; ?></h3>
        </div>
    
        <div class="panel-body">
        
          <form action="<?php echo $action; ?>" id="tv-module-form" method="post" enctype="multipart/form-data" class="form-horizontal">
          
            <h1>Module was installed successfully</h1>
            <p>If you have any feature request contact us. One email address for all your Opencart inquiries: support@prowebtec.com or visit <a href="https://www.prowebtec.com">www.prowebtec.com</a></p>
            
            <hr />
            
            <div class="form-group">
              <label class="col-sm-3 control-label" style="padding-top: 0" for="__MODULE_UNDERSCORE___cfg_log"><span data-toggle="tooltip" title="Verbose logs will be printed to the opencart log file. Useful when you need to figure out what is going on.">Enable __DISPLAY_NAME__ logs:</span></label>
              <div class="col-sm-9">
                  <div style="border: none; box-shadow: none;">
                  
                      <label style="margin-right: 11px;">
                        <input style="vertical-align: top;" type="radio" name="__MODULE_UNDERSCORE___cfg_log" value="1" <?php echo $__MODULE_UNDERSCORE___cfg_log ? 'checked' : ''; ?> id="__MODULE_UNDERSCORE___cfg_log" />
                        <?php echo $text_yes; ?>
                      </label>
                      <span style="display: inline-block; width: 33px"></span>
                      <label style="margin-right: 11px;">
                        <input style="vertical-align: top;" type="radio" name="__MODULE_UNDERSCORE___cfg_log" value="0" <?php echo !$__MODULE_UNDERSCORE___cfg_log ? 'checked' : ''; ?> />
                        <?php echo $text_no; ?>
                      </label>
                      
                  </div>
              </div>
            </div>
            
          </form>            
            
        </div><!-- .panel-body -->
     </div>
  </div><!-- .container-fluid -->
  
  
  <div class="page-header">
    <div class="container-fluid">
      <div class="pull-right">
        <button type="submit" form="tv-module-form" data-toggle="tooltip" title="<?php echo $button_save; ?>" class="btn btn-primary"><i class="fa fa-save"></i></button>
        <a href="<?php echo $cancel; ?>" data-toggle="tooltip" title="<?php echo $button_cancel; ?>" class="btn btn-default"><i class="fa fa-reply"></i></a>
      </div>
      
      <!-- include_social_login_fragment_b0c4d -->
          
    </div>
  </div>
  
  
</div><!-- #content -->

<?php echo $footer; ?>

<!-- 
<script type="text/javascript" src="view/javascript/script.js?v=1"></script>
 -->