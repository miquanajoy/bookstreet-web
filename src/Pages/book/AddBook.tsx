import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { alertService, onAlert } from "../../_services";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import draftToHtml from "draftjs-to-html";
import { CATEGORY } from "../../models/category";
import { DISTRIBUTOR } from "../../models/distributor";
import { fileService } from "../../_services/file.service";
import { GENRE, PRODUCT, PUBLISHER, ROUTER } from "../../_helpers/const/const";
import dayjs from "dayjs";

export default function AddBook() {
  const [data, setData] = useState<any>({
    productName: "",
    price: 10000,
    productTypeName: "",
    publicDay: dayjs(new Date()).format("YYYY-MM-DD"),
    categoryId: "",
    genreId: "",
    distributorId: "",
    authors: "",
  });
  // useEffect(() => {
  //   setValue('publicDay', '2021-04-23'); // this will result a type error
  // }, []);
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
    setData(result);
    setPreview(result.urlImage);
    // setSelectedFile(result.urlImage);

    const blocksFromHTML = convertFromHTML(result.description);
    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    setEditorState(EditorState.createWithContent(state));
    return {
      ...result,
      publicDay: dayjs(result.book.publicDay).format("YYYY-MM-DD"),
      authors: result.book.authors[0],
    };
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
      productTypeId: pathname.includes(ROUTER.book.url) ? 1 : 2,
      productTypeName: val.productTypeName,
      productName: val.productName,
      description: draftToHtml(convertToRaw(editorState.getCurrentContent())),
      price: val.price,
      urlImage: val.urlImage,
      book: {
        ...data.book,
        distributorId: distributorId,
        publisherId: publisherId,
        genreId: genreId,
        publicDay: val.publicDay,
        authors: [val.authors],
      },
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
      dataPost.urlImage = preview ?? '';
    }
    let process;
    if (params.id) {
      // dataPost.book = data
      process = fetchWrapper.put(
        config.apiUrl + PRODUCT + "/" + params.id,
        dataPost
      );
    } else {
      process = fetchWrapper.postUpgrade(config.apiUrl + PRODUCT, dataPost);
    }

    process
      .then((val) => {
        alertService.alert({
          content: params.id ? "Update success" : "Create success",
        });
        navigate(
          pathname.includes(ROUTER.book.url)
            ? ROUTER.book.url
            : ROUTER.souvenir.url,
          { replace: true }
        );
      })
      .catch((e) => {});
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
              {(pathname.includes(ROUTER.book.url)
                ? ROUTER.book.name
                : ROUTER.souvenir.name) + " Name:"}
            </b>
          </label>
          <input
            id="nm"
            type="text"
            className="form-control"
            placeholder={
              (pathname.includes(ROUTER.book.url)
                ? ROUTER.book.name
                : ROUTER.souvenir.name) + " name"
            }
            {...register("productName", { required: true })}
          />
          {errors.productName && <div>This field is required</div>}
          <br />
          <label htmlFor="auth">
            <b>Author: </b>
          </label>
          <input
            id="auth"
            type="text"
            className="form-control"
            {...register("authors")}
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
        </div>
        <div>
          <label htmlFor="pub">
            <b>Public day: </b>
          </label>
          <input
            id="pub"
            type="date"
            className="form-control"
         
            {...register("publicDay", { valueAsDate: true })}
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
        </div>
        <div className="col-start-2 col-span-2">
          <label htmlFor="des">
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
