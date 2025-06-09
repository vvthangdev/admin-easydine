"use client";

import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  InputAdornment,
} from "@mui/material";
import { Search, Plus, Tag } from "lucide-react";
import { useMemo } from "react";
import { debounce } from "lodash";
import {
  textStyles,
  inputStyles,
  buttonStyles,
  boxStyles,
} from "../../styles/index";

const SearchFilterBar = ({
  categories,
  onSearch,
  onFilter,
  onAddItem,
  onAddCategory,
}) => {
  const debouncedSearch = useMemo(
    () => debounce((value) => onSearch(value), 300),
    [onSearch]
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (!value || value === "all") {
      onFilter("all");
    } else {
      onFilter(value);
    }
  };

  return (
    <Box sx={boxStyles.section}>
      <Typography
        variant="h4"
        sx={{
          ...textStyles.blackBold,
          fontSize: "1.5rem", // Điều chỉnh để giống h4
        }}
      >
        Quản lý menu món ăn
      </Typography>
      <Grid container spacing={2} alignItems="center">
  <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
    <TextField
      fullWidth
      placeholder="Tìm món theo tên"
      onChange={handleSearchChange}
      size="small"
      sx={inputStyles.textField}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search size={20} color="#0071e3" />
          </InputAdornment>
        ),
      }}
    />
  </Grid>
  <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
    <FormControl fullWidth size="small" sx={inputStyles.select}>
      <InputLabel>Lọc theo danh mục</InputLabel>
      <Select
        label="Lọc theo danh mục"
        onChange={handleCategoryChange}
        defaultValue="all"
        startAdornment={
          <InputAdornment position="start">
            <Tag size={20} color="#0071e3" style={{ marginRight: 8 }} />
          </InputAdornment>
        }
      >
        <MenuItem value="all">Tất cả</MenuItem>
        {categories
          .filter((cat) => cat && cat._id)
          .map((cat) => (
            <MenuItem key={cat._id} value={cat._id}>
              {cat.name}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  </Grid>
  <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
    <Box
      sx={{
        ...boxStyles.buttonGroup,
        justifyContent: { xs: 'flex-start', md: 'flex-end' },
        display: 'flex',
        gap: 1,
      }}
    >
      <Button
        variant="outlined"
        startIcon={<Tag size={18} />}
        onClick={onAddCategory}
        sx={buttonStyles.outlinedPrimary}
      >
        Thêm danh mục
      </Button>
      <Button
        variant="contained"
        startIcon={<Plus size={18} />}
        onClick={onAddItem}
        sx={buttonStyles.primary}
      >
        Thêm món ăn mới
      </Button>
    </Box>
  </Grid>
</Grid>
    </Box>
  );
};

export default SearchFilterBar;