import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Typography,
  Box,
  Avatar,
  Chip,
  TextField,
  Paper,
  Divider,
  IconButton,
} from "@mui/material";
import {
  CallSplit as SplitIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
} from "@mui/icons-material";
import { useAppleStyles } from "../../theme/theme-hooks.js";
import SplitOrderModalViewModel from "./SplitOrderModalViewModel";

const SplitOrderModal = ({ visible, orderDetails, onCancel, onSuccess, zIndex }) => {
  const styles = useAppleStyles();
  const { splitItems, handleSplitOrder, updateSplitQuantity, selectAllItems, selectedCount, toggleItemSelection } =
    SplitOrderModalViewModel({ visible, orderDetails, onCancel, onSuccess });

  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    selectAllItems(newSelectAll);
  };

  const totalSelectedAmount = splitItems
    .filter((item) => item.selected && item.splitQuantity > 0)
    .reduce((sum, item) => sum + item.itemPrice * item.splitQuantity, 0);

  return (
    <Dialog
      open={visible}
      onClose={onCancel}
      maxWidth="lg"
      fullWidth
      sx={{
        zIndex: zIndex || 1001,
        "& .MuiDialog-paper": {
          borderRadius: styles.borderRadius.modal,
          boxShadow: styles.shadows["2xl"],
          background: styles.gradients.light,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: styles.gradients.primary,
          color: styles.colors.white,
          padding: styles.spacing[4],
          display: "flex",
          alignItems: "center",
          gap: styles.spacing[2],
        }}
      >
        <Box sx={styles.components.iconContainer.glass}>
          <SplitIcon sx={{ color: styles.colors.white }} />
        </Box>
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: styles.typography.fontWeight.bold,
              marginBottom: styles.spacing[0.5],
            }}
          >
            Tách Đơn Hàng
          </Typography>
          <Typography
            variant="body2"
            sx={{
              opacity: 0.9,
              fontSize: styles.typography.fontSize.sm,
              color: styles.colors.white,
            }}
          >
            Chọn món ăn để tách thành đơn hàng mới
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ padding: styles.spacing[4] }}>
        <Box
          sx={{
            ...styles.components.card.main,
            padding: styles.spacing[3],
            marginBottom: styles.spacing[4],
            background: styles.gradients.light,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: styles.spacing[2] }}>
              <Box sx={styles.components.iconContainer.secondary}>
                <CartIcon sx={{ color: styles.colors.secondary.main }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: styles.typography.fontWeight.semibold }}
                >
                  Tổng quan
                </Typography>
                <Typography variant="body2" sx={{ color: styles.colors.text.secondary }}>
                  {selectedCount} món được chọn
                </Typography>
              </Box>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography
                variant="h6"
                sx={{
                  color: styles.colors.primary.main,
                  fontWeight: styles.typography.fontWeight.bold,
                }}
              >
                {totalSelectedAmount.toLocaleString()} VNĐ
              </Typography>
              <Typography variant="body2" sx={{ color: styles.colors.text.secondary }}>
                Tổng tiền tách
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            marginBottom: styles.spacing[3],
            display: "flex",
            alignItems: "center",
            gap: styles.spacing[2],
          }}
        >
          <Checkbox
            checked={selectAll}
            onChange={handleSelectAll}
            sx={{
              color: styles.colors.primary.main,
              "&.Mui-checked": { color: styles.colors.primary.main },
            }}
          />
          <Typography
            variant="body1"
            sx={{ fontWeight: styles.typography.fontWeight.medium }}
          >
            Chọn tất cả món ăn
          </Typography>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: styles.borderRadius.card,
            boxShadow: styles.shadows.card,
            maxHeight: 400,
            overflowY: "auto",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    background: styles.colors.background.paper,
                    fontWeight: styles.typography.fontWeight.semibold,
                    color: styles.colors.text.primary,
                    borderBottom: `1px solid ${styles.colors.neutral[200]}`,
                  }}
                >
                  Chọn
                </TableCell>
                <TableCell
                  sx={{
                    background: styles.colors.background.paper,
                    fontWeight: styles.typography.fontWeight.semibold,
                    color: styles.colors.text.primary,
                    borderBottom: `1px solid ${styles.colors.neutral[200]}`,
                  }}
                >
                  Món ăn
                </TableCell>
                <TableCell
                  sx={{
                    background: styles.colors.background.paper,
                    fontWeight: styles.typography.fontWeight.semibold,
                    color: styles.colors.text.primary,
                    borderBottom: `1px solid ${styles.colors.neutral[200]}`,
                  }}
                >
                  Giá
                </TableCell>
                <TableCell
                  sx={{
                    background: styles.colors.background.paper,
                    fontWeight: styles.typography.fontWeight.semibold,
                    color: styles.colors.text.primary,
                    borderBottom: `1px solid ${styles.colors.neutral[200]}`,
                  }}
                >
                  SL hiện tại
                </TableCell>
                <TableCell
                  sx={{
                    background: styles.colors.background.paper,
                    fontWeight: styles.typography.fontWeight.semibold,
                    color: styles.colors.text.primary,
                    borderBottom: `1px solid ${styles.colors.neutral[200]}`,
                  }}
                >
                  SL tách
                </TableCell>
                <TableCell
                  sx={{
                    background: styles.colors.background.paper,
                    fontWeight: styles.typography.fontWeight.semibold,
                    color: styles.colors.text.primary,
                    borderBottom: `1px solid ${styles.colors.neutral[200]}`,
                  }}
                >
                  Thành tiền
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {splitItems.map((item) => (
                <TableRow
                  key={item.key}
                  sx={{
                    backgroundColor: item.selected ? styles.colors.primary[50] : "transparent",
                    "&:hover": {
                      backgroundColor: styles.colors.neutral[50],
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      borderBottom: `1px solid ${styles.colors.neutral[200]}`,
                    }}
                  >
                    <Checkbox
                      checked={item.selected || false}
                      onChange={() => toggleItemSelection(item.key)}
                      sx={{
                        color: styles.colors.primary.main,
                        "&.Mui-checked": { color: styles.colors.primary.main },
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom: `1px solid ${styles.colors.neutral[200]}`,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: styles.spacing[2],
                      }}
                    >
                      <Avatar
                        src={item.itemImage}
                        alt={item.itemName}
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: styles.borderRadius.sm,
                          boxShadow: styles.shadows.xs,
                        }}
                      />
                      <Box>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: styles.typography.fontWeight.medium,
                          }}
                        >
                          {item.itemName}
                        </Typography>
                        {item.size && item.size !== "Mặc định" && (
                          <Chip
                            label={item.size}
                            size="small"
                            sx={{
                              marginTop: styles.spacing[0.5],
                              backgroundColor: styles.colors.primary[100],
                              color: styles.colors.primary.main,
                              borderRadius: styles.borderRadius.sm,
                            }}
                          />
                        )}
                        {item.note && (
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              marginTop: styles.spacing[0.5],
                              color: styles.colors.text.secondary,
                            }}
                          >
                            Ghi chú: {item.note}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom: `1px solid ${styles.colors.neutral[200]}`,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: styles.colors.success,
                        fontWeight: styles.typography.fontWeight.medium,
                      }}
                    >
                      {item.itemPrice.toLocaleString()} VNĐ
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom: `1px solid ${styles.colors.neutral[200]}`,
                    }}
                  >
                    <Chip
                      label={item.quantity}
                      sx={{
                        backgroundColor: styles.colors.neutral[100],
                        color: styles.colors.text.primary,
                        fontWeight: styles.typography.fontWeight.medium,
                        borderRadius: styles.borderRadius.sm,
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom: `1px solid ${styles.colors.neutral[200]}`,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: styles.spacing[1],
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateSplitQuantity(
                            item.key,
                            Math.max(0, item.splitQuantity - 1)
                          )
                        }
                        disabled={!item.selected || item.splitQuantity <= 0}
                        sx={{
                          backgroundColor: styles.colors.error,
                          color: styles.colors.white,
                          "&:hover": { backgroundColor: styles.gradients.error },
                          "&:disabled": {
                            backgroundColor: styles.colors.neutral[200],
                          },
                          borderRadius: styles.borderRadius.sm,
                        }}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <TextField
                        value={item.splitQuantity || 0}
                        onChange={(e) => {
                          const value = Number.parseInt(e.target.value) || 0;
                          if (value <= item.maxQuantity) {
                            updateSplitQuantity(item.key, value);
                          }
                        }}
                        size="small"
                        sx={{
                          width: 60,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: styles.borderRadius.input,
                            backgroundColor: styles.colors.background.light,
                            "&:hover": {
                              backgroundColor: styles.colors.background.paper,
                            },
                            "&.Mui-focused": {
                              backgroundColor: styles.colors.background.paper,
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: styles.colors.primary.main,
                                borderWidth: "2px",
                              },
                            },
                          },
                        }}
                        inputProps={{
                          min: 0,
                          max: item.maxQuantity,
                          style: { textAlign: "center" },
                        }}
                        disabled={!item.selected}
                      />
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateSplitQuantity(
                            item.key,
                            Math.min(item.maxQuantity, item.splitQuantity + 1)
                          )
                        }
                        disabled={!item.selected || item.splitQuantity >= item.maxQuantity}
                        sx={{
                          backgroundColor: styles.colors.success,
                          color: styles.colors.white,
                          "&:hover": { backgroundColor: styles.gradients.success },
                          "&:disabled": {
                            backgroundColor: styles.colors.neutral[200],
                          },
                          borderRadius: styles.borderRadius.sm,
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom: `1px solid ${styles.colors.neutral[200]}`,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: styles.colors.primary.main,
                        fontWeight: styles.typography.fontWeight.bold,
                      }}
                    >
                      {((item.splitQuantity || 0) * item.itemPrice).toLocaleString()} VNĐ
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <Divider sx={{ borderColor: styles.colors.neutral[200] }} />

      <DialogActions
        sx={{
          padding: styles.spacing[4],
          gap: styles.spacing[2],
          background: styles.colors.background.paper,
        }}
      >
        <Button
          onClick={onCancel}
          sx={{
            ...styles.components.button.outline,
            padding: styles.spacing[3],
            borderRadius: styles.borderRadius.button,
            color: styles.colors.text.primary,
            borderColor: styles.colors.neutral[300],
            "&:hover": {
              background: styles.colors.neutral[50],
              borderColor: styles.colors.primary.main,
            },
          }}
        >
          Hủy bỏ
        </Button>
        <Button
          onClick={handleSplitOrder}
          disabled={selectedCount === 0 || totalSelectedAmount === 0}
          sx={{
            ...styles.components.button.primary,
            padding: styles.spacing[3],
            borderRadius: styles.borderRadius.button,
            background: styles.gradients.primary,
            color: styles.colors.white,
            "&:hover": {
              background: styles.gradients.primary,
              boxShadow: styles.shadows.hover,
            },
            "&:disabled": {
              background: styles.colors.neutral[200],
              color: styles.colors.text.disabled,
            },
          }}
        >
          Tách Đơn ({selectedCount} món)
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SplitOrderModal;