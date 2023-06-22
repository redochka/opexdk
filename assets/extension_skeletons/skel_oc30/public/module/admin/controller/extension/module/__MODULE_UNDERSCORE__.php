<?php
class ControllerExtensionModule__MODULE_CAPITAL_CAMEL__ extends Controller {

	private $error = array();
	private $module_code = "__MODULE_UNDERSCORE__";

	public function install() {

	    $defaultSettings = array(
            "__MODULE_UNDERSCORE___cfg_extension_status" => true,
            "__MODULE_UNDERSCORE___cfg_log" => true,
	    );

		$this->load->model('setting/setting');
        $this->model_setting_setting->editSetting($this->module_code, $defaultSettings);
        $this->model_setting_setting->editSetting('module_' . $this->module_code, array('module_' . $this->module_code . '_status' => true));


// 		$this->load->model('extension/module/__MODULE_UNDERSCORE__');
// 		$this->model_extension_module___MODULE_UNDERSCORE__->install();

        // if ($this->config->get('__MODULE_UNDERSCORE___cfg_log')) $this->log->write("[__MODULE_UNDERSCORE__] going to add all events");
        // $this->add_all_events();
	}

    public function uninstall() {
        //$this->load->model('extension/module/__MODULE_UNDERSCORE__');
        //$this->model_extension_module___MODULE_UNDERSCORE__->uninstall();

        //$this->delete_all_events();
    }


	public function index() {

	    $module_route = 'extension/module/__MODULE_UNDERSCORE__';
        $modules_route = 'marketplace/extension';


		$this->load->language('extension/module/__MODULE_UNDERSCORE__');


		$this->document->setTitle($this->language->get('heading_title'));

		//Load the settings model. You can also add any other models you want to load here.
		$this->load->model('setting/setting');

		//Save the settings if the user has submitted the admin form (ie if someone has pressed save).
		if ($this->request->server['REQUEST_METHOD'] == 'POST') {

			$this->model_setting_setting->editSetting($this->module_code, $this->request->post);

            //Let the extension show as enabled/disabled in the module list
            if($this->request->post['__MODULE_UNDERSCORE___cfg_extension_status']){
                $this->model_setting_setting->editSetting('module_' . $this->module_code, array('module_' . $this->module_code . '_status' => true));
            }else{
                $this->model_setting_setting->editSetting('module_' . $this->module_code, array('module_' . $this->module_code . '_status' => false));
            }

			$this->session->data['success'] = $this->language->get('text_success');

			$this->response->redirect($this->url->link($modules_route, 'user_token=' . $this->session->data['user_token'] . '&type=module', true));
		}


        $data['my_events'] = $this->my_events;

 		if (isset($this->error['warning'])) {
			$data['error_warning'] = $this->error['warning'];
		} else {
			$data['error_warning'] = '';
		}


		$data['breadcrumbs'] = array();

   		$data['breadcrumbs'][] = array(
       		'href'      => $this->url->link('common/dashboard', 'user_token=' . $this->session->data['user_token'], true),
       		'text'      => $this->language->get('text_home'),
      		'separator' => FALSE
   		);

   		$data['breadcrumbs'][] = array(
	        'href'      => $this->url->link($modules_route, 'user_token=' . $this->session->data['user_token'] . '&type=module', true),
	        'text'      => $this->language->get('text_module'),
	        'separator' => ' :: '
   		);

   		$data['breadcrumbs'][] = array(
	        'href'      => $this->url->link($module_route, 'user_token=' . $this->session->data['user_token'] . '&type=module', true),
	        'text'      => $this->language->get('heading_title'),
	        'separator' => ' :: '
   		);


   		$data['action'] = $this->url->link($module_route, 'user_token=' . $this->session->data['user_token'] . '&type=module', true);

   		$data['cancel'] = $this->url->link($modules_route, 'user_token=' . $this->session->data['user_token'] . '&type=module', true);


		$config_data = array(
		    "__MODULE_UNDERSCORE___cfg_extension_status",
	        "__MODULE_UNDERSCORE___cfg_log"
		);

		foreach ($config_data as $conf) {
		    if (isset($this->request->post[$conf])) {
		        $data[$conf] = $this->request->post[$conf];
		    } else {
		        $data[$conf] = $this->config->get($conf);
		    }
		}


		$data['header']      = $this->load->controller('common/header');
		$data['column_left'] = $this->load->controller('common/column_left');
		$data['footer']      = $this->load->controller('common/footer');

		$this->response->setOutput($this->load->view('extension/module/__MODULE_UNDERSCORE__', $data));
	}

}
