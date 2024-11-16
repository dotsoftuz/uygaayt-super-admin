import { Control, Controller, FieldPath } from "react-hook-form";
import "react-phone-input-2/lib/style.css";
import { TRules } from "types/form.types";
import {
  PhoneNumberCountryStyled,
  PhoneNumberlabelStyled,
} from "./PhoneInput.style";
import useCommonContext from "context/useCommon";
import { get } from "lodash";
// export const phoneNumberPattern =
//   /^\+?([87](?!95[5-7]|99[08]|907|94[^09]|336)([348]\d|9[0-6789]|7[01247])\d{8}|[1246]\d{9,13}|68\d{7}|5[1-46-9]\d{8,12}|55[1-9]\d{9}|55[138]\d{10}|55[1256][14679]9\d{8}|554399\d{7}|500[56]\d{4}|5016\d{6}|5068\d{7}|502[345]\d{7}|5037\d{7}|50[4567]\d{8}|50855\d{4}|509[34]\d{7}|376\d{6}|855\d{8,9}|856\d{10}|85[0-4789]\d{8,10}|8[68]\d{10,11}|8[14]\d{10}|82\d{9,10}|852\d{8}|90\d{10}|96(0[79]|17[0189]|181|13)\d{6}|96[23]\d{9}|964\d{10}|96(5[569]|89)\d{7}|96(65|77)\d{8}|92[023]\d{9}|91[1879]\d{9}|9[34]7\d{8}|959\d{7,9}|989\d{9}|971\d{8,9}|97[02-9]\d{7,11}|99[^4568]\d{7,11}|994\d{9}|9955\d{8}|996[2579]\d{8}|998[3789]\d{8}|380[345679]\d{8}|381\d{9}|38[57]\d{8,9}|375[234]\d{8}|372\d{7,8}|37[0-4]\d{8}|37[6-9]\d{7,11}|30[69]\d{9}|34[679]\d{8}|3459\d{11}|3[12359]\d{8,12}|36\d{9}|38[169]\d{8}|382\d{8,9}|46719\d{10})$/;

// export const realNumberPattern =
//   /([0-9]+[.|,][0-9])|([0-9][.|,][0-9]+)|([0-9]+)/g;

export interface IPhoneInputProps<FormValues extends Record<string, any>> {
  control: Control<FormValues>;
  rules?: TRules<FormValues>;
  name: FieldPath<FormValues>;
  label?: any;
  disabled?: boolean;
  autofocus?: boolean;
}

function PhoneInput<FormValues extends Record<string, any>>({
  name,
  label = "",
  rules = {
    required: { value: true, message: "Majburiy" },
    // pattern: {
    //   value: phoneNumberPattern,
    //   message: "Telefon raqamni noto'g'ri kiritdingiz!",
    // },
  },
  control,
  disabled = false,
  autofocus = false,
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
              // disableDropdown
              inputProps={{
                ref: field.ref,
                autoFocus: autofocus,
              }}
              onChange={(val: string) => {
                field.onChange("+" + val);
              }}
            />
            {fieldState.error && (
              <>
                <h6 className="text-error mt-1">{fieldState.error.message}</h6>{" "}
              </>
            )}
          </>
        );
      }}
    />
  );
}

export default PhoneInput;
