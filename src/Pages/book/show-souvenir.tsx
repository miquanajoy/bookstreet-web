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
} from "../../_helpers/const/const";
import { accountService } from "../../_services/account.service";
import { excelService, TYPE_BOOK } from "../../_services/excel.service";
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
import { ModelStyle } from "../../_helpers/const/model.const";
import { Role, Roles } from "../../models/Role";
import { CATEGORY } from "../../models/category";
import { fileService } from "../../_services/file.service";
import axios from "axios";
import { MenuItem, Select } from "@mui/material";
import dayjs from "dayjs";
import { URL_IMG } from "../../_helpers/const/csv.const";
import { searchService, typeSearch } from "../../_services/home/search.service";
import DialogDetailComponent, { dialogDetailService } from "./dialog-detail.component";

export default function ShowSouvenir() {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const { pathname } = useLocation();
  const isBookScreen = pathname == ROUTER.book.url;

  const [data, setData] = useState({
    list: [],
    totalPage: 0,
  });

  const {
    control,
    register,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

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
          value: isBookScreen ? "1" : "2",
          operand: 0,
        },
      ],
    };
    filter.filters.push({
      field: "productName",
      value: searchService.$SearchValue.value?.dataSearch,
      operand: typeSearch,
    });
    const result = fetchWrapper.Post2GetByPaginate(
      config.apiUrl + PRODUCT,
      pageNumber,
      filter
    );
    result.then((res: any) => {
      res.list = res.list.map((v) => ({
        ...v,
        authors: v?.book?.authors.join(", "),
      }));

      setData(res);
    });
  }

  // Search area
  useEffect(() => {
    fetAllData();
  }, [pathname]);

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
  // End Search area

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

      const convertData = responseImport
        // .filter((val) => val.Success)
        .map((val) => {
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
    } catch (error) {
      inputFile.current.value = "";

      alertService.alert({
        content: "Không thể import",
      });
    }
  }

  async function submitCsv() {
    // const formData = new FormData();
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
    await fetchWrapper.AxiosAll(listImportImg).then((val) => {
      valueToSubmit = getValues().author.map((v, index) => {
        let urlImage = val[index];
        if (typeof v.UrlImage != "object") {
          if (val[index]?.includes(URL_IMG)) {
            urlImage = v.UrlImage;
          } else {
            urlImage = v.UrlImage;
          }
        }

        const book = {
          categoryName: v.CategoryName,
          distributorName: v.DistributorName,
          publisherName: v.PublisherName,
          genreName: v.GenreName,
          publicDay: v.PublicDay,
          authors: [v.AuthorName],
        };
        const postData = {
          book,
          categoryId: v.CategoryId,
          productTypeId: isBookScreen ? 1 : 2,
          productTypeName: v.ProductTypeName,
          publicDay: v.PublicDay,
          productName: v.ProductName,
          description: v.Description,
          price: v.Price,
          status: 1,
          AuthorName: [v.AuthorName],
          categoryName: v.CategoryName,
          distributorName: v.DistributorName,
          publisherName: v.PublisherName,
          genreName: v.GenreName,
          authors: [v.AuthorName],

          urlImage,
        };
        if (!isBookScreen) {
          delete postData.book;
        }
        return postData;
      });
    });
    const resp = await fetchWrapper.post(
      config.apiUrl + PRODUCT + "/" + SAVEBATCH,
      valueToSubmit
    );
    if (resp.success) {
      alertService.alert({
        content: `${resp.data.successCount} Bản ghi tạo thành công`,
      });
      if (!resp.data.successCount) {
        for (let index = 0; index < resp.data.results.length; index++) {
          const val = resp.data.results[index];
          if (val.message) {
            alertService.alert({
              content: val.message,
            });
            return;
          }
        }
      } else {
        closeModelImport();
      }
    }
    if (!resp.success || resp.success == 400) {
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

  const listImportBook = () => {
    return (
      <TableContainer sx={{ maxHeight: 440 }} component={Paper}>
        <Table stickyHeader sx={{ minWidth: 440 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell> Tên sách (*)</TableCell>
              <TableCell align="left">Hình ảnh</TableCell>
              <TableCell align="left">Giá tiền</TableCell>
              {isBookScreen ? (
                <TableCell align="left">Danh mục</TableCell>
              ) : (
                <></>
              )}
              <TableCell align="left">Thể loại</TableCell>
              <TableCell align="left">Tác giả</TableCell>
              <TableCell align="left">Nhà cung cấp</TableCell>
              <TableCell align="left">Nhà xuất bản</TableCell>
              {isBookScreen ? (
                <TableCell align="left">Ngày xuất bản</TableCell>
              ) : (
                <></>
              )}

              {/* <TableCell align="left">Trạng thái</TableCell> */}
              <TableCell align="left">Mô tả</TableCell>
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
                    {...register(`author.${index}.ProductName`, {
                      required: true,
                    })}
                  />
                  <div className="absolute text-danger mt-2">
                    {dataImport[index]?.Error || dataImport[index]?.message}
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
                    {...register(`author.${index}.Price`)}
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
                    className="form-control"
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
                    className="form-control min-h-30 max-h-50"
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
  const listImportSouvenir = () => {
    return (
      <TableContainer sx={{ maxHeight: 440 }} component={Paper}>
        <Table stickyHeader sx={{ minWidth: 440 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell> Tên đồ lưu niệm (*)</TableCell>
              <TableCell align="left">Hình ảnh</TableCell>
              <TableCell align="left">Giá tiền</TableCell>
              <TableCell align="left">Danh mục</TableCell>

              <TableCell align="left">Mô tả</TableCell>
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
                <TableCell align="left" key={index}>
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
                    {...register(`author.${index}.Price`)}
                  />
                </TableCell>
                <TableCell align="left">
                  <input
                    className="form-control"
                    type="text"
                    {...register(`author.${index}.CategoryName`)}
                  />
                </TableCell>
                <TableCell align="left">
                  <textarea
                    className="form-control min-h-30 max-h-50"
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
  
  // End Model

  // Template role store
  const handleClickOpenDetail = (v) => {
    dialogDetailService.showDialog(v);
  };
  
  function templateRoleStore(link, template) {
    if (user.role == Role.Store) {
      return <Link to={link}>{template}</Link>;
    } else {
      return template;
    }
  }
  return (
    <div className="px-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="title">
          {"Quản lý " +
            (isBookScreen ? ROUTER.book.name : ROUTER.souvenir.name)}
        </h1>
        {user.role == Role.Store ? (
          <div className="d-flex gap-2">
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
              <button className="bg-black text-white rounded-lg px-3 py-0.5">
                Tạo quà lưu niệm
              </button>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="grid grid-cols-5 gap-4">
        {data.list.map((val) => (
          <div
            key={val.productId}
            className={`${listStyle["book-detail"]} position-relative`}
          >
            {templateRoleStore(
              "update/" + val.productId,
              <div
                className="h-60 bg-cover bg-no-repeat bg-center"
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
                className={`${listStyle["trash-box"]} position-absolute top-0 right-0 bg-slate-400 rounded px-2 py-1 opacity-50 hover:!opacity-100`}
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
                {isBookScreen ? (
                  <div>
                    <div className="box-author">Tác giả: {val?.authors}</div>
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
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="p-6">
          <Box sx={{ ...ModelStyle, width: "65vw" }}>
            <div className="max-h-50vh overflow-auto">
              {isBookScreen ? listImportBook() : listImportSouvenir()}
            </div>
            <button
              onClick={submitCsv}
              type="button"
              className="mt-4 float-right text-white bg-green-700  rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
            >
              Submit
            </button>
          </Box>
        </div>
      </Modal>
      <DialogDetailComponent />

    </div>
  );
}
