import { toast } from "react-toastify";

export function fetchAndDownloadData(url: string, fileName: string): void {
  const token = localStorage.getItem("token");
  const branchId = localStorage.getItem("branchId");

  fetch(process.env.REACT_APP_BASE_URL + url, {
    headers: {
      Authorization: `Bearer ${token} `,
      "Content-Type": "application/json",
      Branch: `${branchId}`,
      Organization: "test",
    },
  })
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      // Yaratilgan linkni tozalash
      document.body.removeChild(link);
    })
    .catch((error) => {
      toast.error("Ma'lumot yuklashda xatolik yuz berdi");
    });
}
