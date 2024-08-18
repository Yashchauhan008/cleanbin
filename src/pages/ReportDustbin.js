import React, { useState, useEffect } from "react";
import "../css/ReportDustbin.css";
import axios from "axios"; // Make sure to install axios if you haven't
import { useParams } from "react-router-dom";

const ReportDustbin = () => {
  const { DustbinId } = useParams();
  const [dustbin, setDustbin] = useState(null);
  const [filledUp, setFillUp] = useState(0);
  const [isDamaged, setIsDamaged] = useState(false);

  const dustbinName = 101; // You can replace this with a dynamic value if needed

  useEffect(() => {
    // Fetch dustbin data from the API
    const fetchDustbin = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/dustbins/name/${DustbinId}`
        );
        setDustbin(response.data);
        setFillUp(response.data.filledUp);
        setIsDamaged(response.data.isDamaged);
      } catch (error) {
        console.error("Error fetching dustbin data:", error);
      }
    };

    fetchDustbin();
  }, [dustbinName]);

  const handleSliderChange = (event) => {
    setFillUp(parseFloat(event.target.value));
  };
  const handleUpdateDustbin = async () => {
    try {
      console.log("Updating dustbin with data:", {
        filledUp: filledUp,
        isDamaged: isDamaged,
      });

      const response = await axios.put(
        `http://localhost:5000/dustbins/name/${DustbinId}`,
        {
          filledUp: filledUp,
          isDamaged: isDamaged,
        }
      );

      console.log("Dustbin updated:", response.data);
    } catch (error) {
      console.error(
        "Error updating dustbin:",
        error.response?.data || error.message
      );
    }
  };

  if (!dustbin) return <p>Loading...</p>;

  return (
    <>
      <h1>{dustbin.color}</h1>
      <h2>{dustbin.type}</h2>
      <label className="slider">
        <input
          type="range"
          className="level"
          value={filledUp}
          min="0"
          max="100"
          onChange={handleSliderChange}
        />
      </label>
      <h2>Filled Up: {filledUp}%</h2>
      <h2>Click button to report damaged dustbin</h2>
      <h2>{isDamaged ? "Damaged" : "Not Damaged"}</h2>
      <button
        onClick={() => {
          setIsDamaged(!isDamaged);
        }}
      >
        Toggle Damaged Status
      </button>
      <button
        onClick={() => {
          handleUpdateDustbin();
        }}
      >
        submit
      </button>
    </>
  );
};

export default ReportDustbin;
