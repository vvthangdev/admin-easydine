"use client"

import { TextField, InputAdornment } from "@mui/material"
import { Search } from 'lucide-react'

const UserSearch = ({ searchTerm, onSearch, onEnter }) => {
  return (
    <TextField
      placeholder="Tìm kiếm theo tên, số điện thoại hoặc ID"
      value={searchTerm}
      onChange={(e) => onSearch(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onEnter?.(e.target.value)
        }
      }}
      fullWidth
      size="small"
      autoComplete="off"
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          height: 40,
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#0071e3",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#0071e3",
            borderWidth: 2,
          },
          "& .MuiInputBase-input": {
            fontSize: "0.875rem",
          },
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "#0071e3",
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search size={18} color="#0071e3" />
          </InputAdornment>
        ),
      }}
    />
  )
}

export default UserSearch
