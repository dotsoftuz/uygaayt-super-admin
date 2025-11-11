import { Dispatch, SetStateAction, useEffect } from "react";
import { Modal, SaveCancelBtn } from "components";
import { WarningModalStyled } from "./WarningModal.styled";
import { useTranslation } from "react-i18next";
import { useApiMutation } from "hooks/useApi/useApiHooks";

const WarningModal = ({
  open,
  setOpen,
  title,
  url,
  confirmFn,
  setRender,
}: any) => {
  const { t } = useTranslation();

  const { mutate, status } = useApiMutation(`${url}/${open}`, "delete");

  useEffect(() => {
    if (status === "success") {
      setOpen(null);
      setRender?.((prev: any) => !prev); // Table'ni yangilash
      // Yoki agar setRender funksiya bo'lsa:
      // setRender?.();
    }
  }, [status, setOpen, setRender]);

  return (
    <Modal setOpen={setOpen} open={!!open}>
      <WarningModalStyled>
        <h2>{title || t("general.reallyDelete")}</h2>
        <SaveCancelBtn
          isCancelFromRoute={false}
          SubmitTitle={t("general.yes")!}
          cancelTitle={t("general.no")!}
          onClick={() => {
            if (url) {
              mutate(""); // DELETE request uchun body kerak emas
            } else {
              confirmFn?.();
            }
          }}
          onCancel={() => setOpen(false)}
        />
      </WarningModalStyled>
    </Modal>
  );
};

export default WarningModal;
