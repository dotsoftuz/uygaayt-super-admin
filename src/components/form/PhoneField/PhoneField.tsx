import { Control, Controller, FieldPath } from "react-hook-form";
import "react-phone-input-2/lib/style.css";
import { TRules } from "types/form.types";
import {
  PhoneNumberCountryStyled,
  PhoneNumberlabelStyled,
} from "./PhoneInput.style";
import useCommonContext from "context/useCommon";
import { get } from "lodash";

export interface IPhoneInputProps<FormValues extends Record<string, any>> {
  control: Control<FormValues>;
  rules?: TRules<FormValues>;
  name: FieldPath<FormValues>;
  label?: any;
  disabled?: boolean;
  autofocus?: boolean;
  onChange?: (value: string) => void; // onChange qo'shildi
}

function PhoneInput<FormValues extends Record<string, any>>({
  name,
  label = "",
  rules = {
    required: { value: true, message: "Majburiy" },
  },
  control,
  disabled = false,
  autofocus = false,
  onChange, // onChange prop qo'shildi
}: IPhoneInputProps<FormValues>) {
  const {
    state: { data: settingsData },
  } = useCommonContext();

  const defaultCountry = (prefix: string) => {
    switch (prefix) {
      case "+998":
        return "uz";
      case "+7":
        return "kz";
      default:
        return "uz";
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        return (
          <>
            {!!label && (
              <PhoneNumberlabelStyled>
                <label>
                  {label || name}
                  {rules.required ? (
                    <span className="text-error mt-1">*</span>
                  ) : null}
                </label>
              </PhoneNumberlabelStyled>
            )}
            <PhoneNumberCountryStyled
              country={defaultCountry(get(settingsData, "phonePrefix", "+998"))}
              onlyCountries={["uz", "kz", "kg", "tj"]}
              placeholder=""
              value={field.value}
              onBlur={field.onBlur}
              disabled={disabled}
              inputProps={{
                ref: field.ref,
                autoFocus: autofocus,
              }}
              onChange={(val: string) => {
                field.onChange("+" + val);
                if (onChange) {
                  onChange("+" + val); // external onChange funksiyasini chaqirish
                }
              }}
            />
            {fieldState.error && (
              <>
                <h6 className="text-error mt-1">{fieldState.error.message}</h6>
              </>
            )}
          </>
        );
      }}
    />
  );
}

export default PhoneInput;
