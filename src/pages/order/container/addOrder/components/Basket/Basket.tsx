import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { numberFormat } from "utils/numberFormat";
import { BasketStyled } from "./Basket.styled";
import { DeleteIcon, MinusIcon, PlusIcon } from "assets/svgs";
import { SearchInput } from "components";
import { useForm } from "react-hook-form";
import { Grid, Modal, Box } from "@mui/material";
import { useApi, useApiMutation } from "hooks/useApi/useApiHooks";
import useDebounce from "hooks/useDebounce";
import { IProduct } from "types/common.types";
import { useTranslation } from "react-i18next";
import useCommonContext from "context/useCommon";
import { get, uniqueId } from "lodash";
import { useSearchParams } from "react-router-dom";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";
import { useAppSelector } from "store/storeHooks";
import PaginationComponent from "./Pagination";

interface IBasketProps {
  basketItems: IProduct[];
  setBasketItems: Dispatch<SetStateAction<IProduct[]>>;
}

const Basket = ({ basketItems, setBasketItems }: IBasketProps) => {
  const [active, setActive] = useState("product");
  const [modalOpen, setModalOpen] = useState(false); // Modalni ochish uchun
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null); // Tanlangan mahsulot
  const [selectedVariant, setSelectedVariant] = useState<any>([]); // Tanlangan variant
  const allParams = useAllQueryParams();
  const { control, watch } = useForm();
  const [search, setSearch] = useState<any>(allParams.search || "");

  const { debouncedValue: debValue } = useDebounce(search, 500);
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultLimit = 10;
  const reRender = useAppSelector((store) => store.tableState.render);

  const currentLang = localStorage.getItem("i18nextLng") || "uz";

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
      limit: allParams.limit || "10",
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
        setBasketItems((prev) => [...prev, { ...product, amount: 1, salom: 'hello' }]);
    }
  };

  // Modalni ochish
  const handleOpenModal = (product: IProduct) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  // Modalni yopish
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
    setSelectedVariant([]);
  };

  // Variantni tanlash
  const handleVariantChange = (variant: any, attributeId: any) => {
    setSelectedVariant((prev: any) => {
      const updatedVariants = prev.filter((item: any) => item.attributeId !== attributeId);
      const newSelectedVariants = [...updatedVariants, { ...variant, attributeId }];

      console.log("Updated Variants:", newSelectedVariants); // Tanlangan variantlarni tekshirish
      return newSelectedVariants;
    });
  };


  // Tanlangan variantni savatga qo'shish
  const addVariantToBasket = () => {
    if (selectedProduct && selectedVariant) {
      const productWithVariant = {
        ...selectedProduct,
        variants: selectedVariant.map((item: any) => ({
          attributeId: item.attributeId,
          attributeItem: item.attributeItem
        }))
      };
      basketFn(productWithVariant);
      handleCloseModal();
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
        <>
             <Grid container spacing={2}>
          {data?.data?.data?.map((product: any) => {
            const foundBasketItem = basketItems.find(
              (e) => e._id === product._id
            );
            return (
              <Grid item md={4} key={product._id}>
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
                  onClick={() => {
                    if (product.attributes?.length > 0) {
                      handleOpenModal(product); // Agar variantlar mavjud bo'lsa modalni ochish
                    } else {
                      basketFn(product); // Variant bo'lmasa, bevosita savatga qo'shish
                    }
                  }}
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
                        {t('order.original_price')}:
                        <s style={{ marginLeft: "4px" }}>
                          {numberFormat(product.price)} {get(settingsData, "currency", "uzs")}
                        </s>
                      </div>
                    }
                    {
                      product?.discountEnabled && <div style={{ color: "#4caf50", fontWeight: "bold" }}>
                        {t('common.discount')}: {numberFormat(product?.discountValue)}{" "}
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
                    {t('order.in_warehouse')}: {numberFormat(product.inStock)}
                  </div>
                </div>
              </Grid>
            );
          })}
        </Grid>
        <Grid>
          <PaginationComponent totalItems={data?.data?.total} itemsPerPage={+allParams.limit || +defaultLimit} allParams={allParams} setSearchParams={setSearchParams}/>
        </Grid>
        </>
      )}


      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{
          padding: "20px",
          background: "#fff",
          borderRadius: "8px",
          maxWidth: "500px",
          margin: "auto",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}>
          <h2 id="modal-title" style={{ textAlign: "center", marginBottom: "20px", fontSize: "20px", color: "#333" }}>
            {t('general.again_choose')}
          </h2>

          {selectedProduct?.attributes?.map((attribute, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <h3 style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#333",
                marginBottom: "10px",
                borderBottom: "1px solid #eee",
                paddingBottom: "5px",
              }}>
                {attribute?.attribute?.name?.[currentLang] || ""}
              </h3>

              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                marginTop: "10px",
              }}>
                {attribute.items.map((option: any, optionIndex: number) => (
                  <div
                    key={optionIndex}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "10px",
                      border: selectedVariant.some(
                        (item: any) => item.attributeId === attribute?.attribute?._id && item.attributeItem === option.attributeItem
                      )
                        ? "2px solid #2196f3"
                        : "1px solid #ddd",
                      borderRadius: "8px",
                      backgroundColor: selectedVariant.some(
                        (item: any) => item.attributeId === attribute?.attribute?._id && item.attributeItem === option.attributeItem
                      )
                        ? "#f1f9ff"
                        : "#fff",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => handleVariantChange(option, attribute?.attribute?._id)}
                  >
                    <div style={{ fontWeight: "500", fontSize: "14px", color: "#333" }}>
                      {option.attributeItem}
                    </div>
                    <div style={{ fontSize: "12px", color: "#888", marginTop: "5px" }}>
                      + {numberFormat(option.amount)} {get(settingsData, "currency", "uzs")}
                    </div>
                  </div>

                ))}
              </div>
            </div>
          ))}

          <div style={{
            marginTop: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
            <button
              onClick={addVariantToBasket}
              style={{
                padding: "10px 20px",
                background:
                  selectedVariant.length === selectedProduct?.attributes?.length
                    ? "#4caf50"
                    : "#ddd",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor:
                  selectedVariant.length === selectedProduct?.attributes?.length
                    ? "pointer"
                    : "not-allowed",
                fontSize: "16px",
                fontWeight: "600",
                transition: "background-color 0.3s ease",
              }}
              disabled={selectedVariant.length !== selectedProduct?.attributes?.length} // Agar hamma atribut tanlanmagan bo'lsa, disable
            >
              {t("general.add_basket")}
            </button>

          </div>
        </Box>
      </Modal>
            


      {active === "basket" && (
        <div>
          {basketItems?.map((item: any) => (
            <div className="basket-item" key={item._id}>
              <div className="flex gap-2">
                <span className="">{item.name}</span>
                {item?.variants?.length > 0 && (
                  <div className="variant-info flex">
                    {item?.variants?.map((variant: any, index: any) => (
                      <div key={index} className="variant-item flex">
                        <span className="variant-name ml-1">
                          -{variant.attributeItem} 
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="action">
                <span className="icon" onClick={() => basketFn(item, "minus")}>
                  <MinusIcon />
                </span>
                <input
                  type="text"
                  className="amount-input"
                  value={item.amount}
                  onChange={(e) => basketFn(item, "", e.target.value || "noValue")}
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
