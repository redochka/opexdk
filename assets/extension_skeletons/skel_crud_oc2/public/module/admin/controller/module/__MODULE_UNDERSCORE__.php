<?php
class ControllerModule__MODULE_CAPITAL_CAMEL__ extends Controller {

    private $error;

    public function index() {
        $this->load->language('module/__MODULE_UNDERSCORE__');

        $this->document->setTitle($this->language->get('heading_title'));

        $this->load->model('module/__MODULE_UNDERSCORE__');

        $this->getList();
    }

    protected function getList() {
        if (isset($this->request->get['sort'])) {
            $sort = $this->request->get['sort'];
        } else {
            $sort = 'name';
        }

        if (isset($this->request->get['order'])) {
            $order = $this->request->get['order'];
        } else {
            $order = 'ASC';
        }

        if (isset($this->request->get['page'])) {
            $page = $this->request->get['page'];
        } else {
            $page = 1;
        }

        $url = '';

        if (isset($this->request->get['sort'])) {
            $url .= '&sort=' . $this->request->get['sort'];
        }

        if (isset($this->request->get['order'])) {
            $url .= '&order=' . $this->request->get['order'];
        }

        if (isset($this->request->get['page'])) {
            $url .= '&page=' . $this->request->get['page'];
        }

        $data['breadcrumbs'] = array();

        $data['breadcrumbs'][] = array(
            'text' => $this->language->get('text_home'),
            'href' => $this->url->link('common/dashboard', 'token=' . $this->session->data['token'], 'SSL')
        );

        $data['breadcrumbs'][] = array(
            'text' => "__DISPLAY_NAME__ list",
            'href' => $this->url->link('module/__MODULE_UNDERSCORE__', 'token=' . $this->session->data['token'] . $url, 'SSL')
        );

        $data['add'] = $this->url->link('module/__MODULE_UNDERSCORE__/add', 'token=' . $this->session->data['token'] . $url, 'SSL');
        $data['delete'] = $this->url->link('module/__MODULE_UNDERSCORE__/delete', 'token=' . $this->session->data['token'] . $url, 'SSL');

        $filter_data = array(
            'sort'  => $sort,
            'order' => $order,
            'start' => ($page - 1) * $this->config->get('config_limit_admin'),
            'limit' => $this->config->get('config_limit_admin')
        );

        $__MODULE_UNDERSCORE__s_total = $this->model_module___MODULE_UNDERSCORE__->get_total___MODULE_UNDERSCORE__s();
        $__MODULE_UNDERSCORE___list       = $this->model_module___MODULE_UNDERSCORE__->get___MODULE_UNDERSCORE___list($filter_data);


        $data['__MODULE_UNDERSCORE___list'] = array();
        foreach ($__MODULE_UNDERSCORE___list as $__MODULE_UNDERSCORE__) {
            $data['__MODULE_UNDERSCORE___list'][] = array(
                'id'           => $__MODULE_UNDERSCORE__['id'],
                '__MODULE_UNDERSCORE___name'    => $__MODULE_UNDERSCORE__['__MODULE_UNDERSCORE___name'],
                'edit'         => $this->url->link('module/__MODULE_UNDERSCORE__/edit', 'token=' . $this->session->data['token'] . '&__MODULE_UNDERSCORE___id=' . $__MODULE_UNDERSCORE__['id'] . $url, 'SSL'),
//                'duplicate'        => $this->url->link('module/__MODULE_UNDERSCORE__/duplicate', 'token=' . $this->session->data['token'] . '&__MODULE_UNDERSCORE___id=' . $result['id'] . $url, 'SSL'),
            );
        }

        $data['heading_title'] = $this->language->get('heading_title');

        $data['text_list'] = $this->language->get('text_list');
        $data['text_no_results'] = $this->language->get('text_no_results');
        $data['text_confirm'] = $this->language->get('text_confirm');

        $data['column_name'] = $this->language->get('column_name');
        $data['column_url'] = $this->language->get('column_url');
        $data['column_action'] = $this->language->get('column_action');

        $data['button_add'] = $this->language->get('button_add');
        $data['button_edit'] = $this->language->get('button_edit');
        $data['button_delete'] = $this->language->get('button_delete');

        //TODO when is this used?
        if (isset($this->error['warning'])) {
            $data['error_warning'] = $this->error['warning'];
        } else {
            $data['error_warning'] = '';
        }

        //in case we fail to save (add route)
        if (isset($this->session->data['warning'])) {
            $data['warning'] = $this->session->data['warning'];

            unset($this->session->data['warning']);
        } else {
            $data['warning'] = '';
        }


        if (isset($this->session->data['success'])) {
            $data['success'] = $this->session->data['success'];

            unset($this->session->data['success']);
        } else {
            $data['success'] = '';
        }

        if (isset($this->request->post['selected'])) {
            $data['selected'] = (array)$this->request->post['selected'];
        } else {
            $data['selected'] = array();
        }

        $url = '';

        if ($order == 'ASC') {
            $url .= '&order=DESC';
        } else {
            $url .= '&order=ASC';
        }

        if (isset($this->request->get['page'])) {
            $url .= '&page=' . $this->request->get['page'];
        }

        $data['sort_name'] = $this->url->link('module/__MODULE_UNDERSCORE__', 'token=' . $this->session->data['token'] . '&sort=name' . $url, 'SSL');

        $url = '';

        if (isset($this->request->get['sort'])) {
            $url .= '&sort=' . $this->request->get['sort'];
        }

        if (isset($this->request->get['order'])) {
            $url .= '&order=' . $this->request->get['order'];
        }

        $pagination = new Pagination();
        $pagination->total = $__MODULE_UNDERSCORE__s_total;
        $pagination->page = $page;
        $pagination->limit = $this->config->get('config_limit_admin');
        $pagination->url = $this->url->link('module/__MODULE_UNDERSCORE__', 'token=' . $this->session->data['token'] . $url . '&page={page}', 'SSL');

        $data['pagination'] = $pagination->render();

        $data['results'] = sprintf($this->language->get('text_pagination'), ($__MODULE_UNDERSCORE__s_total) ? (($page - 1) * $this->config->get('config_limit_admin')) + 1 : 0, ((($page - 1) * $this->config->get('config_limit_admin')) > ($__MODULE_UNDERSCORE__s_total - $this->config->get('config_limit_admin'))) ? $__MODULE_UNDERSCORE__s_total : ((($page - 1) * $this->config->get('config_limit_admin')) + $this->config->get('config_limit_admin')), $__MODULE_UNDERSCORE__s_total, ceil($__MODULE_UNDERSCORE__s_total / $this->config->get('config_limit_admin')));

        $data['sort'] = $sort;
        $data['order'] = $order;

        $data['header'] = $this->load->controller('common/header');
        $data['column_left'] = $this->load->controller('common/column_left');
        $data['footer'] = $this->load->controller('common/footer');

        $this->response->setOutput($this->load->view('module/__MODULE_UNDERSCORE__/__MODULE_UNDERSCORE___list.tpl', $data));
    }




