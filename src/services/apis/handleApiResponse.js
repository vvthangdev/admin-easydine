export const handleApiResponse = (res) => {
    try {
      const { status, message, data } = res;
      console.log("API Response Data:", JSON.stringify(data, null, 2)); // Log dữ liệu chi tiết
      if (status === "SUCCESS") return data;
      throw new Error(message || "Lỗi từ server");
    } catch (error) {
      console.error("Lỗi xử lý phản hồi API:", res);
      throw new Error(error.message || "Phản hồi từ server không đúng định dạng");
    }
  };