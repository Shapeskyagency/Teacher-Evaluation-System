import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteForm1,deleteForm2,deleteForm3,deleteForm4, deleteWingCoordinator } from '../../redux/userSlice';

// Import all delete actions


function DeleteForm() {
  const { name, id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const deleteAndRedirect = async () => {
      try {
        switch (name) {
          case 'form1':
            await dispatch(deleteForm1(id)).unwrap();
            navigate('/fortnightly-monitor');
            break;
          case 'form2':
            await dispatch(deleteForm2(id)).unwrap();
            navigate('/classroom-walkthrough');
            break;
          case 'form3':
            await dispatch(deleteForm3(id)).unwrap();
            navigate('/notebook-checking-proforma');
            break;
          case 'form4':
            await dispatch(deleteForm4(id)).unwrap();
            navigate('/weekly4form');
            break;
          case 'wing-coordinator':
            await dispatch(deleteWingCoordinator(id)).unwrap();
            navigate('/wing-coordinator');
            break;
          default:
            console.error('Unknown form name');
            break;
        }

       
      } catch (error) {
        console.error('Delete failed:', error);
        navigate('/form-listing'); // Still redirect if error
      }
    };

    deleteAndRedirect();
  }, [name, id, dispatch, navigate]);

  return <div>Deleting {name}...</div>;
}

export default DeleteForm;
