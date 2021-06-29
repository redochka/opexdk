<?php
class Model__MODULE____MODULE_CAPITAL_CAMEL__ extends Model {
	public function add__MODULE_CAPITAL_CAMEL__($data) {
		foreach ($data['__MODULE_UNDERSCORE__'] as $language_id => $value) {
			if (isset($__MODULE_UNDERSCORE___id)) {
				$this->db->query("INSERT INTO " . DB_PREFIX . "__MODULE_UNDERSCORE__ SET __MODULE_UNDERSCORE___id = '" . (int)$__MODULE_UNDERSCORE___id . "', language_id = '" . (int)$language_id . "', name = '" . $this->db->escape($value['name']) . "'");
			} else {
				$this->db->query("INSERT INTO " . DB_PREFIX . "__MODULE_UNDERSCORE__ SET language_id = '" . (int)$language_id . "', name = '" . $this->db->escape($value['name']) . "'");

				$__MODULE_UNDERSCORE___id = $this->db->getLastId();
			}
		}

		$this->cache->delete('__MODULE_UNDERSCORE__');

		return $__MODULE_UNDERSCORE___id;
	}

	public function edit__MODULE_CAPITAL_CAMEL__($__MODULE_UNDERSCORE___id, $data) {
		$this->db->query("DELETE FROM " . DB_PREFIX . "__MODULE_UNDERSCORE__ WHERE __MODULE_UNDERSCORE___id = '" . (int)$__MODULE_UNDERSCORE___id . "'");

		foreach ($data['__MODULE_UNDERSCORE__'] as $language_id => $value) {
			$this->db->query("INSERT INTO " . DB_PREFIX . "__MODULE_UNDERSCORE__ SET __MODULE_UNDERSCORE___id = '" . (int)$__MODULE_UNDERSCORE___id . "', language_id = '" . (int)$language_id . "', name = '" . $this->db->escape($value['name']) . "'");
		}

		$this->cache->delete('__MODULE_UNDERSCORE__');
	}

	public function delete__MODULE_CAPITAL_CAMEL__($__MODULE_UNDERSCORE___id) {
		$this->db->query("DELETE FROM " . DB_PREFIX . "__MODULE_UNDERSCORE__ WHERE __MODULE_UNDERSCORE___id = '" . (int)$__MODULE_UNDERSCORE___id . "'");

		$this->cache->delete('__MODULE_UNDERSCORE__');
	}

	public function get__MODULE_CAPITAL_CAMEL__($__MODULE_UNDERSCORE___id) {
		$query = $this->db->query("SELECT * FROM " . DB_PREFIX . "__MODULE_UNDERSCORE__ WHERE __MODULE_UNDERSCORE___id = '" . (int)$__MODULE_UNDERSCORE___id . "' AND language_id = '" . (int)$this->config->get('config_language_id') . "'");

		return $query->row;
	}

	public function get__MODULE_CAPITAL_CAMEL__es($data = array()) {
		if ($data) {
			$sql = "SELECT * FROM " . DB_PREFIX . "__MODULE_UNDERSCORE__ WHERE language_id = '" . (int)$this->config->get('config_language_id') . "'";

			$sql .= " ORDER BY name";

			if (isset($data['order']) && ($data['order'] == 'DESC')) {
				$sql .= " DESC";
			} else {
				$sql .= " ASC";
			}

			if (isset($data['start']) || isset($data['limit'])) {
				if ($data['start'] < 0) {
					$data['start'] = 0;
				}

				if ($data['limit'] < 1) {
					$data['limit'] = 20;
				}

				$sql .= " LIMIT " . (int)$data['start'] . "," . (int)$data['limit'];
			}

			$query = $this->db->query($sql);

			return $query->rows;
		} else {
			$__MODULE_UNDERSCORE___data = $this->cache->get('__MODULE_UNDERSCORE__.' . (int)$this->config->get('config_language_id'));

			if (!$__MODULE_UNDERSCORE___data) {
				$query = $this->db->query("SELECT __MODULE_UNDERSCORE___id, name FROM " . DB_PREFIX . "__MODULE_UNDERSCORE__ WHERE language_id = '" . (int)$this->config->get('config_language_id') . "' ORDER BY name");

				$__MODULE_UNDERSCORE___data = $query->rows;

				$this->cache->set('__MODULE_UNDERSCORE__.' . (int)$this->config->get('config_language_id'), $__MODULE_UNDERSCORE___data);
			}

			return $__MODULE_UNDERSCORE___data;
		}
	}

	public function get__MODULE_CAPITAL_CAMEL__Descriptions($__MODULE_UNDERSCORE___id) {
		$__MODULE_UNDERSCORE___data = array();

		$query = $this->db->query("SELECT * FROM " . DB_PREFIX . "__MODULE_UNDERSCORE__ WHERE __MODULE_UNDERSCORE___id = '" . (int)$__MODULE_UNDERSCORE___id . "'");

		foreach ($query->rows as $result) {
			$__MODULE_UNDERSCORE___data[$result['language_id']] = array('name' => $result['name']);
		}

		return $__MODULE_UNDERSCORE___data;
	}

	public function getTotal__MODULE_CAPITAL_CAMEL__s() {
		$query = $this->db->query("SELECT COUNT(*) AS total FROM " . DB_PREFIX . "__MODULE_UNDERSCORE__ WHERE language_id = '" . (int)$this->config->get('config_language_id') . "'");

		return $query->row['total'];
	}
}
