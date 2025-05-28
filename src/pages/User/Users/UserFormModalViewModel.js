import { useState, useCallback, useEffect } from "react";

const UserFormModalViewModel = ({ editingUser, setSnackbar, onSave }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    address: "",
    role: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [avatar, setAvatar] = useState([]);

  // Đồng bộ form và avatar khi editingUser thay đổi
  useEffect(() => {
    if (editingUser) {
      setForm({
        name: editingUser.name || "",
        email: editingUser.email || "",
        username: editingUser.username || "",
        phone: editingUser.phone || "",
        address: editingUser.address || "",
        role: editingUser.role || "",
        password: "",
      });
      setAvatar(editingUser.avatar ? [{ url: editingUser.avatar, uid: "1" }] : []);
    } else {
      setForm({
        name: "",
        email: "",
        username: "",
        phone: "",
        address: "",
        role: "",
        password: "",
      });
      setAvatar([]);
    }
  }, [editingUser]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Vui lòng nhập tên!";
    if (!form.email) {
      newErrors.email = "Vui lòng nhập email!";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Email không hợp lệ!";
    }
    if (!form.username) newErrors.username = "Vui lòng nhập username!";
    if (form.phone && !/^[0-9]{10}$/.test(form.phone)) {
      newErrors.phone = "Số điện thoại phải có 10 chữ số!";
    }
    if (!form.role) newErrors.role = "Vui lòng chọn vai trò!";
    if (form.password && form.password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự!";
    }
    return newErrors;
  }, [form]);

  const handleFieldChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleRoleChange = useCallback((e) => {
    setForm((prev) => ({ ...prev, role: e.target.value }));
    setErrors((prev) => ({ ...prev, role: undefined }));
  }, []);

  const handleUploadChange = useCallback(({ fileList }) => {
    setAvatar(fileList);
  }, []);

  const handleOk = useCallback(async () => {
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setSnackbar({
        open: true,
        message: "Vui lòng kiểm tra lại các trường thông tin!",
        severity: "error",
      });
      return;
    }

    try {
      await onSave({ ...form, avatar: avatar?.[0]?.originFileObj });
      setForm({
        name: "",
        email: "",
        username: "",
        phone: "",
        address: "",
        role: "",
        password: "",
      });
      setAvatar([]);
      setErrors({});
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Có lỗi xảy ra khi lưu người dùng",
        severity: "error",
      });
    }
  }, [form, avatar, validateForm, setSnackbar, onSave]);

  const handleCancel = useCallback(() => {
    setForm({
      name: editingUser?.name || "",
      email: editingUser?.email || "",
      username: editingUser?.username || "",
      phone: editingUser?.phone || "",
      address: editingUser?.address || "",
      role: editingUser?.role || "",
      password: "",
    });
    setAvatar(editingUser?.avatar ? [{ url: editingUser.avatar, uid: "1" }] : []);
    setErrors({});
  }, [editingUser]);

  return {
    form,
    errors,
    avatar,
    handleFieldChange,
    handleRoleChange,
    handleUploadChange,
    handleOk,
    handleCancel,
  };
};

export default UserFormModalViewModel;