import React, { useEffect, useState } from "react";
import draftToHtml from "draftjs-to-html";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { alertService } from "../../_services/alert.service";
import { Editor } from "react-draft-wysiwyg";
import { fileService } from "../../_services/file.service";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import { EVENT, LOCATION, ROUTER } from "../../_helpers/const/const";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import dayjs from "dayjs";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateTimeRangePicker } from "@mui/x-date-pickers-pro/DateTimeRangePicker";
export default function HandleCalenderPage() {

  const [value, setValue] = React.useState([null, null]);
  const [locations, setLocation] = React.useState([]);

  const [data, setData] = useState<any>({
    locationId: 0,
    title: "",
    description: "",
    urlImage: "",
    purpose: "",
    hostName: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      return await fetAllData();
    },
  });

  const navigate = useNavigate();
  const params = useParams();

  const [selectedFile, setSelectedFile] = useState<any>();
  const [preview, setPreview] = useState();

  const [editorState, setEditorState] = useState(() => {
    const content = ContentState.createFromText("");
    return EditorState.createWithContent(content);
  });

  async function fetAllData() {
    const locations = await fetchWrapper.get(config.apiUrl + LOCATION);
    setLocation(locations);
    if (!params.id) return data;
    const result = await fetchWrapper.get(
      config.apiUrl + EVENT + "/" + params.id
    );
    setData(result);
    setPreview(result.urlImage);

    // const blocksFromHTML = convertFromHTML(result.description ?? "");
    // const state = ContentState.createFromBlockArray(
    //   blocksFromHTML.contentBlocks,
    //   blocksFromHTML.entityMap
    // );
    // setEditorState(EditorState.createWithContent(state));
    setValue([
      dayjs(result.starDate).format("YYYY-MM-DD HH:mm"),
      dayjs(result.endDate).format("YYYY-MM-DD HH:mm"),
    ]);
    return result;
  }
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl: any = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(e.target.files[0]);
  };

  const savedata = async (val) => {
    let dataPost = val;
    // dataPost.description = draftToHtml(
    //   convertToRaw(editorState.getCurrentContent())
    // );
    dataPost.starDate = new Date(dayjs(value[0]).format("YYYY-MM-DD HH:mm"));
    dataPost.endDate = new Date(dayjs(value[1]).format("YYYY-MM-DD HH:mm"));

    const formData = new FormData();
    if (selectedFile) {
      formData.append(
        "files",
        new Blob([selectedFile], { type: "image/png" }),
        selectedFile.name
      );
      dataPost.urlImage = await fileService.postFile(formData);
    } else {
      dataPost.urlImage = preview ?? "";
    }
    let process;
    if (params.id) {
      process = fetchWrapper.put(
        config.apiUrl + EVENT + "/" + params.id,
        dataPost
      );
    } else {
      process = fetchWrapper.postUpgrade(config.apiUrl + EVENT, dataPost);
    }

    process
      .then((val) => {
        alertService.alert({
          content: params.id ?  "Thay đổi thành công" : "Tạo mới thành công",
        });
        navigate(ROUTER.event.url, { replace: true });
      })
      .catch((e) => {});
  };

  return (
    <div className="container">
      <h1 className="title">QUẢN LÝ SỰ KIỆN</h1>
      <form
        onSubmit={handleSubmit(savedata)}
        className="grid grid-cols-2 gap-4 jumbotron mt-4"
      >
        <div className="flex flex-column items-center gap-2">
          <label
            htmlFor="imageUpload"
            className="block h-52 w-52 bg-slate-50 bg-contain bg-no-repeat bg-center"
            style={{ backgroundImage: "url(" + preview + ")" }}
          ></label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={onSelectFile}
            id="imageUpload"
            className="hidden"
          />
          <label
            htmlFor="imageUpload"
            className="block border px-2 py-1 bg-slate-50 rounded"
          >
            Chọn hình ảnh
          </label>
        </div>

        <div>
          <label className="uppercase" htmlFor="nm">
            <b>Tên sự kiện: </b>
          </label>
          <input
            id="nm"
            type="text"
            className="form-control"
            {...register("title")}
          />
          <br />
          <label className="uppercase" htmlFor="loca">
            <b>Vị trí: </b>
          </label>
          <select
            {...register("locationId")}
            id="loca"
            className="form-control"
          >
            {locations.map((v) => (
              <option key={v.locationId} value={v.locationId}>
                {v.locationName}
              </option>
            ))}
          </select>
          <br />
          <label className="uppercase" htmlFor="anm">
            <b>Mục đích: </b>
          </label>
          <input
            id="anm"
            type="text"
            className="form-control"
            {...register("purpose")}
          />
          <br />
          <label className="uppercase" htmlFor="avb">
            <b>Tên máy chủ: </b>
          </label>
          <input
            id="avb"
            type="text"
            className="form-control"
            {...register("hostName")}
          />
          <br />
          <div className="row">
            <div className="col-6">
              <b>Ngày bắt đầu:</b>
              <div>{value[0]}</div>
            </div>
            <div className="col-6">
              <b>Ngày kết thúc:</b>
              <div>{value[1]}</div>
            </div>
          </div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateTimeRangePicker"]}>
              <DateTimeRangePicker
                localeText={{ start: "Check-in", end: "Check-out" }}
                onChange={(newValue) => {
                  setValue([
                    dayjs(newValue[0]).format("YYYY-MM-DD HH:mm"),
                    dayjs(newValue[1]).format("YYYY-MM-DD HH:mm"),
                  ]);
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
          {/* <ChakraProvider>
            <Box>
              <DateRangePicker
                label="Date and time range"
                minValue={today(getLocalTimeZone())}
                defaultValue={{
                  start: now(getLocalTimeZone()),
                  end: now(getLocalTimeZone()).add({ weeks: 1 }),
                }}
              />
            </Box>
          </ChakraProvider> */}
          <br />
          <label htmlFor="des">
            <b>Mô tả: </b>
          </label>
          <textarea
            className="form-control min-h-30 max-h-50"
            {...register("description")}
          ></textarea>

          <input type="submit" className="btn btn-dark mt-2" value="Lưu" />
        </div>
      </form>
    </div>
  );
}
