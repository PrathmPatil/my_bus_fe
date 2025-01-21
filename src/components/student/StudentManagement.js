import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Student.css';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    parentId: '',
    busId: '',
    pickupLocation: {
      type: 'Point',
      coordinates: [0, 0],
    },
    dropLocation: {
      type: 'Point',
      coordinates: [0, 0],
    },
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/students', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching students');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('pickup') || name.includes('drop')) {
      const [locationType, coordType] = name.split('.');
      setFormData({
        ...formData,
        [locationType]: {
          ...formData[locationType],
          coordinates: coordType === 'lat' 
            ? [parseFloat(value), formData[locationType].coordinates[1]]
            : [formData[locationType].coordinates[0], parseFloat(value)],
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/students', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Student added successfully');
      setFormData({
        name: '',
        parentId: '',
        busId: '',
        pickupLocation: { type: 'Point', coordinates: [0, 0] },
        dropLocation: { type: 'Point', coordinates: [0, 0] },
      });
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding student');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/students/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Student deleted successfully');
        fetchStudents();
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting student');
      }
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/students/${id}/status`,
        status,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating status');
    }
  };

  return (
    <div className="student-management">
      <h2>Student Management</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="student-form">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Parent ID</label>
          <input
            type="text"
            name="parentId"
            value={formData.parentId}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Bus ID</label>
          <input
            type="text"
            name="busId"
            value={formData.busId}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Pickup Location (Lat, Long)</label>
          <input
            type="number"
            name="pickupLocation.lat"
            value={formData.pickupLocation.coordinates[0]}
            onChange={handleInputChange}
            step="any"
            required
          />
          <input
            type="number"
            name="pickupLocation.long"
            value={formData.pickupLocation.coordinates[1]}
            onChange={handleInputChange}
            step="any"
            required
          />
        </div>
        <div className="form-group">
          <label>Drop Location (Lat, Long)</label>
          <input
            type="number"
            name="dropLocation.lat"
            value={formData.dropLocation.coordinates[0]}
            onChange={handleInputChange}
            step="any"
            required
          />
          <input
            type="number"
            name="dropLocation.long"
            value={formData.dropLocation.coordinates[1]}
            onChange={handleInputChange}
            step="any"
            required
          />
        </div>
        <button type="submit">Add Student</button>
      </form>

      <div className="student-list">
        <h3>Students</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Parent</th>
              <th>Bus</th>
              <th>Pickup Status</th>
              <th>Drop Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.parentId?.name}</td>
                <td>{student.busId?.busNumber}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={student.pickupStatus}
                    onChange={() => updateStatus(student._id, { pickupStatus: !student.pickupStatus })}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={student.dropStatus}
                    onChange={() => updateStatus(student._id, { dropStatus: !student.dropStatus })}
                  />
                </td>
                <td>
                  <button onClick={() => handleDelete(student._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentManagement;
