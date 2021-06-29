<?php
class ControllerExtensionModule__MODULE_CAPITAL_CAMEL__ extends Controller {
    
	private $error = array(); 
	
	public function install() {

	    $defaultSettings = array(
            "__MODULE_UNDERSCORE___cfg_log" => true,
	    );
	    
		$this->load->model('setting/setting');
		$this->model_setting_setting->editSetting('__MODULE_UNDERSCORE__', $defaultSettings);
		
// 		$this->load->model('extension/module/__MODULE_UNDERSCORE__');
// 		$this->model_extension_module___MODULE_UNDERSCORE__->install();
		
	}
	
	public function index() {
		
	    $module_route = 'extension/module/__MODULE_UNDERSCORE__';
        $modules_route = 'extension/extension';

		$this->load->language('extension/module/__MODULE_UNDERSCORE__');
		
		$this->document->setTitle($this->language->get('heading_title'));
		
		//Load the settings model. You can also add any other models you want to load here.
		$this->load->model('setting/setting');
		
		//Save the settings if the user has submitted the admin form (ie if someone has pressed save).
		if ($this->request->server['REQUEST_METHOD'] == 'POST') {
		    
			$this->model_setting_setting->editSetting('__MODULE_UNDERSCORE__', $this->request->post);		
			
			$this->session->data['success'] = $this->language->get('text_success');
						
			$this->response->redirect($this->url->link($modules_route, 'token=' . $this->session->data['token'] . '&type=module', 'SSL'));
		}

		$text_strings = array(
			'heading_title',
			'text_enabled',
			'text_disabled',
			'text_home',
	        'text_yes',
	        'text_no',
			'button_save',
			'button_cancel'
		);
		
		foreach ($text_strings as $text) {
			$data[$text] = $this->language->get($text);
		}
		
 		if (isset($this->error['warning'])) {
			$data['error_warning'] = $this->error['warning'];
		} else {
			$data['error_warning'] = '';
		}


		$data['breadcrumbs'] = array();

   		$data['breadcrumbs'][] = array(
       		'href'      => $this->url->link('common/home', 'token=' . $this->session->data['token'], 'SSL'),
       		'text'      => $this->language->get('text_home'),
      		'separator' => FALSE
   		);

   		$data['breadcrumbs'][] = array(
	        'href'      => $this->url->link($modules_route, 'token=' . $this->session->data['token'] . '&type=module', 'SSL'),
	        'text'      => $this->language->get('text_module'),
	        'separator' => ' :: '
   		);
   		 
   		$data['breadcrumbs'][] = array(
	        'href'      => $this->url->link($module_route, 'token=' . $this->session->data['token'] . '&type=module', 'SSL'),
	        'text'      => $this->language->get('heading_title'),
	        'separator' => ' :: '
   		);
   		 
   		
   		$data['action'] = $this->url->link($module_route, 'token=' . $this->session->data['token'] . '&type=module', 'SSL');
   		 
   		$data['cancel'] = $this->url->link($modules_route, 'token=' . $this->session->data['token'] . '&type=module', 'SSL');
   		 
		
		$config_data = array(
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
		
		$this->response->setOutput($this->load->view('extension/module/__MODULE_UNDERSCORE__.tpl', $data));
	}
	
}