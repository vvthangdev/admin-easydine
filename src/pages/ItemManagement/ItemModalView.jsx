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
import {
  dialogStyles,
  inputStyles,
  buttonStyles,
  chipStyles,
  textStyles,
  boxStyles,
} from "../../styles"

const ItemModalView = ({
  type,
  visible,
  editingItem,
  categories,
  selectedItem,
  onOk,
  onCancel,
  formData = {}, // Thêm default value để tránh undefined
  setFormData = () => {}, // Thêm default function
  fileList = [],
  setFileList = () => {},
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

  // Helper function để update form data (với null check)
  const updateField = (field, value) => {
    if (setFormData) {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  // Helper function để update sizes (với null check)
  const updateSize = (index, field, value) => {
    if (setFormData && formData) {
      const newSizes = [...(formData.sizes || [])]
      newSizes[index] = { ...newSizes[index], [field]: value }
      updateField('sizes', newSizes)
    }
  }

  const addSize = () => {
    if (setFormData && formData) {
      const newSizes = [...(formData.sizes || []), { name: "", price: 0 }]
      updateField('sizes', newSizes)
    }
  }

  const removeSize = (index) => {
    if (setFormData && formData) {
      const newSizes = formData.sizes?.filter((_, i) => i !== index) || []
      updateField('sizes', newSizes)
    }
  }

  return (
    <Dialog
      open={visible}
      onClose={onCancel}
      maxWidth="md"
      fullWidth
      PaperProps={{ style: dialogStyles.paper }}
    >
      <DialogTitle style={type.includes("delete") ? dialogStyles.titleError : dialogStyles.title}>
        {getTitle()}
      </DialogTitle>
      <DialogContent style={dialogStyles.content}>
        {type === "item" && (
          <Box style={boxStyles.section}>
            {/* Basic Information */}
            <Box style={boxStyles.header}>
              <FileText size={20} color="#0071e3" />
              <Typography style={textStyles.blackBold}>Thông tin cơ bản</Typography>
            </Box>
            <TextField
              fullWidth
              label="Tên món"
              name="name"
              value={formData.name || ""}
              onChange={(e) => updateField('name', e.target.value)}
              required
              margin="dense"
              style={inputStyles.textField}
            />
            <TextField
              fullWidth
              label="Giá"
              name="price"
              type="number"
              value={formData.price || ""}
              onChange={(e) => updateField('price', Number.parseFloat(e.target.value) || 0)}
              required
              margin="dense"
              style={inputStyles.textField}
              InputProps={{
                startAdornment: <DollarSign size={16} color="#0071e3" style={{ marginRight: 8 }} />,
              }}
            />
            <TextField
              fullWidth
              label="Mô tả"
              name="description"
              value={formData.description || ""}
              onChange={(e) => updateField('description', e.target.value)}
              multiline
              rows={3}
              margin="dense"
              style={inputStyles.textField}
            />

            {/* Categories */}
            <Box style={boxStyles.section}>
              <Box style={boxStyles.header}>
                <Tag size={20} color="#0071e3" />
                <Typography style={textStyles.blackBold}>Danh mục</Typography>
              </Box>
              <FormControl fullWidth margin="dense" style={inputStyles.select}>
                <InputLabel>Chọn danh mục</InputLabel>
                <Select
                  multiple
                  value={formData.categories || []}
                  onChange={(e) => updateField('categories', e.target.value)}
                  label="Chọn danh mục"
                  renderValue={(selected) => (
                    <Box style={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {(selected || []).map((value) => {
                        const category = (categories || []).find((cat) => cat._id === value)
                        return (
                          <Chip
                            key={value}
                            label={category?.name || value}
                            size="small"
                            style={chipStyles.category}
                          />
                        )
                      })}
                    </Box>
                  )}
                >
                  {(categories || [])
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
            <Box style={boxStyles.section}>
              <Box style={boxStyles.header}>
                <DollarSign size={20} color="#0071e3" />
                <Typography style={textStyles.blackBold}>Kích cỡ (tùy chọn)</Typography>
              </Box>
              {formData.sizes?.map((size, index) => (
                <Box key={index} style={boxStyles.sizeContainer}>
                  <TextField
                    label="Tên kích cỡ"
                    value={size.name || ""}
                    onChange={(e) => updateSize(index, 'name', e.target.value)}
                    size="small"
                    style={{ ...inputStyles.textField, flex: 1 }}
                  />
                  <TextField
                    label="Giá"
                    type="number"
                    value={size.price || ""}
                    onChange={(e) => updateSize(index, 'price', Number.parseFloat(e.target.value) || 0)}
                    size="small"
                    style={{ ...inputStyles.textField, flex: 1 }}
                  />
                  <IconButton
                    onClick={() => removeSize(index)}
                    style={buttonStyles.dangerIconButton}
                  >
                    <Minus size={16} />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                startIcon={<Plus size={16} />}
                onClick={addSize}
                style={buttonStyles.outlinedPrimary}
              >
                Thêm kích cỡ
              </Button>
            </Box>

            {/* Image Upload */}
            <Box style={boxStyles.section}>
              <Box style={boxStyles.header}>
                <ImageIcon size={20} color="#0071e3" />
                <Typography style={textStyles.blackBold}>Ảnh món ăn (tùy chọn)</Typography>
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
                  style={buttonStyles.upload}
                >
                  Chọn ảnh
                </AntButton>
              </Upload>
            </Box>
          </Box>
        )}

        {type === "category" && (
          <Box style={boxStyles.section}>
            <Box style={boxStyles.header}>
              <Tag size={20} color="#0071e3" />
              <Typography style={textStyles.blackBold}>Thông tin danh mục</Typography>
            </Box>
            <TextField
              fullWidth
              label="Tên danh mục"
              name="name"
              value={formData.name || ""}
              onChange={(e) => updateField('name', e.target.value)}
              required
              margin="dense"
              style={inputStyles.textField}
            />
            <TextField
              fullWidth
              label="Mô tả"
              name="description"
              value={formData.description || ""}
              onChange={(e) => updateField('description', e.target.value)}
              margin="dense"
              style={inputStyles.textField}
            />
          </Box>
        )}

        {(type === "deleteItem" || type === "deleteCategory") && (
          <Box>
            <Typography style={textStyles.blackLight}>
              <span dangerouslySetInnerHTML={{ __html: getDeleteMessage() }} />
            </Typography>
            <Typography style={textStyles.error}>Lưu ý: Hành động này không thể hoàn tác.</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions style={dialogStyles.actions}>
        <Button
          onClick={onCancel}
          style={buttonStyles.outlined}
          variant="outlined"
        >
          Hủy
        </Button>
        <Button
          onClick={() => onOk(formData)}
          style={type.includes("delete") ? buttonStyles.danger : buttonStyles.primary}
          variant="contained"
        >
          {type.includes("delete") ? "Xóa" : "OK"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ItemModalView