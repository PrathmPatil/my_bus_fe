import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Bus.css';

const BusManagement = () => {
  const [buses, setBuses] = useState([]);
  const [formData, setFormData] = useState({
    busNumber: '',
    capacity: '',
    driverId: '',
    helperId: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/buses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBuses(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching buses');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/buses', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Bus added successfully');
      setFormData({ busNumber: '', capacity: '', driverId: '', helperId: '' });
      fetchBuses();
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding bus');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/buses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Bus deleted successfully');
        fetchBuses();
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting bus');
      }
    }
  };

  return (
    <div className="bus-management">
      <h2>Bus Management</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="bus-form">
        <div className="form-group">
          <label>Bus Number</label>
          <input
            type="text"
            name="busNumber"
            value={formData.busNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Capacity</label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Driver ID</label>
          <input
            type="text"
            name="driverId"
            value={formData.driverId}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Helper ID</label>
          <input
            type="text"
            name="helperId"
            value={formData.helperId}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Add Bus</button>
      </form>

      <div className="bus-list">
        <h3>Buses</h3>
        <table>
          <thead>
            <tr>
              <th>Bus Number</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Driver</th>
              <th>Helper</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus) => (
              <tr key={bus._id}>
                <td>{bus.busNumber}</td>
                <td>{bus.capacity}</td>
                <td>{bus.status}</td>
                <td>{bus.driverId?.name || 'Not assigned'}</td>
                <td>{bus.helperId?.name || 'Not assigned'}</td>
                <td>
                  <button onClick={() => handleDelete(bus._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BusManagement;
