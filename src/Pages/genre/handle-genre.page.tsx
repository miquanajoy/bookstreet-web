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
import { GENRE, ROUTER } from "../../_helpers/const/const";
import { fileService } from "../../_services/file.service";
import { alertService } from "../../_services";
import { CATEGORY } from "../../models/category";

export default function HandleGenrePage() {
  const navigate = useNavigate();

  const params = useParams();
  const [data, setData] = useState<any>({
    genreId: 0,
    genreName: "",
    categoryId: "",
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
  const [options, setOption] = useState({
    categories: [],
  });

  const [editorState, setEditorState] = useState(() => {
    const content = ContentState.createFromText("");
    return EditorState.createWithContent(content);
  });

  async function fetAllData() {
    const categories = await fetchWrapper.Post2GetByPaginate(config.apiUrl + CATEGORY, -1);
    setOption({
      categories: categories.list,
    });
    if (!params.id) return data;
    const result = await fetchWrapper.get(
      config.apiUrl + GENRE + "/" + params.id
    );
    setData(result);
    setPreview(result.urlImage);
    return result;
  }

  const savedata = async (val) => {
    let dataPost = val;

    let process;
    if (params.id) {
      process = fetchWrapper.put(
        config.apiUrl + GENRE + "/" + params.id,
        dataPost
      );
    } else {
      delete dataPost.genreId;
      process = fetchWrapper.postUpgrade(config.apiUrl + GENRE, dataPost);
    }

    process
      .then((_) => {
        alertService.alert({
          content: params.id ?  "Thay đổi thành công" : "Tạo mới thành công",
        });
        navigate(ROUTER.genre.url, {
          replace: true,
        });
      })
      .catch((e) => {});
  };

  return (
    <div className="container">
      <h1 className="title">Quản lý thể loại</h1>
      <form onSubmit={handleSubmit(savedata)} className="col-7 mx-auto mt-4">
        <div className="d-flex flex-column gap-2">
          <div className="grid grid-cols-2 gap-2">
            <label className="uppercase" htmlFor="nm">
              <b>Tên thể loại: </b>
              <input
                id="nm"
                type="text"
                className="form-control"
                {...register("genreName")}
              />
            </label>
          </div>
          <div className="w-auto">
            <label htmlFor="cat">
              <b>Danh mục: </b>
            </label>
            <select
              id="cat"
              className="form-control !w-52"
              {...register("categoryId")}
            >
              {options.categories.map((val) => (
                <option key={val.categoryId} value={val.categoryId}>
                  {val.categoryName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <input
              type="submit"
              className="btn btn-success mt-2"
              value="Lưu"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
