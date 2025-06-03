"use client"

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
} from "@mui/material"
import { Search, Plus, Tag } from 'lucide-react'
import { useMemo } from "react"
import { debounce } from "lodash"

const SearchFilterBar = ({ categories, onSearch, onFilter, onAddItem, onAddCategory }) => {
  const debouncedSearch = useMemo(() => debounce((value) => onSearch(value), 300), [onSearch])

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value)
  }

  const handleCategoryChange = (e) => {
    const value = e.target.value
    if (!value || value === "all") {
      onFilter("all")
    } else {
      onFilter(value)
    }
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h4"
        sx={{
          color: "#1d1d1f",
          fontWeight: 700,
          fontFamily: '"SF Pro Display", Roboto, sans-serif',
          mb: 3,
        }}
      >
        Quản lý menu món ăn
      </Typography>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            placeholder="Tìm món theo tên"
            onChange={handleSearchChange}
            size="small"
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} color="#0071e3" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl
            fullWidth
            size="small"
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
            <InputLabel>Lọc theo danh mục</InputLabel>
            <Select
              label="Lọc theo danh mục"
              onChange={handleCategoryChange}
              defaultValue="all"
              startAdornment={
                <InputAdornment position="start">
                  <Tag size={16} color="#0071e3" style={{ marginLeft: -4, marginRight: 8 }} />
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
        <Grid item xs={12} sm={12} md={6}>
          <Box sx={{ display: "flex", gap: 2, justifyContent: { xs: "flex-start", md: "flex-end" } }}>
            <Button
              variant="outlined"
              startIcon={<Tag size={18} />}
              onClick={onAddCategory}
              sx={{
                borderColor: "#0071e3",
                color: "#0071e3",
                borderRadius: 28,
                px: 3,
                textTransform: "none",
                fontWeight: 500,
                "&:hover": {
                  borderColor: "#0071e3",
                  background: "rgba(0, 113, 227, 0.05)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Thêm danh mục
            </Button>
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={onAddItem}
              sx={{
                background: "linear-gradient(145deg, #0071e3 0%, #42a5f5 100%)",
                color: "#ffffff",
                borderRadius: 28,
                px: 3,
                boxShadow: "0 4px 12px rgba(0, 113, 227, 0.2)",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": {
                  background: "linear-gradient(145deg, #0071e3 0%, #42a5f5 100%)",
                  boxShadow: "0 6px 16px rgba(0, 113, 227, 0.3)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Thêm món ăn mới
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SearchFilterBar
