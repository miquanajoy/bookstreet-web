import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchWrapper } from "../../../../../_helpers/fetch-wrapper";
import config from "../../../../../config";
import {
  AREA,
  LOCATION,
  STORE,
  STREET,
} from "../../../../../_helpers/const/const";
import {
  searchService,
  typeSearch,
} from "../../../../../_services/search.service";
import { useForm } from "react-hook-form";

export const useStoreHistoryHook = () => {
  const { pathname } = useLocation();

  const [street, setStreet] = useState([]);
  const [areas, setAreas] = useState([]);
  const [locations, setLocations] = useState([]);
  const [bookStores, setStores] = useState([]);
  const [defaultStressId, setDefaultStressId] = useState("1");

  async function getStreet(pageNumber = 1) {
    const result = fetchWrapper.Post2GetByPaginate(
      config.apiUrl + STREET,
      pageNumber
    );
    result.then(async (res: any) => {
      setStreet(res.list);
      setDefaultStressId(res.list[0]?.streetId);
      getLocations(res.list[0]?.streetId);
    });
  }
  // async function getAreas(streetId = defaultStressId) {
  //   const areas = await fetchWrapper.Post2GetByPaginate(
  //     config.apiUrl + AREA,
  //     0,
  //     {
  //       filters: [
  //         {
  //           field: "streetId",
  //           value: streetId + "",
  //           operand: 0,
  //         },
  //       ],
  //     },
  //     0
  //   );
  //   setAreas(areas.list);
  //   getLocations(areas.list);
  // }

  async function getLocations(streetId) {
    console.log("streetId :>> ", streetId);

    const locations = await fetchWrapper.get(
      config.apiUrl + LOCATION + "/" + STREET + "/" + streetId
    );
    setLocations(locations);
    getStores(locations);
  }
  async function getStores(locations) {
    const result = fetchWrapper.Post2GetByPaginate(
      config.apiUrl + STORE,
      0,
      {
        filters: locations.map((v) => ({
          field: "locationId",
          value: v.locationId + "",
          operand: 0,
        })),
      },
      0
    );
    result.then((res: any) => {
      console.log('res.list :>> ', res.list);
      setStores(res.list);
    });
  }

  useEffect(() => {
    console.log("getValues() :>> ", locations);
    // const dataFilter = getStores()
  }, [defaultStressId]);

  const handleChange = (event) => {
    setDefaultStressId(event.target.value);
    getLocations(event.target.value);
  };

  useEffect(() => {
    getStreet();
  }, [pathname]);

  return {
    defaultStressId,
    handleChange,
    street,
    bookStores,
  };
};
