import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { alertService } from "../../_services/alert.service";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import {
  GENRE,
} from "../../_helpers/const/const";
import ListComponent from "../../Components/list.component";

export default function ShowGenrePage() {
  const navigate = useNavigate();

  const headers = [
    {
      key: "genreName",
      name: "Genre name",
    },
    {
      key: "categoryName",
      name: "Category",
    },
  ];

  const { pathname } = useLocation();

  const [data, setData] = useState({
    list: [],
    totalPage: 0,
  });

  function deleteItem(id) {
    const result = fetchWrapper.delete(
      config.apiUrl + GENRE + "/" + id
    );
    result.then((val) => {
      fetAllData();
      alertService.alert({
        content: "Remove success",
      });
    });
  }

  async function fetAllData(pageNumber = 1) {
    const result = fetchWrapper.Post2GetByPaginate(
      config.apiUrl + GENRE,
      pageNumber
    );
    result.then((res) => {
      const convertData = res.list.map(v => {
        return v
      })
      const convertedData = res.list.map((val) => {
        let p = [];
        p.push({ id: val.genreId });

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
      title="Genre Management"
      buttonName="Create genre"
      deleteItem={deleteItem}
      header={headers}
      data={data.list}
      totalPage={data.totalPage}
      handleChange={fetAllData}
    ></ListComponent>
  );
}
