import { useEffect, useState } from "react";
import config from "../../../../../config";
import { fetchWrapper } from "../../../../../_helpers/fetch-wrapper";
import { alertService } from "../../../../../_services";
import { KIOS, STORE } from "../../../../../_helpers/const/const";
import { useForm } from "react-hook-form";

const useOrderInfo = (orderDetail: any, handleClose) => {
  const [openDialogInfo, setOpenDialog] = useState(false);
  const handleConfirmOpen = () => {
    setOpenDialog(true);
  };
  const handleConfirmClose = () => {
    setOpenDialog(false);
  };

  const [orders, setOrders] = useState([]);

  const [totalOrder, setTotalOrder] = useState({
    quantity: 0,
    price: 0,
  });
  function setOrderNow(val) {
    setOrders(val);
  }
  const fetchTransactions = async () => {
    try {
      const response = await fetchWrapper.get(
        config.apiUrl + STORE + "/order/" + orderDetail.storeOrderId
      );

      setOrderNow(response);
      const total = {
        quantity: response.length,
        price: response.map((val) => val.price).reduce((pre, nxt) => pre + nxt),
      };
      setTotalOrder(total);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    openDialogInfo,
    handleConfirmOpen,
    handleConfirmClose,
    orders,
    totalOrder,
  };
};

export default useOrderInfo;
