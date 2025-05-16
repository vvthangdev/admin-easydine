const MINIO_API_URL =
  process.env.REACT_APP_MINIO_API_URL;

// Lưu trữ fileUrl từ lần upload gần nhất
let lastUploadedFileUrl = null;

class MinioStorage {
  constructor(bucket) {
    this.bucket = bucket;
  }

  /**
   * Uploads a file to MinIO via the API
   * @param {string} fileName - The name/path of the file (ignored by backend)
   * @param {File} file - The file to upload
   * @returns {Promise<{ error: Error | null }>} - Result of the upload
   */
  async upload(fileName, file) {
    if (!(file instanceof File)) {
      return {
        error: new Error("Invalid file. Please provide a File object."),
      };
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(MINIO_API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        return {
          error: new Error(`Upload failed with status ${response.status}`),
        };
      }

      const data = await response.json();
      lastUploadedFileUrl = data.fileUrl; // Lưu fileUrl để dùng trong getPublicUrl
      return { error: null };
    } catch (error) {
      return { error: new Error(`Failed to upload file: ${error.message}`) };
    }
  }

  /**
   * Gets the public URL for the last uploaded file
   * @param {string} fileName - The name/path of the file (ignored)
   * @returns {{ data: { publicUrl: string } }} - The public URL
   */
  getPublicUrl(fileName) {
    if (!lastUploadedFileUrl) {
      return { data: { publicUrl: "" } };
    }
    return { data: { publicUrl: lastUploadedFileUrl } };
  }
}

const minioClient = {
  storage: {
    from: (bucket) => new MinioStorage(bucket),
  },
};

export default minioClient;
