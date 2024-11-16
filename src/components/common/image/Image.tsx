import React from "react";
import def from "../../../assets/images/default.png";

const Image: React.FC<
  { src: string | undefined } & React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
> = ({ src, ...props }) => {
  return (
    <>
      <img
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: ".5rem",
        }}
        src={src ? process.env.REACT_APP_BASE_URL + src : def}
        alt={process.env.REACT_APP_BASE_URL + "" + src}
        width="100%"
        {...props}
      />
    </>
  );
};

export default Image;
