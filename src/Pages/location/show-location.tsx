import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFieldArray, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { alertService, onAlert } from "../../_services";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import draftToHtml from "draftjs-to-html";
import { Trash } from "../../assets/icon/trash";
import ListComponent from "../../Components/list.component";

export default function ShowLocation() {
  const [data, setData] = useState([]);
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

  function fetAllData() {
    const result = fetchWrapper.get(config.apiUrl + "Location");
    result.then((res) => {
      const convertedData = res.map((val) => {
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
      setData(convertedData);
    });
  }

  useEffect(() => {
    fetAllData();
  }, []);

  function deleteItem(val) {
    const result = fetchWrapper.delete(
      config.apiUrl + "Location/" + val.id
    );
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
        title="Location Manager"
        buttonName="Create new location"
        linkEdit=""
        deleteItem={deleteItem}
        header={headers}
        data={data}
      ></ListComponent>
    </>
  );
}
