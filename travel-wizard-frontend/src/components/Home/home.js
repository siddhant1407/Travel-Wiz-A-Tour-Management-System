import Search from "../Search/search";
import styles from "./home.module.css";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import { Link } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";

const getCitiesOne = async (str) => {
  try {
    let searchableCity = str.replace(/,/g, "");
    let url = "search/" + searchableCity;

    let { data } = await axiosInstance.get(url);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export default function Home() {
  const [optionsOne, setOptionsOne] = useState([]);
  const [value, setValue] = useState("");
  const [data, setData] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [date, setDate] = useState("");

  const onChangeOne = async (e) => {
    if (e.target.value) {
      let d = await getCitiesOne(e.target.value);
      setOptionsOne(d);
      setData(d);
      console.log(data + "here");
    }
  };

  const isSearchDisabled = !date; // disable search if date is empty
  const today = new Date().toISOString().split("T")[0]; // get current date

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.searchBox}>
          <h2>Search your next destination</h2>
          <Autocomplete
            freeSolo
            filterOptions={(x) => x}
            onChange={(e) => setValue(e.target.innerText)}
            options={optionsOne ? optionsOne.map((obj) => obj.name) : []}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search One"
                onChange={(e) => onChangeOne(e)}
              />
            )}
          />
          <br />
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={today} // set min date to current date
          />
          {isSearchDisabled && <p>Please enter a valid date</p>} {/* display message if date is empty */}
          <br />
          <Link to="/search" state={{ val: value, dat: data, date: date }}>
            <button disabled={isSearchDisabled}>
              Search
            </button>
          </Link>
        </div>
        <h1>{attractions}</h1>
      </div>
    </div>
  );
}
