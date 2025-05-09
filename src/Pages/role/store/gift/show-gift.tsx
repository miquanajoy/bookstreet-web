import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Controller, useFieldArray, useForm } from "react-hook-form";

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
} from "../../../../_services/search.service";
import { SearchIcon } from "../../../../assets/icon/search";
import { ClearIcon } from "@mui/x-date-pickers";

export default function ShowGift() {
  const { pathname } = useLocation();
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const noteInput = useRef(null);
  const quantityRef = useRef(null);

  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setValue,
  } = useForm();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null); 
  const [data, setData] = useState({
    list: [],
    totalPage: 0,
  });
  const [dataDetail, setDataDetail] = useState<any>();
  const [customer, setCustomer] = useState<any>([]);
  const [isFormOtp, setisFormOtp] = useState<any>(false);
  const [quantityRefValue, setQuantityRefValue] = useState<any>(1);

  async function deleteItem(val) {
    await fetchWrapper.delete(config.apiUrl + GIFT + "/" + val.id, fetAllData);
  }

  async function fetAllData(pageNumber = 1) {
    const customers = await fetchWrapper.Post2GetByPaginate(
      config.apiUrl + CUSTOMER,
      -1,
      undefined,
      -1
    );
    setCustomer(
      customers.list.map((v) => ({
        ...v,
        label: v.customerName,
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
      }));

      setData(res);
    });
  }

  useEffect(() => {
    fetAllData();
  }, [pathname]);

 
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

  const [dataImport, setDataImport] = useState([]);

  const handleOpen = () => setOpenImport(true);
  function checkAmount() {
   
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

  const [exchangeGift, setExchangeGift] = useState<any>();

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
          startDate: dayjs(new Date(val.startDate)).format("YYYY-MM-DD"),
          EndDate: dayjs(new Date(val.EndDate)).format("YYYY-MM-DD"),
        });
      });
      console.log('convertData :>> ', convertData);
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
      console.log("val :>> ", val);
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
          startDate: v.startDate,
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
    setisFormOtp(false)
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

  const savedata = () => {
    let dataPost = {
      giftId: dataDetail.id,
     
      emailOrUsername: selectedCustomer.email,
      quantity: Number(getValues().quantity),
    };
    const process = fetchWrapper.post(
      config.apiUrl + "Store/exchange-gift",
      dataPost
    );

    process
      .then((val) => {
        if (val.success) {
          alertService.alert({
            content: val.message,
          });
          setisFormOtp(true)
          setExchangeGift(val.data)

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
                      className="block h-20 w-20 bg-slate-200 bg-contain bg-no-repeat bg-center"
                      style={{
                        backgroundImage: "url(" + URL_IMG + row?.UrlImage + ")",
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
                    {...register(`gift.${index}.startDate`)}
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
        <h2 className="mb-4 text-center">Đổi quà</h2>
        <div
         
          className="d-flex flex-column gap-2 col-6 mx-auto"
        >
          <div className="relative flex-grow">
            <Autocomplete
              options={customer}
              getOptionLabel={(option) => option.email || ""}
              value={selectedCustomer}
              onChange={(event, newValue) => {
                setSelectedCustomer(newValue);
              }}
              isOptionEqualToValue={(option, value) =>
                option.customerId === value.customerId
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tìm kiếm khách hàng (theo email)"
                  variant="outlined"
                  fullWidth 
                />
              )}
            />
          </div>
          

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
          </div>

          <div className="col-start-2 col-span-2">
            <button onClick={savedata} className="btn btn-success mt-12 w-full">
              Đổi quà
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const [customerCode, setCustomerCode] = useState();

  const handleInputChange = (event) => {
    setCustomerCode(event.target.value);
  };

  const handleConfirm = async () => {
    const response = await fetchWrapper.post(
      config.apiUrl + "Store/exchange-gift/verify-otp",
      
      {
        ...exchangeGift,
        "otp": customerCode,
      }
    );
    if (response.success) {
      handleClose(undefined);
      alertService.alert({
        content: "Đã hoàn tất đơn hàng",
      });
      fetAllData()
    } else {
      alertService.alert({
        content: response.message,
      });
    }
  };
  function FormOTP(props: any) {
    return (
      <div>
      <button
        onClick={() =>{handleClose(undefined)}}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-semibold"
        aria-label="Đóng"
      >
        ×
      </button>

      <h2 className="text-center text-xl font-light text-gray-700 mb-4 tracking-wider">
        Nhập mã nhận sách
      </h2>

      <input
        type="text"
        value={customerCode}
        onChange={handleInputChange}
        placeholder="Nhập mã nhận quà tại đây"
        className="w-64 mx-auto d-block px-4 py-2 border border-gray-400 rounded-md mb-3 text-center text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
      />

      <div className="w-full d-flex justify-center gap-4">
        <button
          disabled={!customerCode}
          onClick={handleConfirm}
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
  return (
    <div className="m-n2">
      <div className="flex items-center justify-between mb-2 bg-slate-200 pb-3">
        {user.role == Role.GiftStore ? (
          <div className="d-flex justify-end gap-2 w-full bg-white px-6 py-3">
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
              <button className="bg-info text-white rounded-lg px-3 py-0.5">
                Tạo quà tặng
              </button>
            </Link>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="grid grid-cols-5 gap-4 px-6 py-2">
        {data.list.map((val) => (
          <div
            key={val.id}
            className={`${listStyle["book-detail"]} position-relative`}
          >
            <Link to={"update/" + val.id}>
              <div
                className="h-40 bg-contain bg-no-repeat bg-center"
                style={{
                  backgroundImage: `url(${
                    val.urlImage ? val.urlImage : AVATARDEFAULT
                  })`,
                }}
              ></div>
            </Link>
            {/* <div
              onClick={() => {
                deleteItem(val);
              }}
              className={`${listStyle["trash-box"]} position-absolute top-0 right-0 bg-slate-400 rounded px-2 py-1 opacity-50 hover:!opacity-100`}
            >
              <Trash />
            </div> */}

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
      <div className="mt-2 p-2">
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
        className="z-1"
      >
        <Box sx={{ ...ModelStyle, width: "50%" }}>
          {isFormOtp ? <FormOTP /> :  <DialogUptoPoint
            selectedValue={selectedValue}
            open={openPoint}
            onClose={handleClose}
          />}
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
              Nhập
            </button>
          </Box>
        </div>
      </Modal>
    </div>
  );
}
