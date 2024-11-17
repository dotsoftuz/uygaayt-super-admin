import { SVGProps } from "react";

const EditIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="m13.222 6.278 4.5 4.5-9.773 9.774-4.012.443a.844.844 0 0 1-.932-.932l.447-4.016 9.77-9.77Zm7.284-.67-2.113-2.114a1.688 1.688 0 0 0-2.387 0l-1.989 1.989 4.501 4.5 1.988-1.988c.66-.66.66-1.728 0-2.387Z"
      fill="#0F6FDF"
    />
  </svg>
);

export default EditIcon;
