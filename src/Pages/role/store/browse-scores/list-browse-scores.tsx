import { useEffect, useState } from "react";
import { accountService, alertService } from "../../../../_services";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { fetchWrapper } from "../../../../_helpers/fetch-wrapper";
import config from "../../../../config";
import {
  AVATARDEFAULT,
  CUSTOMER,
  POINT_HISTORY,
  ROUTER,
  STORE,
} from "../../../../_helpers/const/const";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Modal,
  Pagination,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
} from "@mui/material";
import { loadingService } from "../../../../_services/loading.service";
import {
  SearchModel,
  searchService,
  typeSearch,
} from "../../../../_services/search.service";
import CustomTabPanel from "../../../../Components/customTabPanel";
import HistoryStore from "../../manager/manager-point/history-store";
import HistoryCustomer from "../../manager/manager-point/history-customer";
import { useForm } from "react-hook-form";
import { ModelStyle } from "../../../../_helpers/const/model.const";
import dayjs from "dayjs";
import { CalendarIcon } from "@mui/x-date-pickers";
import CreateBillForm from "./form-create-bill";
import { billFormService } from "../../../../_services/bill-form.service";

export const WAIT_BROWSE_SCORE = "1";
export const HISTORY_BROWSE_SCORE = "2";
export const REJECT_BROWSE_SCORE = "3";

export default function ListBrowseScores() {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      return await fetAllData();
    },
  });

  const [data, setData] = useState({
    list: [],
    totalPage: 0,
  });
  const [pointStore, setPointStore] = useState(0);
  async function fetAllData(pageNumber = 1, status = value.toString()) {
    const pointHistory = await fetchWrapper.Post2GetByPaginate(
      config.apiUrl + POINT_HISTORY,
      pageNumber,
      {
        filters: [
          {
            field: "storeId",
            value: user.user.storeId.toString(),
            operand: 0,
          },
          {
            field: "status",
            value: "1",
            operand: status,
          },
        ],
      },
      10
    );
    setData({
      list: pointHistory.list.filter((val) => val.invoiceCode && !val.giftId),
      totalPage: pointHistory.totalPage,
    });
    fetchWrapper
      .getWithoutCall(config.apiUrl + STORE + "/" + user.user.storeId)
      .then((v: any) => {
        loadingService.hiddenLoading();
        setPointStore(v.data.totalPoint);
      });

    return pointHistory;
  }

  // Search area
  useEffect(() => {
    const searchSub = searchService.$SearchValue.subscribe({
      next: (v: SearchModel) => {
        if (v?.isClickSearch) {
          fetAllData();
        }
      },
    });
    return () => searchSub.unsubscribe();
  }, []);
  // End Search area

  async function browseScore(data: any, status) {
    const updatePoint = await fetchWrapper.post(
      config.apiUrl + POINT_HISTORY + "/update-point",
      {
        pointHistoryId: data.pointHistoryId,
        status,
      }
    );
    if (updatePoint.success) {
      fetAllData(1, "1").then(() => {
        if (status == REJECT_BROWSE_SCORE) {
          alertService.alert({
            content: `Đã từ chối mã hoá đơn ${data.invoiceCode}`,
          });
        } else {
          alertService.alert({
            content: `Đã duyệt thành công cho mã hoá đơn ${data.invoiceCode}`,
          });
        }
        setValue(1);
      });
    } else {
      alertService.alert({
        content: updatePoint.message,
      });
    }
  }

  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [customerChoose, setCustomerChoose] = useState<any>();

  const handleClose = (value: string) => {
    setOpen(false);
    setOpenPoint(false);
    setSelectedValue(value);
  };

  const [openCreateBillForm, setOpenPoint] = useState(false);
  function closeFormBill(v?) {
    if (v) {
      fetAllData();
    }
    setOpenPoint(false);
  }
  function openFormBill() {
    billFormService.setTgthdBillForm(0);
    setOpenPoint(true);
  }

  function DialogDetail(props: any) {
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
      onClose(selectedValue);
    };

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    function CustomTabPanel(props) {
      const { children, value, index, ...other } = props;

      return (
        <div
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
          {...other}
        >
          {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
        </div>
      );
    }

    return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="p-6">
          <Box sx={{ ...ModelStyle, width: "65vw" }}>
            <TableContainer>
              <Table stickyHeader aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Mã hoá đơn</TableCell>
                    <TableCell align="center">Tên khách hàng</TableCell>
                    <TableCell align="center">Số điện thoại</TableCell>
                    <TableCell align="center">Tổng tiền đơn hàng</TableCell>
                    <TableCell align="center">Số điểm</TableCell>
                    <TableCell align="center">Số dư</TableCell>
                    <TableCell align="center">Ghi chú</TableCell>
                    <TableCell align="center">Ngày</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableCell align="center">
                    {customerChoose?.invoiceCode}
                  </TableCell>
                  <TableCell align="center">
                    {customerChoose?.customerName}
                  </TableCell>
                  <TableCell align="center">
                    {customerChoose?.customerPhone}
                  </TableCell>
                  <TableCell align="center">{customerChoose?.amount}</TableCell>

                  <TableCell align="center">
                    {customerChoose?.pointAmount}
                  </TableCell>
                  <TableCell align="center">
                    {customerChoose?.currentPoint}
                  </TableCell>
                  <TableCell align="center"> {customerChoose?.note}</TableCell>
                  <TableCell align="center">
                    {dayjs(customerChoose?.createdAt).format("YYYY-MM-DD")}
                  </TableCell>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </div>
      </Modal>
    );
  }

  const [value, setValue] = useState(0);

  const handleChange = (_, newValue) => {
    setValue(newValue);
    setData({
      list: [],
      totalPage: 0,
    });
    fetAllData(1, newValue);
  };

  return (
    <>
      <div className="">
        <div className="flex items-center justify-between mb-2 bg-slate-200 pb-3">
          <div className="d-flex justify-end gap-2 w-full bg-white px-6 py-3">
            <button
              className="bg-success text-white rounded-lg px-3 py-0.5"
              onClick={openFormBill}
            >
              Tạo hoá đơn
            </button>
          </div>
        </div>
        <div className="p-2">
          <h4>Số điểm trong ví: {pointStore} điểm </h4>

          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={value} onChange={handleChange}>
              <Tab label="Chờ duyệt" id="simple-tab-1" />
              <Tab label="Lịch sử duyệt" id="simple-tab-2" />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            {data.list.length ? (
              <HistoryCustomer
                data={data.list}
                totalPage={data.totalPage}
                fetAllData={fetAllData}
                browseScore={browseScore}
                isRejectBrowseScore={HISTORY_BROWSE_SCORE}
                getPointHistory={browseScore}
              />
            ) : (
              <div className="mt-2 ">Không có dữ liệu</div>
            )}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            {data.list.length ? (
              <HistoryCustomer
                data={data.list}
                isRejectBrowseScore={REJECT_BROWSE_SCORE}
              />
            ) : (
              <div className="mt-2 p-2">Không có dữ liệu</div>
            )}
          </CustomTabPanel>
          <div className="flex justify-center">
            <span>
              <Pagination
                count={data.totalPage}
                onChange={(_, pageNumber) => fetAllData(pageNumber)}
              />
            </span>
          </div>
        </div>
        <DialogDetail
          selectedValue={selectedValue}
          open={open}
          onClose={handleClose}
        />
        <Modal
          open={openCreateBillForm}
          onClose={closeFormBill}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{ ...ModelStyle, width: "auto" }}>
            <CreateBillForm close={closeFormBill} />
          </Box>
        </Modal>
      </div>
    </>
  );
}
