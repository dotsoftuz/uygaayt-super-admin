import { FormDrawer, Table } from "components";
import { useMemo, useState } from "react";
import { usePaymentMethodColumns } from "./payment-method.columns";
import { useAppDispatch } from "../../../store/storeHooks";
import { setOpenDrawer } from "components/elements/FormDrawer/formdrawer.slice";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useRoleManager } from "services/useRoleManager";
import WarningModal from "components/common/WarningModal/WarningModal";
import PaymentMethodForm from "../components/PaymentMethodForm";

const PaymentMethod = () => {
  const [editingPaymentMethodId, setEditingPaymentMethodId] = useState<any>();
  const [paymentMethodId, setPaymentMethodId] = useState<any>();
  const columns = usePaymentMethodColumns();
  const hasAccess = useRoleManager();
  const { t } = useTranslation();
  const dis = useAppDispatch();
  const formStore = useForm<any>();

  const resetForm = () => {
    setEditingPaymentMethodId(undefined);
    formStore.reset({
      name: "",
    });
  };

  const queryParams = useMemo(() => ({

  }), []);

  return (
    <>
      <Table
        dataUrl="payment-method/paging"
        columns={columns}
        searchable
        onAddButton={() => {
          dis(setOpenDrawer(true));
        }}
        onEditColumn={(row) => {
          setEditingPaymentMethodId(row._id);
          dis(setOpenDrawer(true));
        }}
        onDeleteColumn={(row) => setPaymentMethodId(row._id)}
        exQueryParams={queryParams}
      />
      <WarningModal open={paymentMethodId} setOpen={setPaymentMethodId} url="payment-method/delete" />
      <FormDrawer
        FORM_ID="payment-method"
        isEditing={!!editingPaymentMethodId}
        customTitle={t("general.payment_method")}
        onClose={resetForm}
      >
        <PaymentMethodForm
          formStore={formStore}
          resetForm={resetForm}
          editingPaymentMethodId={editingPaymentMethodId}
        />
      </FormDrawer>
    </>
  );
};

export default PaymentMethod;
