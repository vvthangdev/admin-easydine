"use client"

import { useState, useMemo } from "react"
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  InputAdornment,
  CircularProgress,
} from "@mui/material"
import { Search, User, Phone, Home } from 'lucide-react'
import debounce from "lodash.debounce"
import { userAPI } from "../../services/apis/User"

const UserSearch = ({ onSelectCustomer }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)

  const searchUsers = async (query) => {
    if (!query || query.trim() === "") {
      setSearchResults([])
      return
    }

    setLoading(true)
    try {
      const response = await userAPI.searchUsers(query)
      setSearchResults(response)
    } catch (error) {
      console.error("Error searching users:", error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const debouncedSearch = useMemo(() => debounce((value) => searchUsers(value), 300), [])

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    debouncedSearch(value)
  }

  const handleSelectCustomer = (customer) => {
    setSearchTerm("")
    setSearchResults([])
    onSelectCustomer(customer)
  }

  return (
    <Box sx={{ height: "100%", overflowY: "auto" }}>
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          color: "#1d1d1f",
          fontWeight: 600,
          fontFamily: '"SF Pro Display", Roboto, sans-serif',
        }}
      >
        Tìm kiếm khách hàng
      </Typography>
      <TextField
        fullWidth
        label="Tìm kiếm theo tên, số điện thoại, địa chỉ"
        value={searchTerm}
        onChange={handleSearch}
        variant="outlined"
        sx={{
          mb: 3,
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
          endAdornment: loading && (
            <InputAdornment position="end">
              <CircularProgress size={20} sx={{ color: "#0071e3" }} />
            </InputAdornment>
          ),
        }}
      />
      {searchResults.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
            overflow: "hidden",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            background: "linear-gradient(145deg, #ffffff 0%, #f8f8fa 100%)",
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "rgba(0, 113, 227, 0.05)" }}>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#1d1d1f",
                    py: 1.5,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <User size={16} />
                    Tên
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#1d1d1f",
                    py: 1.5,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Phone size={16} />
                    Số điện thoại
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#1d1d1f",
                    py: 1.5,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Home size={16} />
                    Địa chỉ
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#1d1d1f",
                    py: 1.5,
                  }}
                >
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchResults.map((record) => (
                <TableRow
                  key={record._id}
                  sx={{
                    "&:hover": { backgroundColor: "rgba(0, 113, 227, 0.05)" },
                    transition: "background-color 0.2s",
                  }}
                >
                  <TableCell sx={{ color: "#1d1d1f" }}>{record.name}</TableCell>
                  <TableCell sx={{ color: "#1d1d1f" }}>{record.phone}</TableCell>
                  <TableCell sx={{ color: "#1d1d1f" }}>{record.address}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleSelectCustomer(record)}
                      sx={{
                        background: "linear-gradient(145deg, #0071e3 0%, #42a5f5 100%)",
                        color: "#ffffff",
                        borderRadius: 28,
                        px: 2,
                        py: 0.5,
                        minWidth: 0,
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
                      Chọn
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}

export default UserSearch
