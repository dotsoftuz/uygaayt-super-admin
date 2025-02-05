import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import { Input, TextInput } from "components";
import CommonButton from "components/common/commonButton/Button";
import { useTranslation } from "react-i18next";
import { useFieldArray } from "react-hook-form";
import { PlusIcon } from "assets/svgs";

interface Attribute {
    id: string;
    items: any[];
}

const AttributeForm = ({ attributeId, control, register, getByIdData }: { attributeId: any, control: any, register: any, getByIdData: any }) => {
    const {fields, append, remove} = useFieldArray({control, name: `attributes.${attributeId}`});
    const { t } = useTranslation();

    const handleAdd = () => {
        append({amount: 0, attributeItem: ""})
    };

    const handleRemove = (index: number) => {
        remove(index)
    };

    return (
        <div>
            {fields?.map((field, index) => (
                <Grid
                    container
                    key={field.id}
                    className="flex items-end justify-between mt-2"
                >
                    <Grid item md={5}>
                        <TextInput
                            control={control}
                            name={`attributes.${attributeId}.${index}.attributeItem`}
                            type="text"
                            rules={{ required: false }}
                            label={t('general.feature')}
                        />
                    </Grid>
                    <Grid item md={5}>
                        <Input
                            label={t('general.Price_added')}
                            params={{
                                ...register(`attributes.${attributeId}.${index}.amount`),
                            }}
                        />
                    </Grid>
                    <Grid item md={1}>
                        <Delete
                            sx={{ cursor: "pointer", color: "#D54239", fontSize: "1.5rem" }}
                            className="mb-2.5"
                            onClick={() => handleRemove(index)}
                        />
                    </Grid>
                </Grid>
            ))}
            <Grid item xs={3} md={2} paddingBlock={2} className="flex flex-col">
                <CommonButton startIcon={<PlusIcon />} type="button" onClick={handleAdd} />
            </Grid>
        </div>
    );
};

export default AttributeForm;
