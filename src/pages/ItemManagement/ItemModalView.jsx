"use client"

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  IconButton,
  Chip,
} from "@mui/material"
import { Upload, Button as AntButton } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import { Plus, Minus, Tag, DollarSign, FileText, ImageIcon } from "lucide-react"

const ItemModalView = ({
  type,
  visible,
  editingItem,
  categories,
  selectedItem,
  onOk,
  onCancel,
  form,
  fileList,
  setFileList,
}) => {
  const getTitle = () => {
    switch (type) {
      case "item":
        return editingItem ? "Sửa món ăn" : "Thêm món ăn mới"
      case "category":
        return "Thêm danh mục mới"
      case "deleteItem":
        return "Xác nhận xóa món ăn"
      case "deleteCategory":
        return "Xác nhận xóa danh mục"
      default:
        return ""
    }
  }

  const getDeleteMessage = () => {
    if (type === "deleteItem") {
      return `Bạn có chắc chắn muốn xóa món ăn <strong>${selectedItem?.name}</strong> không?`
    }
    if (type === "deleteCategory") {
      return `Bạn có chắc chắn muốn xóa danh mục <strong>${selectedItem?.name}</strong> không?`
    }
    return ""
  }

  return (
    <Dialog
      open={visible}
      onClose={onCancel}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          background: "linear-gradient(145deg, #ffffff 0%, #f8f8fa 100%)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 3,
          background: type.includes("delete")
            ? "linear-gradient(145deg, rgba(255, 59, 48, 0.05) 0%, rgba(255, 59, 48, 0.1) 100%)"
            : "linear-gradient(145deg, rgba(0, 113, 227, 0.05) 0%, rgba(0, 113, 227, 0.1) 100%)",
          color: "#1d1d1f",
          fontWeight: 600,
          fontFamily: '"SF Pro Display", Roboto, sans-serif',
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
        }}
      >
        {getTitle()}
      </DialogTitle>
      <DialogContent sx={{ p: 3, mt: 2 }}>
        {type === "item" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Basic Information */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <FileText size={20} color="#0071e3" />
                <Typography variant="subtitle1" sx={{ color: "#1d1d1f", fontWeight: 500 }}>
                  Thông tin cơ bản
                </Typography>
              </Box>
              <TextField
                fullWidth
                label="Tên món"
                name="name"
                value={form.name || ""}
                onChange={(e) => form.setFieldsValue({ name: e.target.value })}
                required
                margin="dense"
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0071e3",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0071e3",
                      borderWidth: 2,
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#0071e3",
                  },
                }}
              />
              <TextField
                fullWidth
                label="Giá"
                name="price"
                type="number"
                value={form.price || ""}
                onChange={(e) => form.setFieldsValue({ price: Number.parseFloat(e.target.value) || 0 })}
                required
                margin="dense"
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0071e3",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0071e3",
                      borderWidth: 2,
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#0071e3",
                  },
                }}
                InputProps={{
                  startAdornment: <DollarSign size={16} color="#0071e3" style={{ marginRight: 8 }} />,
                }}
              />
              <TextField
                fullWidth
                label="Mô tả"
                name="description"
                value={form.description || ""}
                onChange={(e) => form.setFieldsValue({ description: e.target.value })}
                multiline
                rows={3}
                margin="dense"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0071e3",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0071e3",
                      borderWidth: 2,
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#0071e3",
                  },
                }}
              />
            </Box>

            {/* Categories */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Tag size={20} color="#0071e3" />
                <Typography variant="subtitle1" sx={{ color: "#1d1d1f", fontWeight: 500 }}>
                  Danh mục
                </Typography>
              </Box>
              <FormControl
                fullWidth
                margin="dense"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0071e3",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0071e3",
                      borderWidth: 2,
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#0071e3",
                  },
                }}
              >
                <InputLabel>Chọn danh mục</InputLabel>
                <Select
                  multiple
                  value={form.categories || []}
                  onChange={(e) => form.setFieldsValue({ categories: e.target.value })}
                  label="Chọn danh mục"
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => {
                        const category = categories.find((cat) => cat._id === value)
                        return (
                          <Chip
                            key={value}
                            label={category?.name || value}
                            size="small"
                            sx={{
                              backgroundColor: "rgba(156, 39, 176, 0.1)",
                              color: "#9c27b0",
                              fontWeight: 500,
                            }}
                          />
                        )
                      })}
                    </Box>
                  )}
                >
                  {categories
                    .filter((cat) => cat && cat._id)
                    .map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>

            {/* Sizes */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <DollarSign size={20} color="#0071e3" />
                <Typography variant="subtitle1" sx={{ color: "#1d1d1f", fontWeight: 500 }}>
                  Kích cỡ (tùy chọn)
                </Typography>
              </Box>
              {form.sizes?.map((size, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    background: "rgba(0, 113, 227, 0.05)",
                    border: "1px solid rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <TextField
                    label="Tên kích cỡ"
                    value={size.name || ""}
                    onChange={(e) => {
                      const newSizes = [...(form.sizes || [])]
                      newSizes[index] = { ...newSizes[index], name: e.target.value }
                      form.setFieldsValue({ sizes: newSizes })
                    }}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="Giá"
                    type="number"
                    value={size.price || ""}
                    onChange={(e) => {
                      const newSizes = [...(form.sizes || [])]
                      newSizes[index] = { ...newSizes[index], price: Number.parseFloat(e.target.value) || 0 }
                      form.setFieldsValue({ sizes: newSizes })
                    }}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <IconButton
                    onClick={() => {
                      const newSizes = form.sizes?.filter((_, i) => i !== index) || []
                      form.setFieldsValue({ sizes: newSizes })
                    }}
                    sx={{
                      color: "#ff3b30",
                      "&:hover": {
                        backgroundColor: "rgba(255, 59, 48, 0.1)",
                      },
                    }}
                  >
                    <Minus size={16} />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                startIcon={<Plus size={16} />}
                onClick={() => {
                  const newSizes = [...(form.sizes || []), { name: "", price: 0 }]
                  form.setFieldsValue({ sizes: newSizes })
                }}
                sx={{
                  borderColor: "#0071e3",
                  color: "#0071e3",
                  borderRadius: 28,
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": {
                    borderColor: "#0071e3",
                    background: "rgba(0, 113, 227, 0.05)",
                  },
                }}
              >
                Thêm kích cỡ
              </Button>
            </Box>

            {/* Image Upload */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <ImageIcon size={20} color="#0071e3" />
                <Typography variant="subtitle1" sx={{ color: "#1d1d1f", fontWeight: 500 }}>
                  Ảnh món ăn (tùy chọn)
                </Typography>
              </Box>
              <Upload
                listType="picture"
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                beforeUpload={() => false}
                maxCount={1}
              >
                <AntButton
                  icon={<UploadOutlined />}
                  style={{
                    height: 40,
                    borderRadius: 8,
                    borderColor: "#0071e3",
                    color: "#0071e3",
                  }}
                >
                  Chọn ảnh
                </AntButton>
              </Upload>
            </Box>
          </Box>
        )}

        {type === "category" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Tag size={20} color="#0071e3" />
              <Typography variant="subtitle1" sx={{ color: "#1d1d1f", fontWeight: 500 }}>
                Thông tin danh mục
              </Typography>
            </Box>
            <TextField
              fullWidth
              label="Tên danh mục"
              name="name"
              value={form.name || ""}
              onChange={(e) => form.setFieldsValue({ name: e.target.value })}
              required
              margin="dense"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0071e3",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0071e3",
                    borderWidth: 2,
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#0071e3",
                },
              }}
            />
            <TextField
              fullWidth
              label="Mô tả"
              name="description"
              value={form.description || ""}
              onChange={(e) => form.setFieldsValue({ description: e.target.value })}
              margin="dense"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0071e3",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0071e3",
                    borderWidth: 2,
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#0071e3",
                },
              }}
            />
          </Box>
        )}

        {(type === "deleteItem" || type === "deleteCategory") && (
          <Box>
            <Typography variant="body1" sx={{ color: "#1d1d1f", mb: 2 }}>
              <span dangerouslySetInnerHTML={{ __html: getDeleteMessage() }} />
            </Typography>
            <Typography variant="body2" sx={{ color: "#ff3b30" }}>
              Lưu ý: Hành động này không thể hoàn tác.
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: "1px solid rgba(0, 0, 0, 0.05)" }}>
        <Button
          onClick={onCancel}
          sx={{
            borderColor: "#86868b",
            color: "#86868b",
            borderRadius: 28,
            px: 3,
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              borderColor: "#1d1d1f",
              color: "#1d1d1f",
              background: "rgba(0, 0, 0, 0.05)",
            },
          }}
          variant="outlined"
        >
          Hủy
        </Button>
        <Button
          onClick={onOk}
          sx={{
            background: type.includes("delete")
              ? "linear-gradient(145deg, #ff3b30 0%, #ff9500 100%)"
              : "linear-gradient(145deg, #0071e3 0%, #42a5f5 100%)",
            color: "#ffffff",
            borderRadius: 28,
            px: 3,
            boxShadow: type.includes("delete")
              ? "0 4px 12px rgba(255, 59, 48, 0.2)"
              : "0 4px 12px rgba(0, 113, 227, 0.2)",
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              background: type.includes("delete")
                ? "linear-gradient(145deg, #ff3b30 0%, #ff9500 100%)"
                : "linear-gradient(145deg, #0071e3 0%, #42a5f5 100%)",
              boxShadow: type.includes("delete")
                ? "0 6px 16px rgba(255, 59, 48, 0.3)"
                : "0 6px 16px rgba(0, 113, 227, 0.3)",
            },
            transition: "all 0.3s ease",
          }}
          variant="contained"
        >
          {type.includes("delete") ? "Xóa" : "OK"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ItemModalView
