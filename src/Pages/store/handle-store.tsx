import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { alertService, onAlert } from "../../_services";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState, convertFromHTML } from "draft-js";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import draftToHtml from "draftjs-to-html";
import { Role } from "../../models/Role";
import { fileService } from "../../_services/file.service";

export default function HandleStore() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const params = useParams();

  const [selectedFile, setSelectedFile] = useState<any>();
  const [preview, setPreview] = useState();
  const [streets, setStreets] = useState([]);
  const [areas, setAreas] = useState([]);
  const [locations, setLocations] = useState([]);
  const [users, setUsers] = useState([]);
  const [editorState, setEditorState] = useState(() => {
    const content = ContentState.createFromText("");
    return EditorState.createWithContent(content);
  });

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl: any = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const [data, setData] = useState<any>();
  function fetAllData() {
    const streets = fetchWrapper.get(config.apiUrl + "Street");
    streets.then((res) => {
      setStreets(res);
    });

    const areas = fetchWrapper.get(config.apiUrl + "Area");
    areas.then((res) => {
      setAreas(res);
    });

    const locations = fetchWrapper.get(config.apiUrl + "Location");
    locations.then((res) => {
      setLocations(res);
    });

    const users = fetchWrapper.get(config.apiUrl + "Auth");
    users.then((res) => {
      console.log('res.filter((val) => val.role == Role.Store) :>> ', res.filter((val) => val.role == Role.Store));
      setUsers(res.filter((val) => val.role == Role.Store));
    });

    if (!params.id) return;
    const result = fetchWrapper.get(config.apiUrl + "Store/" + params.id);
    result.then((val) => {
      (document.getElementById("nm") as HTMLInputElement).value = val.name;
      setData({ ...val });
      const blocksFromHTML = convertFromHTML(val.description);
      const state = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      setEditorState(EditorState.createWithContent(state));
      });
  }

  useEffect(() => {
    fetAllData();
  }, []);

  const savedata = async (val) => {
    console.log('val :>> ', val);
    const dataPost = {
      ...data,
      ...val,
      areaName: areas.find(stressDetail => stressDetail.areaId == val.areaId).areaName,
      urlImage: preview,
    };
    const formData = new FormData();
    if (selectedFile) {
      formData.append(
        "files",
        new Blob([selectedFile], { type: "image/png" }),
        selectedFile.name
      );
      dataPost.urlImage = await fileService.postFile(formData);
    } else {
      dataPost.urlImage = preview ?? '';
    }

    let process;
    if (params.id) {
      // dataPost.book = data
      // process = fetchWrapper.put(config.apiUrl + LOCATION + "/" + params.id, dataPost)
    } else {
      // process = fetchWrapper.post(config.apiUrl + LOCATION, dataPost);
    }

    process.then((res) => {
      if (res.errors) {
        let listErr = {};
        for (const key in res.errors) {
          const element = res.errors[key];
          listErr = {
            ...listErr,
            [key]: element[0],
          };
        }
        return;
      }
      alertService.alert({
        content: params.id ? "Update success" : "Create success",
      });
      navigate("/location", { replace: true });
    });
  };
  return (
    <div className="container">
      <form onSubmit={handleSubmit(savedata)} className="gap-2 mt-4">
        <div>
          <label htmlFor="nm">
            <b>Store Name: </b>
          </label>
          <input
            id="nm"
            type="text"
            className="form-control"
            placeholder="Store name"
            {...register("title")}
          />
          <br />
        </div>
        <div>
          <label htmlFor="street">
            <b>Book street: </b>
          </label>
          <select
            {...register("streetId")}
            id="street"
            className="form-control"
          >
            {streets.map((v) => (
              <option key={v.streetId} value={v.streetId}>
                {v.streetName}
              </option>
            ))}
          </select>
          <br />
        </div>
        <div>
          <label htmlFor="area">
            <b>Area: </b>
          </label>
          <select {...register("areaId")} id="area" className="form-control">
            {areas.map((v) => (
              <option key={v.areaId} value={v.areaId}>
                {v.areaName}
              </option>
            ))}
          </select>
          <br />
        </div>
        <div>
          <label htmlFor="location">
            <b>Location: </b>
          </label>
          <select
            {...register("locationId")}
            id="location"
            className="form-control"
          >
            {locations.map((v) => (
              <option key={v.locationId} value={v.locationId}>
                {v.locationName}
              </option>
            ))}
          </select>
          <br />
        </div>
        <div>
          <label htmlFor="User">
            <b>User: </b>
          </label>
          <select
            {...register("locationId")}
            id="User"
            className="form-control"
          >
            {users.map((v) => (
              <option key={v.id} value={v.id}>
                {v.fullName}
              </option>
            ))}
          </select>
          <br />
        </div>

        <div className="col-start-2 col-span-2">
          <label htmlFor="avb">
            <b>Description: </b>
          </label>
          <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={setEditorState}
          />
          <input type="submit" className="btn btn-success mt-12" value="Save" />
        </div>
      </form>
    </div>
  );
}
