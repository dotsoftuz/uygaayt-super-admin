import { Rating } from "@mui/material";
import { DefaultImage } from "assets/svgs";
import { get } from "lodash";
import AddOrderForm from "pages/order/container/addOrder/components/AddOrderForm/AddOrderForm";
import { OrderInfoStyled } from "./OrderInfo.styled";

const OrderInfo = ({ formStore, order }: any) => {
  return (
    <OrderInfoStyled>
      <AddOrderForm order={order} basketItems={[]} formStore={formStore} />
      <div className="card mt-3">
        <h4 className="title">Mijoz</h4>
        <div className="info border-bottom mb-3 pb-3">
          <div className="image">
            {order?.customer?.image ? (
              <img src="https://picsum.photos/100" alt="" />
            ) : (
              <DefaultImage />
            )}
          </div>
          <div>
            <h4 className="name">
              {get(order, "customer.firstName", "") +
                " " +
                get(order, "customer.lastName", "")}
            </h4>
            <span className="phone">{order?.customer?.phoneNumber}</span>
          </div>
        </div>
        {get(order, "state.state", "") === "completed" && (
          <div>
            <h3 className="mb-2">Reyting va izoh</h3>
            {get(order, "rateComment", "") && (
              <p className="border-bottom pb-3">
                {get(order, "rateComment", "")}
              </p>
            )}
            <div className="py-3 border-bottom">
              <Rating name="read-only" value={get(order, "rate", 5)} readOnly />
            </div>

            <div className="comment_boxes pt-3">
              {get(order, "rateComments", []).map((item: any) => (
                <div className="comment_box">
                  <div className="comment_img">
                    <img
                      src={
                        process.env.REACT_APP_BASE_URL +
                        "/" +
                        get(item, "image.url", "")
                      }
                      alt="rate"
                    />
                  </div>
                  <p>{get(item, "title", "")}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {order.courier && (
        <div className="card">
          <h4 className="title">Kuryer</h4>
          <div className="info">
            <div className="image">
              {order?.courier?.image ? (
                <img
                  src={
                    process.env.REACT_APP_BASE_URL +
                    "/" +
                    order?.courier?.image?.url
                  }
                  alt=""
                />
              ) : (
                <span>
                  <DefaultImage />
                </span>
              )}
            </div>
            <div>
              <h4 className="name">
                {get(order, "courier.firstName", "")}{" "}
                {get(order, "courier.lastName", "")}
              </h4>
              <span className="phone">
                {get(order, "courier.phoneNumber", "")}
              </span>
            </div>
          </div>
          <div className="car">
            <span className="name">{get(order, "courier.carBrand", "")}</span>
            <span className="number">
              {get(order, "courier.carNumber", "")}
            </span>
          </div>
        </div>
      )}
      {order?.employee && (
        <div className="card">
          <h4 className="title">Xodim</h4>
          <div className="info">
            <div className="image">
              {order?.employee?.image ? (
                <img
                  src={
                    process.env.REACT_APP_BASE_URL +
                    "/" +
                    order?.employee?.image?.url
                  }
                  alt=""
                />
              ) : (
                <span>
                  <DefaultImage />
                </span>
              )}
            </div>
            <div>
              <h4 className="name">
                {get(order, "employee.firstName", "")}{" "}
                {get(order, "employee.lastName", "")}
              </h4>
              <span className="phone">
                {get(order, "employee.phoneNumber", "")}
              </span>
            </div>
          </div>
        </div>
      )}
      {order?.orderStructureType === "combined" &&
      order?.stores &&
      order.stores.length > 1
        ? order.stores.map((store: any, index: number) => (
            <div
              key={index}
              className="card"
              style={{ marginTop: index > 0 ? "16px" : "0" }}
            >
              <h4 className="title">
                Do'kon {index + 1}: {store.storeName}
              </h4>
              <div className="info">
                <div>
                  <h4 className="name">
                    {get(store, "store.name", store.storeName)}
                  </h4>
                  {get(store, "store.phoneNumber", "") && (
                    <span className="phone">
                      📞 {get(store, "store.phoneNumber", "")}
                    </span>
                  )}
                  {get(store, "store.addressName", "") && (
                    <span
                      className="phone"
                      style={{ display: "block", marginTop: "4px" }}
                    >
                      📍 {get(store, "store.addressName", "")}
                    </span>
                  )}
                  <div
                    style={{
                      marginTop: "8px",
                      paddingTop: "8px",
                      borderTop: "1px solid #e0e0e0",
                    }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: 500 }}>
                      Mahsulotlar: {store.items?.length || 0} ta
                    </span>
                    <br />
                    <span style={{ fontSize: "14px", fontWeight: 500 }}>
                      Subtotal: {store.subtotal?.toLocaleString() || 0}{" "}
                      {get(order, "currency", "uzs")}
                    </span>
                    {store.promocodePrice > 0 && (
                      <>
                        <br />
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#28a745",
                          }}
                        >
                          Promokod: -
                          {store.promocodePrice?.toLocaleString() || 0}{" "}
                          {get(order, "currency", "uzs")}
                        </span>
                      </>
                    )}
                    {store.usedBalance > 0 && (
                      <>
                        <br />
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#dc3545",
                          }}
                        >
                          Balance: -{store.usedBalance?.toLocaleString() || 0}{" "}
                          {get(order, "currency", "uzs")}
                        </span>
                      </>
                    )}
                    <br />
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#1976d2",
                      }}
                    >
                      Jami:{" "}
                      {(
                        (store.subtotal || 0) -
                        (store.promocodePrice || 0) -
                        (store.usedBalance || 0)
                      )?.toLocaleString() || 0}{" "}
                      {get(order, "currency", "uzs")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        : order?.store && (
            <div className="card">
              <h4 className="title">Do'kon</h4>
              <div className="info">
                <div>
                  <h4 className="name">{get(order, "store.name", "")}</h4>
                  {get(order, "store.phoneNumber", "") && (
                    <span className="phone">
                      {get(order, "store.phoneNumber", "")}
                    </span>
                  )}
                  {get(order, "store.addressName", "") && (
                    <span className="phone">
                      {get(order, "store.addressName", "")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
      {/* <div className="card">
        <h4 className="title">Moderator</h4>
        <div className="info">
          <div className="image">
            {order?.customer.image ? (
              <img src="https://picsum.photos/100" alt="" />
            ) : (
              <span>
                <DefaultImage />
              </span>
            )}
          </div>
          <div>
            <h4 className="name">Рахмонов Исломжон</h4>
            <span className="phone">+998974481512</span>
          </div>
        </div>
      </div> */}
    </OrderInfoStyled>
  );
};

export default OrderInfo;
