import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Trash } from "../../assets/icon/trash";
import listStyle from "../../styles/listStyle.module.scss";
import { alertService, AlertType } from "../../_services/alert.service";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import Pagination from "@mui/material/Pagination";
import {
  AUTHOR,
  AVATARDEFAULT,
  IMPORT,
  SAVEBATCH,
} from "../../_helpers/const/const";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import dayjs from "dayjs";
import { useFieldArray, useForm } from "react-hook-form";
import { ModelStyle } from "../../_helpers/const/model.const";
import { excelService, TYPE_AUTHOR } from "../../_services/excel.service";
import { fileService } from "../../_services/file.service";
import axios from "axios";
import { URL_IMG } from "../../_helpers/const/csv.const";
import { SearchModel, searchService, typeSearch } from "../../_services/home/search.service";

export default function ShowAuthorPage() {
  const navigate = useNavigate();

  const {
    control,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const { pathname } = useLocation();

  const [data, setData] = useState({
    list: [],
    totalPage: 0,
  });

  function deleteItem(val) {
    fetchWrapper.delete(
      config.apiUrl + AUTHOR + "/" + val.authorId,
      fetAllData
    );
  }

  async function fetAllData(pageNumber = 1) {
    const result = fetchWrapper.Post2GetByPaginate(
      config.apiUrl + AUTHOR,
      pageNumber,
      {
        filters: [
          {
            field: "authorName",
            value: searchService.$SearchValue.value?.dataSearch,
            operand: typeSearch,
          },
        ],
      }
    );
    result.then((res: any) => {
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
  const [dataImport, setDataImport] = useState([]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "author",
    rules: { required: true },
  });

  const inputFile = useRef(null);

  function getCsv() {
    excelService.getCsv(TYPE_AUTHOR);
  }

  async function importExcel(e) {
    try {
      remove();

      const responseImport = await excelService.importExcel(
        e,
        AUTHOR + "/" + IMPORT
      );

      const convertData = responseImport.map((val) => {
        const birth = dayjs(new Date(val.DateOfBirth)).format("YYYY-MM-DD");
        const UrlImage =
          val.UrlImage && val.UrlImage != "anh_mau.jpg"
            ? URL_IMG + val.UrlImage
            : undefined;
        return {
          ...val,
          UrlImage,
          DateOfBirth:
            birth != "Invalid Date"
              ? birth
              : dayjs(new Date()).format("YYYY-MM-DD"),
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

    // data.forEach(val => {
    //   if(val.Error) {
    //     alertService.alert({
    //       content: val.Error
    //     });
    //   }
    // });
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
  // End Model

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

        return {
          authorName: v.AuthorName,
          biography: v.Biography,
          dateOfBirth: v.DateOfBirth,
          description: v.Description,
          urlImage,
        };
      });
    });
    await fetchWrapper.post(
      config.apiUrl + AUTHOR + "/" + SAVEBATCH,
      valueToSubmit
    );
    await closeModelImport();
    await fetAllData(1);
  }

  function closeModelImport() {
    handleClose();
    setDataImport([]);
    inputFile.current.value = "";
  }

  return (
    <div className="px-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="title">Quản lý tác giả</h1>
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
              Tạo tác giả
            </button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {data.list.map((val) => (
          <div
            key={val.authorId}
            className={`${listStyle["book-detail"]} position-relative`}
          >
            <Link to={"update/" + val.authorId}>
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
              onClick={(event: any) => {
                deleteItem(val);
              }}
              className={`${listStyle["trash-box"]} position-absolute top-0 right-0 bg-slate-400 rounded px-2 py-1 opacity-50 hover:!opacity-100`}
            >
              <Trash />
            </div>
            <Link to={"update/" + val.authorId}>
              <div className="mt-1 text-dark">
                <h6 className="mb-0 line-clamp-2">{val.authorName}</h6>
              </div>
            </Link>
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
              <TableContainer sx={{ maxHeight: 440 }} component={Paper}>
                <Table
                  stickyHeader
                  sx={{ minWidth: 440 }}
                  aria-label="simple table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Author name (*)</TableCell>
                      <TableCell align="center">Hình ảnh</TableCell>

                      <TableCell align="left">Birthday</TableCell>
                      <TableCell align="left">Biography</TableCell>
                      <TableCell align="left">Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataImport.map((row, index) => (
                      <TableRow
                        key={index}
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
                            {...register(`author.${index}.AuthorName`, {
                              required: true,
                            })}
                          />
                          <div className="absolute text-danger mt-3">
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
                            type="date"
                            {...register(`author.${index}.DateOfBirth`)}
                          />
                        </TableCell>
                        <TableCell align="left">
                          <input
                            className="form-control"
                            type="text"
                            {...register(`author.${index}.Biography`)}
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
