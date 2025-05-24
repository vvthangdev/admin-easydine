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
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState(null);

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
    // Chuẩn bị dữ liệu item để truyền vào modal
    const itemData = {
      id: record._id,
      name: record.name,
      itemName: record.name, // Đảm bảo có itemName
      itemImage: record.image || "https://via.placeholder.com/80",
      price: record.price,
      sizes: record.sizes || [],
    };
    
    setSelectedItemForModal(itemData);
    setItemModalOpen(true);
  };

  const handleConfirmItem = (itemData) => {
    handleAddItem(itemData);
    setItemModalOpen(false);
    setSelectedItemForModal(null);
  };

  const handleCloseItemModal = () => {
    setItemModalOpen(false);
    setSelectedItemForModal(null);
  };

  // Xử lý click row - tránh trigger khi click vào button
  const handleRowClick = (e, record) => {
    if (
      e.target.tagName !== "BUTTON" &&
      !e.target.closest("button")
    ) {
      handleOpenItemModal(record);
    }
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
            variant="scrollable"
            scrollButtons="auto"
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
              size="small"
            />
            <FormControl sx={{ width: { xs: "100%", sm: 200 } }}>
              <InputLabel>Lọc theo danh mục</InputLabel>
              <Select
                value={selectedCategory || ""}
                label="Lọc theo danh mục"
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                size="small"
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
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: "grey.50" }}>Ảnh</TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: "grey.50" }}>Tên món</TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: "grey.50" }}>Giá</TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: "grey.50" }}>Kích thước</TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: "grey.50" }}>Công thức</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: "center", py: 4 }}>
                      <CircularProgress size={24} />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Đang tải món ăn...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : menuItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: "center", py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        Không tìm thấy món ăn nào
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  menuItems.map((record) => (
                    <TableRow
                      key={record._id}
                      sx={{ 
                        "&:hover": { bgcolor: "grey.100", cursor: "pointer" },
                        transition: "background-color 0.2s"
                      }}
                      onClick={(e) => handleRowClick(e, record)}
                    >
                      <TableCell>
                        {record.image ? (
                          <img
                            src={record.image}
                            alt={record.name}
                            style={{
                              width: 60,
                              height: 60,
                              objectFit: "cover",
                              borderRadius: 4,
                            }}
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/60";
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 60,
                              height: 60,
                              bgcolor: "grey.200",
                              borderRadius: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              No Image
                            </Typography>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {record.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: "success.main", fontWeight: 500 }}>
                          {record.price.toLocaleString()} VND
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {record.sizes?.length > 0 ? (
                          <Box>
                            {record.sizes.map((size, index) => (
                              <Typography key={index} variant="caption" sx={{ display: "block" }}>
                                {size.name} ({size.price.toLocaleString()} VND)
                              </Typography>
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            Kích thước mặc định
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {record.description && (
                          <Button
                            variant="text"
                            color="primary"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              showDescriptionModal(record.description);
                            }}
                          >
                            Chi tiết
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Modal hiển thị mô tả món ăn */}
      <Modal
        open={isModalVisible}
        onClose={handleModalClose}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 2,
            maxWidth: 500,
            width: "90%",
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Thông tin món ăn
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
            {selectedDescription || "Không có mô tả."}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              onClick={handleModalClose}
              sx={{ fontSize: "0.875rem" }}
            >
              Đóng
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal thêm món ăn */}
      <ItemDetailsModal
        open={itemModalOpen}
        onClose={handleCloseItemModal}
        onConfirm={handleConfirmItem}
        item={selectedItemForModal}
        sizes={selectedItemForModal?.sizes || []}
        isEditing={false}
      />
    </Box>
  );
};

export default ItemSelectorView;