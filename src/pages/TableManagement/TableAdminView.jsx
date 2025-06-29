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
import { useAppleStyles } from "../../theme/theme-hooks";

const TableAdminView = ({ tables, areas, onAddSuccess, onEditSuccess, onDeleteSuccess }) => {
  const styles = useAppleStyles(); // Sử dụng hook để lấy style Apple
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

  // Shorten the link for display
  const shortenLink = (link) => {
    const parts = link.split("/");
    return `.../menu/${parts[parts.length - 1]}`;
  };

  // Kiểm tra an toàn cho styles.table và styles.modal
  const tableStyles = styles.table || {};
  const modalStyles = styles.modal || {};
  const tableContainerStyle = tableStyles.container || {
    borderRadius: styles.borderRadius.card || "12px",
    overflow: "hidden",
    boxShadow: styles.shadows.card || "0 5px 15px rgba(0, 0, 0, 0.05)",
    border: "1px solid rgba(0, 0, 0, 0.05)",
  };
  const modalContentStyle = modalStyles.content || {
    borderRadius: styles.borderRadius.modal || "16px",
    boxShadow: styles.shadows["2xl"] || "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    border: "none",
    background: styles.colors.background.paper || "#ffffff",
    maxWidth: "90vw",
    maxHeight: "90vh",
  };

  return (
    <Box sx={{ p: styles.spacing(3) }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: styles.spacing(2) }}>
        <Typography
          variant="h6"
          sx={{ ...styles.typography.h6, color: styles.colors.text.primary }}
        >
          Danh sách bàn
        </Typography>
        <Button
          variant="contained"
          sx={{ ...styles.button("primary") }}
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
          sx={{
            mb: styles.spacing(2),
            "& .MuiTab-root": {
              fontWeight: styles.typography.fontWeight.semibold,
              color: styles.colors.text.secondary,
              "&.Mui-selected": {
                color: styles.colors.primary.main,
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: styles.colors.primary.main,
            },
          }}
        >
          {tabAreas.map((area) => (
            <Tab label={area} value={area} key={area} />
          ))}
        </Tabs>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: styles.spacing(2) }}>
          <CircularProgress sx={{ color: styles.colors.primary.main }} />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={tableContainerStyle}>
          <Table>
            <TableHead>
              <TableRow sx={tableStyles.header || {}}>
                <TableCell>Số bàn</TableCell>
                <TableCell>Sức chứa</TableCell>
                <TableCell>Khu vực</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTables.map((table) => (
                <TableRow key={table._id || table.table_id} sx={tableStyles.row || {}}>
                  <TableCell sx={tableStyles.cell || {}}>{table.table_number}</TableCell>
                  <TableCell sx={tableStyles.cell || {}}>{table.capacity}</TableCell>
                  <TableCell sx={tableStyles.cell || {}}>{table.area}</TableCell>
                  <TableCell align="right" sx={tableStyles.cell || {}}>
                    <Button
                      variant="outlined"
                      sx={{ ...styles.button("outline"), mr: styles.spacing(1) }}
                      onClick={() => handleEdit(table)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{ ...styles.button("outline"), borderColor: styles.colors.error, color: styles.colors.error, mr: styles.spacing(1) }}
                      onClick={() => handleDelete(table.table_id)}
                    >
                      Xóa
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{ ...styles.button("secondary") }}
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
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...modalStyles.overlay,
        }}
      >
        <Box
          sx={{
            ...modalContentStyle,
            p: styles.spacing(4),
            textAlign: "center",
            maxWidth: "400px",
            width: "90%",
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              top: styles.spacing(2),
              right: styles.spacing(2),
              color: styles.colors.text.secondary,
              "&:hover": {
                backgroundColor: styles.colors.neutral[100],
              },
            }}
          >
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              ...styles.typography.h6,
              color: styles.colors.text.primary,
              mb: styles.spacing(2),
            }}
          >
            QR Code Menu
          </Typography>
          {selectedTable && (
            <Box sx={{ mb: styles.spacing(2), textAlign: "left" }}>
              <Typography
                variant="body2"
                sx={{
                  ...styles.typography.body2,
                  color: styles.colors.text.primary,
                  mb: styles.spacing(1),
                }}
              >
                <strong>Số bàn:</strong> {selectedTable.table_number}
              </Typography>
              
              <Typography
                variant="body2"
                sx={{
                  ...styles.typography.body2,
                  color: styles.colors.text.primary,
                  mb: styles.spacing(1),
                }}
              >
                <strong>Sức chứa:</strong> {selectedTable.capacity}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  ...styles.typography.body2,
                  color: styles.colors.text.primary,
                  mb: styles.spacing(1),
                }}
              >
                <strong>Khu vực:</strong> {selectedTable.area}
              </Typography>
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: styles.spacing(2),
              backgroundColor: styles.colors.background.light,
              p: styles.spacing(1),
              borderRadius: styles.rounded("sm"),
            }}
          >
            <Typography
              variant="body2"
              sx={{
                ...styles.typography.body2,
                color: styles.colors.text.secondary,
                wordBreak: "break-all",
              }}
            >
              {shortenLink(qrLink)}
            </Typography>
            <Tooltip title="Sao chép liên kết">
              <IconButton
                onClick={handleCopyLink}
                sx={{
                  ml: styles.spacing(1),
                  color: styles.colors.primary.main,
                  "&:hover": {
                    backgroundColor: styles.colors.primary[50],
                  },
                }}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          {qrLink && (
            <Box
              sx={{
                backgroundColor: styles.colors.white,
                p: styles.spacing(2),
                borderRadius: styles.rounded("md"),
                boxShadow: styles.shadow("sm"),
                display: "inline-block",
              }}
            >
              <QRCodeCanvas
                value={qrLink}
                size={200}
                level="H"
                includeMargin={true}
              />
            </Box>
          )}
          <Button
            variant="contained"
            sx={{ ...styles.button("primary"), mt: styles.spacing(2) }}
            onClick={handleCloseModal}
          >
            Đóng
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default TableAdminView;