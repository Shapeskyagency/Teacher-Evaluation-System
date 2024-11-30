import React, { useState, useMemo } from 'react';
import { Menu } from './Data';
import { getUserId } from '../Utils/auth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LoginOutlined } from '@ant-design/icons';

function Sidebar() {
  const navigate = useNavigate();
  const PATHROUTE =useLocation().pathname;
  const Role = getUserId()?.access || 'default'; // Fallback for missing role
  const [selectedKey, setSelectedKey] = useState();

  // Memoize menu items for performance
  const menuItems = useMemo(() => Menu[Role] || [], [Role]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.replace('/')
  };

  return (
    <>
      <h5 className="pt-3 text-dark px-4 mb-0 mt-3">Evaluation System</h5>
      <div
        className="d-flex flex-column pt-5 px-4 justify-content-between align-items-start"
        style={{ height: '80dvh' }}
      >
        {/* Menu Items */}
        <div className="d-flex flex-column w-100">
          {menuItems.map((item, index) => 
            item.label ? (
              <p
                key={index}
                className="m-0 text-start text-primary px-3"
              >
                {item.label}
              </p>
            ) : (
              <Link
                key={index}
                onClick={() => setSelectedKey(index)}
                className={`IndexColor ${
                  selectedKey === index || PATHROUTE === item.route
                    ? 'btn btn-primary mb-3 text-start'
                    : 'btn mb-3 text-start'
                }`}
                to={item.route}
              >
                {item.icon} {item.name}
              </Link>
            )
          )}
        </div>
        {/* Logout Button */}
        <button
          className="btn btn-outline-primary mb-3 text-start w-100"
          onClick={handleLogout}
        >
          <LoginOutlined /> Logout
        </button>
      </div>
    </>
  );
}

export default Sidebar;
