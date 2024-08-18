import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import { fileService } from "../../_services/file.service";
import { PUBLISHER, ROUTER } from "../../_helpers/const/const";

export default function HandlePublisher() {
  const [data, setData] = useState<any>({
    publisherName: "",
    description: "",
    publisherNumber: "0",
    website: "",
    year: new Date().getFullYear(),
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
  const [editorState, setEditorState] = useState(() => {
    return EditorState.createWithContent(convertValueForEditor(""));
  });

  const navigate = useNavigate();
  const params = useParams();

  const [selectedFile, setSelectedFile] = useState<any>();
  const [preview, setPreview] = useState();

  async function fetAllData() {
    if (!params.id) return data;
    const result = await fetchWrapper.get(
      config.apiUrl + PUBLISHER + "/" + params.id
    );
    setData(result);

    setPreview(result.urlImage);
    // const blocksFromHTML = convertFromHTML(result.description ?? "");
    // const state = ContentState.createFromBlockArray(
    //   blocksFromHTML.contentBlocks,
    //   blocksFromHTML.entityMap
    // );
    // setEditorState(EditorState.createWithContent(state));
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
    const dataPost = {
      publisherId: params.id,
      ...val,
      urlImage: "",
    };
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

    if (params.id) {
      await fetchWrapper.put(
        config.apiUrl + PUBLISHER + "/" + params.id,
        dataPost
      );
    } else {
      await fetchWrapper.post(config.apiUrl + PUBLISHER, dataPost);
    }
    navigate(ROUTER.publisher.url, {
      replace: true,
    });
  };

  function convertValueForEditor(val) {
    const sampleMarkup = val;
    const blocksFromHTML = convertFromHTML(sampleMarkup);

    return ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
  }
  return (
    <div className="container">
      <div className="col-10 mx-auto">
        <h1 className="title">Quản lý nhà xuất bản</h1>
        <form
          onSubmit={handleSubmit(savedata)}
          className="grid grid-cols-2 gap-2 jumbotron mt-4"
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
              New Image
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2 jumbotron mt-4">
            <div>
              <label className="uppercase" htmlFor="nm">
                <b>Publisher name: </b>
              </label>
              <input
                id="nm"
                type="text"
                className="form-control"
                {...register("publisherName", { required: true })}
              />
            </div>
            <div>
              <label className="uppercase" htmlFor="nm">
                <b>Publisher number: </b>
              </label>
              <input
                id="nm"
                type="number"
                className="form-control"
                min="0"
                {...register("publisherNumber", { required: true })}
              />
            </div>
            <div>
              <label className="uppercase" htmlFor="nm">
                <b>Website: </b>
              </label>
              <input
                id="nm"
                type="text"
                className="form-control"
                placeholder="http://"
                {...register("website", { required: true })}
              />
            </div>
            <div>
              <label className="uppercase" htmlFor="nm">
                <b>Year: </b>
              </label>
              <input
                id="nm"
                type="text"
                className="form-control"
                {...register("year")}
              />
            </div>
            <div className="col-span-2">
              <label className="uppercase" htmlFor="Description">
                <b>Description: </b>
              </label>
              <textarea
                className="form-control min-h-30 max-h-50"
                {...register("description")}
              ></textarea>

              <input type="submit" className="btn btn-dark mt-2" value="Save" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
