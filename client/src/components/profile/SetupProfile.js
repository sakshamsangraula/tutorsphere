import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AvailabilityPicker from './AvailabilityPicker';
import CreatableSelect from 'react-select/creatable';
import useFirestore from '../../firestore';
import { useAuthContext } from '../context/UserAuthContext';

function SetupProfile() {

  const {user} = useAuthContext();
  const {updateDocument} = useFirestore();
  const [show, setShow] = useState(false);
  const USERS = "users";

  const subjectOptions = [
    {
        label: "Science",
        value: "science"
    },
    {
        label: "Math",
        value: "math"
    }
  ]

  const [selectedOptions, setSelectedOptions] = useState([]);
  console.log("selectedoptions", selectedOptions)
  function handleSelectChange(newValue, actionMeta) {
    setSelectedOptions(newValue);
  }

  const handleSubmit = async () => {
    // add list of subjects to firestore
    const subjectTitles = selectedOptions.map(subject => subject.value);
    try{
        // TODO: make sure at least one subject is selected by the tutor before saving data to the database. Also, try to get the selected values from firestore if it exists and show them by default 
        const subjectAddResponse = await updateDocument(USERS, user.uid, {subjects: subjectTitles});
        // set profile setup to true TODO: also need to add about me description (maybe wrap this around form (about me, other values, and picking availability))
        const updatedProfileSetupValue = await updateDocument(USERS, user.uid, {isProfileSetup: true});
        setShow(false);
    }catch(err){
        alert("Error submitting subjects to firestore", err);
    }
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

// TODO: reuse modal in setupProfile (here) and MeetingSchedulerFinal modal
  return (
    <>
      <button className={"btn btn-danger"} onClick={handleShow}>
        Setup Profile
      </button>

      <Modal show={show} onHide={handleClose} size="xl" animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Setup Tutor Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div>
                <p>Select subjects you would like to teach</p>
                <p>selection box</p>

                <CreatableSelect 
                    isMulti 
                    options={subjectOptions} 
                    onChange={handleSelectChange}

                />

                <p>Select your availability</p>
                <AvailabilityPicker />
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SetupProfile;