import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import { CATEGORY, ROUTER } from "../../_helpers/const/const";
import { alertService } from "../../_services";

export default function HandleCategoryPage() {
  const navigate = useNavigate();

  const params = useParams();
  const [data, setData] = useState<any>({
    categoryId: 0,
    categoryName: "",
    productTypeId: 0,
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
    productTypes: [],
  });

  async function fetAllData() {
    const productTypes = [
      {
        key: 1,
        value: "Sách",
      },
      {
        key: 2,
        value: "Quà lưu niệm",
      },
    ];
    setOption({
      productTypes,
    });
    if (!params.id) return {
      ...data,
      productTypeId: 1
    };
    const result = await fetchWrapper.get(
      config.apiUrl + CATEGORY + "/" + params.id
    );
    setData(result);
    setPreview(result.urlImage);
    return result
  }

  const savedata = async (val) => {
    let dataPost = val;

    let process;
    if (params.id) {
      process = fetchWrapper.put(
        config.apiUrl + CATEGORY + "/" + params.id,
        dataPost
      );
    } else {
      delete dataPost.categoryId;
      process = fetchWrapper.post(config.apiUrl + CATEGORY, dataPost);
    }

    process
      .then((v) => {
        if(v.success) {
          alertService.alert({
            content: params.id ?  "Thay đổi thành công" : "Tạo mới thành công",
          });
        } else {
          alertService.alert({
            content: params.id ?  "Thay đổi không thành công" : "Tạo mới không thành công",
          });
        }
        
        navigate(ROUTER.category.url, {
          replace: true,
        });
      })
      .catch((e) => {});
  };

  return (
    <div className="container">
      <h1 className="title">Quản lý danh mục</h1>
      <form onSubmit={handleSubmit(savedata)} className="col-7 mx-auto mt-4">
        <div className="d-flex flex-column gap-2">
          <div className="grid grid-cols-2 gap-2">
            <label className="" htmlFor="nm">
              <b>Tên danh mục: </b>
              <input
                id="nm"
                type="text"
                className="form-control"
                {...register("categoryName")}
              />
            </label>
          </div>
          <div className="w-auto">
            <label htmlFor="cat">
              <b>Loại sản phẩm: </b>
            </label>
            <select
              id="cat"
              className="form-control !w-52"
              {...register("productTypeId")}
            >
              {options.productTypes.map((val) => (
                <option key={val.key} value={val.key}>
                  {val.value}
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
