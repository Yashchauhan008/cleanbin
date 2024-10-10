import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../index.css";

const DustbinList = () => {
  const [dustbins, setDustbins] = useState([]); // State to store dustbin list
  const [showModal, setShowModal] = useState(false); // State to handle modal visibility
  const [newDustbin, setNewDustbin] = useState({
    type: 'dry',
    color: '',
    filledUp: 0,
    address: '',
    dustbinName: '',
    responsiblePerson: '',
    isDamaged: false, // Set as a boolean
  }); // State to handle new dustbin form data

  // Fetch dustbins from backend
  useEffect(() => {
    fetchDustbins();
  }, []);

  const fetchDustbins = async () => {
    try {
      const response = await axios.get('http://localhost:5000/dustbins'); // Fetch all dustbins
      setDustbins(response.data);
    } catch (error) {
      console.error('Error fetching dustbins:', error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Convert filledUp and dustbinName to numbers
    if (name === "filledUp" || name === "dustbinName") {
      setNewDustbin({ ...newDustbin, [name]: Number(value) });
    } else {
      setNewDustbin({ ...newDustbin, [name]: value });
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    setNewDustbin({ ...newDustbin, isDamaged: e.target.checked });
  };

  // Handle form submission to add a new dustbin
  const handleAddDustbin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/dustbins/add', newDustbin); // Add dustbin via POST request
      setDustbins([...dustbins, response.data]); // Update the list with the new dustbin
      setShowModal(false); // Close the modal after adding
      setNewDustbin({
        type: 'dry',
        color: '',
        filledUp: 0,
        address: '',
        dustbinName: '',
        responsiblePerson: '',
        isDamaged: false,
      }); // Reset form fields
    } catch (error) {
      console.error('Error adding dustbin:', error.response?.data || error);
    }
  };

  return (
    <div>
      <h1>Dustbin List</h1>

      {/* Button to open Add Dustbin Modal */}
      <button onClick={() => setShowModal(true)}>Add Dustbin</button>

      {/* Display dustbin list */}
      <ul>
        {dustbins.map((dustbin) => (
          <li key={dustbin._id}>
            {dustbin.dustbinName} - {dustbin.type} - {dustbin.address} - Filled: {dustbin.filledUp}% - Responsible: {dustbin.responsiblePerson} - Damaged: {dustbin.isDamaged ? 'Yes' : 'No'}
          </li>
        ))}
      </ul>

      {/* Add Dustbin Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <h2>Add Dustbin</h2>
            <form onSubmit={handleAddDustbin}>
              <label>Type:</label>
              <select name="type" value={newDustbin.type} onChange={handleInputChange}>
                <option value="dry">Dry</option>
                <option value="wet">Wet</option>
              </select>

              <label>Color:</label>
              <input
                type="text"
                name="color"
                value={newDustbin.color}
                onChange={handleInputChange}
                required
              />

              <label>Filled Up (%):</label>
              <input
                type="number"
                name="filledUp"
                value={newDustbin.filledUp}
                onChange={handleInputChange}
                min="0"
                max="100"
                required
              />

              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={newDustbin.address}
                onChange={handleInputChange}
                required
              />

              <label>Dustbin Name (Number):</label>
              <input
                type="number"
                name="dustbinName"
                value={newDustbin.dustbinName}
                onChange={handleInputChange}
                required
              />

              <label>Responsible Person:</label>
              <input
                type="text"
                name="responsiblePerson"
                value={newDustbin.responsiblePerson}
                onChange={handleInputChange}
                required
              />

              <label>Is Damaged:</label>
              <input
                type="checkbox"
                name="isDamaged"
                checked={newDustbin.isDamaged}
                onChange={handleCheckboxChange}
              />

              <button type="submit">Add Dustbin</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DustbinList;
