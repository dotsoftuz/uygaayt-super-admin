import { Box, Grid } from "@mui/material";
import { CopyIcon } from "assets/svgs";
import { CommonLoader, Modal, SelectForm, TextInput } from "components";
import CommonButton from "components/common/commonButton/Button";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import useCopyToClipboard from "hooks/useClipboard";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  InegrationCard,
  IntegrationInfo,
  IntegrationStyled,
} from "./Integration.styled";
import { get } from "lodash";

const Integration = () => {
  const [integrationId, setIntegrationId] = useState<string>("");
  const [integration, setIntegration] = useState<any>();
  const [update, setUpdate] = useState<boolean>(false);
  const { control, handleSubmit, setValue } = useForm();
  const { fields } = useFieldArray({
    control,
    name: "fields",
  });

  const { t } = useTranslation();

  const { data, refetch, isLoading } = useApi("integration");

  const [copiedText, copy] = useCopyToClipboard();

  const { mutate } = useApiMutation(`integration/${integrationId}`, "put", {
    onSuccess() {
      refetch();
      refetchInteg();
      toast.success(t("general.success"));
    },
  });

  const submit = handleSubmit((data: any) => {
    const requestData = {
      ...integration,
      fields: data.fields,
    };
    mutate(requestData);
  });

  const {
    data: integ,
    isFetching: loading,
    refetch: refetchInteg,
  } = useApi(
    `integration/${integrationId}`,
    {},
    {
      enabled: !!integrationId,
      onSuccess(data) {
        setIntegration(data?.data);
      },
    }
  );

  const handleInstalled = (bool: boolean) => {
    mutate({ isInstalled: bool });
  };

  return (
    <IntegrationStyled>
      {data?.data?.map((item: any) => (
        <div
          className="card"
          onClick={() => {
            setValue("fields", item.fields);
            setIntegrationId(item._id);
          }}
        >
          <h3 className="name">{item.name}</h3>
        </div>
      ))}
      <Modal
        open={!!integrationId}
        onClose={() => {
          setIntegrationId("");
          setUpdate(false);
        }}
      >
        <InegrationCard>
          {loading ? (
            <div className="integration_loader">
              <CommonLoader />
            </div>
          ) : (
            <Grid container>
              <Grid item md={6}>
                <div className="integration-logo">
                  <img
                    src={process.env.REACT_APP_BASE_URL + integration?.logo}
                    alt="integration.logo"
                  />
                  <h3 className="py-2">{integration?.name}</h3>
                  <div>
                    {integration?.isInstalled ? (
                      <div className="d-flex gap-3">
                        <CommonButton title="O'rnatilgan" disabled />

                        <CommonButton
                          title="O'chirish"
                          disabled={isLoading}
                          onClick={() => handleInstalled(false)}
                        />
                      </div>
                    ) : (
                      <CommonButton
                        title="O'rnatish"
                        className="designed"
                        disabled={isLoading}
                        onClick={() => handleInstalled(true)}
                      />
                    )}
                  </div>
                </div>
              </Grid>
              <Grid item md={6}>
                <Box
                  sx={{
                    height: "400px",
                    boxSizing: "border-box",
                    overflow: "auto",
                  }}
                >
                  {integration?.isInstalled && !update && (
                    <div className="d-flex justify-content-end">
                      <CommonButton
                        title="Tahrirlash"
                        onClick={() => setUpdate(true)}
                      />
                    </div>
                  )}
                  {update ? (
                    <>
                      {fields.map((field: any, index) =>
                        field.fieldType === "input" ? (
                          <div className="mb-2" key={field.id}>
                            <TextInput
                              control={control}
                              name={`fields.${index}.fieldValue`}
                              label={field.fieldName}
                            />
                          </div>
                        ) : field.fieldType === "select" ? (
                          <div className="mb-2" key={field.id}>
                            <SelectForm
                              control={control}
                              name={`fields.${index}.fieldValue`}
                              options={field.options?.map((option: any) => ({
                                _id: option.value,
                                name: option.text,
                              }))}
                              label={field.fieldName}
                            />
                          </div>
                        ) : (
                          ""
                        )
                      )}
                      <div className="d-flex justify-content-end gap-2 py-2">
                        <CommonButton
                          title="Orqaga"
                          onClick={() => setUpdate(false)}
                        />
                        {/* <MainButton
                      variant="contained"
                      title={t("general.save")}
                      className="mt-1"
                      fullWidth
                      onClick={submit}
                    /> */}
                        <CommonButton
                          title={t("general.save")!}
                          className="designed"
                          onClick={submit}
                        />
                      </div>
                    </>
                  ) : (
                    <IntegrationInfo>
                      <h2>Tarif</h2>
                      <p>{integration?.description}</p>

                      <ul className="fields_val">
                        {fields.map((item: any) => (
                          <li key={item.fieldValue}>
                            {item.fieldName}:{" "}
                            {item.fieldValue && (
                              <span>
                                <i>&nbsp; {item.fieldValue}</i>
                                <CopyIcon
                                  onClick={() => copy(item.fieldValue)}
                                />
                              </span>
                            )}
                          </li>
                        ))}
                        {get(integ, "data.infoFields", []).map(
                          (info: Record<string, any>) => (
                            <li key={info.fieldValue}>
                              {info.fieldName}:{" "}
                              {info.fieldValue && (
                                <span>
                                  <i>&nbsp; {info.fieldValue}</i>
                                  <CopyIcon
                                    onClick={() => copy(info.fieldValue)}
                                  />
                                </span>
                              )}
                            </li>
                          )
                        )}
                      </ul>
                    </IntegrationInfo>
                  )}
                </Box>
              </Grid>
            </Grid>
          )}
        </InegrationCard>
      </Modal>
    </IntegrationStyled>
  );
};

export default Integration;
