import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  AVATARDEFAULT,
  IMPORT,
  GIFT,
  ROUTER,
  SAVEBATCH,
  CUSTOMER,
  POINT_HISTORY,
  AUTHOR,
} from "../../../../_helpers/const/const";

import { fetchWrapper } from "../../../../_helpers/fetch-wrapper";
import config from "../../../../config";
import { alertService } from "../../../../_services";
import { excelService } from "../../../../_services/excel.service";
import { Role } from "../../../../models/Role";
import { Trash } from "../../../../assets/icon/trash";
import { ModelStyle } from "../../../../_helpers/const/model.const";
import listStyle from "../../../../styles/listStyle.module.scss";
import {
  Autocomplete,
  FormControl,
  Pagination,
  TextField,
} from "@mui/material";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import dayjs from "dayjs";
import { fileService } from "../../../../_services/file.service";
import axios from "axios";
import { URL_IMG } from "../../../../_helpers/const/csv.const";
import {
  SearchModel,
  searchService,
  typeSearch,
} from "../../../../_services/home/search.service";

export default function ShowGift() {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const { pathname } = useLocation();
  const isBookScreen = pathname == ROUTER.book.url;
  const noteInput = useRef(null);
  const quantityRef = useRef(null);

  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const [data, setData] = useState({
    list: [],
    totalPage: 0,
  });
  const [dataDetail, setDataDetail] = useState<any>();
  const [customer, setCustomer] = useState<any>([]);
  const [customerPhone, setCustomerPhone] = useState<any>([]);
  const [quantityRefValue, setQuantityRefValue] = useState<any>(1);

  async function deleteItem(val) {
    await fetchWrapper.delete(config.apiUrl + GIFT + "/" + val.id, fetAllData);
  }

  async function fetAllData(pageNumber = 1) {
    const customers = await fetchWrapper.Post2GetByPaginate(
      config.apiUrl + CUSTOMER,
      -1,
      {
        filters: [
          {
            field: "customerId",
            value: user.user.storeId.toString(),
            operand: 0,
          },
        ],
      }
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
      config.apiUrl + GIFT,
      pageNumber,
      {
        filters: [
          {
            field: "giftName",
            value: searchService.$SearchValue.value?.dataSearch,
            operand: typeSearch,
          },
        ],
      }
    );
    result.then((res: any) => {
      res.list = res.list.map((v) => ({
        ...v,
        authors: v?.book?.authors.join(", "),
      }));

      setData(res);
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

  // Model
  const handleOnSearch = (e, results) => {
    if (!results) return;
    setcustomerId(results);
    setcustomerPhoneDetail(
      customerPhone.find((v) => v.customerId == results.customerId)
    );
    changeCustomer(results.customerId);
  };
  const handleOnSearchPhone = (e, results) => {
    if (!results) return;
    setcustomerId(customer.find((v) => v.customerId == results.customerId));
    setcustomerPhoneDetail(results);
    changeCustomer(results.customerId);
  };

  const [dataImport, setDataImport] = useState([]);

  const handleOpen = () => setOpenImport(true);
  function checkAmount() {
    if (quantityRef.current.value) {
      setQuantityRefValue(quantityRef.current.value);
      if (quantityRef.current.value > dataDetail.quantity) {
        setredeemGiftCheckQuantity(false);
      } else {
        setredeemGiftCheckQuantity(true);
      }
    }
  }
  const { fields, append, remove } = useFieldArray({
    control,
    name: "gift",
    rules: { required: true },
  });

  const inputFile = useRef(null);

  function getCsv() {
    excelService.getCsv(4);
  }

  // Dialog Point
  const [redeemGift, setRedeemGift] = useState<boolean>(true);
  const [redeemGiftCheckQuantity, setredeemGiftCheckQuantity] =
    useState<boolean>(true);
  const [customerChoose, setCustomerChoose] = useState<any>();
  const [customerId, setcustomerId] = useState("");
  const [customerPhoneDetail, setcustomerPhoneDetail] = useState("");

  function changeCustomer(id) {
    const customerDetail = customer.find((cus) => cus.customerId == id);
    if (!customerDetail) return;
    setCustomerChoose(customerDetail);
    if (customerDetail.point > dataDetail.point) {
      setRedeemGift(false);
    } else {
      setRedeemGift(true);
    }
  }
  const [openPoint, setOpenPoint] = useState(false);

  const handleClickOpenDIalogPoint = (val) => {
    const customerConvert = customer.map((v) => ({
      ...v,
      label: v.customerName,
    }));
    setCustomer(customerConvert);
    setDataDetail(val);
    setOpenPoint(true);
  };

  async function importExcel(e) {
    try {
      remove();

      const responseImport = await excelService.importExcel(
        e,
        GIFT + "/" + IMPORT
      );

      const convertData = responseImport
        // .filter((val) => val.Success)
        .map((val) => {
          return {
            ...val,
          };
        });
      inputFile.current.value = "";
      handleOpen();
      convertData.forEach((val) => {
        append({
          ...val,
          StartDate: dayjs(new Date(val.StartDate)).format("YYYY-MM-DD"),
          EndDate: dayjs(new Date(val.EndDate)).format("YYYY-MM-DD"),
        });
      });
      setDataImport(convertData);
    } catch (error) {
      inputFile.current.value = "";

      alertService.alert({
        content: "Đã có lỗi xảy ra",
      });
    }
  }

  async function submitCsv() {
    const listImportImg = [];
    let valueToSubmit = [];
    getValues().gift.map(async (data, index) => {
      if (data?.UrlImage && data?.UrlImage["0"]?.name) {
        const formData = new FormData();

        const img = data.UrlImage[0];
        formData.append(
          "files",
          new Blob([img], { type: "image/png" }),
          img.name
        );
        listImportImg.push(fileService.postFile(formData));
      } else {
        listImportImg.push("");
      }
    });
    await axios.all(listImportImg).then((val) => {
      valueToSubmit = getValues().gift.map((v, index) => {
        let urlImage = val[index];
        if (typeof v.UrlImage != "object") {
          if (val[index]?.includes(URL_IMG)) {
            urlImage = v.UrlImage;
          } else {
            urlImage = v.UrlImage;
          }
        }
        return {
          giftName: v.GiftName,
          description: v.Description,
          startDate: v.StartDate,
          endDate: v.EndDate,
          point: v.Point,
          quantity: v.Quantity,
          urlImage,
        };
      });
    });
    await fetchWrapper.post(
      config.apiUrl + GIFT + "/" + SAVEBATCH,
      valueToSubmit
    );
    await closeModelImport();
    await fetAllData(1);
  }
  const handleCloseImport = () => setOpenImport(false);

  function closeModelImport() {
    handleCloseImport();
    setDataImport([]);
    inputFile.current.value = "";
  }
  const [selectedValue, setSelectedValue] = useState("");

  const handleClose = (value: string) => {
    setOpenImport(false);
    setOpenPoint(false);
    setSelectedValue(value);
    setRedeemGift(true);
    setCustomerChoose({});
    setcustomerId("");
    setcustomerPhoneDetail("");
  };
  function onSelectFile(e, index) {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    let reader = new FileReader();
    let base64String;
    reader.onload = function () {
      base64String = reader.result;
      const currentDataImport = JSON.parse(JSON.stringify(getValues().gift));
      currentDataImport[index].UrlImage = base64String;
      setDataImport(currentDataImport);
    };
    reader.readAsDataURL(e.target.files[0]);
  }

  // End Model
  const savedata = () => {
    let dataPost = {
      giftId: dataDetail.id,
      note: noteInput.current.value,
      customerId: customerChoose?.customerId,
      quantity: Number(getValues().quantity),
    };
    const process = fetchWrapper.post(config.apiUrl + POINT_HISTORY, dataPost);

    process
      .then((val) => {
        if (val.success) {
          alertService.alert({
            content: `Đổi thành công món quà ${val.data.gift.giftName} cho khách hàng ${val.data.customer.customerName}`,
          });
          fetAllData();
        } else {
          alertService.alert({
            content: val.message,
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
    handleClose(undefined);
  };
  const [openImportDIalog, setOpenImport] = useState(false);

  const listImportBook = () => {
    return (
      <TableContainer sx={{ maxHeight: 440 }} component={Paper}>
        <Table stickyHeader sx={{ minWidth: 440 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Tên quà tặng (*)</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell align="left">Điểm</TableCell>
              <TableCell align="left">Số lượng</TableCell>
              <TableCell align="left">Ngày bắt đầu</TableCell>
              <TableCell align="left">Ngày kết thúc</TableCell>
              <TableCell align="left">Mô tả</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataImport.map((row: any, index) => (
              <TableRow
                key={"n" + index}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell align="left">
                  <input
                    className={
                      errors.gift && errors.gift[index]
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    type="text"
                    {...register(`gift.${index}.GiftName`, {
                      required: true,
                    })}
                  />
                  <div className="absolute text-danger mt-2">
                    {dataImport[index]?.Error}
                  </div>
                </TableCell>
                <TableCell align="left">
                  <div className="flex flex-column items-center gap-2">
                    <label
                      htmlFor={"imageUpload" + index}
                      className="block h-20 w-20 bg-slate-50 bg-contain bg-no-repeat bg-center"
                      style={{
                        backgroundImage: "url(" + row?.UrlImage + ")",
                      }}
                    >
                      <input
                        type="file"
                        accept="image/png, image/jpeg"
                        id={"imageUpload" + index}
                        className="hidden"
                        {...register(`gift.${index}.UrlImage`, {
                          onChange: (e) => {
                            onSelectFile(e, index);
                          },
                        })}
                      />
                    </label>
                  </div>
                </TableCell>
                <TableCell align="left">
                  <input
                    className="form-control"
                    type="number"
                    min={0}
                    {...register(`gift.${index}.Point`)}
                  />
                </TableCell>
                <TableCell align="left">
                  <input
                    className="form-control"
                    type="number"
                    {...register(`gift.${index}.Quantity`)}
                  />
                </TableCell>

                <TableCell align="left">
                  <input
                    className="form-control"
                    type="date"
                    {...register(`gift.${index}.StartDate`)}
                  />
                </TableCell>
                <TableCell align="left">
                  <input
                    className="form-control"
                    type="date"
                    {...register(`gift.${index}.EndDate`)}
                  />
                </TableCell>

                <TableCell align="left">
                  <textarea
                    className="form-control min-h-30 max-h-50"
                    {...register(`gift.${index}.Description`)}
                  ></textarea>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  function DialogUptoPoint(props: any) {
    return (
      <div className="p-6">
        <h2 className="mb-4">Đổi quà</h2>
        <div
          // onSubmit={handleSubmit()}
          className="d-flex flex-column gap-2 col-6 mx-auto"
        >
          <b>Khách hàng: </b>
          <FormControl fullWidth>
            <Autocomplete
              disablePortal
              options={customer}
              defaultValue={customerId}
              sx={{ width: 300 }}
              onChange={handleOnSearch}
              renderInput={(params) => (
                <TextField {...params} label="Khách hàng" />
              )}
            />
          </FormControl>
          {redeemGift && customerChoose?.customerId ? (
            <div className="text-danger mt-2">
              Số điểm của Tài khoản này không đủ
            </div>
          ) : (
            <></>
          )}
          <b>Số điện thoại: </b>
          <FormControl fullWidth>
            <Autocomplete
              disablePortal
              options={customerPhone}
              defaultValue={customerPhoneDetail}
              sx={{ width: 300 }}
              onChange={handleOnSearchPhone}
              renderInput={(params) => (
                <TextField {...params} label="Số điện thoại" />
              )}
            />
          </FormControl>

          <div>
            <label htmlFor="vd">
              <b>Số lượng:</b>
            </label>
            <input
              id="vd"
              type="number"
              min={1}
              max={dataDetail?.quantity}
              className="form-control"
              onChange={checkAmount}
              defaultValue={quantityRefValue}
              ref={quantityRef}
              {...register("quantity")}
            />
            {/* {!redeemGiftCheckQuantity && quantityRef?.current?.value > 0 ? (
              <div className="text-danger mt-2">
                Số lượng không phù hợp, số lượng còn lại của món quà này:
                {dataDetail?.quantity}
              </div>
            ) : (
              <></>
            )} */}
          </div>

          <div className="col-start-2 col-span-2">
            <label htmlFor="note">
              <b>Note: </b>
            </label>
            <textarea
              defaultValue=""
              id="note"
              ref={noteInput}
              className="form-control min-h-30 max-h-50"
            ></textarea>
            <button
              onClick={savedata}
              disabled={redeemGift}
              className="btn btn-success mt-12"
            >
              Đổi quà
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="px-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="title">Quản lý quà tặng</h1>
        {user.role == Role.Store ? (
          <div className="d-flex gap-2">
            <button
              className="bg-info text-white rounded-lg px-3 py-0.5"
              onClick={() => getCsv()}
            >
              Tải xuống file mẫu
            </button>
            <label
              htmlFor="import-excel"
              className="bg-info text-white rounded-lg px-3 py-0.5"
            >
              Nhập excel
            </label>
            <input
              id="import-excel"
              ref={inputFile}
              type="file"
              accept=".zip"
              className="d-none"
              onChange={(event) => importExcel(event)}
            />
            <Link to="create">
              <button className="bg-black text-white rounded-lg px-3 py-0.5">
                Tạo quà tặng
              </button>
            </Link>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="grid grid-cols-5 gap-4">
        {data.list.map((val) => (
          <div
            key={val.id}
            className={`${listStyle["book-detail"]} position-relative`}
          >
            <Link to={"update/" + val.id}>
              <div
                className="h-40 bg-cover bg-no-repeat bg-center"
                style={{
                  backgroundImage: `url(${
                    val.urlImage ? val.urlImage : AVATARDEFAULT
                  })`,
                }}
              ></div>
            </Link>
            <div
              onClick={() => {
                deleteItem(val);
              }}
              className={`${listStyle["trash-box"]} position-absolute top-0 right-0 bg-slate-400 rounded px-2 py-1 opacity-50 hover:!opacity-100`}
            >
              <Trash />
            </div>

            <Link to={"update/" + val.id}>
              <div className="mt-1 text-dark">
                <h6 className="mb-0 line-clamp-1">{val.giftName}</h6>
                <div>Điểm: {val.point}</div>
                <div>Số lượng: {val.quantity}</div>
              </div>
            </Link>
            <div className="text-center pt-2">
              <button
                className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none rounded-lg border border-gray-200 hover:bg-gray-600 hover:text-white focus:z-10"
                onClick={(event: any) => {
                  handleClickOpenDIalogPoint(val);
                }}
              >
                Đổi quà
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2">
        {data.totalPage ? (
          <div className="flex justify-center">
            <span>
              <Pagination
                count={data.totalPage}
                onChange={(_, pageNumber) => fetAllData(pageNumber)}
              />
            </span>
          </div>
        ) : (
          <></>
        )}
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
        open={openImportDIalog}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="p-6">
          <Box sx={ModelStyle}>
            <div className="max-h-50vh overflow-auto">{listImportBook()}</div>
            <button
              onClick={submitCsv}
              type="button"
              className="mt-4 float-right text-white bg-green-700  rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
            >
              Lưu
            </button>
          </Box>
        </div>
      </Modal>
    </div>
  );
}
