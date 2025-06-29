import { useState, useCallback, useEffect } from "react";
import { adminAPI } from "../../../services/apis/Admin";
import minioClient from "../../../Server/minioClient";

const UserFormModalViewModel = ({ editingUser, setSnackbar }) => {
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
      setAvatar(
        editingUser.avatar ? [{ url: editingUser.avatar, uid: "1" }] : []
      );
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
    if (!editingUser && !form.password) {
      newErrors.password = "Vui lòng nhập mật khẩu!";
    } else if (form.password && form.password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự!";
    }
    return newErrors;
  }, [form, editingUser]);

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
      let imageUrl = editingUser?.avatar || "";
      if (avatar?.length > 0 && avatar[0]?.originFileObj) {
        const timestamp = Date.now();
        const fileName = `images/${timestamp}_${avatar[0].originFileObj.name}`;
        const minioStorage = minioClient.storage.from("test01");
        const { error } = await minioStorage.upload(
          fileName,
          avatar[0].originFileObj
        );
        if (error) throw new Error(`Không thể upload file: ${error.message}`);
        const { data: publicUrlData } = minioStorage.getPublicUrl(fileName);
        if (!publicUrlData.publicUrl)
          throw new Error("Không thể lấy URL công khai cho ảnh.");
        imageUrl = publicUrlData.publicUrl;
      }

      const userData = {
        email: form.email,
        username: form.username,
        name: form.name,
        phone: form.phone || "",
        address: form.address || "",
        role: form.role,
        avatar: imageUrl,
        ...(form.password && { password: form.password }),
      };

      let updatedUser;
      if (editingUser) {
        userData.id = editingUser._id;
        updatedUser = await adminAPI.updateUser(userData);
      } else {
        updatedUser = await adminAPI.createUserByAdmin(userData);
      }

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

      setSnackbar({
        open: true,
        message: editingUser
          ? "Cập nhật người dùng thành công"
          : "Thêm người dùng thành công",
        severity: "success",
      });

      return updatedUser; // Trả về dữ liệu người dùng để sử dụng trong UserScreenView
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi lưu người dùng";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
      throw error; // Ném lỗi để UserScreenView xử lý
    }
  }, [form, avatar, editingUser, validateForm, setSnackbar]);

  const handleCancel = useCallback(() => {
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
  }, []);

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
