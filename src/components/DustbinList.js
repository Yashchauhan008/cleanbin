import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../index.css";

const DustbinList = () => {
  const [dustbins, setDustbins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editDustbinId, setEditDustbinId] = useState(null);
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
      setDustbins(response.data);
    } catch (error) {
      console.error('Error fetching dustbins:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDustbin(prevState => ({
      ...prevState,
      [name]: name === 'isDamaged' ? value === 'true' : value
    }));
  };

  const handleAddDustbin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/dustbins/add`, newDustbin);
      setDustbins([...dustbins, response.data]);
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error adding dustbin:', error);
    }
  };

  const handleEditDustbin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${BASE_URL}/dustbins/edit/${editDustbinId}`, newDustbin);
      setDustbins(dustbins.map(dustbin => (dustbin._id === editDustbinId ? response.data : dustbin)));
      setShowModal(false);
      resetForm();
      setIsEditing(false);
      setEditDustbinId(null);
    } catch (error) {
      console.error('Error editing dustbin:', error);
    }
  };

  const handleDeleteDustbin = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/dustbins/delete/${id}`);
      setDustbins(dustbins.filter(dustbin => dustbin._id !== id));
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

  return (
    <div>
      <h1>Dustbin List</h1>
      <button onClick={() => { resetForm(); setShowModal(true); }}>Add Dustbin</button>
      <ul>
        {dustbins.map((dustbin) => (
          <li key={dustbin._id}>
            {dustbin.dustbinName} - {dustbin.type} - {dustbin.address} - Filled: {dustbin.filledUp}% - Responsible: {dustbin.responsiblePerson}
            <img src={dustbin.qrcode} alt="QR Code" style={{ width: 100, height: 100 }} />
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
    </div>
  );
};

export default DustbinList;
