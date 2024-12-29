import axios from "axios";

export const uploadFileToS3 = async (
  presignedUrl: string,
  file: File
): Promise<void> => {
  try {
    const options = {
      headers: {
        "Content-Type": file.type || "application/octet-stream", 
      },
    };
    console.log("Uploading file:", file.name, "Size:", file.size);
    await axios.put(presignedUrl, file, options);
    console.log("File uploaded successfully");
  } catch (error) {
    console.error("Error uploading file to S3:", error);
  }
};