    public function add() {
        $this->load->language('module/__MODULE_UNDERSCORE__');

        $this->document->setTitle($this->language->get('heading_title'));

        $this->load->model('module/__MODULE_UNDERSCORE__');

        if (($this->request->server['REQUEST_METHOD'] == 'POST') && $this->validateForm()) {
            $saved = $this->model_module___MODULE_UNDERSCORE__->add___MODULE_UNDERSCORE__($this->request->post);

            if ($saved) {
                $this->session->data['success'] = "__DISPLAY_NAME__ was saved successfully";
            }else{
                $this->session->data['warning'] = "__DISPLAY_NAME__ was not saved. Check log file for errors.";
            }

            $url = '';

            if (isset($this->request->get['sort'])) {
                $url .= '&sort=' . $this->request->get['sort'];
            }

            if (isset($this->request->get['order'])) {
                $url .= '&order=' . $this->request->get['order'];
            }

            if (isset($this->request->get['page'])) {
                $url .= '&page=' . $this->request->get['page'];
            }

            $this->response->redirect($this->url->link('module/__MODULE_UNDERSCORE__/index', 'token=' . $this->session->data['token'] . $url, 'SSL'));
        }

        $this->getForm();
    }


    public function edit() {
        $this->load->language('module/__MODULE_UNDERSCORE__');

        $this->document->setTitle($this->language->get('heading_title'));

        $this->load->model('module/__MODULE_UNDERSCORE__');

        if (($this->request->server['REQUEST_METHOD'] == 'POST') && $this->validateForm()) {
            $saved = $this->model_module___MODULE_UNDERSCORE__->edit___MODULE_UNDERSCORE__($this->request->get['__MODULE_UNDERSCORE___id'], $this->request->post);
            if ($saved) {
                $this->session->data['success'] = $this->language->get('text_success');
                $this->session->data['success'] = "__DISPLAY_NAME__ was saved successfully";
            }else{
                $this->session->data['warning'] = "__DISPLAY_NAME__ was not saved. Check log file for errors.";
            }

            $url = '';

            if (isset($this->request->get['sort'])) {
                $url .= '&sort=' . $this->request->get['sort'];
            }

            if (isset($this->request->get['order'])) {
                $url .= '&order=' . $this->request->get['order'];
            }

            if (isset($this->request->get['page'])) {
                $url .= '&page=' . $this->request->get['page'];
            }

            $this->response->redirect($this->url->link('module/__MODULE_UNDERSCORE__/index', 'token=' . $this->session->data['token'] . $url, 'SSL'));
        }

        $this->getForm();
    }


