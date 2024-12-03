import { ExportIcon } from "assets/svgs";
import CommonButton from "components/common/commonButton/Button";
import { useApiMutation } from "hooks/useApi/useApiHooks";
import React from "react";

interface IExportButton {
  url: string;
  fileName?: string;
}

export const downlaodFileByName = async ({
  fileUrl,
  fileName,
}: {
  fileUrl: string;
  fileName: string;
}) => {
  try {
    const response = await fetch(
      process.env.REACT_APP_BASE_URL + "/" + fileUrl
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("File download error:", error);
  }
};

const ExportButton = ({ url, fileName }: IExportButton) => {
  const { mutate, status } = useApiMutation(url, "get", {
    onSuccess(data) {
      if (data) {
        downlaodFileByName({
          fileUrl: data?.data as string,
          fileName: fileName || "appropriation",
        });
      }
    },
  });

  return (
    <CommonButton
      className="export"
      title={status === "loading" ? "Exporting..." : "Export"}
      startIcon={<ExportIcon />}
      onClick={() => mutate({})}
      disabled={status === "loading"}
    />
  );
};

export default ExportButton;
