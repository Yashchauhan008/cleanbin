import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../index.css";
import DustbinCardPopup from './DustbinCardPopup';  // Import the Popup component

const DustbinList = () => {
  const [dustbins, setDustbins] = useState([]);
  const [filteredDustbins, setFilteredDustbins] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');  // Single search query state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editDustbinId, setEditDustbinId] = useState(null);
  const [selectedDustbin, setSelectedDustbin] = useState(null); // To track the dustbin for the popup
  const [newDustbin, setNewDustbin] = useState({
    type: 'dry',
    color: '',
    filledUp: 0,
    address: '',
    dustbinName: '',
    responsiblePerson: '',
    isDamaged: false,
    qrcode: ''
  });

  // Get the base URL from environment variable
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    fetchDustbins();
  }, []);

  const fetchDustbins = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/dustbins`);
      const sortedDustbins = response.data.sort((a, b) => b.filledUp - a.filledUp); // Sort by filledUp (desc)
      setDustbins(sortedDustbins);
      setFilteredDustbins(sortedDustbins); // Initially, all dustbins are shown
    } catch (error) {
      console.error('Error fetching dustbins:', error);
    }
  };

  // Handle input change for new dustbin and form editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDustbin(prevState => ({
      ...prevState,
      [name]: name === 'isDamaged' ? value === 'true' : value
    }));
  };

  // Handle add dustbin
  const handleAddDustbin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/dustbins/add`, newDustbin);
      const updatedDustbins = [...dustbins, response.data].sort((a, b) => b.filledUp - a.filledUp);
      setDustbins(updatedDustbins);
      setFilteredDustbins(updatedDustbins);
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error adding dustbin:', error);
    }
  };

  // Handle edit dustbin
  const handleEditDustbin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${BASE_URL}/dustbins/edit/${editDustbinId}`, newDustbin);
      const updatedDustbins = dustbins.map(dustbin => 
        dustbin._id === editDustbinId ? response.data : dustbin
      ).sort((a, b) => b.filledUp - a.filledUp);
      setDustbins(updatedDustbins);
      setFilteredDustbins(updatedDustbins);
      setShowModal(false);
      resetForm();
      setIsEditing(false);
      setEditDustbinId(null);
    } catch (error) {
      console.error('Error editing dustbin:', error);
    }
  };

  // Handle delete dustbin
  const handleDeleteDustbin = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/dustbins/delete/${id}`);
      const updatedDustbins = dustbins.filter(dustbin => dustbin._id !== id);
      setDustbins(updatedDustbins);
      setFilteredDustbins(updatedDustbins);
    } catch (error) {
      console.error('Error deleting dustbin:', error);
    }
  };

  const handleEditClick = (dustbin) => {
    setNewDustbin({
      type: dustbin.type,
      color: dustbin.color,
      filledUp: dustbin.filledUp,
      address: dustbin.address,
      dustbinName: dustbin.dustbinName,
      responsiblePerson: dustbin.responsiblePerson,
      isDamaged: dustbin.isDamaged,
      qrcode: dustbin.qrcode
    });
    setEditDustbinId(dustbin._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleQrCodeClick = (dustbin) => {
    setSelectedDustbin(dustbin); // Set the selected dustbin for the popup
  };

  const resetForm = () => {
    setNewDustbin({
      type: 'dry',
      color: '',
      filledUp: 0,
      address: '',
      dustbinName: '',
      responsiblePerson: '',
      isDamaged: false,
      qrcode: ''
    });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter dustbins based on single search input
  useEffect(() => {
    const filtered = dustbins.filter(dustbin => {
      const searchLower = searchQuery.toLowerCase();
      return (
        dustbin.dustbinName.toLowerCase().includes(searchLower) || // Search by Dustbin Number/Name
        dustbin.address.toLowerCase().includes(searchLower) ||     // Search by City/Address
        dustbin.responsiblePerson.toLowerCase().includes(searchLower)  // Search by Responsible Person
      );
    });
    setFilteredDustbins(filtered);
  }, [searchQuery, dustbins]);

  return (
    <div>
      <h1>Dustbin List</h1>
      
      {/* Single Search input */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Dustbin Number, City or Responsible Person"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <button onClick={() => { resetForm(); setShowModal(true); }}>Add Dustbin</button>
      
      {/* List of filtered dustbins */}
      <ul>
        {filteredDustbins.map((dustbin) => (
          <li key={dustbin._id}>
            {dustbin.dustbinName} - {dustbin.type} - {dustbin.address} - Filled: {dustbin.filledUp}% - Responsible: {dustbin.responsiblePerson}
            <img
              src={dustbin.qrcode}
              alt="QR Code"
              style={{ width: 100, height: 100, cursor: 'pointer' }}
              onClick={() => handleQrCodeClick(dustbin)} // Open popup on click
            />
            <button onClick={() => handleEditClick(dustbin)}>Edit</button>
            <button onClick={() => handleDeleteDustbin(dustbin._id)}>Delete</button>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <h2>{isEditing ? 'Edit Dustbin' : 'Add Dustbin'}</h2>
            <form onSubmit={isEditing ? handleEditDustbin : handleAddDustbin}>
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

              <label>Dustbin Name:</label>
              <input
                type="text"
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
              <select name="isDamaged" value={newDustbin.isDamaged} onChange={handleInputChange}>
                <option value={false}>No</option>
                <option value={true}>Yes</option>
              </select>

              <button type="submit">{isEditing ? 'Update Dustbin' : 'Add Dustbin'}</button>
            </form>
          </div>
        </div>
      )}

      {selectedDustbin && (
        <DustbinCardPopup
          dustbin={selectedDustbin}
          onClose={() => setSelectedDustbin(null)} // Close the popup
        />
      )}
    </div>
  );
};

export default DustbinList;
