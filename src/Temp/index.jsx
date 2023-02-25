import React, { useEffect, useRef, useState } from "react";
import style from "./temp.module.css";
import axios from "axios";

export default function Temp() {
  const [key, setKey] = useState("Enter");
  const [city, setCity] = useState("London");
  const [data, setData] = useState("");
  let [date, setDate] = useState("");
  const timer = useRef();

  useEffect(() => {
    function getCity() {
      try {
        if (key === "Enter") {
          setKey("");
          const urlDate = axios.get(
            `https://timezone.abstractapi.com/v1/current_time/?api_key=fcc04bf1153f422aaa87c205fd9a8ec4=${city}`
          );
          urlDate.then((response) => {
            let time = new Date(response.data.datetime).getTime();
            timer.current = setInterval(() => {
              time += 1000;
              let d = new Date(time);
              setDate(
                `Local time ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
              );
              console.log(
                `Local time ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
              );
            }, 1000);
          });
          const url = axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&&appid=d013f54d9fb14d18b834ba839aa4ea0e`
          );
          url.then((response) => {
            setData(response.data);
            console.log("mounted");
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    getCity();
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
        console.log("unmounted");
      }
    };
  }, [key]);

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center "
      style={{ height: "99vh" }}
    >
      <div
        className={`${style.temp} text-white d-flex align-items-center justify-content-center flex-column`}
        style={{ width: 500, height: 700 }}
      >
        <div
          className=" border d-flex w-75 justify-content-center"
          style={{ position: "absolute", top: "10%" }}
        >
          <input
            placeholder="Search for any city"
            className={style.searchCity}
            type="text"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
            }}
          />
          <span
            style={{ width: 60, height: 50 }}
            className="d-flex justify-content-center alignt-items-center btn btn-secondary text-light"
            onClick={() => {
              setKey("Enter");
            }}
          >
            <i className="bi bi-search"></i>
          </span>
        </div>
        {}
        {data.main && (
          <div>
            {console.log(data.main.temp - 275.15)}{" "}
            <h1>
              {Math.floor(data.main.temp - 273.15)} °C{" "}
              <i
                class={`bi bi-thermometer-${
                  data.main
                    ? data.main.temp - 273.15 < 15
                      ? "low"
                      : data.main.temp - 273.15 < 30 &&
                        data.main.temp - 273.15 >= 15
                      ? "half"
                      : data.main.temp - 273.15 >= 30 &&
                        data.main.temp - 273.15 < 40
                      ? "high"
                      : data.main.temp - 273.15 >= 40
                      ? "sun"
                      : ""
                    : ""
                }`}
              ></i>{" "}
              <span className="m-4">
                {data.weather[0].main}{" "}
                <i
                  class={`bi bi-${
                    data.weather[0].main === "Clouds"
                      ? "cloud"
                      : data.weather[0].main === "Rain"
                      ? "cloud-drizzle"
                      : "sun"
                  }-fill`}
                ></i>
              </span>
            </h1>
            {data.sys && (
              <div>
                <h1>
                  {data.name} in {data.sys.country}
                </h1>
                <div
                  className={`${
                    data.main.temp - 275.15 < 10
                      ? "bg-primary"
                      : data.main.temp - 275.15 > 10 &&
                        data.main.temp - 275.15 < 23
                      ? "bg-success"
                      : "bg-warning"
                  }`}
                  style={{ height: 4 }}
                >
                  {" "}
                </div>
              </div>
            )}
            <div
              style={{
                position: "absolute",
                left: "10%",
                bottom: "10%",
                width: "100%",
              }}
            >
              {console.log(date)}
              {<h1 style={{ position: "absolute" }}>{date}</h1>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
