import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash } from "../../assets/icon/trash";
import ListComponent from "../../Components/list.component";
import { alertService } from "../../_services/alert.service";
import { Role } from "../../models/Role";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import { AUTH } from "../../_helpers/const/const";

export default function ShowUserPage() {
  const [data, setData] = useState({
    list: [],
    totalPage: 0,
  });

  const headers = [
    {
      key: "image",
      name: "Avatar",
    },
    {
      key: "username",
      name: "username",
    },
    {
      key: "fullName",
      name: "fullName",
    },
    {
      key: "email",
      name: "email",
    },
    {
      key: "phone",
      name: "phone",
    },
    {
      key: "address",
      name: "address",
    },
    {
      key: "role",
      name: "role",
    },
  ];

  async function fetAllData(pageNumber = 1) {
    const result = fetchWrapper.Post2GetByPaginate(
      config.apiUrl + AUTH,
      pageNumber
    );
    result.then((res) => {
      const convertedData = res.list.map((val) => {
        let p = [];
        p.push({ image: val.avatar });
        for (const key in val) {
          if (!["password", "avatar"].includes(key)) {
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
   await fetchWrapper.delete(config.apiUrl + AUTH + "/" + id);
    fetAllData();
    alertService.alert({
      content: "Xóa thành công",
    });
  }

  return (
    <>
      <ListComponent
        title="Quản lý người dùng"
        buttonName="Tạo người dùng"
        deleteItem={deleteItem}
        header={headers}
        data={data.list}
        totalPage={data.totalPage}
        handleChange={fetAllData}
      ></ListComponent>
    </>
  );
}
