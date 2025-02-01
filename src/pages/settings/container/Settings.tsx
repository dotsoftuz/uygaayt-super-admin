import { Box, Grid, Switch, Typography } from "@mui/material";
import { HeaderOfSettings, SettingsStyled, SettingTitle, StyledMenuItem, StyledPhoneCountrySelect } from "./Settings.styled";
import { SETTINGS_TABS } from "types/enums";
import { useEffect, useState } from "react";
import MinimumOrder from "../components/MinimumOrder";
import StateMap from "../components/StateMap";
import { useRoleManager } from "services/useRoleManager";
import { MainButton, TextInput } from "components";
import { useTranslation } from "react-i18next";
import { PHONE_COUNTRY_DATA } from "./Settings.constants";
import { useForm } from "react-hook-form";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import MainAddress from "../components/MainAddress";
import WebsiteConditions from "../components/WebsiteConditions";
import DiscountOrder from "../components/DiscountOrder";
import PremiumDiscountOrder from "../components/PremiumDiscountOrder";

const Settings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(SETTINGS_TABS[0].key);
  const hasAccess = useRoleManager();
  const { t } = useTranslation();
  const [phonePrefix, setphonePrefix] = useState<string>("");
  const { control, reset, watch, register, handleSubmit, setValue } = useForm();


  const { data, status, refetch } = useApi(
    "settings-general",
    {},
    {
      onSuccess({ data }) {
        localStorage.setItem("settings", JSON.stringify(data));
      },
    }
  );

  const { mutate } = useApiMutation("settings-general", "put", {
    onSuccess() {
      toast.success(t("general.success"));
      refetch();
    },
  });

  useEffect(() => {
    if (status === "success") {
      reset(data.data);
      setphonePrefix(data.data?.phonePrefix);
    }
  }, [status]);

  const submit = handleSubmit((data: any) => {
    mutate({
      ...data,
      phonePrefix,
    });
  });

  const handleTab = (tab: { name: string; key: string }) => {
    setActiveTab(tab.key);
    setSearchParams({ tab: tab.key });
  };

  const onChangePhone = (event: any) => {
    setphonePrefix(event.target.value);
  };


  return (
    <SettingsStyled>
      <Grid className="md:flex" spacing={1}>
        <Grid item className="md:w-1/3 p-2" >
          <div className="tabs">
            {SETTINGS_TABS.map((tab) => {
              if (hasAccess(tab.role)) {
                return (
                  <div
                    key={tab.key}
                    className={`tab ${activeTab === tab.key && "active"}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {t(`settings.${tab.name}`)} {/* Tarjima qilish */}
                    {activeTab === tab.key && (
                      <div className="left-border"></div>
                    )}
                  </div>
                );
              }
            })}

          </div>
        </Grid>
        <Grid item className="md:w-2/3 p-2" >
          {activeTab === "functionality" && (
            <div className="settings">
              <HeaderOfSettings>
                <SettingTitle className="md:text-2xl">{t("settings.functionality")}</SettingTitle>
                <MainButton
                  title={t("general.save")}
                  variant="contained"
                  onClick={submit}
                />
              </HeaderOfSettings>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12}>
                  <div className="item">
                    <span className="key">{t("settings.minimum_order_amount")}</span>
                    <TextInput
                      control={control}
                      name="orderMinimumPrice"
                      type="number"
                      rules={{ required: false }}
                    />
                  </div>
                </Grid>
                <Grid item md={12} xs={12}>
                  <div className="item">
                    <span className="key">{t('settings.switch_for_courier')}</span>
                    <Box display="flex" alignItems="center">
                      <Switch
                        checked={watch("courierChangeOnline")}
                        id="courierChangeOnline"
                        {...register("courierChangeOnline")}
                      />
                      <label className="mb-1" htmlFor="courierChangeOnline">
                        {t("general.allow")}
                      </label>
                    </Box>
                  </div>
                </Grid>
                <Grid item md={12} xs={12}>
                  <div className="item">
                    <span className="key">{t("settings.banner_time")}</span>
                    <TextInput
                      control={control}
                      name="bannerTime"
                      type="number"
                    />
                  </div>
                </Grid>
                {/* <Grid item md={12} xs={12}>
                  <div className="item">
                    <span className="key">
                      {t("settings.store_radius")}
                    </span>
                    <TextInput
                      control={control}
                      name="storeRadius"
                      type="number"
                      rules={{ required: false }}
                    />
                  </div>
                </Grid> */}

                <Grid item md={12} xs={12}>
                  <div className="item">
                    <span className="key">{t("settings.currency")}</span>
                    <TextInput
                      control={control}
                      name="currency"
                      type="text"
                      onCustomChange={(value) => {
                        const allowedCharacters = value.replace(/[^a-zA-Z'`]/g, "");
                        setValue("currency", allowedCharacters);
                      }}
                    />
                  </div>
                </Grid>
                <Grid item md={12} xs={12}>
                  <div className="item">
                    <span className="key">{t("settings.order_delivery_time")}</span>
                    <TextInput
                      control={control}
                      name="maxDeliveryTime"
                      type="number"
                      rules={{ required: false }}
                    />
                  </div>
                </Grid>
                <Grid item md={12} xs={12}>
                  <div className="item">
                    <span className="key">{t("settings.couirer_return_time")}</span>
                    <TextInput
                      control={control}
                      name="maxArrivalTime"
                      type="number"
                      rules={{ required: false }}
                    />
                  </div>
                </Grid>
                <Grid item md={12} xs={12}>
                  <div className="item">
                    <span className="key">{t("settings.premium_days")} (kun)</span>
                    <TextInput
                      control={control}
                      name="premiumDays"
                      type="number"
                      rules={{ required: false }}
                    />
                  </div>
                </Grid>
                <Grid item md={12} xs={12}>
                  <div className="item">
                    <span className="key">{t("settings.premium_price")}</span>
                    <TextInput
                      control={control}
                      name="premiumPrice"
                      type="number"
                      rules={{ required: false }}
                    />
                  </div>
                </Grid>

                <Grid item md={12} xs={12}>
                  <div className="item">
                    <Box>
                      <Typography fontSize={"13px"} color="#000">
                        {t("common.phone_prefix_comment")}
                      </Typography>
                      <Box marginTop="10px">
                        <StyledPhoneCountrySelect
                          value={phonePrefix}
                          onChange={onChangePhone}
                          sx={{
                            "& fieldset": { border: "none" },
                          }}
                        >
                          {PHONE_COUNTRY_DATA.map((phone) => (
                            <StyledMenuItem
                              value={phone?.prefix}
                              key={phone?.flag}
                            >
                              <img
                                src={`/images/phone/${phone?.flag}.svg`}
                                alt={phone?.flag}
                                style={{ width: "32px" }}
                              />
                              <Typography
                                fontFamily="SF Pro Display"
                                marginLeft="12px"
                                marginBottom={0}
                              >
                                {t(`common.country.${phone?.translationKey}`)}
                                &nbsp; ({phone?.prefix})
                              </Typography>
                            </StyledMenuItem>
                          ))}
                        </StyledPhoneCountrySelect>
                      </Box>
                    </Box>
                  </div>
                </Grid>
              </Grid>
            </div>
          )}
          {activeTab === "discountOrder" && (
            <div className="settings">
              <DiscountOrder data={data} />
            </div>
          )}
          {activeTab === "premiumDiscountOrder" && (
            <div className="settings">
              <PremiumDiscountOrder data={data} />
            </div>
          )}
          {activeTab === "mainAddress" && (
            <div className="settings">
              <MainAddress />
            </div>
          )}
          {activeTab === "websiteConditions" && (
            <div className="settings">
              <WebsiteConditions />
            </div>
          )}
        </Grid>
      </Grid>
    </SettingsStyled>
  );
};

export default Settings;
