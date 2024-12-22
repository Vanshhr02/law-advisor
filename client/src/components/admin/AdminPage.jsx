import React, { useState, useEffect } from 'react';
import newRequest from "../../utils/newRequest";
import "./AdminPage.scss";
const AdminPage = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loginStatus, setLoginStatus] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });

  useEffect(() => {
    // Fetch lawyers if logged in
    if (loginStatus) {
      newRequest.get('/adminRouter/lawyers')
        .then(response => {
          setLawyers(response.data);
        })
        .catch(error => {
          console.error('Error fetching lawyer data:', error);
        });
    }
  }, [loginStatus]);

  const handleLogin = async () => {
    try {
      const response = await newRequest.post('/adminRouter/loginasadmin', adminCredentials);
      if (response.status === 200) {
        setLoginStatus(true);
        alert('Login successful!');
      } else {
        alert('Invalid credentials!');
      }
    } catch (error) {
      alert('Login failed!');
    }
  };

  const handleApproval = (lawyerId, status) => {
    newRequest.post('/adminRouter/approve-reject', { lawyerId, status })
      .then(response => {
        alert(`Lawyer ${status}`);
        setLawyers(prevLawyers => 
          prevLawyers.map(lawyer => 
            lawyer.id === lawyerId ? { ...lawyer, status } : lawyer
          )
        );
      })
      .catch(error => {
        alert('Error updating lawyer status');
      });
  };

  return (
    <div className="admin-page">
      {!loginStatus ? (
        <div className="login-form">
          <input
            type="text"
            placeholder="Admin Username"
            value={adminCredentials.username}
            onChange={(e) => setAdminCredentials({ ...adminCredentials, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Admin Password"
            value={adminCredentials.password}
            onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div className="lawyers-list">
          <h2>Lawyer Applications</h2>
          <ul>
            {lawyers.map((lawyer) => (
              <li key={lawyer.id}>
                <p>Name: {lawyer.name}</p>
                <p>Contact: {lawyer.contact}</p>
                <p>Speciality: {lawyer.speciality.join(', ')}</p>
                <p>Status: {lawyer.status || 'Pending'}</p>
                <button onClick={() => handleApproval(lawyer.id, 'approved')}>Approve</button>
                <button onClick={() => handleApproval(lawyer.id, 'rejected')}>Reject</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
