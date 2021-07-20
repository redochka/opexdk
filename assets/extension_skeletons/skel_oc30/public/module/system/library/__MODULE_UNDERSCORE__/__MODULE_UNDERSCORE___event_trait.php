<?php

trait __MODULE_UNDERSCORE___event_trait {

    private $my_events = array(
/*
        array(
            "code" => "__MODULE_UNDERSCORE___event_handler_after_product_view",
            "when" => "admin/view/catalog/product_form/after",
            "func" => "extension/module/__MODULE_UNDERSCORE__/qty___MODULE_UNDERSCORE___event_handler_after_product_view",
        ),
*/
    );

    private function add_all_events() {
        if ($this->config->get('__MODULE_UNDERSCORE___cfg_log')) $this->log->write("[__MODULE_UNDERSCORE__] adding events");

        $this->load->model('setting/event');

        foreach ($this->my_events as $event) {
            $this->model_setting_event->addEvent(
                $event['code'],
                $event['when'],
                $event['func'],
            );
        }
    }

    private function delete_all_events() {
        if ($this->config->get('__MODULE_UNDERSCORE___cfg_log')) $this->log->write("[__MODULE_UNDERSCORE__] deleting events");

        $this->load->model('setting/event');
        foreach ($this->my_events as $event) {
            $this->model_setting_event->deleteEventByCode($event['code']);
        }
    }
}