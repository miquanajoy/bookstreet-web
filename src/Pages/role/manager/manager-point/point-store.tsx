import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
  ROUTER,
  CUSTOMER,
  STORE,
  POINT_HISTORY,
} from "../../../../_helpers/const/const";

import { fetchWrapper } from "../../../../_helpers/fetch-wrapper";
import config from "../../../../config";
import { alertService } from "../../../../_services";
import { excelService } from "../../../../_services/excel.service";
import { ModelStyle } from "../../../../_helpers/const/model.const";
import { Pagination, Tab, TableContainer, Tabs } from "@mui/material";
import {
  SearchModel,
  searchService,
  typeSearch,
} from "../../../../_services/home/search.service";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdb-react-ui-kit";
import HistoryStore from "./history-store";
import CustomTabPanel from "../../../../Components/customTabPanel";
import HistoryCustomer from "./history-customer";
import { SearchIcon } from "../../../../assets/icon/search";

export default function PointStore() {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const { pathname } = useLocation();
  const headers = ["Avatar", "Tên cửa hàng", "Vị trí", "Hoạt động"];
  const noteInput = useRef(null);
  const pointRef = useRef(null);

  const {
    control,
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm();

  const [data, setData] = useState({
    list: [],
    totalPage: 0,
  });
  const [dataDetail, setDataDetail] = useState<any>();
  const [customer, setCustomer] = useState<any>([]);
  const [customerPhone, setCustomerPhone] = useState<any>([]);

  async function fetAllData(pageNumber = 1) {
    const customers = await fetchWrapper.Post2GetByPaginate(
      config.apiUrl + CUSTOMER,
      -1
    );
    setCustomer(
      customers.list.map((v) => ({
        ...v,
        label: v.customerName,
        id: v.customerId,
      }))
    );

    setCustomerPhone(
      customers.list.map((v) => ({
        ...v,
        label: v.phone,
        id: v.customerId,
      }))
    );
    const result = fetchWrapper.Post2GetByPaginate(
      config.apiUrl + STORE,
      pageNumber,
      {
        filters: [
          {
            field: "storeName",
            value: searchService.$SearchValue.value?.dataSearch,
            operand: typeSearch,
          },
        ],
      }
    );
    result.then((res: any) => {
      setData({
        list: res.list,
        totalPage: res.totalPage,
      });
    });
  }

  useEffect(() => {
    fetAllData();
  }, [pathname]);

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

  const [openPoint, setOpenPoint] = useState(false);
  const [openPointHistory, setOpenPointHistory] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [customerByStore, setCustomerHistory] = useState({
    data: [],
    filterData: [],
  });
  const openDialogCreasePoint = (val) => {
    const customerConvert = customer.map((v) => ({
      ...v,
      label: v.customerName,
    }));
    setCustomer(customerConvert);
    setDataDetail(val);
    setOpenPoint(true);
  };

  const openDialogCreasePointHistory = (storeId) => {
    setOpenPointHistory(true);
    const storeHistory = fetchWrapper.post(config.apiUrl + STORE + "/history", {
      page: 1,
      limit: -1,
      filters: [
        {
          field: "storeId",
          value: storeId.toString(),
          operand: 0,
        },
      ],
    });
    storeHistory.then((res: any) => {
      setHistoryList(res.data.list);
    });
    fetchWrapper
      .Post2GetByPaginate(
        config.apiUrl + POINT_HISTORY,
        -1,
        {
          filters: [
            {
              field: "storeId",
              value: storeId.toString(),
              operand: 0,
            },
          ],
        },
        -1
      )
      .then((res) =>
        setCustomerHistory({ data: res.list, filterData: res.list })
      );
  };

  const [selectedValue, setSelectedValue] = useState("");

  const handleClose = (value: string) => {
    reset();
    setOpenPoint(false);
    setOpenPointHistory(false);
    setSelectedValue(value);
  };

  const [value, setValue] = useState(0);

  const handleChange = (_, newValue) => {
    setValue(newValue ?? 1);
  };
  function updateSearchValue(e) {
    const filterData = e.target.value
      ? customerByStore.data.filter((val) => {
          return (
            val?.customerPhone && val?.customerPhone.includes(e.target.value)
          );
        })
      : customerByStore.data;
    setCustomerHistory({
      data: customerByStore.data,
      filterData,
    });
  }

  // End Model
  const savedata = (val) => {
    val.storeId = dataDetail.storeId;
    const process = fetchWrapper.post(config.apiUrl + "Store/add-point", val);

    process
      .then((res) => {
        if (res.success) {
          alertService.alert({
            content: `Cộng ${val.point} điểm cho cửa hàng ${dataDetail.storeName}`,
          });
        } else {
          alertService.alert({
            content: res.message,
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
    handleClose(undefined);
  };

  function DialogUptoPoint(props: any) {
    return (
      <div className="p-6">
        <h2 className="mb-4">Tăng điểm</h2>
        <div className="mb-2">
          <div>Tên cửa hàng: {dataDetail?.storeName} </div>
          <div>Vị trí: {dataDetail?.locationName}</div>
        </div>
        <form
          onSubmit={handleSubmit(savedata)}
          className="d-flex flex-column gap-2 col-6 mx-auto"
        >
          <div>
            <label htmlFor="point">
              <b>Số điểm:</b>
            </label>
            <input
              id="point"
              type="number"
              min={1}
              max={dataDetail?.point}
              ref={pointRef}
              className="form-control"
              {...register("point")}
            />
          </div>

          <div className="col-start-2 col-span-2">
            <label htmlFor="note">
              <b>Note: </b>
            </label>
            <textarea
              defaultValue=""
              id="note"
              ref={noteInput}
              {...register("description")}
              className="form-control min-h-30 max-h-50"
            ></textarea>
            <input
              type="submit"
              className="btn btn-dark mt-2"
              value="Xác nhận"
            />
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="px-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="title">{ROUTER.roleManager.pointHistory.name}</h1>
      </div>
      <MDBTable align="middle" hover>
        <MDBTableHead>
          <tr className="text-center">
            {headers.map((v) => (
              <th key={v} scope="col">
                {v}
              </th>
            ))}
            {/* <th scope="col">Actions</th> */}
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {data.list.map((tr, rowLine) => (
            <tr key={rowLine} className="cursor-pointer">
              <td>
                <div
                  className="mx-auto w-20 h-20 bg-contain bg-no-repeat bg-center"
                  style={{
                    backgroundImage: `url('${
                      tr.urlImage ??
                      "https://mdbootstrap.com/img/new/avatars/8.jpg"
                    }')`,
                  }}
                ></div>
              </td>
              <td className="flex-inline items-center text-dark p-1">
                <div>
                  <p className="text-center">{tr.storeName}</p>
                </div>
              </td>
              <td className="flex-inline items-center text-dark p-1">
                <div>
                  <p className="text-center">{tr.locationName}</p>
                </div>
              </td>

              <td>
                <div className="flex items-center justify-center gap-4">
                  <button
                    className="btn"
                    onClick={(_) => {
                      openDialogCreasePoint(tr);
                    }}
                  >
                    Cộng điểm
                  </button>
                  <button
                    className="btn"
                    onClick={(_) => {
                      openDialogCreasePointHistory(tr.storeId);
                    }}
                  >
                    Xem lịch sử
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>
      <div className="flex justify-center">
        <span>
          <Pagination
            count={data.totalPage}
            onChange={(_, pageNumber) => fetAllData(pageNumber)}
          />
        </span>
      </div>
      <Modal
        open={openPoint}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...ModelStyle, width: "50%" }}>
          <DialogUptoPoint
            selectedValue={selectedValue}
            open={openPoint}
            onClose={handleClose}
          />
        </Box>
      </Modal>
      <Modal
        open={openPointHistory}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...ModelStyle, width: "65vw" }}>
          <Box sx={{ width: "100%" }} className="scoll-auto">
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Lịch sử điểm store" id="simple-tab-1" />
                <Tab label="Lịch sử điểm khách hàng" id="simple-tab-2" />
                {value ? (
                  <div className="d-flex items-center px-2 basis-full">
                    <form className="max-w-[200px] w-full">
                      <label
                        htmlFor="default-search"
                        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                      >
                        Tìm kiếm
                      </label>
                      <div className="relative d-flex items-center">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                          <SearchIcon />
                        </div>
                        <input
                          type="text"
                          id="default-search"
                          className="block w-full py-1 pl-10 text-sm text-gray-900 border border-gray-300 rounded-2xl bg-gray-50"
                          placeholder="000-000-000"
                          onChange={(v) => {
                            updateSearchValue(v);
                          }}
                        />
                      </div>
                    </form>
                  </div>
                ) : (
                  <></>
                )}
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              {historyList.length ? (
                <HistoryStore data={historyList} />
              ) : (
                <div className="mt-2 ">Chưa có giao dịch nào</div>
              )}
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              {customerByStore.filterData.length ? (
                <HistoryCustomer data={customerByStore.filterData} />
              ) : (
                <div className="mt-2">Chưa có giao dịch nào</div>
              )}
            </CustomTabPanel>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
