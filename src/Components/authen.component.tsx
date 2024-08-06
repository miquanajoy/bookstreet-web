import { useState } from "react";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { login } from "../_services";
import { Role } from "../models/Role";
import { useForm } from "react-hook-form";
import "./../styles/login.css";
import { ROUTER } from "../_helpers/const/const";

export default function AuthenPage() {
  const { register, handleSubmit } = useForm();
  const location = useLocation();
  const navigate = useNavigate();

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
      if (val.statusCode === 200) {
        switch (val.data.role) {
          case Role.Admin:
            navigate(ROUTER.book.url, { replace: true });
            break;
          case Role.Store:
            navigate(ROUTER.book.url, { replace: true });
            break;

          default:
            break;
        }
      }
    });
  };
  return (
    <div className="login-box">
      <div className="container right-panel-active">
        <form className="form" id="form2" onSubmit={handleSubmit(loginHandle)}>
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
  );
}
