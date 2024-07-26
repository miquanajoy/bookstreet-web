import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { alertService, onAlert } from "../../_services";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import draftToHtml from "draftjs-to-html";
import { CATEGORY } from "../../models/category";
import { DISTRIBUTOR } from "../../models/distributor";
import { GENRE, PRODUCT, PUBLISHER, ROUTER } from "../../models/const";
import { fileService } from "../../_services/file.service";

export default function AddBook() {
  const [data, setData] = useState<any>({
    productName: "",
    price: 10000,
    productTypeName: "",
    publicDay: "",
    categoryId: "",
    genreId: "",
    distributorId: "",
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
  // Router
  const navigate = useNavigate();
  const params = useParams();
  const { pathname } = useLocation();
  // End Router

  const [selectedFile, setSelectedFile] = useState<any>();
  const [preview, setPreview] = useState();
  const [options, setOption] = useState({
    categories: [],
    publishers: [],
    distributors: [],
    genres: [],
  });

  const [editorState, setEditorState] = useState(() => {
    const content = ContentState.createFromText("");
    return EditorState.createWithContent(content);
  });

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl: any = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
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
    const categories = await getOption(CATEGORY);
    const publishers = await getOption(PUBLISHER);
    const distributors = await getOption(DISTRIBUTOR);
    const genres = await getOption(GENRE);
    setOption({
      categories,
      publishers,
      distributors,
      genres,
    });
    if (!params.id) return data;
    const result = await fetchWrapper.get(
      config.apiUrl + PRODUCT + "/" + params.id
    );

    setPreview(result.urlImage);
    result.description = ContentState.createFromText(result.description ?? "");
    setEditorState(EditorState.createWithContent(result.description));
    return result;
  }

  function getOption(url) {
    return fetchWrapper.get(config.apiUrl + url);
  }

  const savedata = async (val) => {
    const categoryId = val.categoryId ?? options.categories[0].categoryId;
    const distributorId =
      val.distributorId ?? options.distributors[0].distributorId;
    const publisherId = val.publisherId ?? options.publishers[0].publisherId;
    const genreId = val.genreId ?? options.genres[0].genreId;

    let dataPost = {
      productId: params.id,
      categoryId: categoryId,
      productTypeId: pathname == ROUTER.book.url ? 1 : 2,
      productTypeName: val.productTypeName,
      productName: val.productName,
      description: draftToHtml(convertToRaw(editorState.getCurrentContent())),
      price: val.price,
      urlImage: val.urlImage,
      book: {
        distributorId: distributorId,
        publisherId: publisherId,
        genreId: genreId,
        publicDay: new Date(),
        authors: ["string"],
      },
    };
    const formData = new FormData();
    formData.append(
      "files",
      new Blob([selectedFile], { type: "image/png" }),
      selectedFile.name
    );

    await fileService.postFile(formData).then((result) => {
      dataPost.urlImage = result;
    });
    const process = params.id
      ? fetchWrapper.put(config.apiUrl + PRODUCT + "/" + params.id, dataPost)
      : fetchWrapper.postUpgrade(config.apiUrl + PRODUCT, dataPost);

    process
      .then((val) => {
        alertService.alert({
          content: params.id ? "Update success" : "Create success",
        });
        navigate(
          pathname == ROUTER.book.url ? ROUTER.book.url : ROUTER.souvenir.url,
          { replace: true }
        );
      })
      .catch((e) => {
        console.log("e :>> ", e);
      });
  };
  return (
    <div className="container">
      <form
        onSubmit={handleSubmit(savedata)}
        className="grid grid-cols-3 gap-2 jumbotron mt-4"
      >
        <div className="row-span-2 flex flex-column items-center gap-2">
          <label
            htmlFor="imageUpload"
            className="block h-52 w-52 bg-slate-50 bg-contain bg-no-repeat bg-center"
            style={{ backgroundImage: "url(" + preview + ")" }}
          ></label>
          <input
            type="file"
            onChange={onSelectFile}
            id="imageUpload"
            accept="image/png, image/jpeg"
            className="hidden"
          />
          <label
            htmlFor="imageUpload"
            className="block border px-2 py-1 bg-slate-50 rounded"
          >
            New Image
          </label>
        </div>

        <div>
          <label htmlFor="nm">
            <b>
              {(pathname == ROUTER.book.url
                ? ROUTER.book.name
                : ROUTER.souvenir.name) + " Name:"}
            </b>
          </label>
          <input
            id="nm"
            type="text"
            className="form-control"
            placeholder={
              (pathname == ROUTER.book.url
                ? ROUTER.book.name
                : ROUTER.souvenir.name) + " name"
            }
            {...register("productName", { required: true })}
          />
          {errors.productName && <div>This field is required</div>}
          <br />
          <label htmlFor="ptn">
            <b>Product Type Name: </b>
          </label>
          <input
            id="ptn"
            type="text"
            className="form-control"
            placeholder="Product type name"
            {...register("productTypeName", { required: true })}
          />
          <br />
          <label htmlFor="anm">
            <b>Price: </b>
          </label>
          <input
            id="anm"
            type="number"
            className="form-control"
            {...register("price")}
          />
          <br />
          <label htmlFor="genr">
            <b>Publisher: </b>
          </label>
          {options.publishers[0]?.publisherId}
          <select id="genr" className="form-control">
            {options.publishers.map((val) => (
              <option key={val.publisherId} value={val.publisherId}>
                {val.publisherName}
              </option>
            ))}
          </select>
          <br />
          <label htmlFor="pub">
            <b>Public day: </b>
          </label>
          <input
            id="pub"
            type="date"
            className="form-control"
            value={
              new Date().getFullYear() +
              "-" +
              ("0" + (new Date().getMonth() + 1)).slice(-2) +
              "-" +
              ("0" + new Date().getDate()).slice(-2).toString()
            }
            {...register("publicDay")}
          />
          <br />
        </div>
        <div>
          <label htmlFor="cat">
            <b>Category: </b>
          </label>
          <select id="cat" className="form-control" {...register("categoryId")}>
            {options.categories.map((val) => (
              <option key={val.categoryId} value={val.categoryId}>
                {val.categoryName}
              </option>
            ))}
          </select>
          <br />
          <label htmlFor="genr">
            <b>Genre: </b>
          </label>
          <select {...register("genreId")} id="genr" className="form-control">
            {options.genres.map((val) => (
              <option key={val.genreId} value={val.genreId}>
                {val.genreName}
              </option>
            ))}
          </select>
          <br />
          <label htmlFor="dis">
            <b>Distributor: </b>
          </label>
          <select
            {...register("distributorId")}
            id="dis"
            className="form-control"
          >
            {options.distributors.map((val) => (
              <option key={val.distributorId} value={val.distributorId}>
                {val.distriName}
              </option>
            ))}
          </select>

          <br />
        </div>
        <div className="col-start-2 col-span-2">
          <label htmlFor="avb">
            <b>Description: </b>
          </label>
          <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={setEditorState}
          />
          <input type="submit" className="btn btn-success mt-12" value="Save" />
        </div>
      </form>
    </div>
  );
}
