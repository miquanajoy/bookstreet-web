import { useState } from "react";
import { STORE } from "../../../../../../_helpers/const/const";
import config from "../../../../../../config";
import { fetchWrapper } from "../../../../../../_helpers/fetch-wrapper";
import { alertService } from "../../../../../../_services";

export default function ConfirmOrder({
  orderDetail,
  handleClose,
  handleConfirmClose,
  fetchTransactions,
}) {
  const [customerCode, setCustomerCode] = useState();

  const handleInputChange = (event) => {
    setCustomerCode(event.target.value);
  };

  const handleConfirm = async (isCancel) => {
    let apitxt = "/update-order/";
    if (isCancel) {
      if (window.confirm("Bạn có muốn huỷ đơn hàng này không?")) {
        apitxt = "/cancel-order/";
      }
    }
    const response = await fetchWrapper.post(
      config.apiUrl + STORE + apitxt + orderDetail.storeOrderId,
      {
        pickupCode: !isCancel ? customerCode : undefined,
      }
    );
    if (response.success) {
      handleClose();
      if (isCancel) {
        alertService.alert({
          content: "Huỷ đơn hàng thành công",
        });
        setTimeout(() => {
          fetchTransactions({ email: undefined, type: "default" });
        }, 1000);
        return;
      }
      alertService.alert({
        content: "Đã hoàn tất đơn hàng",
      });
      setTimeout(() => {
        fetchTransactions({ email: undefined, type: "default" });
      }, 1000);
    } else {
      alertService.alert({
        content: response.message,
      });
    }
  };

  return (
    <div>
      <button
        onClick={handleConfirmClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-semibold"
        aria-label="Đóng"
      >
        ×
      </button>

      <h2 className="text-center text-xl font-light text-gray-700 mb-4 tracking-wider">
        Nhập OTP đơn hàng
      </h2>

      <input
        type="text"
        value={customerCode}
        onChange={handleInputChange}
        placeholder="Nhập mã OTP tại đây"
        className="w-64 mx-auto d-block px-4 py-2 border border-gray-400 rounded-md mb-3 text-center text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
        aria-label="Mã OTP"
      />

      <div className="w-full d-flex justify-center gap-4">
        <button
          onClick={() => {
            handleConfirm(1);
          }}
          className={`
          w-64 block mx-auto px-8 py-2
          rounded-md border
          focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50
          transition duration-150 ease-in-out
          bg-gray-300 border-gray-400 text-gray-500 
          cursor-pointer
        `}
        >
          Xác nhận huỷ đơn
        </button>

        <button
          disabled={!customerCode}
          onClick={() => {
            handleConfirm(0);
          }}
          className={`
          w-64 block mx-auto px-8 py-2
          rounded-md border
          focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50
          transition duration-150 ease-in-out
          cursor-pointer
          ${
            !customerCode
              ? "bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed"
              : "bg-gray-500 border-gray-600 text-white hover:bg-gray-600"
          }
        `}
        >
          Xác nhận hoàn thành
        </button>
      </div>
    </div>
  );
}
