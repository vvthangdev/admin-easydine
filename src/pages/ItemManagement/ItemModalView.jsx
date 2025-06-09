'use client';

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
} from '@mui/material';
import { Upload, Button as AntButton } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Plus, Minus, Tag, DollarSign, FileText, ImageIcon } from 'lucide-react';
import { theme } from '../../styles'; // Chỉ import theme cho colors

const ItemModalView = ({
  type,
  visible,
  editingItem,
  categories,
  selectedItem,
  onOk,
  onCancel,
  formData = {},
  setFormData = () => {},
  fileList = [],
  setFileList = () => {},
}) => {
  const getTitle = () => {
    switch (type) {
      case 'item':
        return editingItem ? 'Sửa món ăn' : 'Thêm món ăn mới';
      case 'category':
        return 'Thêm danh mục mới';
      case 'deleteItem':
        return 'Xác nhận xóa món ăn';
      case 'deleteCategory':
        return 'Xác nhận xóa danh mục';
      default:
        return '';
    }
  };

  const getDeleteMessage = () => {
    if (type === 'deleteItem') {
      return `Bạn có chắc chắn muốn xóa món ăn <strong>${selectedItem?.name}</strong> không?`;
    }
    if (type === 'deleteCategory') {
      return `Bạn có chắc chắn muốn xóa danh mục <strong>${selectedItem?.name}</strong> không?`;
    }
    return '';
  };

  const updateField = (field, value) => {
    if (setFormData) {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const updateSize = (index, field, value) => {
    if (setFormData && formData) {
      const newSizes = [...(formData.sizes || [])];
      newSizes[index] = { ...newSizes[index], [field]: value };
      updateField('sizes', newSizes);
    }
  };

  const addSize = () => {
    if (setFormData && formData) {
      const newSizes = [...(formData.sizes || []), { name: '', price: 0 }];
      updateField('sizes', newSizes);
    }
  };

  const removeSize = (index) => {
    if (setFormData && formData) {
      const newSizes = formData.sizes?.filter((_, i) => i !== index) || [];
      updateField('sizes', newSizes);
    }
  };

  return (
    <Dialog
      open={visible}
      onClose={onCancel}
      maxWidth='md'
      fullWidth
    >
      <DialogTitle>
        <Typography variant='h6' sx={{ color: type.includes('delete') ? theme.colors.error.main : theme.colors.primary.main }}>
          {getTitle()}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {type === 'item' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Basic Information */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <FileText size={20} color={theme.colors.primary.main} />
              <Typography variant='subtitle1' sx={{ color: theme.colors.neutral[800], fontWeight: 600 }}>
                Thông tin cơ bản
              </Typography>
            </Box>
            <TextField
              fullWidth
              label='Tên món'
              name='name'
              value={formData.name || ''}
              onChange={(e) => updateField('name', e.target.value)}
              required
              margin='dense'
            />
            <TextField
              fullWidth
              label='Giá'
              name='price'
              type='number'
              value={formData.price || ''}
              onChange={(e) => updateField('price', Number.parseFloat(e.target.value) || 0)}
              required
              margin='dense'
              InputProps={{
                startAdornment: (
                  <DollarSign size={16} color={theme.colors.primary.main} sx={{ mr: 1 }} />
                ),
              }}
            />
            <TextField
              fullWidth
              label='Mô tả'
              name='description'
              value={formData.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              multiline
              rows={3}
              margin='dense'
            />

            {/* Categories */}
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Tag size={20} color={theme.colors.primary.main} />
                <Typography variant='subtitle1' sx={{ color: theme.colors.neutral[800], fontWeight: 600 }}>
                  Danh mục
                </Typography>
              </Box>
              <FormControl fullWidth margin='dense'>
                <InputLabel>Chọn danh mục</InputLabel>
                <Select
                  multiple
                  value={formData.categories || []}
                  onChange={(e) => updateField('categories', e.target.value)}
                  label='Chọn danh mục'
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected || []).map((value) => {
                        const category = (categories || []).find((cat) => cat._id === value);
                        return (
                          <Chip
                            key={value}
                            label={category?.name || value}
                            size='small'
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {(categories || []).filter((cat) => cat && cat._id).map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Sizes */}
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <DollarSign size={20} color={theme.colors.primary.main} />
                <Typography variant='subtitle1' sx={{ color: theme.colors.neutral[800], fontWeight: 600 }}>
                  Kích cỡ (tùy chọn)
                </Typography>
              </Box>
              {formData.sizes?.map((size, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <TextField
                    label='Tên kích cỡ'
                    value={size.name || ''}
                    onChange={(e) => updateSize(index, 'name', e.target.value)}
                    size='small'
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label='Giá'
                    type='number'
                    value={size.price || ''}
                    onChange={(e) => updateSize(index, 'price', Number.parseFloat(e.target.value) || 0)}
                    size='small'
                    sx={{ flex: 1 }}
                  />
                  <IconButton onClick={() => removeSize(index)} color='error'>
                    <Minus size={16} />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant='outlined'
                startIcon={<Plus size={16} />}
                onClick={addSize}
              >
                Thêm kích cỡ
              </Button>
            </Box>

            {/* Image Upload */}
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <ImageIcon size={20} color={theme.colors.primary.main} />
                <Typography variant='subtitle1' sx={{ color: theme.colors.neutral[800], fontWeight: 600 }}>
                  Ảnh món ăn (tùy chọn)
                </Typography>
              </Box>
              <Upload
                listType='picture'
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                beforeUpload={() => false}
                maxCount={1}
              >
                <AntButton
                  icon={<UploadOutlined />}
                  style={{
                    backgroundColor: theme.colors.neutral[100],
                    borderColor: theme.colors.neutral[300],
                    color: theme.colors.neutral[800],
                  }}
                >
                  Chọn ảnh
                </AntButton>
              </Upload>
            </Box>
          </Box>
        )}

        {type === 'category' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Tag size={20} color={theme.colors.primary.main} />
              <Typography variant='subtitle1' sx={{ color: theme.colors.neutral[800], fontWeight: 600 }}>
                Thông tin danh mục
              </Typography>
            </Box>
            <TextField
              fullWidth
              label='Tên danh mục'
              name='name'
              value={formData.name || ''}
              onChange={(e) => updateField('name', e.target.value)}
              required
              margin='dense'
            />
            <TextField
              fullWidth
              label='Mô tả'
              name='description'
              value={formData.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              margin='dense'
            />
          </Box>
        )}

        {(type === 'deleteItem' || type === 'deleteCategory') && (
          <Box>
            <Typography variant='body1' sx={{ color: theme.colors.neutral[800] }}>
              <span dangerouslySetInnerHTML={{ __html: getDeleteMessage() }} />
            </Typography>
            <Typography variant='body2' sx={{ color: theme.colors.error.main, mt: 1 }}>
              Lưu ý: Hành động này không thể hoàn tác.
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant='outlined'>
          Hủy
        </Button>
        <Button
          onClick={() => onOk(formData)}
          variant='contained'
          color={type.includes('delete') ? 'error' : 'primary'}
        >
          {type.includes('delete') ? 'Xóa' : 'OK'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemModalView;