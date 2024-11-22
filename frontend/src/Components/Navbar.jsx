import React from 'react';
import { getUserId } from '../Utils/auth';
import { useSelector } from 'react-redux';
import { Dropdown, Menu, message } from 'antd';
import { BellFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const role = getUserId().access;
  const userNotification = useSelector((state) => state.user.Notification);

  // Transform notifications into menu items
  const menuItems = userNotification?.map((item, index) => ({
    key: index.toString(),
    route:item.route,
    label: item.title,
  }));
const navigate = useNavigate()
  const onClick = ({key}) => {
    const clickedNotification = userNotification[key];
    navigate(clickedNotification.route)
  };

  const menu = <Menu items={menuItems} onClick={onClick} />;

  return (
    <div>
      <div className="d-flex gap-3">
        <p className="fs-5 fw-bold">
          Hi,
          {role === 'Superadmin' && ' Super admin'}
          {role === 'Observer' && ' Observer'}
          {role === 'Teacher' && ' Teacher'}
        </p>

        <Dropdown overlay={menu} trigger={['click']}>
          <a onClick={(e) => e.preventDefault()}  className='position-relative d-block'>
            <BellFilled style={{ fontSize: '20px', cursor: 'pointer',color:"#fff", fontWeight:"500" }} />
            {menu?.props?.items && 
            <span className='bg-danger px-2 rounded-5 text-white position-absolute' style={{width:"fit-content", height:"40px",
              width: "fit-content",
              height: 20,
              textAlign: 'center',
              top: 12,
              left: 9,
              fontSize: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"

         }}>
          {menu?.props?.items?.length}
           </span>}
          </a>
        </Dropdown>
      </div>
    </div>
  );
}

export default Navbar;
