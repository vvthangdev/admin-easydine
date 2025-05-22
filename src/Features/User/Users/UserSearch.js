import React from "react";
import { TextField } from "@mui/material";

const UserSearch = ({ searchTerm, onSearch }) => {
  return (
    <TextField
      placeholder="Tìm kiếm theo tên, số điện thoại hoặc ID"
      value={searchTerm}
      onChange={(e) => onSearch(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onSearch(e.target.value);
        }
      }}
      size="small"
      autoComplete="off"
      sx={{
        width: { xs: "100%", sm: "256px", lg: "320px" },
        "& .MuiInputBase-input": { fontSize: "0.85rem" },
      }}
    />
  );
};

export default UserSearch;