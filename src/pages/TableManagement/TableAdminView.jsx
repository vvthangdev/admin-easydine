import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Modal,
  IconButton,
  Tooltip,
} from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import TableAdminViewModel from "./TableAdminViewModel";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast } from "react-toastify";

const TableAdminView = ({ tables, areas, onAddSuccess, onEditSuccess, onDeleteSuccess }) => {
  const {
    activeArea,
    setActiveArea,
    filteredTables,
    tabAreas,
    loading,
    handleDelete,
    handleAdd,
    handleEdit,
  } = TableAdminViewModel({
    tables,
    areas,
    onAddSuccess,
    onEditSuccess,
    onDeleteSuccess,
  });

  const [openModal, setOpenModal] = useState(false);
  const [qrLink, setQrLink] = useState("");
  const [selectedTable, setSelectedTable] = useState(null);

  // Function to handle opening the modal with the QR code and table info
  const handleOpenQrModal = (table) => {
    const link = `https://vuvanthang.website/user/menu/${table._id || table.table_id}`;
    setQrLink(link);
    setSelectedTable(table);
    setOpenModal(true);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setQrLink("");
    setSelectedTable(null);
  };

  // Function to copy link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrLink).then(() => {
      toast.success("Đã sao chép liên kết!");
    }).catch(() => {
      toast.error("Sao chép thất bại!");
    });
  };

  // Shorten the link for display (optional, e.g., show only table ID or a shorter format)
  const shortenLink = (link) => {
    const parts = link.split("/");
    return `.../menu/${parts[parts.length - 1]}`; // Hiển thị chỉ phần cuối của link
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Danh sách bàn</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAdd}
          disabled={loading}
        >
          Thêm bàn mới
        </Button>
      </Box>

      {tabAreas.length > 0 && (
        <Tabs
          value={activeArea}
          onChange={(e, newValue) => setActiveArea(newValue)}
          sx={{ mb: 2 }}
        >
          {tabAreas.map((area) => (
            <Tab label={area} value={area} key={area} />
          ))}
        </Tabs>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Số bàn</TableCell>
                <TableCell>Sức chứa</TableCell>
                <TableCell>Khu vực</TableCell>
                <TableCell align="right">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTables.map((table) => (
                <TableRow key={table._id || table.table_id}>
                  <TableCell>{table.table_number}</TableCell>
                  <TableCell>{table.capacity}</TableCell>
                  <TableCell>{table.area}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEdit(table)}
                      sx={{ mr: 1 }}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(table.table_id)}
                      sx={{ mr: 1 }}
                    >
                      Xóa
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleOpenQrModal(table)}
                    >
                      QR Code
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal for displaying QR code and table info */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="qr-code-modal"
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            position: "relative",
            textAlign: "center",
            maxWidth: 400,
            width: "90%",
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" gutterBottom>
            QR Code Menu
          </Typography>
          {selectedTable && (
            <Box sx={{ mb: 2, textAlign: "left" }}>
              <Typography variant="body2">
                <strong>Số bàn:</strong> {selectedTable.table_number}
              </Typography>
              <Typography variant="body2">
                <strong>Tầng:</strong> {selectedTable.floor || "Không xác định"}
              </Typography>
              <Typography variant="body2">
                <strong>Sức chứa:</strong> {selectedTable.capacity}
              </Typography>
              <Typography variant="body2">
                <strong>Khu vực:</strong> {selectedTable.area}
              </Typography>
            </Box>
          )}
          <Typography variant="body2" sx={{ mb: 2, wordBreak: "break-all" }}>
            {shortenLink(qrLink)}
            <Tooltip title="Sao chép liên kết">
              <IconButton onClick={handleCopyLink} sx={{ ml: 1 }}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Typography>
          {qrLink && (
            <QRCodeCanvas
              value={qrLink}
              size={200}
              level="H"
              includeMargin={true}
            />
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleCloseModal}
            sx={{ mt: 2 }}
          >
            Đóng
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default TableAdminView;