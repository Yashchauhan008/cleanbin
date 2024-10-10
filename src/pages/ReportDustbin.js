import React, { useState, useEffect } from "react";
import "../css/ReportDustbin.css";
import axios from "axios"; // Make sure to install axios if you haven't
import { useNavigate, useParams } from "react-router-dom";
import logo from '../assets/logo.png';

const ReportDustbin = () => {
  const navigate = useNavigate()
  const { DustbinId } = useParams();
  const [dustbin, setDustbin] = useState(null);
  const [filledUp, setFillUp] = useState(0);
  const [isDamaged, setIsDamaged] = useState(false);

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
  }, [DustbinId]);

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
      <div className="ReportDustbin">
        <div className="binlogo">
          <img src={logo} alt="Logo" />
        </div>
        <label className="slider">
          <input
            type="range"
            className={`level ${dustbin.color}`}
            value={filledUp}
            min="0"
            max="100"
            onChange={handleSliderChange}
          />
        </label>
        <div className="bindata">
          <h2>Filled Up: {filledUp}%</h2>
          <h2>{dustbin.dustbinName}</h2>
          <h3>Click button to report damaged dustbin</h3>
          <h4 className={`${dustbin.color}`}>{dustbin.type} waste dustbin</h4>
        </div>
        <div className="binbtns">
          <button
            className="button"
            onClick={() => {
              if (!isDamaged) {
                setIsDamaged(true);
              }
            }}
            disabled={isDamaged} // Disable the button if already reported
          >
            <span className="first-child">
              {isDamaged ? "Reported" : "Report"}
            </span>
            <span className={`last-child ${dustbin.color}`}>
              {isDamaged ? "Reported" : "Reported"}
            </span>
          </button>
          <button
            className="button"
            onClick={() => {
              handleUpdateDustbin();
              navigate("/thanks")
            }}
          >
            <span className="first-child">Submit</span>
            <span className={`last-child ${dustbin.color}`}>Thanks!</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ReportDustbin;
