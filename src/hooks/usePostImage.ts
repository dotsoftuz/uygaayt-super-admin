import axios from "axios";
import { useState } from "react";

export interface IIdImage {
  url: string;
  _id?: string;
}
export interface IFileImage {
  id?: string | number;
  imageFile?: File;
}
const usePostImage = (onSuccess?: (idImage: IIdImage) => void) => {
  const [imageFile, setImage] = useState<IIdImage>();
  const [isUploading, setIsUploading] = useState<boolean>();
  const uploadImage = (image: IFileImage) => {
    setIsUploading(true);
    if (image.imageFile) {
      axios({
        url: `${process.env.REACT_APP_BASE_URL}/image/upload`,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          storeId: localStorage.getItem("storeId"),
        },
        data: {
          file: image.imageFile,
          type: "img",
        },
      }).then((res) => {
        const IDImage = {
          url: res.data.data.url,
          _id: res.data.data._id,
        };
        onSuccess?.(IDImage);
        setImage(IDImage);
        setIsUploading(false);
      });
    }
  };
  return { imageFile, isUploading, uploadImage, setImage };
};

export default usePostImage;
