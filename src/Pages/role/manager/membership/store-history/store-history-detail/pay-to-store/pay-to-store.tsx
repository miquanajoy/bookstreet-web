import { useNavigate } from "react-router-dom";
import { fetchWrapper } from "../../../../../../../_helpers/fetch-wrapper";
import { alertService } from "../../../../../../../_services/alert.service";
import config from "../../../../../../../config";

export default function Pay2Store({ storeDetail, handleClose, orders }) {
  const navigate = useNavigate();

  const totalPrice = orders
    .map((v) => v.subTotal)
    .reduce((pre, nxt) => {
      return pre + nxt;
    });

  const handleConfirm = async () => {
    const response = await fetchWrapper.post(
      config.apiUrl + "Store/pay/" + storeDetail.storeId,
      undefined
    );
    if (response.success) {
      alertService.alert({
        content: "Thanh toán thành công",
      });
      setTimeout(() => {
        navigate("/membership/store-history", { replace: true });
      }, 1000);
    } else {
      alertService.alert({
        content: "Thanh toán không thành công",
      });
    }
  };

  return (
    <div className="rounded-lg w-full border border-gray-200">
      {/* Header Section */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <button
          className="flex items-center text-gray-700 hover:text-black"
          onClick={handleClose}
        >
          <span className="text-xl mr-2">←</span> Quay lại
        </button>
        <h2 className="text-lg font-semibold text-gray-800 m-0">
          Thông tin đơn hàng
        </h2>
        {/* Placeholder for alignment, can be removed if title should be centered */}
        <div className="w-16"></div>
      </div>
      <div className="p-4 pb-0">
        <div className="text-sm text-gray-700 mb-1">
          Số lượng đơn thanh toán: {orders.length}
        </div>
        <div className="text-sm text-gray-700 mb-1">
          Mã đơn: {orders.map((v) => v.storeOrderId).join(", ")}
        </div>
        <div className="text-sm text-gray-700 mb-1">
          Tổng giá trị thanh toán: {totalPrice} VNĐ
        </div>
      </div>
      {storeDetail.bankQrImage &&
      storeDetail.bankAccountNumber &&
      storeDetail.bankName ? (
        <div className="p-4">
          <img
            src={storeDetail.bankQrImage}
            width={250}
            height={250}
            alt="qr"
            className="mx-auto mb-2"
          />
          <div className="text-center">
            Số tài khoản: {storeDetail.bankAccountNumber}
          </div>
          <div className="text-center">Ngân hàng: {storeDetail.bankName}</div>
          <button
            onClick={handleConfirm}
            className={`
          w-64 block mx-auto px-8 py-2 mt-2
          rounded-md border
          focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50
          transition duration-150 ease-in-out
          cursor-pointer bg-gray-500 border-gray-600 text-white hover:bg-gray-600"
          }<
        `}
          >
            Hoàn tất thanh toán
          </button>
        </div>
      ) : (
        <div className="text-center mb-2">
          Store này hiện chưa cập nhật thông tin ngân hàng
        </div>
      )}
    </div>
  );
}