    public function delete() {
        $this->load->language('module/__MODULE_UNDERSCORE__');

        $this->document->setTitle($this->language->get('heading_title'));

        $this->load->model('module/__MODULE_UNDERSCORE__');

        if (isset($this->request->post['selected']) && $this->validateDelete()) {
            foreach ($this->request->post['selected'] as $__MODULE_UNDERSCORE___id) {
                $this->model_module____MODULE_UNDERSCORE__->delete___MODULE_UNDERSCORE__($__MODULE_UNDERSCORE___id);
            }

            $this->session->data['success'] = $this->language->get('text_success');

            $url = '';

            if (isset($this->request->get['sort'])) {
                $url .= '&sort=' . $this->request->get['sort'];
            }

            if (isset($this->request->get['order'])) {
                $url .= '&order=' . $this->request->get['order'];
            }

            if (isset($this->request->get['page'])) {
                $url .= '&page=' . $this->request->get['page'];
            }

            $this->response->redirect($this->url->link('module/__MODULE_UNDERSCORE__/index', 'token=' . $this->session->data['token'] . $url, 'SSL'));
        }

        $this->getList();
    }


    /**
     *
     */
    protected function getForm() {

        $data['heading_title'] = $this->language->get('heading_title');

        $data['text_form'] = !isset($this->request->get['__MODULE_UNDERSCORE___id']) ? $this->language->get('text_add') : $this->language->get('text_edit');

        $data['button_save'] = $this->language->get('button_save');
        $data['button_cancel'] = $this->language->get('button_cancel');

        if (isset($this->error['warning'])) {
            $data['error_warning'] = $this->error['warning'];
        } else {
            $data['error_warning'] = '';
        }

        if (isset($this->error['name'])) {
            $data['error_name'] = $this->error['name'];
        } else {
            $data['error_name'] = array();
        }

        if (isset($this->error['url'])) {
            $data['error_url'] = $this->error['url'];
        } else {
            $data['error_url'] = array();
        }


        $url = '';

        if (isset($this->request->get['sort'])) {
            $url .= '&sort=' . $this->request->get['sort'];
        }

        if (isset($this->request->get['order'])) {
            $url .= '&order=' . $this->request->get['order'];
        }

        if (isset($this->request->get['page'])) {
            $url .= '&page=' . $this->request->get['page'];
        }

        $data['breadcrumbs'] = array();

        $data['breadcrumbs'][] = array(
            'text' => $this->language->get('text_home'),
            'href' => $this->url->link('common/dashboard', 'token=' . $this->session->data['token'], 'SSL')
        );

        $data['breadcrumbs'][] = array(
            'text' => $this->language->get('heading_title'),
            'href' => $this->url->link('module/__MODULE_UNDERSCORE__', 'token=' . $this->session->data['token'] . $url, 'SSL')
        );

        if (!isset($this->request->get['__MODULE_UNDERSCORE___id'])) {
            $data['action'] = $this->url->link('module/__MODULE_UNDERSCORE__/add', 'token=' . $this->session->data['token'] . $url, 'SSL');
        } else {
            $data['action'] = $this->url->link('module/__MODULE_UNDERSCORE__/edit', 'token=' . $this->session->data['token'] . '&__MODULE_UNDERSCORE___id=' . $this->request->get['__MODULE_UNDERSCORE___id'] . $url, 'SSL');
        }

        $data['cancel'] = $this->url->link('module/__MODULE_UNDERSCORE__', 'token=' . $this->session->data['token'] . $url, 'SSL');


        /*
         *
         */
        $this->load->model('localisation/language');
        $data['languages'] = $this->model_localisation_language->getLanguages();


        if (isset($this->request->get['__MODULE_UNDERSCORE___id'])) {
            $__MODULE_UNDERSCORE__ = $this->model_module___MODULE_UNDERSCORE__->get___MODULE_UNDERSCORE__($this->request->get['__MODULE_UNDERSCORE___id']);
            $data['__MODULE_UNDERSCORE___name'] = $__MODULE_UNDERSCORE__['__MODULE_UNDERSCORE___name'];
        }else{
            $data['__MODULE_UNDERSCORE___name'] = '';
        }


        $data['__MODULE_UNDERSCORE___form'] = $this->load->view('module/__MODULE_UNDERSCORE__/__MODULE_UNDERSCORE___form.tpl', $data);

        $data['header']      = $this->load->controller('common/header');
        $data['column_left'] = $this->load->controller('common/column_left');
        $data['footer']      = $this->load->controller('common/footer');

        $this->response->setOutput($this->load->view('module/__MODULE_UNDERSCORE__/__MODULE_UNDERSCORE___form_wrapper.tpl', $data));
    }



    protected function validateForm() {

        if ((utf8_strlen($this->request->post['__MODULE_UNDERSCORE___name']) < 1) || (utf8_strlen($this->request->post['__MODULE_UNDERSCORE___name']) > 190)) {
            $this->error['warning'] = "__DISPLAY_NAME__ name must be between 1 and 190 characters";
        }

        return !$this->error;
    }

    protected function validateDelete() {

        return true;
        //if (!$this->user->hasPermission('modify', 'localisation/order_status')) {
        //    $this->error['warning'] = $this->language->get('error_permission');
        //}

        $this->load->model('sale/order');

        foreach ($this->request->post['selected'] as $order_status_id) {

            $order_total = $this->model_sale_order->getTotalOrderHistoriesByOrderStatusId($order_status_id);

            if ($order_total) {
                $this->error['warning'] = sprintf($this->language->get('error_order'), $order_total);
            }
        }

        return !$this->error;
    }
}