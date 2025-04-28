import React, { useState } from "react";
import UserList from "./UserList";
import VoucherList from "./VoucherList";

export default function UserVoucherManagement() {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="p-4 sm:p-6 text-left">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Quản lý Người dùng và Voucher
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <UserList onSelectUser={handleSelectUser} />
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <VoucherList selectedUser={selectedUser} />
        </div>
      </div>
    </div>
  );
}