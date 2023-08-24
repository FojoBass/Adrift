import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { useGlobalContext } from '../../context';

const Confirmations = () => {
  const { confirmations, setConfirmations, setAffirm } = useGlobalContext();

  return confirmations?.isShow ? (
    <section id='confirm_sect'>
      <div className='center_sect'>
        <h3 className='heading'>
          Confirm
          <button
            className='close_btn'
            onClick={() =>
              setConfirmations && setConfirmations({ isShow: false, msg: '' })
            }
          >
            <FaTimes />
          </button>
        </h3>

        <p className='question'>
          Are you sure you want to {confirmations?.msg}?
        </p>

        <div className='btns_wrapper'>
          <button
            className='act_btn yes_btn'
            onClick={() => {
              setAffirm && setAffirm(true);
              setConfirmations && setConfirmations({ isShow: false, msg: '' });
            }}
          >
            Yes
          </button>
          <button
            className='act_btn no_btn'
            onClick={() =>
              setConfirmations && setConfirmations({ isShow: false, msg: '' })
            }
          >
            No
          </button>
        </div>
      </div>
    </section>
  ) : (
    <></>
  );
};

export default Confirmations;
