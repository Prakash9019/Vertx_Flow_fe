import "./style.css";
import { useNavigate } from "react-router";
import Button from "../button/component";
import { useEffect, useState } from "react";

export default function Navigation({cb}) {
  const navigate = useNavigate()
  const [currentPage, setPage] = useState("explore")
  useEffect(() => {
    setPage(window.location.href.split("/").pop());
  }, [])
  return (
    <div className="nav">
      <ion-icon name="close-outline" onClick={() => cb()} color={"white"} className="close"></ion-icon>
      <div className="linkwrap">
        <div className={currentPage == "explore" ? "link sel" : "link"}>
          <ion-icon name="search-outline"></ion-icon>
          <a href="/explore" className="lk">
            Explore
          </a>
        </div>
        <div className={currentPage == "outreach" ? "link sel" : "link"}>
          <ion-icon name="globe-outline"></ion-icon>
          <a href="/outreach" className="lk">
            Outreach
          </a>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <Button
          theme={"light"}
          context={"VERTX FLOW"}
          callback={() => {
            navigate("/flow/match flow");
          }}
        />
        {
          window.localStorage.getItem("token") != null ? (
            <Button
              theme={"dark"}
              context={"GET OUT"}
              callback={() => {
                window.localStorage.removeItem("token");
                navigate("/authentication");
              }}
            />
          ) : null
        }
      </div>
    </div>
  );
}
