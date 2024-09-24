import { useEffect, useState } from "react";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { alertService, login, logout } from "../_services";
import { Role } from "../models/Role";
import { useForm } from "react-hook-form";
import "./../styles/login.css";
import { ROUTER } from "../_helpers/const/const";
import LoadingComponent from "./loading.component";
import {
  isLoadingVarialble,
  loadingService,
} from "../_services/loading.service";
import { AlertModel } from "../models/AlertModel";
import AlertContext from "./alert.component";

export default function AuthenPage() {
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [isShowAlert, setIsShowAlert] = useState({});

  const { register, handleSubmit } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    alertService.onAlert().subscribe({
      next: (v: AlertModel) => {
        setIsShowAlert({
          content: v.content,
        });
        setTimeout(() => {
          setIsShowAlert({});
        }, 2500);
      },
    });
  }, []);
  function useCurrentURL() {
    const params = useParams();

    return {
      pathname: location.pathname.includes(Role.Admin)
        ? location.pathname
        : location.pathname.replace("/", ""),
      search: location.search,
      params,
    };
  }
  const { pathname, search, params } = useCurrentURL();
  const [justifyActive, setJustifyActive] = useState("tab1");

  const handleJustifyClick = (value: any) => {
    if (value === justifyActive) {
      return;
    }

    setJustifyActive(value);
  };

  const loginHandle = (val) => {
    login(val.email, val.password).then((val) => {
      if (!val.success) {
        alertService.alert({
          content: val.message,
        });
        return;
      }
      if (val.statusCode === 200) {
        switch (val.data.role) {
          case Role.Admin:
            navigate(ROUTER.book.url, { replace: true });
            break;
          case Role.GiftStore:
            navigate(ROUTER.roleGiftStore.gift.url, { replace: true });
            break;
          // case Role.Manager:
          //   navigate(ROUTER.roleManager.customerPoint.url, { replace: true });
          //   break;
          case Role.Store:
            if (!val.data.user.storeId) {
              alertService.alert({
                content: "Chưa được ủy quyền",
              });
              logout();
              return;
            }
            navigate(ROUTER.book.url, { replace: true });
            break;

          default:
            break;
        }
      }
    });
  };

  useEffect(() => {
    isLoadingVarialble.subscribe({
      next: (v) => {
        setIsShowLoading(v);
      },
    });
  }, []);
  return (
    <div>
      <AlertContext onAlert={isShowAlert} content="Demo alert" />
      <LoadingComponent onLoading={isShowLoading} />

      <div className="login-box">
        <div className="container right-panel-active">
          <form
            className="form"
            id="form2"
            onSubmit={handleSubmit(loginHandle)}
          >
            <h2 className="form__title">Sign In</h2>
            <input
              type="text"
              placeholder="Email"
              className="input"
              {...register("email")}
            />
            <input
              type="password"
              placeholder="Password"
              className="input"
              {...register("password")}
            />

            <button className="btn">Sign In</button>
          </form>
        </div>
      </div>
    </div>
  );
}
