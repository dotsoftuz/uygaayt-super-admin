import { useNavigate } from "react-router-dom";
import { MainButton, PhoneInput, TextInput } from "components";
import { LoginStyled } from "./Login.style";
import { useForm } from "react-hook-form";
import { useApiMutation } from "hooks/useApi/useApiHooks";
import { useAppDispatch } from "store/storeHooks";
import { ILoginData, setLoginData } from "store/reducers/LoginSlice";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { initializeSocket, socket } from "socket";
import { useEffect } from "react";

interface ILoginBody {
  phoneNumber: string;
  password: string;
}

const Login = () => {
  const { control, handleSubmit } = useForm<ILoginBody>();
  const dis = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    mutate,
    status,
    data: responseData,
  } = useApiMutation<ILoginBody, ILoginData>("/employee/login", "post", {
    onSuccess(data) {
      const updatedLoginData: ILoginData = {
        token: data.data.token, 
        employee: {
          _id: data.data.employee._id, 
          firstName: data.data.employee.firstName,
          lastName: data.data.employee.lastName,
          fullName: data.data.employee.fullName,
          phoneNumber: data.data.employee.phoneNumber,
          language: data.data.employee.language,
          roleId: data.data.employee.roleId,
          isBoss: data.data.employee.isBoss,
          createdAt: data.data.employee.createdAt,
          updatedAt: data.data.employee.updatedAt,
          deletedAt: data.data.employee.deletedAt,
        },
      };
  
      dis(setLoginData(updatedLoginData));
  
      toast.success(t("general.success"));
  
      localStorage.setItem("token", updatedLoginData.token);
      localStorage.setItem("employeeId", updatedLoginData.employee._id);
      localStorage.setItem("roleId", updatedLoginData.employee.roleId);
      localStorage.setItem("i18nextLng", "uz");
      // localStorage.setItem("storeId", data.data.stores?.[0]?._id);
  
      initializeSocket(updatedLoginData.token);
        navigate("/home");
    },
  });
  
  
  const submit = (data: ILoginBody) => {
    mutate(data);
  };

  return (
    <LoginStyled>
      <form onSubmit={handleSubmit(submit)}>
        <h1>KIRISH</h1>
        <main>
          <span>
            <PhoneInput
              control={control}
              name="phoneNumber"
              label="Phone number"
              autofocus={true}
              rules={{ required: false }}
            />
          </span>
          <span>
            <TextInput
              control={control}
              name="password"
              type="password"
              label="Password"
              placeholder="Password"
              rules={{ required: false }}
            />
          </span>
          <span>
            <MainButton
              disabled={status === "loading"}
              title="Kirish"
              type="submit"
              variant="contained"
            />
          </span>
        </main>
      </form>
    </LoginStyled>
  );
};

export default Login;
