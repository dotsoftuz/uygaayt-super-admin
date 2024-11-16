import { Button, Grid } from "@mui/material";
import { TextInput } from "components";
import dayjs from "dayjs";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { getRandomColor } from "utils";
import { useApiMutation } from "hooks/useApi/useApiHooks";

interface IAddLaneForm {
  color: string;
  name: string;
}

export const useAddNewLaneForm = (
  onSuccess: () => void
): {
  NewLaneForm: ({ onAdd }: any) => React.ReactElement;
} => {
  const { control, register, handleSubmit, reset } = useForm<IAddLaneForm>({
    defaultValues: {
      color: getRandomColor(),
    },
  });
  const { mutate, data } = useApiMutation<IAddLaneForm, string>(
    "status",
    "post",
    {
      onSuccess,
    }
  );

  const NewLaneForm = useCallback(({ onAdd, onCancel }: any) => {
    const onSubmit = (formData: IAddLaneForm) => {
      onAdd({
        id: dayjs(),
        title: formData.name,
        // label: "20/70 ",
        style: {
          width: 280,
          borderTop: `${formData.color} 5px solid`,
        },
      });
      mutate({ ...formData });
      reset();
    };
    return (
      <form className="add-lane-form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={1} display="flex" alignItems="center">
          <Grid item md={7}>
            <TextInput placeholder="Nomi" control={control} name="name" />
          </Grid>
          <Grid item md={5}>
            <span>rangi: </span>
            <input {...register("color")} type="color" />
          </Grid>
          <Grid item md={6}>
            <Button type="submit" color="inherit" fullWidth onClick={onCancel}>
              bekor qilish
            </Button>
          </Grid>
          <Grid item md={6}>
            <Button type="submit" color="primary" variant="contained" fullWidth>
              qo'shish
            </Button>
          </Grid>
        </Grid>
      </form>
    );
  }, []);
  return {
    NewLaneForm,
  };
};
