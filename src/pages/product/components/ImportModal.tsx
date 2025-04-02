import { DoneIcon, ImportIcon, UploadFile } from "assets/svgs";
import { CommonModal, Loading } from "components";
import { useRef, useState } from "react";
import { useApiMutation } from "hooks/useApi/useApiHooks";
import { get } from "lodash";
import { Spin } from "antd";
import { toast } from "react-toastify";
import { useAppDispatch } from "store/storeHooks";
import { Trans, useTranslation } from "react-i18next";
import CommonButton from "components/common/commonButton/Button";
import { reRenderTable } from "components/elements/Table/reducer/table.slice";
import { fetchAndDownloadData } from "./fetchAndDownload";
import { ImportStudentStyle } from "./ProductForm.styled";
import usePostFile from "hooks/usePostFile";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

const ImportModal = () => {
  const [open, setOpen] = useState<string>("");
  const [errors, setErrors] = useState<{
    error_items?: Array<{ position: string; error_message: string, value: any }>;
    error_count?: number | undefined;
    item_count?: number | undefined;
  }>({});
  const [uploadedFilePath, setUploadedFilePath] = useState<string>("");
  const fileRef = useRef<any>(null);
  const dis = useAppDispatch();
  const { t } = useTranslation();

  const { mutate: confirmStudent, status: confirmStatus } = useApiMutation(
    "product/import",
    "post",
    {
      onSuccess() {
        setOpen("");
        toast.success(t("toast_messages.success"));
        dis(reRenderTable(true));
        setUploadedFilePath("");
        setErrors({});
      },
    }
  );

  const { mutate, data, status: uploadStatus } = useApiMutation(
    "product/import/validate",
    "post",
    {
      onSuccess(data) {
        setErrors(get(data, "data", {}));
        fileRef.current.value = "";
      },
      onError(data) {
        // setUploadedFilePath(get(data, "data.uploadedFilePath", ""));
        setErrors(get(data, "message.errors", {}));
      },
    }
  );

  const { uploadImage } = usePostFile((response) => {
    if (response?.url) {
      setUploadedFilePath(response.url);
      mutate({ file_path: response.url });
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      uploadImage({ imageFile: file });
    }
  };

  console.log(uploadedFilePath)
  console.log(errors)

  return (
    <>
      <CommonButton
        title="Import"
        className="import"
        startIcon={<ImportIcon />}
        onClick={() => setOpen("open-import")}
      />
      <CommonModal open={!!open} setOpen={setOpen} canClose={false} width={800}>
        <ImportStudentStyle>
          <h2 className="text-center">{t("general.import")}</h2>
          <h4 className="my-3">
            <Trans
              i18nKey="general.import_student"
              components={[
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={() => {
                    fetchAndDownloadData(
                      "uploads/product_template.xlsx",
                      "products.xlsx"
                    );
                  }}
                ></span>,
              ]}
            />
          </h4>

          <div className="py-3 mb-3 import-student-box">
            <label htmlFor="import-student">
              {errors && errors?.error_count !== 0 ? <UploadFile /> : <DoneIcon />}
              <span>
                {errors && errors?.error_count !== 0
                  ? t("general.upload_file")
                  : t("general.uploaded_file")}
              </span>
              <input
                type="file"
                className="upload-input"
                id="import-student"
                onChange={handleFileChange}
                accept=".xlsx,.xls"
                disabled={uploadStatus === "loading"}
                ref={fileRef}
              />
              {uploadStatus === "loading" && (
                <div className="d-flex align-items-center">
                  <Spin />
                </div>
              )}
            </label>
          </div>

          {errors?.error_count && errors.error_count > 0 && (
            <div className="errors-upload">
              <Box className="error-table" sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                  <Typography variant="body1">
                    <strong>Jami:</strong> {errors.item_count || 0}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Xatolar soni:</strong> {errors.error_count || 0}
                  </Typography>
                </Box>

                <TableContainer sx={{ border: 1, borderColor: 'divider' }}>
                  <Table sx={{ minWidth: 650 }} aria-label="error table">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'grey.100' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Joylashgan o'rni</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Qiymati</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Xato xabari</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {errors.error_items?.map((error, index) => (
                        <TableRow
                          key={index}
                          sx={{ '&:nth-of-type(even)': { backgroundColor: 'grey.50' } }}
                        >
                          <TableCell>{error.position}</TableCell>
                          <TableCell>{error.value || '-'}</TableCell>
                          <TableCell sx={{ color: 'error.main' }}>{error.error_message}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </div>
          )}
          <div className="d-flex justify-content-end align-items-center gap-3">
            <CommonButton
              title={t("general.back")!}
              onClick={() => {
                setOpen("");
                setUploadedFilePath("");
                setErrors({});
              }}
              disabled={
                confirmStatus === "loading" || uploadStatus === "loading"
              }
            />
            <CommonButton
              title={t("general.save")!}
              className="main"
              onClick={() => confirmStudent({ file_path: uploadedFilePath })}
              status={confirmStatus}
              disabled={confirmStatus === "loading" || !uploadedFilePath || (errors.error_count ?? 0) > 0}
            />
          </div>
        </ImportStudentStyle>
      </CommonModal>

      {uploadStatus === "loading" && <Loading />}
    </>
  );
};

export default ImportModal;