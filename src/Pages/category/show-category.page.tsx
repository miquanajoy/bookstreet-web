import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { alertService } from "../../_services/alert.service";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import { CATEGORY } from "../../_helpers/const/const";
import ListComponent from "../../Components/list.component";
import {
  SearchModel,
  searchService,
  typeSearch,
} from "../../_services/search.service";
import { Role } from "../../models/Role";

export default function ShowCategoryPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // ✅ Lấy role và xác định có phải là Store không
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const role = user?.user?.role;
  const isStore = role === Role.Store;

  const headers = [
    {
      key: "productTypeName",
      name: "Tên loại sản phẩm",
    },
    {
      key: "categoryName",
      name: "Tên danh mục",
    },
  ];

  const [data, setData] = useState({
    list: [],
    totalPage: 0,
  });

  function deleteItem(id) {
    if (isStore) {
      alertService.alert({ content: "Bạn không có quyền xóa danh mục." });
      return;
    }

    fetchWrapper.delete(config.apiUrl + CATEGORY + "/" + id, fetAllData);
  }

  async function fetAllData(pageNumber = 1) {
    const result = fetchWrapper.Post2GetByPaginate(
      config.apiUrl + CATEGORY,
      pageNumber,
      {
        filters: [
          {
            field: "categoryName",
            value: searchService.$SearchValue.value?.dataSearch,
            operand: typeSearch,
          },
        ],
      }
    );
    result.then((res) => {
      const convertedData = res.list.map((val) => {
        let p = [];
        p.push({ id: val.categoryId });

        for (const key in val) {
          if (!["categoryId"].includes(key)) {
            p.push({ [key]: val[key] });
          }
        }
        return p;
      });
      setData({
        list: convertedData,
        totalPage: res.totalPage,
      });
    });
    return result;
  }

  useEffect(() => {
    fetAllData();
  }, [pathname]);

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

  return (
    <ListComponent
      title="Quản lý danh mục"
      buttonName={isStore ? undefined : "Tạo danh mục"} // ✅ Ẩn nút nếu là Store
      deleteItem={deleteItem}
      header={headers}
      data={data.list}
      totalPage={data.totalPage}
      handleChange={fetAllData}
      isStore={isStore} // ✅ Truyền xuống để ẩn cột hành động
    />
  );
}
