import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Trash } from "../../assets/icon/trash";
import listStyle from "../../styles/listStyle.module.scss";
import { alertService } from "../../_services/alert.service";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import Pagination from "@mui/material/Pagination";
import { IMPORT, PRODUCT, ROUTER, SAVEBATCH } from "../../_helpers/const/const";
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
import { fileService } from "../../_services/file.service";
import { Role, Roles } from "../../models/Role";

export default function ShowBook() {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const { pathname } = useLocation();

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

  function deleteItem(val) {
    const result = fetchWrapper.delete(
      config.apiUrl + "Product/" + val.productId
    );
    result.then((val) => {
      fetAllData();
      alertService.alert({
        content: "Remove success",
      });
    });
  }

  async function fetAllData(pageNumber = 1) {
    const account = accountService.userValue;
    // if (account.role) {
    // }
    const filter = {
      filters: [
        {
          field: "productTypeId",
          value: pathname == ROUTER.book.url ? "1" : "2",
          operand: 0,
        },
      ],
    };
    const result = fetchWrapper.Post2GetByPaginate(
      config.apiUrl + PRODUCT,
      pageNumber,
      filter
    );
    result.then((res: any) => {
      setData(res);
    });
  }

  useEffect(() => {
    fetAllData();
  }, [pathname]);

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

  function getCsv() {
    excelService.getCsv(TYPE_BOOK);
  }
  async function importExcel(e) {
    try {
      remove();

      const responseImport = await excelService.importExcel(
        e,
        PRODUCT +
          "/" +
          IMPORT +
          "?type=" +
          (pathname == ROUTER.book.url ? 1 : 2)
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
        append(val);
      });
      setDataImport(convertData);
    } catch (error) {
      inputFile.current.value = "";

      alertService.alert({
        content: "An error occurred",
      });
    }
  }

  async function submitCsv() {
    const formData = new FormData();
    let valueToSubmit = getValues().author.map((v) => ({ ...v }));
    // getValues().author.map(async (data, index) => {
    //   if (data.urlImage[0]) {
    //     const img = data.urlImage[0];
    //     formData.append(
    //       "files",
    //       new Blob([img], { type: "image/png" }),
    //       img.name
    //     );
    //     valueToSubmit[index].urlImage = await fileService.postFile(formData);
    //   } else {
    //     valueToSubmit[index].urlImage = "";
    //   }
    // });
    console.log("valueToSubmit :>> ", valueToSubmit);

    await fetchWrapper.post(
      config.apiUrl + PRODUCT + "/" + SAVEBATCH,
      valueToSubmit
    );
    await closeModelImport();
    await fetAllData(1);
  }

  function closeModelImport() {
    handleClose();
    setDataImport([]);
    inputFile.current.value = "";
    // console.log('getValues().author :>> ', getValues().author);
  }
  // End Model
  console.log("user.role == Role.Store :>> ", user.role == Role.Store);
  return (
    <div className="px-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="title">
          {(pathname == ROUTER.book.url
            ? ROUTER.book.name
            : ROUTER.souvenir.name) + " management"}
        </h1>
        {
          (user.role == Role.Store ? (
            <div className="d-flex gap-2">
              <button
                className="bg-info text-white rounded-lg px-3 py-0.5"
                onClick={() => getCsv()}
              >
                Export csv
              </button>
              <label
                htmlFor="import-excel"
                className="bg-info text-white rounded-lg px-3 py-0.5"
              >
                Import excel
              </label>
              <input
                id="import-excel"
                ref={inputFile}
                type="file"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                className="d-none"
                onChange={(event) => importExcel(event)}
              />
              <Link to="create">
                <button className="bg-black text-white rounded-lg px-3 py-0.5">
                  Create new
                  {" " +
                    (pathname == ROUTER.book.url
                      ? ROUTER.book.name
                      : ROUTER.souvenir.name)}
                </button>
              </Link>
            </div>
          ) : (
            <></>
          ))
        }
      </div>
      <div className="grid grid-cols-5 gap-4">
        {data.list.map((val) => (
          <div
            key={val.productId}
            className={`${listStyle["book-detail"]} position-relative`}
          >
            {user.role == Role.Store ? (
              <Link to={"update/" + val.productId}>
                <div
                  className="h-60 bg-contain bg-no-repeat bg-center"
                  style={{ backgroundImage: `url(${val.urlImage})` }}
                ></div>
              </Link>
            ) : (
              <div
                className="h-60 bg-contain bg-no-repeat bg-center"
                style={{ backgroundImage: `url(${val.urlImage})` }}
              ></div>
            )}

            <div
              onClick={(event: any) => {
                deleteItem(val);
              }}
              className={`${listStyle["trash-box"]} position-absolute top-0 right-0 bg-slate-400 rounded px-2 py-1 opacity-50 hover:!opacity-100`}
            >
              <Trash />
            </div>
            {user.role == Role.Store ? (
              <Link to={"update/" + val.productId}>
                <div className="mt-1 text-dark">
                  <h6 className="mb-0 line-clamp-2">{val.productName}</h6>
                  <div className="box-author">
                    {val.book?.authors ? (
                      val.book.authors.map((author) => (
                        <small key={author}>{author}</small>
                      ))
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="mt-1 text-dark">
                <h6 className="mb-0 line-clamp-2">{val.productName}</h6>
                <div className="box-author">
                  {val.book?.authors ? (
                    val.book.authors.map((author) => (
                      <small key={author}>{author}</small>
                    ))
                  ) : (
                    <></>
                  )}
                </div>
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
          <Box sx={ModelStyle}>
            <div>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell> Tên sách (*)</TableCell>
                      <TableCell align="left">Giá tiền</TableCell>
                      <TableCell align="left">Danh mục</TableCell>
                      <TableCell align="left">Thể loại</TableCell>
                      <TableCell align="left">Tác giả</TableCell>
                      <TableCell align="left">Nhà cung cấp</TableCell>
                      <TableCell align="left">Nhà xuất bản</TableCell>
                      <TableCell align="left">Mô tả loại</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fields.map((row, index) => (
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
                        {/* <TableCell align="left" key={index}>
                          <input
                            className={
                              errors.author && errors.author[index]
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            type="file"
                            accept="image/png, image/jpeg"
                            {...register(`author.${index}.urlImage`)}
                          />
                        </TableCell> */}

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
                          <input
                            className="form-control"
                            type="text"
                            {...register(`author.${index}.GenreName`)}
                          />
                        </TableCell>
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

              <button
                onClick={submitCsv}
                type="button"
                className="mt-4 float-right text-white bg-green-700  rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
              >
                Submit
              </button>
            </div>
          </Box>
        </div>
      </Modal>
    </div>
  );
}
