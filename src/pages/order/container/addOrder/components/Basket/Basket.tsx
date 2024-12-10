import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { numberFormat } from "utils/numberFormat";
import { BasketStyled } from "./Basket.styled";
import { DeleteIcon, MinusIcon, PlusIcon } from "assets/svgs";
import { SearchInput, TextInput } from "components";
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
import { useAppSelector } from "store/storeHooks";

interface IBasketProps {
  basketItems: IProduct[];
  setBasketItems: Dispatch<SetStateAction<IProduct[]>>;
}

const Basket = ({ basketItems, setBasketItems }: IBasketProps) => {
  const [active, setActive] = useState("product");
  const allParams = useAllQueryParams();
  const { control, watch } = useForm();
  const [search, setSearch] = useState<any>(allParams.search || "");

  const { debouncedValue: debValue } = useDebounce(search, 500);
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultLimit = 10;
  const reRender = useAppSelector((store) => store.tableState.render);

  const [queryParams, setQueryParams] = useState<any>(
    {
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 10,
      search: searchParams.get("search") || "",
    }
  );

  useEffect(() => {
    setSearchParams({
      ...allParams,
      search: search || "",
      page: search ? "1" : allParams.page || "1",
      limit: allParams.limit || "20",
    });
  }, [debValue]);

  const {
    state: { data: settingsData },
  } = useCommonContext();

  const { data, mutate } = useApiMutation<{ data: IProduct[] }>(
    "product/paging",
    "post",
    {
      onSuccess: (data) => {
        console.log("Product created successfully:");
        setQueryParams({
          ...allParams,
          search: debValue || "",
          page: search ? "1" : allParams.page || "1",
          limit: allParams.limit || defaultLimit + "",
        });
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
  }, [reRender, debValue, searchParams]);


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
          <SearchInput
            value={search}
            onChange={(e: any) => {
              setSearch(e?.target?.value);
            }}
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
                <div
                  className="product-card"
                  style={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    padding: "16px",
                    backgroundColor: "#F5F5F5",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "12px",
                    height: "170px", // Har bir kartaning balandligi bir xil bo'ladi
                    justifyContent: "space-between", // Ichki elementlar orasida bir xil masofa
                    transition: "transform 0.2s ease",
                  }}
                  onClick={() => basketFn(product)}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  {foundBasketItem && (
                    <div
                      style={{
                        background: "#f44336",
                        color: "#fff",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                      }}
                    >
                      {foundBasketItem.amount} dona
                    </div>
                  )}

                  <div
                    style={{
                      fontWeight: "600",
                      fontSize: "16px",
                      color: "#333",
                      textAlign: "center",
                    }}
                  >
                    {product.name}
                  </div>

                  <div
                    style={{
                      width: "100%",
                      display: "block",
                      justifyContent: "space-between",
                      fontSize: "14px",
                      textAlign: "center",
                    }}
                  >
                    {
                      product?.discountEnabled === false ? "" : <div style={{ color: "#ed0e0e" }}>
                        Asl Narxi:
                        <s style={{ marginLeft: "4px" }}>
                          {numberFormat(product.price)} {get(settingsData, "currency", "uzs")}
                        </s>
                      </div>
                    }
                    {
                      product?.discountEnabled && <div style={{ color: "#4caf50", fontWeight: "bold" }}>
                        Chegirma: {numberFormat(product?.discountValue)}{" "}
                        {product?.discountType === "percent" ? "%" : get(settingsData, "currency", "uzs")}
                      </div>
                    }

                  </div>

                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#000",
                    }}
                  >
                    {numberFormat(product.salePrice)} {get(settingsData, "currency", "uzs")}
                  </div>

                  <div
                    style={{
                      fontSize: "12px",
                      color: "#757575",
                      marginTop: "8px",
                    }}
                  >
                    Omborda: {numberFormat(product.inStock)} dona
                  </div>
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
