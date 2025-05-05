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

export default function ShowCategoryPage() {
  const navigate = useNavigate();

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

  const { pathname } = useLocation();

  const [data, setData] = useState({
    list: [],
    totalPage: 0,
  });

  function deleteItem(id) {
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
      const convertData = res.list.map((v) => {
        return v;
      });
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
    return result
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

  return (
    <ListComponent
      title="Quản lý danh mục"
      buttonName="Tạo danh mục"
      deleteItem={deleteItem}
      header={headers}
      data={data.list}
      totalPage={data.totalPage}
      handleChange={fetAllData}
    ></ListComponent>
  );
}
