<?php echo $header; ?><?php echo $column_left; ?>
<div id="content">
    <div class="page-header">
        <div class="container-fluid">
            <div class="pull-right"><a href="<?php echo $add; ?>" data-toggle="tooltip" title="<?php echo $button_add; ?>" class="btn btn-primary"><i class="fa fa-plus"></i></a>
                <button type="button" data-toggle="tooltip" title="<?php echo $button_delete; ?>" class="btn btn-danger" onclick="confirm('<?php echo $text_confirm; ?>') ? $('#the-form').submit() : false;"><i class="fa fa-trash-o"></i></button>
            </div>
            <h1>__DISPLAY_NAME__ list</h1>
            <ul class="breadcrumb">
                <?php foreach ($breadcrumbs as $breadcrumb) { ?>
                <li><a href="<?php echo $breadcrumb['href']; ?>"><?php echo $breadcrumb['text']; ?></a></li>
                <?php } ?>
            </ul>
        </div>
    </div>
    <div class="container-fluid">
        <?php if ($error_warning) { ?>
        <div class="alert alert-danger"><i class="fa fa-exclamation-circle"></i> <?php echo $error_warning; ?>
            <button type="button" class="close" data-dismiss="alert">&times;</button>
        </div>
        <?php } ?>
        <?php if ($success) { ?>
        <div class="alert alert-success"><i class="fa fa-check-circle"></i> <?php echo $success; ?>
            <button type="button" class="close" data-dismiss="alert">&times;</button>
        </div>
        <?php } ?>
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title"><i class="fa fa-list"></i> __DISPLAY_NAME__ List</h3>
            </div>
            <div class="panel-body">
                <form action="<?php echo $delete; ?>" method="post" enctype="multipart/form-data" id="the-form">
                    <div class="table-responsive">
                        <table class="table table-bordered table-hover">
                            <thead>
                            <tr>
                                <td style="width: 1px;" class="text-center"><input type="checkbox" onclick="$('input[name*=\'selected\']').prop('checked', this.checked);" /></td>
                                <td class="text-left"><?php if ($sort == 'name') { ?>
                                    <a href="<?php echo $sort_name; ?>" class="<?php echo strtolower($order); ?>">__DISPLAY_NAME__ Name</a>
                                    <?php } else { ?>
                                    <a href="<?php echo $sort_name; ?>">__DISPLAY_NAME__ name</a>
                                    <?php } ?></td>
                                <td class="text-right"><?php echo $column_action; ?></td>
                            </tr>
                            </thead>
                            <tbody>
                            <?php if ($__MODULE_UNDERSCORE___list) { ?>
                            <?php foreach($__MODULE_UNDERSCORE___list as $__MODULE_UNDERSCORE__) { ?>
                            <tr>
                                <td class="text-center"><?php if (in_array($__MODULE_UNDERSCORE__['id'], $selected)) { ?>
                                    <input type="checkbox" name="selected[]" value="<?php echo $__MODULE_UNDERSCORE__['id']; ?>" checked="checked" />
                                    <?php } else { ?>
                                    <input type="checkbox" name="selected[]" value="<?php echo $__MODULE_UNDERSCORE__['id']; ?>" />
                                    <?php } ?></td>
                                <td class="text-left"><?php echo $__MODULE_UNDERSCORE__['__MODULE_UNDERSCORE___name']; ?></td>
                                <td class="text-right">
                                    <!-- <a href="<?php echo $__MODULE_UNDERSCORE__['duplicate']; ?>" class="btn btn-default"><i class="fa fa-copy"></i> Duplicate</a> -->
                                    <!-- <a href="<?php echo $__MODULE_UNDERSCORE__['test']; ?>" target="_blank" class="btn btn-success"><i class="fa fa-paste"></i> Test</a> -->
                                    <a href="<?php echo $__MODULE_UNDERSCORE__['edit']; ?>" data-toggle="tooltip" title="<?php echo $button_edit; ?>" class="btn btn-primary"><i class="fa fa-pencil"></i> Edit</a>
                                </td>
                            </tr>
                            <?php } ?>
                            <?php } else { ?>
                            <tr>
                                <td class="text-center" colspan="4"><?php echo $text_no_results; ?></td>
                            </tr>
                            <?php } ?>
                            </tbody>
                        </table>
                    </div>
                </form>
                <div class="row">
                    <div class="col-sm-6 text-left"><?php echo $pagination; ?></div>
                    <div class="col-sm-6 text-right"><?php echo $results; ?></div>
                </div>
            </div>
        </div>
    </div>
</div>
<?php echo $footer; ?>