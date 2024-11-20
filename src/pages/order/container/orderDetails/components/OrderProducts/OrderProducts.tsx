import {
  ClockIcon,
  DefaultImage,
  DeleteIcon,
  FlagIcon,
  TickIcon,
  TruckIcon,
} from "assets/svgs";
import { OrderProductsStyled } from "./OrderProducts.styled";
import { numberFormat } from "utils/numberFormat";
import EditIcon from "components/elements/Table/assets/EditIcon";
import { useFieldArray } from "react-hook-form";
import WarningModal from "components/common/WarningModal/WarningModal";
import { useState } from "react";
import { MainButton, Modal, TextInput } from "components";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import useCommonContext from "context/useCommon";
import { get } from "lodash";

const OrderProducts = ({ formStore, state, order }: any) => {
  const [productIndex, setProductIndex] = useState<number>(0);
  const [updatedProduct, setUpdatedProduct] = useState<any>();
  const { t } = useTranslation();

  const {
    state: { data: settingsData },
  } = useCommonContext();

  const {
    fields: products,
    remove,
    update,
  } = useFieldArray({
    control: formStore?.control,
    name: "items",
  });
  const index =
    state === "created"
      ? 1
      : state === "inProcess"
      ? 2
      : state === "inDelivery"
      ? 3
      : state === "completed"
      ? 4
      : 0;

  console.log(order);
  return (
    <OrderProductsStyled>
      <div className="steps">
        <span className={`icon ${index && "active"}`}>
          <TickIcon />
        </span>
        <span className={`icon ${index > 1 && "active"}`}>
          <ClockIcon />
          <div className="line"></div>
        </span>
        <span className={`icon ${index > 2 && "active"}`}>
          <TruckIcon />
          <div className="line"></div>
        </span>
        <span className={`icon ${index > 3 && "active"}`}>
          <FlagIcon />
          <div className="line"></div>
        </span>
      </div>
      <div className="products">
        <div>
          {products?.map((item: any, index) => (
            <div className="product">
              <span className="default-image">
                {item.product.mainImage ? (
                  <img
                    src={
                      process.env.REACT_APP_BASE_URL + "/" +
                      item.product.mainImage.url
                    }
                    alt="product"
                  />
                ) : (
                  <DefaultImage />
                )}
              </span>
              <div className="info">
                <span className="name">{item.product.name}</span>
                <div className="amount-price">
                  {item.amount} x {numberFormat(item.price)}{" "}
                  {get(settingsData, "currency", "uzs")}
                </div>
              </div>
              {state !== "completed" && state !== "cancelled" && (
                <div className="action">
                  {state !== "inDelivery" && (
                    <>
                      <span onClick={() => setProductIndex(index + 1)}>
                        <DeleteIcon />
                      </span>
                      <span
                        onClick={() => setUpdatedProduct({ ...item, index })}
                      >
                        <EditIcon />
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <ul className="product_info">
          <li>
            <span>Barcha mahsulotlar:</span>{" "}
            <b>
              {numberFormat(get(order, "itemPrice", 0))}{" "}
              {get(settingsData, "currency", "uzs")}
            </b>
          </li>
          <li>
            <span>Yetkazib berish:</span>
            <b>
              {numberFormat(get(order, "deliveryPrice", 0))}{" "}
              {get(settingsData, "currency", "uzs")}
            </b>
          </li>
          <li>
            <span className="main">Umumiy:</span>{" "}
            <b>
              {numberFormat(get(order, "totalPrice", 0))}{" "}
              {get(settingsData, "currency", "uzs")}
            </b>
          </li>
        </ul>
      </div>
      <WarningModal
        open={productIndex}
        setOpen={setProductIndex}
        confirmFn={() => {
          remove(productIndex - 1);
          setProductIndex(0);
        }}
      />
      <Modal setOpen={setUpdatedProduct} open={!!updatedProduct}>
        <div className="custom-modal">
          <span className="d-block mb-2">
            {updatedProduct?.product.name} ({t("common.residue")}:{" "}
            {updatedProduct?.product?.inStock || 0})
          </span>
          <TextInput
            control={formStore?.control}
            name={`items.${updatedProduct?.index}.amount`}
            type="number"
            onCustomChange={(value: any) => {
              if (value.floatValue <= updatedProduct.product.inStock) {
                update(updatedProduct?.index, {
                  ...updatedProduct,
                  amount: value?.floatValue || 0,
                });
              }
            }}
          />
          <MainButton
            title={t("general.save")}
            fullWidth
            variant="contained"
            className="mt-3"
            onClick={() => {
              if (
                formStore.watch(`items.${updatedProduct?.index}.amount`) <=
                updatedProduct.product.inStock
              ) {
                setUpdatedProduct(null);
              } else {
                toast.warn(`Max: ${updatedProduct.product.inStock}`);
              }
            }}
          />
        </div>
      </Modal>
    </OrderProductsStyled>
  );
};

export default OrderProducts;
