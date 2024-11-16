import { DefaultImage } from "assets/svgs";
import { Image } from "components";
import usePostImage, { IIdImage } from "hooks/usePostImage";
import { useEffect } from "react";
import {
  Control,
  Controller,
  FieldPath,
  UseFormSetValue,
} from "react-hook-form";
import { useAppSelector } from "store/storeHooks";
import { TRules } from "types/form.types";

import { ImageInputStyled } from "./ImageInput.style";
import { CircularProgress } from "@mui/material";

interface IImageProps<FormNames extends Record<string, any>> {
  title?: string;
  rules?: TRules<FormNames>;
  control: Control<FormNames>;
  name: FieldPath<FormNames>;
  setValue: UseFormSetValue<FormNames>;
  className?: string;
  getImage?: (img: IIdImage) => void;
  multiple?: boolean;
  accept?: string;
}

function ImageInput<FormNames extends Record<string, any>>({
  title,
  control,
  name,
  setValue,
  rules = {
    required: {
      value: true,
      message: "Rasm yuklash majburiy",
    },
  },
  className,
  getImage,
  multiple,
  accept = "image/*",
}: IImageProps<FormNames>) {
  const isOpen = useAppSelector((store) => store.formDrawerState.isOpen);
  useEffect(() => {
    if (!isOpen) {
      // @ts-ignore
      setValue(name, undefined);
    }
  }, [isOpen]);

  const { uploadImage, imageFile, isUploading } = usePostImage((IDImage) => {
    // @ts-ignore
    setValue(name, IDImage);
    if (getImage) {
      getImage(IDImage);
    }
  });

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ fieldState, field }) => {
        return (
          <ImageInputStyled className={className}>
            {title && <h3>{title}</h3>}
            <label className="input-file">
              <input
                ref={field.ref}
                id={name}
                name={field.name}
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    uploadImage({
                      imageFile: e.target.files[0],
                      id: name,
                    });
                  }
                }}
                type="file"
                accept={accept}
              />
              <div className="image-main">
                {isUploading ? (
                  <div className="pre-loader">
                    <CircularProgress color="primary" size={30} />
                  </div>
                ) : field?.value && !multiple ? (
                  <Image src={field?.value?.url} />
                ) : (
                  <div className="image-top">
                    <DefaultImage />
                  </div>
                )}
              </div>
            </label>
            {fieldState.error && !imageFile && (
              <>
                <h6 className="text-error mt-1">{fieldState.error?.message}</h6>
              </>
            )}
          </ImageInputStyled>
        );
      }}
    />
  );
}

export default ImageInput;
