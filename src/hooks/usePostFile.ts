import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export interface IIdImage {
  url: string;
  _id?: string;
}
export interface IFileImage {
  id?: string | number;
  imageFile?: File;
}
const usePostFile = (onSuccess?: (idImage: IIdImage) => void) => {
  const [imageFile, setImage] = useState<IIdImage>();
  const [isUploading, setIsUploading] = useState<boolean>();
  const uploadImage = (image: IFileImage) => {
    setIsUploading(true);
    if (image.imageFile) {
      axios({
        url: `${process.env.REACT_APP_BASE_URL}/image/file/upload`,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Accept-Language": localStorage.getItem("i18nextLng"),
          // storeId: localStorage.getItem("storeId"),
        },
        data: {
          file: image.imageFile,
          type: "file",
        },
      })
        .then((res) => {
          const IDImage = {
            url: res.data.data.url,
            _id: res.data.data._id,
          };
          onSuccess?.(IDImage);
          setImage(IDImage);
          setIsUploading(false);
        })
        .catch((err) => {
          console.log(err.response.data.message);
          setIsUploading(false);
          toast.error(err.response.data.message, {
            position: "top-center",
            autoClose: 5000,
          });
        });
    } else {
      setIsUploading(false);
      toast.error("Rasm fayl tanlanmadi!", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return { imageFile, isUploading, uploadImage, setImage };
};

export default usePostFile;
