import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { numberFormat } from "utils/numberFormat";
import { BasketStyled } from "./Basket.styled";
import { DeleteIcon, MinusIcon, PlusIcon } from "assets/svgs";
import { TextInput } from "components";
import { useForm } from "react-hook-form";
import { Grid } from "@mui/material";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import useDebounce from "hooks/useDebounce";
import { IProduct } from "types/common.types";
import { useTranslation } from "react-i18next";
import useCommonContext from "context/useCommon";
import { get } from "lodash";
import { useSearchParams } from "react-router-dom";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";

interface IBasketProps {
  basketItems: IProduct[];
  setBasketItems: Dispatch<SetStateAction<IProduct[]>>;
}

const Basket = ({ basketItems, setBasketItems }: IBasketProps) => {
  const [active, setActive] = useState("product");
  const { control, watch } = useForm();
  const { debouncedValue: search } = useDebounce(watch("search"), 500);
  const { t } = useTranslation();
  const allParams = useAllQueryParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryParams, setQueryParams] = useState<any>(
    {
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 10,
      search: searchParams.get("search") || "",
    }
  );

  const {
    state: { data: settingsData },
  } = useCommonContext();

  const { data, mutate } = useApiMutation<{ data: IProduct[] }>(
    "product/paging",
    "post",
    {
      onSuccess: (data) => {
        console.log("Product created successfully:", data);
      },
      onError: (error) => {
        console.error("Error creating product:", error);
      },
    }
  );

  useEffect(() => {
    mutate({
      ...queryParams,
      ...allParams,
    });
  }, [mutate, search]);


  const basketFn = (
    product: IProduct,
    action?: string,
    inputValue?: string
  ) => {
    const foundProduct = basketItems?.find((e) => e._id === product?._id);
    if (foundProduct) {
      if (action === "minus" && foundProduct.amount === 1) {
        return setBasketItems((prev) =>
          prev.filter((e) => e._id !== foundProduct._id)
        );
      }
      return setBasketItems((prev) =>
        prev.map((prevItem) => {
          if (prevItem._id === product?._id) {
            const amount = prevItem.amount;
            return {
              ...prevItem,
              amount: inputValue
                ? inputValue === "noValue"
                  ? ""
                  : Number(inputValue) <= product.inStock
                    ? Number(inputValue)
                    : amount
                : !action
                  ? foundProduct.amount < product.inStock
                    ? amount + 1
                    : amount
                  : action === "minus" && amount > 1
                    ? amount - 1
                    : action === "plus"
                      ? foundProduct.amount < product.inStock
                        ? amount + 1
                        : amount
                      : amount,
            };
          }
          return prevItem;
        })
      );
    } else {
      if (product)
        setBasketItems((prev) => [...prev, { ...product, amount: 1 }]);
    }
  };

  return (
    <BasketStyled>
      <div className="tab">
        <button
          className={`tab-btn ${active === "product" && "active"}`}
          onClick={() => setActive("product")}
        >
          {t("order.products")}
        </button>
        <button
          className={`tab-btn ${active === "basket" && "active"}`}
          onClick={() => setActive("basket")}
        >
          {t("order.basket")}
        </button>
      </div>
      <div className="mb-3 search">
        {active === "product" && (
          <TextInput
            control={control}
            name="search"
            placeholder={t("general.search")!}
          />
        )}
        {active === "basket" && (
          <div className="clear-basket" onClick={() => setBasketItems([])}>
            <DeleteIcon />
          </div>
        )}
      </div>
      {active === "product" && (
        <Grid container spacing={2}>
          {data?.data?.data?.map((product: any) => {
            const foundBasketItem = basketItems.find(
              (e) => e._id === product._id
            );
            return (
              <Grid item md={4}>
                <div className="product-card" onClick={() => basketFn(product)}>
                  {foundBasketItem && (
                    <span className="amount">{foundBasketItem?.amount}</span>
                  )}
                  <span className="name">{product.name}</span>
                  <span className="price">
                    {numberFormat(product.salePrice)}{" "}
                    {get(settingsData, "currency", "uzs")}
                  </span>
                  <span className="in-stock">
                    {numberFormat(product.inStock)}
                  </span>
                </div>
              </Grid>
            );
          })}
        </Grid>
      )}
      {active === "basket" && (
        <div>
          {basketItems?.map((item) => (
            <div className="basket-item">
              <span className="name">{item.name}</span>
              <div className="action">
                <span className="icon" onClick={() => basketFn(item, "minus")}>
                  <MinusIcon />
                </span>
                <input
                  type="text"
                  className="amount-input"
                  value={item.amount}
                  onChange={(e) =>
                    basketFn(item, "", e.target.value || "noValue")
                  }
                />
                <span className="icon" onClick={() => basketFn(item, "plus")}>
                  <PlusIcon />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </BasketStyled>
  );
};

export default Basket;
