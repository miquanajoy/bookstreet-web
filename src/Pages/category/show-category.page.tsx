import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { alertService } from "../../_services/alert.service";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import {
  CATEGORY,
} from "../../_helpers/const/const";
import ListComponent from "../../Components/list.component";

export default function ShowCategoryPage() {
  const navigate = useNavigate();

  const headers = [
    {
      key: "productTypeName",
      name: "Product type name",
    },
    {
      key: "categoryName",
      name: "Category name",
    }
  ];

  const { pathname } = useLocation();

  const [data, setData] = useState({
    list: [],
    totalPage: 0,
  });

  function deleteItem(id) {
    const result = fetchWrapper.delete(
      config.apiUrl + CATEGORY + "/" + id
    );
    result.then((val) => {
      fetAllData();
      alertService.alert({
        content: "Xóa thành công",
      });
    });
  }

  async function fetAllData(pageNumber = 1) {
    const result = fetchWrapper.Post2GetByPaginate(
      config.apiUrl + CATEGORY,
      pageNumber
    );
    result.then((res) => {
      const convertData = res.list.map(v => {
        return v
      })
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
  }

  useEffect(() => {
    fetAllData();
  }, [pathname]);

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
