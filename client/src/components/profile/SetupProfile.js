import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AvailabilityPicker from './AvailabilityPicker';
import CreatableSelect from 'react-select/creatable';
import useFirestore from '../../firestore';
import { useAuthContext } from '../context/UserAuthContext';
import { Alert } from 'react-bootstrap';

function SetupProfile() {

  const {user} = useAuthContext();
  const {data, updateDocument} = useFirestore();
  const [show, setShow] = useState(false);
  const [didSaveSchedule, setDidSaveSchedule] = useState(false);
  const USERS = "users";

  const subjectOptions = [
    {
        label: "science",
        value: "science"
    },
    {
        label: "math",
        value: "math"
    },
    {
      label: "english",
      value: "english"
    },
    {
      label: "coding",
      value: "coding"
    }
  ]

  const [selectedOptions, setSelectedOptions] = useState([]);
  console.log("selectedoptions", selectedOptions)
  function handleSelectChange(newValue, actionMeta) {
    setSelectedOptions(newValue);
  }

  useEffect(() =>{
    // console.log("data.reactLibrarySchedule", data)
    if(data?.userRole === "tutors" && data?.subjects?.length > 0){
        setSelectedOptions(getLabelAndValue(data?.subjects))
    }else{
        setSelectedOptions([]);
    }
}, [data]);

  function getLabelAndValue(listOfValues){
    return listOfValues?.map(listElement => {
      return {
        label: listElement,
        value: listElement
      }
    })
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
  const handleSaveSchedule = () => setDidSaveSchedule(true);

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
                <CreatableSelect 
                    isMulti 
                    options={subjectOptions} 
                    onChange={handleSelectChange}
                    value={selectedOptions}

                />

                <div>Select your availability</div>
                <AvailabilityPicker handleSaveSchedule={handleSaveSchedule}/>
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {didSaveSchedule && selectedOptions?.length > 0 && <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>}
          {(didSaveSchedule && selectedOptions?.length > 0) || <Alert>
            You must select at least one subject and click on Save Availability to submit and setup your profile </Alert>}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SetupProfile;