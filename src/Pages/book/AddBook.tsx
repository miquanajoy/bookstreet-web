import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { alertService, onAlert } from "../../_services";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import { CATEGORY } from "../../models/category";
import { DISTRIBUTOR } from "../../models/distributor";
import { fileService } from "../../_services/file.service";
import {
  GENRE,
  PRODUCT,
  PUBLISHER,
  ROUTER,
  STORE,
} from "../../_helpers/const/const";
import dayjs from "dayjs";

export default function AddBook() {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const [data, setData] = useState<any>({
    // productName: "",
    // price: 10000,
    // productTypeName: "",
    publicDay: dayjs(new Date()).format("YYYY-MM-DD"),
    // categoryId: "",
    // genreId: "",
    // distributorId: "",
    // authors: "",
    // description: "",
    // publisherId: "",
    // status: 1,
  });

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: async () => {
      return await fetAllData();
    },
  });
  // Router
  const navigate = useNavigate();
  const params = useParams();
  const { pathname } = useLocation();
  const isBookScreen = pathname.includes(ROUTER.book.url);
  // End Router

  const [selectedFile, setSelectedFile] = useState<any>();
  const [preview, setPreview] = useState();
  const [options, setOption] = useState({
    categories: [],
    publishers: [],
    distributors: [],
    genres: {
      data: [],
      filter: [],
    },
    stores: [],
    status: [ {
      key: 1,
      value: "Còn hàng",
    },
    {
      key: 2,
      value: "Sắp về hàng",
    }],
  });

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl: any = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!getValues().categoryId) return;
    const dataFilter = options.genres.data.filter(
      (genre) => genre.categoryId == getValues().categoryId
    );
    const currentOptions = options;
    setOption({
      ...currentOptions,
      genres: {
        data: currentOptions.genres.data,
        filter: dataFilter,
      },
    });
  }, [watch("categoryId")]);

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
    const categories = getOption(CATEGORY);
    const publishers = getOption(PUBLISHER);
    const distributors = getOption(DISTRIBUTOR);
    const genres = getOption(GENRE);
    const stores = getOption(STORE);
    let options;
    if (!params.id) {
      fetchWrapper
        .AxiosAll([categories, publishers, distributors, genres, stores])
        .then((v) => {
          const status = [
            {
              key: 1,
              value: "Còn hàng",
            },
            {
              key: 2,
              value: "Sắp về hàng",
            },
          ];
          options = {
            categories: v[0].list.filter(
              (val) => val.productTypeId == (isBookScreen ? 1 : 2)
            ),
            publishers: v[1].list,
            distributors: v[2].list,
            genres: {
              data: v[3].list,
              filter: v[3].list.filter(
                (genre) => genre.categoryId == v[0].list[0].categoryId
              ),
            },
            stores: v[4].list,
          };
          setOption({
            categories: v[0].list.filter(
              (val) => val.productTypeId == (isBookScreen ? 1 : 2)
            ),
            publishers: v[1].list,
            distributors: v[2].list,
            genres: {
              data: v[3].list,
              filter: v[3].list.filter(
                (genre) => genre.categoryId == v[0].list[0].categoryId
              ),
            },
            stores: v[4].list,
            status,
          });
          setValue("categoryId", options.categories[0]?.categoryId)
          setValue("distributorId", options.distributors[0]?.distributorId)
          setValue("publisherId", options.publishers[0]?.publisherId)
          setValue("genreId", options.genres[0]?.genreId)
          setValue("storeId", options.stores[0]?.storeId)
          setValue("publicDay", dayjs(new Date()).format("YYYY-MM-DD"))
          setValue("status", 1 )
            return {
              ...data,
            };
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      const result = fetchWrapper.getWithoutCall(
        config.apiUrl + PRODUCT + "/" + params.id
      );

      return await fetchWrapper
        .AxiosAll([
          categories,
          publishers,
          distributors,
          genres,
          stores,
          result,
        ])
        .then((v) => {
          const status = [
            {
              key: 1,
              value: "Còn hàng",
            },
            {
              key: 2,
              value: "Sắp về hàng",
            },
          ];
          setOption({
            categories: v[0].list.filter(
              (val) => val.productTypeId == (isBookScreen ? 1 : 2)
            ),
            publishers: v[1].list,
            distributors: v[2].list,
            genres: {
              data: v[3].list,
              filter: [],
            },
            stores: v[4].list,
            status,
          });
          setData(v[5]);
          setPreview(v[5].urlImage);
          return {
            ...v[5],
            ...v[5].book,
            publicDay: dayjs(v[5].book?.publicDay).format("YYYY-MM-DD"),
            authors: v[5].book?.authors.join(", "),
          };
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  function getOption(url) {
    return fetchWrapper.Post2GetByPaginateWithoutCall(
      config.apiUrl + url,
      1,
      undefined,
      -1
    );
  }

  const savedata = async (val) => {
    const categoryId = Number(val.categoryId);
    const distributorId = Number(val.distributorId);
    const publisherId = Number(val.publisherId);
    const genreId = Number(val.genreId);
    let book;
    if (isBookScreen) {
      book = {
        ...data.book,
        distributorId: distributorId,
        publisherId: publisherId,
        genreId: genreId,
        publicDay: val.publicDay,
        editionYear: val.editionYear,
        editionNumber: val.editionNumber,
        authors: val.authors.split(", "),
      };
    }

    let dataPost = {
      book,
      productId: params.id,
      categoryId: categoryId,
      productTypeId: isBookScreen ? 1 : 2,
      productTypeName: val.productTypeName,
      productName: val.productName,
      description: val.description,
      price: val.price,
      urlImage: val.urlImage,
      status: Number(val.status),
      storeId: user.user.storeId,
    };
    if (!isBookScreen) {
      delete dataPost.book;
    }
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
        if (val.success) {
          alertService.alert({
            content: params.id ? "Thay đổi thành công" : "Tạo mới thành công",
          });
          navigate(isBookScreen ? ROUTER.book.url : ROUTER.souvenir.url, {
            replace: true,
          });
        } else {
          alertService.alert({
            content: val.message,
          });
        }
      })
      .catch((e) => {});
  };
  return (
    <div className="col-10 p-2">
      <form
        onSubmit={handleSubmit(savedata)}
        className="grid grid-cols-3 gap-2 jumbotron mt-4"
      >
        <div className="row-span-2 flex flex-column items-center gap-2">
          <label
            htmlFor="imageUpload"
            className="block h-52 w-52 bg-slate-200 bg-contain bg-no-repeat bg-center"
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
            className="block border px-2 py-1 bg-slate-200 rounded"
          >
            Chọn hình ảnh
          </label>
        </div>

        <div className="flex flex-column gap-2">
          <div>
            <label htmlFor="nm">
              <b>{"Tên " + (isBookScreen ? "sách" : "quà lưu niệm") + ":"}</b>
            </label>
            <input
              id="nm"
              type="text"
              className="form-control"
              placeholder={
                (isBookScreen ? ROUTER.book.name : ROUTER.souvenir.name) +
                " name"
              }
              {...register("productName", { required: true })}
            />
            {errors.productName && <div>Trường này là bắt buộc</div>}
          </div>

          {isBookScreen ? (
            <div>
              <div>
                <label htmlFor="auth">
                  <b>Tác giả: </b>
                </label>
                <input
                  id="auth"
                  type="text"
                  className="form-control"
                  placeholder="Tác giả, tác giả, tác giả"
                  {...register("authors")}
                />
              </div>
              <div>
                <label htmlFor="editionYear">
                  <b>Năm tái bản: </b>
                </label>
                <input
                  id="editionYear"
                  type="number"
                  className="form-control"
                  min={1800}
                  defaultValue={2024}
                  {...register("editionYear")}
                />
              </div>
            </div>
          ) : (
            <></>
          )}
          {isBookScreen ? (
            <div>
              <div>
                <label htmlFor="publisher">
                  <b>Nhà xuất bản: </b>
                </label>
                <select
                  {...register("publisherId")}
                  id="publisher"
                  className="form-control"
                >
                  {options.publishers.map((val) => (
                    <option key={val.publisherId} value={val.publisherId}>
                      {val.publisherName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div>
            <label htmlFor="anm">
              <b>Giá: </b>
            </label>
            <input
              id="anm"
              type="number"
              className="form-control"
              {...register("price")}
            />
          </div>
          {isBookScreen ? (
            <div>
              <label htmlFor="genr">
                <b>Thể loại: </b>
              </label>
              <select
                {...register("genreId")}
                id="genr"
                className="form-control"
              >
                {options.genres.filter.map((val) => (
                  <option key={val.genreId} value={val.genreId}>
                    {val.genreName}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="flex flex-column gap-2">
          <div>
            <label htmlFor="cat">
              <b>Danh mục: </b>
            </label>
            <select
              id="cat"
              className="form-control"
              {...register("categoryId")}
            >
              {options.categories.map((val) => (
                <option key={val.categoryId} value={val.categoryId}>
                  {val.categoryName}
                </option>
              ))}
            </select>
          </div>
          {isBookScreen ? (
            <div>
              <div>
                <label htmlFor="pub">
                  <b>Ngày xuất bản: </b>
                </label>
                <input
                  id="pub"
                  type="date"
                  className="form-control"
                  {...register("publicDay")}
                />
              </div>

              <div>
                <label htmlFor="editionNumber">
                  <b>Lần tái bản: </b>
                </label>
                <input
                  id="editionNumber"
                  type="number"
                  min={0}
                  defaultValue={0}
                  className="form-control"
                  {...register("editionNumber")}
                />
              </div>
            </div>
          ) : (
            <></>
          )}
          {isBookScreen ? (
            <div>
              <label htmlFor="dis">
                <b>Nhà phân phối: </b>
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
            </div>
          ) : (
            <></>
          )}
          {/* Status */}
          <div>
            <label htmlFor="status">
              <b>Trạng thái: </b>
            </label>
            <select
              {...register("status")}
              id="status"
              className="form-control"
            >
              {options.status.map((val) => (
                <option key={val.key} value={val.key}>
                  {val.value}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-start-2 col-span-2">
          <label htmlFor="des">
            <b>Mô tả: </b>
          </label>
          <textarea
            className="form-control min-h-30 max-h-50"
            {...register("description")}
          ></textarea>
          <input type="submit" className="btn btn-success mt-12" value="Lưu" />
        </div>
      </form>
    </div>
  );
}
