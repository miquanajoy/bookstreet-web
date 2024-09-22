import { useEffect, useState } from "react";
import { accountService, alertService } from "../../../../_services";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { fetchWrapper } from "../../../../_helpers/fetch-wrapper";
import config from "../../../../config";
import {
  AVATARDEFAULT,
  CUSTOMER,
  GIFT,
  POINT_HISTORY,
  ROUTER,
} from "../../../../_helpers/const/const";
import { Link, useNavigate } from "react-router-dom";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdb-react-ui-kit";
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
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { ModelStyle } from "../../../../_helpers/const/model.const";
import dayjs from "dayjs";
import { PlusIcon } from "../../../../assets/icon/plus";
import { useForm } from "react-hook-form";
import { loadingService } from "../../../../_services/loading.service";
import { Trash } from "../../../../assets/icon/trash";
import {
  SearchModel,
  searchService,
  typeSearch,
} from "../../../../_services/home/search.service";

export default function ListCustomerPoint() {
  const navigate = useNavigate();

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
  const [dataDetail, setDataDetail] = useState<any>();
  const headers = [
    { key: "customerName", name: "Tên khách hàng" },
    { key: "point", name: "Điểm" },
    { key: "phone", name: "Điện thoại" },
    { key: "action", name: "Hoạt động" },
  ];

  async function fetAllData(pageNumber = 1) {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    const result = await fetchWrapper.Post2GetByPaginate(
      config.apiUrl + CUSTOMER,
      pageNumber,
      {
        filters: [
          {
            field: "customerName",
            value: searchService.$SearchValue.value?.dataSearch,
            operand: typeSearch,
          }
        ],
      }
    );
    setData({
      list: result.list,
      totalPage: result.totalPage,
    });
  }

  useEffect(() => {
    fetAllData();
  }, []);

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

  async function deleteItem(id) {
    await fetchWrapper.delete(config.apiUrl + CUSTOMER + "/" + id, fetAllData);
  }

  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [customerChoose, setCustomerChoose] = useState<any>();

  const handleClickOpen = async (val) => {
    setCustomerChoose(val);
    const customerDetail = await fetchWrapper.Post2GetByPaginate(
      config.apiUrl + POINT_HISTORY,
      -1,
      {
        filters: [
          {
            field: "customerId",
            value: val.customerId.toString(),
            operand: 0,
          },
        ],
      },
      -1
    );
    const customerConvert = customerDetail.list;
    // const giftDetail = await fetchWrapper.get(
    //   config.apiUrl + GIFT + "/" + customerConvert?.giftId
    // );

    setDataDetail({
      customerConvert,
      // giftDetail,
    });
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setOpenPoint(false);
    setSelectedValue(value);
  };

  function DialogDetail(props: any) {
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
      onClose(selectedValue);
    };

    const handleListItemClick = (value: string) => {
      onClose(value);
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
          <Box sx={{ ...ModelStyle, width: "50%" }}>
            <div className="mb-2">
              <div>Tên khách hàng: {customerChoose?.customerName} </div>
              <div>Điểm: {customerChoose?.point}</div>
              {customerChoose?.phone ? (
                <div>Điện thoại: {customerChoose?.phone}</div>
              ) : (
                <></>
              )}
            </div>
            <Box sx={{ width: "100%" }} className="scoll-auto">
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab label="Lịch sử điểm" id="simple-tab-1" />
                  <Tab label="Lịch sử đổi quà" id="simple-tab-2" />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                {dataDetail?.customerConvert.length ? (
                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table
                      stickyHeader
                      sx={{ minWidth: 440 }}
                      aria-label="simple table"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">
                            Tổng tiền đơn hàng
                          </TableCell>
                          <TableCell align="center">Số điểm</TableCell>
                          <TableCell align="center">Số dư</TableCell>
                          <TableCell align="center">Ghi chú</TableCell>
                          <TableCell align="center">Ngày</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dataDetail?.customerConvert?.map((data, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell align="center">{data.amount}</TableCell>

                            <TableCell align="center">
                              {data.pointAmount}
                            </TableCell>
                            <TableCell align="center">
                              {data.currentPoint}
                            </TableCell>
                            <TableCell align="center"> {data.note}</TableCell>
                            <TableCell align="center">
                              {dayjs(data.createdAt).format("YYYY-MM-DD")}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <div className="mt-2 ">Chưa có giao dịch nào</div>
                )}
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                {dataDetail?.customerConvert.length && dataDetail?.customerConvert.some(val => val.gift) ? (
                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table
                      stickyHeader
                      sx={{ minWidth: 440 }}
                      aria-label="simple table"
                    >
                      <TableHead>
                        <TableRow>
                          {[
                            "Tên quà tặng",
                            "Hình ảnh",
                            "Số lượng quà tặng",
                            "Ngày bắt đầu",
                            "Ngày kết thúc",
                            "Mô tả",
                            "Ngày đổi",
                          ].map((v) => (
                            <TableCell align="center" key={v}>
                              {v}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dataDetail?.customerConvert.map((data, index) =>
                          data?.gift ? (
                            <TableRow
                              key={index}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell align="center">
                                {data?.gift?.giftName}
                              </TableCell>
                              <TableCell align="center">
                                <div
                                  className="h-40 bg-cover bg-no-repeat bg-center"
                                  style={{
                                    backgroundImage: `url(${
                                      data?.gift?.urlImage
                                        ? data?.gift?.urlImage
                                        : AVATARDEFAULT
                                    })`,
                                  }}
                                ></div>
                              </TableCell>
                              <TableCell align="center">
                                {data?.quantity}
                              </TableCell>
                              <TableCell align="center">
                                {dayjs(data?.gift?.startDate).format(
                                  "YYYY-MM-DD"
                                )}
                              </TableCell>

                              <TableCell align="center">
                                {dayjs(data?.gift?.endDate).format(
                                  "YYYY-MM-DD"
                                )}
                              </TableCell>
                              <TableCell align="center">
                                {data?.gift?.description}
                              </TableCell>
                              <TableCell align="center">
                                {dayjs(data.createdAt).format("YYYY-MM-DD")}
                              </TableCell>
                            </TableRow>
                          ) : (
                            <></>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <div className="mt-2 ">Chưa có giao dịch nào</div>
                )}
              </CustomTabPanel>
            </Box>
          </Box>
        </div>
      </Modal>
    );
  }

  // Dialog Point
  const [openPoint, setOpenPoint] = useState(false);

  const handleClickOpenDIalogPoint = async (val) => {
    setCustomerChoose(val);
    setOpenPoint(true);
  };

  const savedata = async (val) => {
    let dataPost = {
      ...val,
      customerId: customerChoose.customerId,
    };
    let process;
    process = fetchWrapper.post(config.apiUrl + POINT_HISTORY, dataPost);

    process
      .then(async (val) => {
        await fetAllData();
        alertService.alert({
          content: `Cộng ${val.data.pointAmount} điểm cho khách hàng ${val.data.customer.customerName}`,
        });
      })
      .catch((e) => {
        console.log(e);
      });
    handleClose(undefined);
  };

  function DialogUptoPoint(props: any) {
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
      onClose(selectedValue);
    };

    const handleListItemClick = (value: string) => {
      onClose(value);
    };

    return (
      <Modal
        open={openPoint}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="p-6">
          <Box sx={{ ...ModelStyle, width: "50%" }}>
            <div className="col-7 mx-auto">
              <div>Tên khách hàng: {customerChoose?.customerName} </div>
              <div>Điểm: {customerChoose?.point}</div>
              {customerChoose?.phone ? (
                <div>Điện thoại: {customerChoose?.phone}</div>
              ) : (
                <></>
              )}
            </div>
            <form
              onSubmit={handleSubmit(savedata)}
              className="col-7 mx-auto mt-4"
            >
              <div className="d-flex flex-column gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <label className="uppercase" htmlFor="nm">
                    <b>Tổng tiền đơn hàng: </b>
                    <input
                      id="nm"
                      type="number"
                      min={0}
                      className="form-control"
                      {...register("amount")}
                    />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="uppercase" htmlFor="nm">
                    <b>Điểm cộng: </b>
                    <input
                      id="nm"
                      type="number"
                      min={0}
                      className="form-control"
                      {...register("pointAmount")}
                    />
                  </label>
                </div>
                <div className="col-start-2 col-span-2">
                  <label htmlFor="avb">
                    <b>Note: </b>
                  </label>
                  <textarea
                    className="form-control min-h-30 max-h-50"
                    {...register("note")}
                  ></textarea>
                  <input
                    type="submit"
                    className="btn btn-success mt-12"
                    value="Lưu"
                  />
                </div>
              </div>
            </form>
          </Box>
        </div>
      </Modal>
    );
  }

  return (
    <>
      <div className="px-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="title">Quản lý Khách hàng </h1>
          <Link to="create">
            <button className="bg-black text-white rounded-lg px-3 py-0.5">
              Tạo khách hàng
            </button>
          </Link>
        </div>
        <MDBTable align="middle" hover>
          <MDBTableHead>
            <tr className="text-center">
              {headers.map((v) => (
                <th key={v.key} scope="col">
                  {v.name}
                </th>
              ))}
              {/* <th scope="col">Actions</th> */}
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {data.list.map((tr, rowLine) => (
              <tr key={rowLine} className="cursor-pointer">
                <td
                  onClick={() => {
                    handleClickOpen(tr);
                  }}
                  className="flex-inline items-center text-dark p-1"
                >
                  <div>
                    <p className="text-center">{tr.customerName}</p>
                  </div>
                </td>
                <td
                  onClick={() => {
                    handleClickOpen(tr);
                  }}
                  className="flex-inline items-center text-dark p-1"
                >
                  <div>
                    <p className="text-center">{tr.point}</p>
                  </div>
                </td>
                <td
                  onClick={() => {
                    handleClickOpen(tr);
                  }}
                  className="flex-inline items-center text-dark p-1"
                >
                  <div>
                    <p className="text-center">{tr.phone}</p>
                  </div>
                </td>
                <td>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      className="fw-bold"
                      onClick={(_) => {
                        handleClickOpenDIalogPoint(tr);
                      }}
                    >
                      <PlusIcon />
                    </button>

                    <button
                      className="fw-bold"
                      onClick={(_) => {
                        deleteItem(tr.customerId);
                      }}
                    >
                      <Trash fill="#000" />
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
        <DialogDetail
          selectedValue={selectedValue}
          open={open}
          onClose={handleClose}
        />
        <DialogUptoPoint
          selectedValue={selectedValue}
          open={openPoint}
          onClose={handleClose}
        />
      </div>
    </>
  );
}
