import React, { useState, Dispatch, SetStateAction } from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import useStyles from './CustomModalStyles';

type CustomModalProps = {
  title: string,
  text: string,
  show: boolean,
  setShow: Dispatch<SetStateAction<boolean>>
}

const CustomModal = (props: CustomModalProps) => {

  // Services

  const classes = useStyles();

  // Functions 

  const handleClose = () => {
    props.setShow(false);
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={ classes.modal }
        open={ props.show }
        onClose={ handleClose }
        closeAfterTransition
        BackdropComponent={ Backdrop }
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={ props.show }>
          <div className={ classes.paper }>
            <h2 id="transition-modal-title">{ props.title }</h2>
            <p id="transition-modal-description">{ props.text }</p>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default CustomModal;