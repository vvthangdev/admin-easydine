import React from "react";
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
} from "@mui/material";
import ItemSelectorViewModel from "./ItemSelectorViewModel";

const ItemSelectorView = ({ setSelectedItems, menuItems, setMenuItems, sx }) => {
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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        p: 2,
        maxWidth: "100%",
        ...sx,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Chọn món ăn
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexDirection: { xs: "column", sm: "row" } }}>
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
          maxHeight: "calc(100% - 140px)",
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
                sx={{ "&:hover": { bgcolor: "grey.100", cursor: "pointer" } }}
                onClick={(e) => {
                  if (e.target.tagName !== "BUTTON" && !e.target.closest("button")) {
                    handleAddItem(record);
                  }
                }}
              >
                <TableCell>
                  {record.image ? (
                    <img
                      src={record.image}
                      alt="Món ăn"
                      style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }}
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
                        .map((s) => `${s.name} (${s.price.toLocaleString()} VND)`)
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
      {loading && <CircularProgress sx={{ alignSelf: "center", mt: 2 }} />}
      <Modal
        open={isModalVisible}
        onClose={handleModalClose}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box sx={{ bgcolor: "background.paper", p: 3, borderRadius: 2, maxWidth: 400 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Thông tin món ăn
          </Typography>
          <Typography>{selectedDescription || "Không có mô tả."}</Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button variant="contained" color="error" onClick={handleModalClose}>
              Đóng
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ItemSelectorView;