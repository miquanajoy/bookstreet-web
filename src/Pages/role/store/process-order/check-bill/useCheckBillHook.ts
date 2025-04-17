import { useEffect, useState } from "react";
import config from "../../../../../config";
import { fetchWrapper } from "../../../../../_helpers/fetch-wrapper";
import { alertService } from "../../../../../_services";
import { KIOS, STORE } from "../../../../../_helpers/const/const";

const useCheckBillHook = (initialEmail: string = "") => {
  // Dialog
  const [openDialogInfo, setOpenDialog] = useState(false);
  const handleCloseOrderInfo = () => {
    setOpenDialog(false);
  };
  const openOrderInfo = () => {
    setOpenDialog(true);
  };

  return {
    openDialogInfo,
    handleCloseOrderInfo,
    openOrderInfo
  };
};

export default useCheckBillHook;
