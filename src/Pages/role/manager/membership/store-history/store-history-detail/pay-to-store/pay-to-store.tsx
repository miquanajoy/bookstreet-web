import { useNavigate } from "react-router-dom";
import { fetchWrapper } from "../../../../../../../_helpers/fetch-wrapper";
import { alertService } from "../../../../../../../_services/alert.service";
import config from "../../../../../../../config";

export default function Pay2Store({ storeDetail, handleClose, orders }) {
  const navigate = useNavigate();

  // Format tiền theo đơn vị VNĐ
  const formatCurrency = (value: number) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const totalPrice = orders
    .map((v) => v.subTotal)
    .reduce((pre, nxt) => pre + nxt, 0);

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
      {/* Header */}
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
        <div className="w-16"></div>
      </div>

      {/* Nội dung */}
      <div className="p-4 pb-0">
        <div className="text-sm text-gray-700 mb-1">
          Số lượng đơn thanh toán: {orders.length}
        </div>
        {/* ❌ Đã bỏ phần hiển thị mã đơn */}
        <div className="text-sm text-gray-700 mb-1">
          Tổng giá trị thanh toán: {formatCurrency(totalPrice)}
        </div>
      </div>

      {/* QR & Thông tin ngân hàng */}
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
            <b>Số tài khoản:</b> {storeDetail.bankAccountNumber}
          </div>
          <div className="text-center">
            <b>Ngân hàng:</b> {storeDetail.bankName}
          </div>
          <button
            onClick={handleConfirm}
            className="w-64 block mx-auto px-8 py-2 mt-4 rounded-md bg-gray-600 hover:bg-gray-700 text-white font-semibold"
          >
            Hoàn tất thanh toán
          </button>
        </div>
      ) : (
        <div className="text-center mb-4 text-red-500 font-medium">
          Store này hiện chưa cập nhật thông tin ngân hàng
        </div>
      )}
    </div>
  );
}
