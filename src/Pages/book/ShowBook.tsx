import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Trash } from "../../assets/icon/trash";
import listStyle from "../../styles/listStyle.module.scss";
import { alertService } from "../../_services/alert.service";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import Pagination from "@mui/material/Pagination";
import {
  AVATARDEFAULT,
  IMPORT,
  PRODUCT,
  ROUTER,
  SAVEBATCH,
  STORE,
} from "../../_helpers/const/const";
import { excelService, TYPE_BOOK } from "../../_services/excel.service";
import { useFieldArray, useForm } from "react-hook-form";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Role, Roles } from "../../models/Role";
import { fileService } from "../../_services/file.service";
import dayjs from "dayjs";
import { URL_IMG } from "../../_helpers/const/csv.const";
import { searchService, typeSearch } from "../../_services/search.service";
import DialogDetailComponent, {
  dialogDetailService,
} from "./dialog-detail.component";
import { Dialog, DialogContent } from "@mui/material";
import axios from "axios";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

export default function ShowBook() {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const { pathname } = useLocation();
  const isBookScreen = pathname == ROUTER.book.url;

  const [data, setData] = useState({
    list: [],
    totalPage: 0,
  });

  const [selectedStore, setSelectedStore] = useState("all"); // State để lưu cửa hàng được chọn
  const [stores, setStores] = useState([]); // Danh sách cửa hàng từ API

  const {
    control,
    register,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const formatCurrency = (value: number | string) => {
    if (!value && value !== 0) return "";
    return Number(value).toLocaleString("vi-VN");
  };

  async function fetAllStore() {
    const result = fetchWrapper.Post2GetByPaginate(
      config.apiUrl + STORE,
      -1,
      {
        filters: [],
      },
      -1
    );
    result.then((res) => {
      const uniqueStores = res.list.map((val) => ({
        storeId: val.storeId,
        storeName: val.storeName,
      }));
      setStores(uniqueStores);
    });
    return result;
  }

  async function deleteItem(val) {
    await fetchWrapper.delete(
      config.apiUrl + "Product/" + val.productId,
      fetAllData
    );
  }

  async function fetAllData(pageNumber = 1) {
    getDataByPaginator(pageNumber);
  }

  async function getDataByPaginator(pageNumber = 1) {
    const filter = {
      filters: [
        {
          field: "productTypeId",
          value: "1",
          operand: 0,
        },
      ],
    };
    // Thêm bộ lọc productName nếu có giá trị tìm kiếm
    if (searchService.$SearchValue.value?.dataSearch) {
      filter.filters.push({
        field: "productName",
        value: searchService.$SearchValue.value.dataSearch,
        operand: typeSearch,
      });
    }
    // Thêm bộ lọc storeId nếu không chọn "Tất cả"
    if (selectedStore !== "all") {
      filter.filters.push({
        field: "storeId",
        value: selectedStore + "",
        operand: 0,
      });
    }
    const result = fetchWrapper.Post2GetByPaginate(
      config.apiUrl + PRODUCT,
      pageNumber,
      filter
    );
    result.then((res: any) => {
      res.list = res.list.map((v) => ({
        ...v,
        authors: v?.book?.authors?.join(", "),
      }));
      setData(res);
    });
  }

  // Gọi API khi thay đổi pathname
  useEffect(() => {
    fetAllData();
    fetAllStore();
  }, [pathname]);

  // Gọi API khi tìm kiếm
  useEffect(() => {
    const searchSub = searchService.$SearchValue.subscribe({
      next: (v) => {
        if (v?.isClickSearch) {
          getDataByPaginator(1);
        }
      },
    });
    return () => searchSub.unsubscribe();
  }, []);

  // Gọi API khi thay đổi cửa hàng
  useEffect(() => {
    getDataByPaginator(1);
  }, [selectedStore]);

  // Xử lý khi chọn cửa hàng từ dropdown
  const handleStoreChange = (event) => {
    setSelectedStore(event.target.value);
  };

  // Model
  const [dataImport, setDataImport] = useState([]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "author",
    rules: { required: true },
  });

  const handleClickOpenDetail = (v) => {
    dialogDetailService.showDialog(v);
  };

  const inputFile = useRef(null);

  function getCsv(type) {
    excelService.getCsv(type);
  }

  async function importExcel(e) {
    try {
      remove();

      const responseImport = await excelService.importExcel(
        e,
        PRODUCT + "/" + IMPORT + "?type=" + (isBookScreen ? 1 : 2)
      );

      const convertData = responseImport.map((val) => {
        if (isBookScreen) {
          val.AuthorName = val.AuthorName[0];
        }
        const UrlImage =
          val.UrlImage && val.UrlImage != "anh_mau.jpg"
            ? URL_IMG + val.UrlImage
            : undefined;
        return { ...val, UrlImage };
      });
      inputFile.current.value = "";

      if (convertData.length) {
        handleOpen();
        convertData.forEach((val) => {
          if (isBookScreen) {
            val.PublicDay =
              val.PublicDay != "Invalid Date" && val.PublicDay
                ? dayjs(new Date(val.PublicDay)).format("YYYY-MM-DD")
                : dayjs(new Date()).format("YYYY-MM-DD");
          }
          append(val);
        });
        setDataImport(convertData);
      }
    } catch (error) {
      inputFile.current.value = "";
      console.log(error);
      alertService.alert({
        content: error.message,
      });
    }
  }

  async function submitCsv() {
    const listImportImg = [];
    let valueToSubmit = [];
    getValues().author.map(async (data, index) => {
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
      valueToSubmit = getValues().author.map((v, index) => {
        let urlImage = val[index];
        if (typeof v.UrlImage != "object") {
          if (val[index]?.includes(URL_IMG)) {
            urlImage = v.UrlImage;
          } else {
            urlImage = v.UrlImage;
          }
        }

        const postData = {
          ...v,
          // AuthorName: v.AuthorName?.length ? v.AuthorName.split(", ")  : "",
          AuthorName: Array.isArray(v.AuthorName) ? v.AuthorName : v.AuthorName.split(", "),
          urlImage,
          Price: Number(v.Price),
          OriginalPrice: Number(v.OriginalPrice),
          DiscountPercentage: Number(v.DiscountPercentage),
        };
        if (!isBookScreen) {
          delete postData.book;
        }
        return postData;
      });
    });
    valueToSubmit.forEach(v => {
      v.ProductTypeId = "1"
    })
    const resp = await fetchWrapper.post(
      config.apiUrl + PRODUCT + "/" + SAVEBATCH,
      valueToSubmit
    );

    if (resp.success) {
      alertService.alert({
        content: `${resp.data.successCount} Bản ghi tạo thành công`,
      });

      // Map resp.data.results theo định dạng responseImport
      const updatedDataImport = resp.data.results.map((result, index) => {
        const data = result.data;
        return {
          ISBN: data?.isbn,
          ProductName: data.productName,
          Quantity: data.quantity,
          Price: data.price,
          OriginalPrice: data.originalPrice,
          DiscountPercentage: data.discountPercentage,
          CategoryName: data.categoryName,
          GenreName: data.genreName,
          AuthorName: data.authorName,
          DistributorName: data.distributorName,
          PublisherName: data.publisherName,
          PublicDay: data.publicDay,
          Description: data.description,
          UrlImage: data.urlImage,
          SortOrder: index + 1,
          Error: result.message,
          ProductTypeId: "1",
          Success: result.success,
        };
      });

      // Cập nhật dataImport để hiển thị trong modal
      reset();
      setDataImport(updatedDataImport);
      updatedDataImport.forEach((val, index) => {
      setValue(`author.${index}.UrlImage`, val.UrlImage);

      //   if (isBookScreen) {
      //     val.PublicDay =
      //       val.PublicDay != "Invalid Date" && val.PublicDay
      //         ? dayjs(new Date(val.PublicDay)).format("YYYY-MM-DD")
      //         : dayjs(new Date()).format("YYYY-MM-DD");
      //   }
      //   setValue(`author.${index}`, val);
      });

      // Không đóng modal nếu có bản ghi thất bại
      if (resp.data.failCount > 0) {
        return; // Giữ modal mở
      }

      // Đóng modal và reset nếu tất cả thành công
      if (resp.data.successCount > 0) {
        closeModelImport();
      }
    } else {
      // Xử lý lỗi tổng thể
      alertService.alert({
        content: resp.message,
      });
    }

    await fetAllData(1);
  }

  function closeModelImport() {
    handleClose();
    setDataImport([]);
    inputFile.current.value = "";
  }

  function onSelectFile(e, index) {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    let reader = new FileReader();
    let base64String;
    reader.onload = function () {
      base64String = reader.result;
      const currentDataImport = JSON.parse(JSON.stringify(getValues().author));
      currentDataImport[index].UrlImage = base64String;
      setDataImport(currentDataImport);
    };
    reader.readAsDataURL(e.target.files[0]);
  }

  // Template role store
  function templateRoleStore(link, template) {
    if (user.role == Role.Store) {
      return <Link to={link}>{template}</Link>;
    } else {
      return template;
    }
  }

  const listImportBook = () => {
    return (
      <TableContainer sx={{ minWidth: 1800 }} className="import-book">
        <Table stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{}}>ISBN</TableCell>
              <TableCell sx={{}}> Tên sách (*)</TableCell>
              <TableCell sx={{ width: 100 }} align="left">
                Hình ảnh
              </TableCell>
              <TableCell sx={{}} align="left">
                Số lượng
              </TableCell>
              <TableCell sx={{}} align="left">
                Giá bán
              </TableCell>
              <TableCell sx={{}} align="left">
                Giá gốc
              </TableCell>
              <TableCell sx={{}} align="left">
                Giảm giá (%)
              </TableCell>
              {isBookScreen ? (
                <TableCell sx={{}} align="left">
                  Danh mục
                </TableCell>
              ) : (
                <></>
              )}
              <TableCell sx={{}} align="left">
                Thể loại
              </TableCell>
              <TableCell sx={{}} align="left">
                Tác giả
              </TableCell>
              <TableCell sx={{}} align="left">
                Nhà cung cấp
              </TableCell>
              <TableCell sx={{}} align="left">
                Nhà xuất bản
              </TableCell>
              {isBookScreen ? (
                <TableCell align="left" sx={{}}>
                  Ngày xuất bản
                </TableCell>
              ) : (
                <></>
              )}
              <TableCell align="left" sx={{}}>
                Mô tả
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataImport.map((row, index) => (
              <TableRow
                key={"n" + index}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell align="left">
                  <input
                    className={
                      errors.author && errors.author[index]
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    type="text"
                    {...register(`author.${index}.ISBN`, {
                      required: true,
                      onChange: (e) => {
                        const value = e.target.value;
                        if (value.length > 20) {
                          setValue(`author.${index}.ISBN`, value.slice(0, 20)); // Cắt chuỗi về 20 ký tự
                        }
                      },
                    })}
                  />
                </TableCell>
                <TableCell align="left">
                  <input
                    className={
                      errors.author && errors.author[index]
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    type="text"
                    {...register(`author.${index}.ProductName`, {
                      required: true,
                    })}
                  />
                  <div className="line-clamp-2 text-danger mt-2">
                    {dataImport[index]?.Error || dataImport[index]?.message}
                  </div>
                </TableCell>
                <TableCell align="left">
                  <div className="flex flex-column items-center gap-2">
                    <label
                      htmlFor={"imageUpload" + index}
                      className="block h-12 w-12 bg-slate-200 bg-contain bg-no-repeat bg-center cursor-pointer"
                      style={{
                        backgroundImage: "url(" + row?.UrlImage + ")",
                      }}
                    >
                      <input
                        type="file"
                        accept="image/png, image/jpeg"
                        id={"imageUpload" + index}
                        className="hidden"
                        {...register(`author.${index}.UrlImage`, {
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
                    {...register(`author.${index}.Quantity`)}
                  />
                </TableCell>
                <TableCell align="left">
                  <input
                    className="form-control"
                    type="number"
                    min={0}
                    {...register(`author.${index}.Price`)}
                    disabled
                  />
                </TableCell>
                <TableCell align="left">
                  <input
                    className="form-control"
                    type="number"
                    {...register(`author.${index}.OriginalPrice`, { min: 0 })}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value < 0) {
                        setValue(`author.${index}.OriginalPrice`, 0);
                      } else {
                        setValue(`author.${index}.OriginalPrice`, value);
                      }
                      // Recalculate price
                      const discount = getValues().author[index].DiscountPercentage ?? 0;
                      const calculatedPrice = value * (1 - discount / 100);
                      setValue(`author.${index}.Price`, Math.ceil(calculatedPrice));
                    }}
                  />
                </TableCell>
                <TableCell align="left">
                  <input
                    className="form-control"
                    type="number"
                    {...register(`author.${index}.DiscountPercentage`, { max: 100 })}
                    onChange={(e) => {
                      let value = Number(e.target.value);
                      if (value > 100) {
                        value = 100;
                        setValue(`author.${index}.DiscountPercentage`, 100);
                      } else if (value < 0) {
                         value = 0;
                        setValue(`author.${index}.DiscountPercentage`, 0);
                      } else {
                         setValue(`author.${index}.DiscountPercentage`, value);
                      }
                      // Recalculate price
                      const original = getValues().author[index].OriginalPrice ?? 0;
                      const calculatedPrice = original * (1 - value / 100);
                      setValue(`author.${index}.Price`, Math.ceil(calculatedPrice));
                    }}
                  />
                </TableCell>
                <TableCell align="left">
                  <input
                    className="form-control"
                    type="text"
                    {...register(`author.${index}.CategoryName`)}
                  />
                </TableCell>
                {isBookScreen ? (
                  <TableCell align="left">
                    <input
                      className="form-control"
                      type="text"
                      {...register(`author.${index}.GenreName`)}
                    />
                  </TableCell>
                ) : (
                  <></>
                )}
                <TableCell align="left">
                  <input
                    className="form-control h-12"
                    type="text"
                    {...register(`author.${index}.AuthorName`)}
                  />
                </TableCell>
                <TableCell align="left">
                  <input
                    className="form-control"
                    type="text"
                    {...register(`author.${index}.DistributorName`)}
                  />
                </TableCell>
                <TableCell align="left">
                  <input
                    className="form-control"
                    type="text"
                    {...register(`author.${index}.PublisherName`)}
                  />
                </TableCell>
                {isBookScreen ? (
                  <TableCell align="left">
                    <input
                      className="form-control"
                      type="date"
                      {...register(`author.${index}.PublicDay`)}
                    />
                  </TableCell>
                ) : (
                  <></>
                )}
                <TableCell align="left">
                  <textarea
                    className="form-control"
                    rows={4}
                    {...register(`author.${index}.Description`)}
                  ></textarea>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div className="m-n2">
      <div className="flex items-center justify-between mb-2 bg-slate-200 pb-3">
        {user.role == Role.Store ? (
          <div className="d-flex justify-end gap-2 w-full bg-white px-6 py-3">
            <button
              className="bg-info text-white rounded-lg px-3 py-0.5"
              onClick={() => getCsv(isBookScreen ? 1 : 2)}
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
            {templateRoleStore(
              "create",
              <button className="bg-info text-white rounded-lg px-3 py-0.5">
                Tạo sách
              </button>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
      {user.role == Role.Manager ? (
        <div className="px-6 mb-4">
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="store-filter-label">Lọc theo cửa hàng</InputLabel>
            <Select
              labelId="store-filter-label"
              id="store-filter"
              value={selectedStore}
              label="Lọc theo cửa hàng"
              onChange={handleStoreChange}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              {stores.map((store) => (
                <MenuItem key={store.storeId} value={store.storeId}>
                  {store.storeName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      ) : (
        <></>
      )}

      <div className="grid grid-cols-5 gap-4 px-6">
        {data.list.map((val) => (
          <div
            key={val.productId}
            className={`${listStyle["book-detail"]} position-relative`}
          >
            {templateRoleStore(
              "update/" + val.productId,
              <div
                className="h-60 bg-contain bg-no-repeat bg-center"
                style={{
                  backgroundImage: `url(${
                    val.urlImage ? val.urlImage : AVATARDEFAULT
                  })`,
                }}
              ></div>
            )}
            <button
              onClick={() => {
                handleClickOpenDetail(val);
              }}
              className={`${listStyle["info-icon"]} position-absolute top-0 left-0 bg-slate-400 rounded p-3 opacity-50 cursor-pointer`}
            ></button>
            {user.role == Role.Store ? (
              <div
                onClick={(_: any) => {
                  deleteItem(val);
                }}
                className={`${listStyle["trash-box"]} position-absolute top-0 right-0 bg-slate-400 rounded px-2 py-1`}
              >
                <Trash />
              </div>
            ) : (
              <></>
            )}
            {templateRoleStore(
              "update/" + val.productId,
              <div className="mt-1 text-dark">
                <h6 className="mb-0 line-clamp-2">{val.productName}</h6>
                {val.price ? <div>Giá: {formatCurrency(val.price)} vnđ</div> : null}
                {isBookScreen ? (
                  <div>
                    {val?.authors ? (
                      <div className="box-author">Tác giả: {val?.authors}</div>
                    ) : (
                      <></>
                    )}
                    {user.role == Roles[0] ? (
                      <div>Được bán tại: {val.storeName}</div>
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            )}
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
      <Dialog
        maxWidth="xl"
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="mx-[-10px]">
          <DialogContent className="relative">
            <div className="max-h-90vh overflow-auto">{listImportBook()}</div>
            <button
              onClick={submitCsv}
              type="button"
              className="sticky bottom-0 mt-4 text-white bg-green-700 rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
            >
              Nhập
            </button>
            <button
              onClick={closeModelImport}
              type="button"
              className="sticky bottom-0 mt-4 text-white bg-red-700 rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
            >
              Đóng
            </button>
          </DialogContent>
        </div>
      </Dialog>
      <DialogDetailComponent />
    </div>
  );
}