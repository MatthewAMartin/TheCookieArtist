import { useState, useEffect, useRef } from "react";
import {
  getLatestCookieIDAPI,
  postCookieAPI,
  postCookieImageAPI,
} from "../pages/api/cookiesAPI";
import { Modal, Button, CloseButton, Form, Alert } from "react-bootstrap";

const DeleteModal = ({ show, handleClose, deleteRecord }) => {
  // Component Variables
  const componentState = "Delete";
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  // useEffect(() => {
  //   updateForm("Create"); // Always open at "Create"
  // }, []);

  return (
    <Modal show={show} onHide={handleClose}>
      <div className="form-card">
        <h2 style={{ marginBottom: "20px" }}>Delete</h2>
        <CloseButton
          type="button"
          className={"btn btn-close btn-block btn-form-close"}
          onClick={() => {
            handleClose();
          }}
        />
        {error && (
          <Alert key={"danger"} variant={"danger"}>
            {alertMessage}
          </Alert>
        )}
        <Form>
          <div className="row mb-4">
            <p>
              Are you sure you want to delete this record? This cannot be
              undone, it will be deleted forever and cannot be recovered.
            </p>
          </div>
          <div
            className="col-sm-12"
            style={{ display: "flex", justifyContent: "right" }}
          >
            <Button
              type="button"
              variant={"danger"}
              style={{ width: 25 + "%", marginRight: "10px" }}
              onClick={() => {
                deleteRecord();
                handleClose();
              }}
            >
              {componentState}
            </Button>
            <Button
              type="button"
              variant={"secondary"}
              style={{ width: 25 + "%" }}
              onClick={() => {
                handleClose();
              }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default DeleteModal;
