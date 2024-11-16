import { Grid } from "@mui/material";
import { AddOrderStyled } from "./AddOrder.styled";
import Basket from "../components/Basket/Basket";
import AddOrderForm from "../components/AddOrderForm/AddOrderForm";
import { IProduct } from "types/common.types";
import { useState } from "react";

const AddOrder = () => {
  const [basketItems, setBasketItems] = useState<IProduct[]>([]);

  return (
    <AddOrderStyled>
      <Grid container spacing={3}>
        <Grid item md={8}>
          <Basket basketItems={basketItems} setBasketItems={setBasketItems} />
        </Grid>
        <Grid item md={4}>
          <AddOrderForm basketItems={basketItems} />
        </Grid>
      </Grid>
    </AddOrderStyled>
  );
};

export default AddOrder;
