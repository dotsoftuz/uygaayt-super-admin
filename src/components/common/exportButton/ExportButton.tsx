import { ExportIcon } from "assets/svgs";
import CommonButton from "components/common/commonButton/Button";
import { useApiMutation } from "hooks/useApi/useApiHooks";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
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

const getFileNameFromPath = (path?: any) => {
  if (!path) return null; 
  const match = path.match(/uploads\/(.*?)\.xlsx/);
  return match ? match[1] : null;
};

const ExportButton = ({ url, fileName }: IExportButton) => {
  const allParams = useAllQueryParams();

  const { mutate, status } = useApiMutation(url, "post", {
    onSuccess(data) {
      if (data) {
        downlaodFileByName({
          fileUrl: data?.data as string,
          fileName: fileName || getFileNameFromPath(data?.data),
        });
      }
    },
  });

  const generateRequestBody = () => {
    const { dateFrom, dateTo, customer_id, categoryId, page, limit, sortOrder, sortBy } = allParams || {};
    return {
      page: page || 1,
      limit: limit || 20,
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
      customer_id: customer_id || null,
      categoryId: categoryId || null,
      sortBy: sortBy || null,
      sortOrder: sortOrder|| null
    };
  };

  return (
    <CommonButton
      className="export"
      title={status === "loading" ? "Exporting..." : "Export"}
      startIcon={<ExportIcon />}
      onClick={() => mutate(generateRequestBody())}
      disabled={status === "loading"}
    />
  );
};

export default ExportButton;
