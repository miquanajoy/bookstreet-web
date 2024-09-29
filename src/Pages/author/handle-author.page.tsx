import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import { AUTHOR, ROUTER } from "../../_helpers/const/const";
import { fileService } from "../../_services/file.service";
import { alertService } from "../../_services";

export default function HandleAuthorPage() {
  const navigate = useNavigate();

  const params = useParams();
  const [data, setData] = useState<any>({
    authorId: 0,
    authorName: "",
    biography: "",
    dateOfBirth: dayjs(new Date()).format("YYYY-MM-DD"),
    description: "",
    urlImage: "",
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
  const [preview, setPreview] = useState();
  const [selectedFile, setSelectedFile] = useState<any>();

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

    let reader = new FileReader();
    let base64String;

    reader.onload = function () {
      base64String = reader.result;
      setPreview(base64String);
    };
    reader.readAsDataURL(e.target.files[0]);
    setSelectedFile(e.target.files[0]);
  };

  async function fetAllData() {
    if (!params.id) return data;
    const result = await fetchWrapper.get(
      config.apiUrl + AUTHOR + "/" + params.id
    );
    setData(result);
    setPreview(result.urlImage);
    return {
      ...result,
      dateOfBirth: dayjs(new Date(result.dateOfBirth)).format("YYYY-MM-DD"),
    }
  }

  const savedata = async (val) => {
    let dataPost = val;
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
        config.apiUrl + AUTHOR + "/" + params.id,
        dataPost
      );
    } else {
      delete dataPost.authorId;
      process = fetchWrapper.postUpgrade(config.apiUrl + AUTHOR, dataPost);
    }

    process
      .then((val) => {
        alertService.alert({
          content: params.id ?  "Thay đổi thành công" : "Tạo mới thành công",
        });
        navigate(ROUTER.author.url, {
          replace: true,
        });
      })
      .catch((e) => {});
  };

  return (
    <div className="container">
      <form
        onSubmit={handleSubmit(savedata)}
        className="grid grid-cols-2 gap-2 jumbotron mt-4"
      >
        <div className="flex flex-column items-center gap-2">
          <label
            htmlFor="imageUpload"
            className="block h-52 w-52 bg-slate-200 bg-contain bg-no-repeat bg-center"
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
            className="block border px-2 py-1 bg-slate-200 rounded"
          >
            Chọn hình ảnh
          </label>
        </div>

        <div className="d-flex flex-column gap-2">
          <div className="grid grid-cols-2 gap-2">
            <label className="" htmlFor="nm">
              <b>Tên tác giả: </b>
              <input
                id="nm"
                type="text"
                className="form-control"
                {...register("authorName")}
              />
            </label>
            <label className="" htmlFor="anm">
              <b>Ngày sinh: </b>
              <input
                id="anm"
                type="date"
                className="form-control"
                placeholder=""
                {...register("dateOfBirth")}
              />
            </label>
          </div>

          <div>
            <label className=" d-block" htmlFor="biography">
              <b>Tiểu sử: </b>
              <input
                id="biography"
                type="text"
                className="form-control"
                maxLength={300}
                {...register("biography")}
              />
            </label>
          </div>
          <div className="col-start-2 col-span-2">
            <label htmlFor="des">
              <b>Mô tả: </b>
            </label>
            <textarea
              className="form-control min-h-30 max-h-50"
              {...register("description")}
            ></textarea>

            <input
              type="submit"
              className="btn btn-success mt-12"
              value="Lưu"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
