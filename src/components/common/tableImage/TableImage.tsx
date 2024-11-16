import React from "react";
// @ts-ignore
import defImage from "assets/images/default-image (1).webp";

const TableImage: React.FC<
  { src: string | undefined } & React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
> = ({ src, ...props }) => {
  return (
    <>
      <img
        {...props}
        style={{
          width: "39px",
          height: "33px",
          borderRadius: "4px",
          objectFit: "cover",
        }}
        src={!src ? defImage : process.env.REACT_APP_BASE_URL + "public" + src}
        alt={process.env.REACT_APP_BASE_URL + "public" + src}
        width="100%"
      />
    </>
  );
};

export default TableImage;
