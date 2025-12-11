import { FC, memo } from "react";
import { Controller } from "react-hook-form";
import { TimePickerContainer } from "./TimePicker.style";
import { ITimePicker } from "./TimePicker.types";
// @ts-ignore
import TimePickerCom from "react-time-picker";
import { useTranslation } from "react-i18next";

const TimePicker: FC<ITimePicker> = ({
  control,
  name,
  errors,
  rules,
  label,
}) => {
  const { t } = useTranslation();

  return (
    <TimePickerContainer>
      {label && <label className="custom-label">{label}</label>}
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <TimePickerCom
            clockIcon={null}
            className="time-picker"
            onChange={onChange}
            value={value}
            format="HH:mm"
            hourPlaceholder="HH"
            minutePlaceholder="mm"
            locale="uz-UZ"
          />
        )}
      />
      {!!errors[name] && (
        <h6 className="text-error mt-1">{t("general.required")}</h6>
      )}
    </TimePickerContainer>
  );
};

export default memo(TimePicker);
