import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchWrapper } from "../../../../../_helpers/fetch-wrapper";
import config from "../../../../../config";
import {
  AREA,
  LOCATION,
  POINT_HISTORY,
  STORE,
  STREET,
} from "../../../../../_helpers/const/const";
import { useForm } from "react-hook-form";

export const useStoreHistoryHook = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [historyList, setHistoryList] = useState([]);
  const [openPointHistory, setOpenPointHistory] = useState(null);

  const [street, setStreet] = useState([]);
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

  async function getLocations(streetId) {
    const locations = await fetchWrapper.get(
      config.apiUrl + LOCATION + "/" + STREET + "/" + streetId
    );
    setLocations(locations);
    getStores(locations);
  }
  async function getStores(locations) {
    const licatioinIds = locations.map((v) => v.locationId);
    const result = fetchWrapper.get(config.apiUrl + STORE);
    result.then((res: any) => {
      const filter = res.filter((v) => licatioinIds.includes(v.locationId));
      setStores(filter);
    });
  }

  const handleChange = (event) => {
    setDefaultStressId(event.target.value);
    getLocations(event.target.value);
  };

  useEffect(() => {
    getStreet();
  }, [pathname]);

  const openDialogCreasePointHistory = (storeId) => {
    navigate("/membership/store-history/" + storeId, { replace: true });
  };

  return {
    defaultStressId,
    handleChange,
    street,
    bookStores,
    openDialogCreasePointHistory,
    historyList,
    openPointHistory,
    setOpenPointHistory,
  };
};
