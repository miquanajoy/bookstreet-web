import { useEffect, useState } from "react";
import { alertService, onAlert } from "../../_services";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import ListComponent from "../../Components/list.component";
import { LOCATION } from "../../_helpers/const/const";

export default function ShowLocation() {
  const [data, setData] = useState({
    list: [],
    totalPage: 0,
  });
  const headers = [
    {
      key: "image",
      name: "urlImage",
    },
    {
      key: "locationName",
      name: "locationName",
    },
    {
      key: "areaName",
      name: "areaName",
    },
  ];

  function fetAllData(pageNumber = 1) {
    const result = fetchWrapper.Post2GetByPaginate(
      config.apiUrl + LOCATION,
      pageNumber
    );
    result.then((res) => {
      const convertedData = res.list.map((val) => {
        let p = [];
        p.push({ id: val.locationId });
        p.push({ image: val.urlImage });
        for (const key in val) {
          if (!["areaId", "locationId"].includes(key)) {
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
  }, []);

  async function deleteItem(id) {
    await fetchWrapper.delete(config.apiUrl + LOCATION + "/" + id);
    fetAllData();
    alertService.alert({
      content: "Remove success",
    });
  }

  return (
    <>
      <ListComponent
        title="Location Management"
        buttonName="Create location"
        deleteItem={deleteItem}
        header={headers}
        data={data.list}
        totalPage={data.totalPage}
        handleChange={fetAllData}
      ></ListComponent>
    </>
  );
}
