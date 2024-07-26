import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash } from "../../assets/icon/trash";
import ListComponent from "../../Components/list.component";
import { alertService } from "../../_services/alert.service";
import { Role } from "../../models/Role";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";

export default function ShowUserPage() {
  const [data, setData] = useState([]);

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

  async function fetAllData() {
    const result = fetchWrapper.get(config.apiUrl + "Auth");
    result.then((val) => {
      const convertedData = val.map((val) => {
        let p = [];
        p.push({ image: val.avatar });
        for (const key in val) {
          if (!["password", "avatar"].includes(key)) {
            p.push({ [key]: val[key] });
          }
        }
        return p;
      });
      console.log('convertedData :>> ', convertedData);
      setData(convertedData);
    });
  }

  useEffect(() => {
    fetAllData();
  }, []);

  function deleteItem(val) {
    const result = fetchWrapper.delete(config.apiUrl + "Auth/" + val.id);
    result.then((val) => {
      alertService.alert({
        content: "Remove success",
      });
      fetAllData();
    });
  }

  return (
    <>
      <ListComponent
        title="Account Manager"
        buttonName="Create new account"
        linkEdit=""
        deleteItem={deleteItem}
        header={headers}
        data={data}
      ></ListComponent>
    </>
  );
}
