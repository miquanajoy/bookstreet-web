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

  const fetchTransactions = async () => {
    try {
      const response = await fetchWrapper.get(
        config.apiUrl + STORE + "/order/" + orderDetail.storeOrderId
      );
      if (response.success) {
        setOrders(response.data);
        const total = {
          quantity: response.data.length,
          price: response.data
            .map((val) => val.price)
            .reduce((pre, nxt) => pre + nxt),
        };
        setTotalOrder(total);
      } else {
        alertService.alert({
          content: response.message,
        });
      }
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
