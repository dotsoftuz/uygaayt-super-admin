import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import { Checkbox, TextInput } from "components";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { RoleFormStyled } from "./RoleForm.styled";
import { ALL_ROLES, IRoleBody, IRolesForm } from "./RoleForm.constants";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const RolesForm = ({ formStore, editingRoleId, resetForm }: IRolesForm) => {
  const { control, handleSubmit, setValue, reset } = formStore;
  const { t } = useTranslation();

  const { mutate, status } = useApiMutation<IRoleBody>(
    editingRoleId ? `role/${editingRoleId}` : "role",
    editingRoleId ? "put" : "post"
  );

  const { data: getByIdData, status: getByIdStatus } = useApi(`role/${editingRoleId}`, {}, {
    enabled: !!editingRoleId,
    suspense: false
  })

  const submit = (data: IRoleBody) => {
    mutate(data);
  };

  useEffect(() => {
    if (status === "success") {
      resetForm();
    }
  }, [status]);

  useEffect(() => {
    if (getByIdStatus === 'success') {
      reset({
        ...getByIdData.data,
      });
    }
  }, [getByIdStatus, getByIdData]);

  const setAllRoles = (val: boolean) => {
    ALL_ROLES.forEach((role) => {
      setValue(role.role, val);
      role.childRoles.forEach((child: any) => setValue(child.role, val));
    });
  };

  return (
    <RoleFormStyled className="custom-drawer">
      <form id="role" onSubmit={handleSubmit(submit)}>
        <Grid container spacing={3}>
          <Grid item md={12}>
            <TextInput
              control={control}
              name="name"
              label={t("common.name")}
            />
          </Grid>
          <Grid item md={12}>
            <Checkbox
              control={control}
              label={t("common.all")}
              onChange={(val) => setAllRoles(val)}
              name="_select_all"
            />
            <br />
            {ALL_ROLES.map((checkbox) => (
              <CheckboxAccordion
                control={control}
                checkbox={checkbox}
                setValue={setValue}
              />
            ))}
          </Grid>
        </Grid>
      </form>
    </RoleFormStyled>
  );
};

const CheckboxAccordion = ({ control, checkbox, setValue }: any) => {
  const { t } = useTranslation();

  const parentChange = (checked: boolean, name: string) => {
    const role = ALL_ROLES.find((r) => r.role === name);
    setValue(role?.role, checked);
    if (role?.childRoles) {
      role.childRoles.map((child: any) => setValue(child.role, checked));
    }
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Checkbox
          label={t(`role.${checkbox.label}`)}
          name={checkbox.role}
          control={control}
          onChange={(checked, event) =>
            parentChange(checked, event.target.name)
          }
          isFullWidth
          className="role-checkbox"
        />
      </AccordionSummary>
      <AccordionDetails>
        <Grid container display="flex" justifyContent="flex-end" spacing={1} className="mb-2">
          {checkbox?.childRoles?.map((childBox: any, index: number) => (
            <Grid item md={11} key={childBox.role}>
              <Checkbox
                control={control}
                name={childBox.role}
                label={t(`role.${childBox.label}`)}
                isFullWidth
                className="role-checkbox"
              />
            </Grid>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default RolesForm;
