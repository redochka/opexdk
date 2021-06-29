<?php
class ModelModule__MODULE_CAPITAL_CAMEL__ extends Model {

    public function get_total___MODULE_UNDERSCORE__s() {
        $sql = "SELECT COUNT(*) AS total FROM " . DB_PREFIX . "tv___MODULE_UNDERSCORE__";
        $query = $this->db->query($sql);
        return $query->row['total'];
    }

    public function get___MODULE_UNDERSCORE___list($filter_data) {
        $sql = "SELECT * FROM " . DB_PREFIX . "tv___MODULE_UNDERSCORE__";
        $query = $this->db->query($sql);
        return $query->rows;
    }

    public function add___MODULE_UNDERSCORE__($data) {
        $sql = "INSERT INTO " . DB_PREFIX . "tv___MODULE_UNDERSCORE__ SET __MODULE_UNDERSCORE___name = '" . $this->db->escape($data['__MODULE_UNDERSCORE___name']) . "'";
        $query = $this->db->query($sql);
        return $query; //bool
    }

    public function edit___MODULE_UNDERSCORE__($__MODULE_UNDERSCORE___id, $data) {
        $sql = "UPDATE " . DB_PREFIX . "tv___MODULE_UNDERSCORE__ SET __MODULE_UNDERSCORE___name = '" . $data['__MODULE_UNDERSCORE___name'] . "' WHERE id = " . (int)$__MODULE_UNDERSCORE___id;
        $query = $this->db->query($sql);
        return $query;
    }

    public function get___MODULE_UNDERSCORE__($__MODULE_UNDERSCORE___id) {
        $sql = "SELECT * FROM " . DB_PREFIX . "tv___MODULE_UNDERSCORE__ WHERE id = " . (int)$__MODULE_UNDERSCORE___id;
        $query = $this->db->query($sql);
        return $query->row;
    }

    public function delete___MODULE_UNDERSCORE__($__MODULE_UNDERSCORE___id) {
        $sql = "DELETE FROM " . DB_PREFIX . "tv___MODULE_UNDERSCORE__ WHERE id = " . (int)$__MODULE_UNDERSCORE___id;
        $this->db->query($sql);
    }
}