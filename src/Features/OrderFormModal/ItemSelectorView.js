import React, { useState } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Select,
  MenuItem,
  Button,
  Modal,
  Box,
  Typography,
  FormControl,
  InputLabel,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import ItemSelectorViewModel from "./ItemSelectorViewModel";
import ItemDetailsModal from "./ItemDetailsModal";

const ItemSelectorView = ({
  setSelectedItems,
  menuItems,
  setMenuItems,
  sx,
  availableTables,
  selectedTables,
  setFormData,
  defaultTable,
  fetchAvailableTables,
  isExistingOrder = false,
}) => {
  const {
    categories,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    loading,
    isModalVisible,
    selectedDescription,
    handleAddItem,
    showDescriptionModal,
    handleModalClose,
  } = ItemSelectorViewModel({ setSelectedItems, menuItems, setMenuItems });

  const [activeTab, setActiveTab] = useState("Tầng 1");
  const [showTableSelector, setShowTableSelector] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const groupedTables = availableTables.reduce((acc, table) => {
    const area = table.area || "Không xác định";
    if (!acc[area]) {
      acc[area] = [];
    }
    acc[area].push(table);
    return acc;
  }, {});

  const handleTableChange = (area, value) => {
    const selectedTableIds = value.map((tableKey) => {
      const [tableNumber, tableArea] = tableKey.split("|");
      const table = availableTables.find(
        (t) => t.table_number === parseInt(tableNumber) && t.area === tableArea
      );
      return table ? table._id : null;
    }).filter((id) => id !== null);

    setFormData((prev) => {
      const otherAreaTableIds = prev.tables.filter((tableId) => {
        const table = availableTables.find((t) => t._id === tableId);
        return table && table.area !== area;
      });
      return {
        ...prev,
        tables: [...otherAreaTableIds, ...selectedTableIds],
      };
    });
  };

  const handleOpenItemModal = (record) => {
    setSelectedItem({
      id: record._id,
      name: record.name,
      price: record.price,
    });
    setModalOpen(true);
  };

  const handleConfirmItem = (itemData) => {
    handleAddItem(itemData);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        p: 1,
        maxWidth: "100%",
        ...sx,
      }}
    >
      <Typography variant="h6" sx={{ mb: 1 }}>
        Chọn món ăn
      </Typography>
      {!isExistingOrder && (
        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <Button
            variant={showTableSelector ? "outlined" : "contained"}
            color="primary"
            onClick={() => setShowTableSelector(false)}
            sx={{ fontSize: "0.875rem" }}
          >
            Chọn món
          </Button>
          <Button
            variant={showTableSelector ? "contained" : "outlined"}
            color="primary"
            onClick={() => setShowTableSelector(true)}
            sx={{ fontSize: "0.875rem" }}
          >
            Chọn bàn
          </Button>
        </Box>
      )}

      {showTableSelector && !isExistingOrder ? (
        <Box sx={{ mb: 1, maxHeight: "calc(100% - 120px)", overflowY: "auto" }}>
          <Typography variant="subtitle1">Chọn Bàn</Typography>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ mb: 1 }}
          >
            {Object.keys(groupedTables).map((area) => (
              <Tab key={area} label={area} value={area} />
            ))}
          </Tabs>
          {Object.keys(groupedTables).map((area) => (
            <Box key={area} sx={{ display: activeTab === area ? "block" : "none" }}>
              <FormControl fullWidth>
                <InputLabel>Chọn bàn ở {area}</InputLabel>
                <Select
                  multiple
                  value={
                    selectedTables
                      ? availableTables
                          .filter(
                            (table) =>
                              selectedTables.includes(table._id) && table.area === area
                          )
                          .map((table) => `${table.table_number}|${table.area}`)
                      : []
                  }
                  label={`Chọn bàn ở ${area}`}
                  onChange={(e) => handleTableChange(area, e.target.value)}
                >
                  {groupedTables[area].map((table) => (
                    <MenuItem
                      key={table._id}
                      value={`${table.table_number}|${table.area}`}
                    >
                      Bàn {table.table_number} (Sức chứa: {table.capacity})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          ))}
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              mb: 1,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <TextField
              label="Tìm kiếm món ăn"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              sx={{ flex: 1 }}
            />
            <FormControl sx={{ width: { xs: "100%", sm: 200 } }}>
              <InputLabel>Lọc theo danh mục</InputLabel>
              <Select
                value={selectedCategory || ""}
                label="Lọc theo danh mục"
                onChange={(e) => setSelectedCategory(e.target.value || null)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <TableContainer
            sx={{
              flex: 1,
              overflowY: "auto",
              maxHeight: isExistingOrder ? "calc(100% - 100px)" : "calc(100% - 140px)",
              maxWidth: "100%",
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Ảnh</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Tên món</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Giá</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Kích thước</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Công thức</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menuItems.map((record) => (
                  <TableRow
                    key={record._id}
                    sx={{ "&:hover": { bgcolor: "grey.100", cursor: "pointer" }}}
                    onClick={(e) => {
                      if (
                        e.target.tagName !== "BUTTON" &&
                        !e.target.closest("button")
                      ) {
                        handleOpenItemModal(record);
                      }
                    }}
                  >
                    <TableCell>
                      {record.image ? (
                        <img
                          src={record.image}
                          alt="Món ăn"
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                      ) : (
                        <Typography color="text.secondary">Không có ảnh</Typography>
                      )}
                    </TableCell>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>{record.price.toLocaleString()} VND</TableCell>
                    <TableCell>
                      {record.sizes?.length > 0
                        ? record.sizes
                            .map(
                              (s) => `${s.name} (${s.price.toLocaleString()} VND)`
                            )
                            .join(", ")
                        : "Mặc định"}
                    </TableCell>
                    <TableCell>
                      {record.description && (
                        <Button
                          variant="text"
                          color="primary"
                          onClick={() => showDescriptionModal(record.description)}
                        >
                          Chi tiết
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      {loading && <CircularProgress sx={{ alignSelf: "center", mt: 1 }} />}
      <Modal
        open={isModalVisible}
        onClose={handleModalClose}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            p: 2,
            borderRadius: 2,
            maxWidth: 400,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            Thông tin món ăn
          </Typography>
          <Typography>{selectedDescription || "Không có mô tả."}</Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleModalClose}
              sx={{ fontSize: "0.875rem" }}
            >
              Đóng
            </Button>
          </Box>
        </Box>
      </Modal>
      <ItemDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmItem}
        item={selectedItem}
        sizes={menuItems.find((m) => m._id === selectedItem?.id)?.sizes || []}
        isEditing={false}
      />
    </Box>
  );
};

export default ItemSelectorView;