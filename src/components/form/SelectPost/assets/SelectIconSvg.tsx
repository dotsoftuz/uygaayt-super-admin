import { SVGProps } from "react";

const SelectIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 17c-.167 0-.33-.034-.487-.103a1.13 1.13 0 0 1-.392-.275l-5.776-6.32C5.115 10.05 5 9.729 5 9.34c0-.39.115-.71.345-.962.23-.252.523-.378.88-.378.355 0 .648.126.878.378L12 13.737l4.897-5.36c.23-.251.523-.377.879-.377.355 0 .648.126.879.378.23.252.345.572.345.962 0 .389-.115.71-.345.962l-5.776 6.32A1.104 1.104 0 0 1 12 17Z"
      fill="#232323"
    />
  </svg>
);

export default SelectIcon;
