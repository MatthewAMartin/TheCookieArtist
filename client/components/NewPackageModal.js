import { useState, useEffect } from "react";
import { postPackageAPI } from "../pages/api/packagesAPI";
import { Modal, Button, CloseButton, Form, Alert } from "react-bootstrap";

const NewPackageModal = ({ show, handleClose, cookiesArr, getAllPackages }) => {
  // Component Variables
  const componentState = "Create";
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  // Package Data Variables
  const [cookieName, setCookieName] = useState(0);
  const [packageAmount, setPackageAmount] = useState("");
  const [packageCost, setPackageCost] = useState("");
  const [packageActiveStatus, setPackageActiveStatus] = useState(1);

  // Form Validity Variables
  const [validAmount, setValidAmount] = useState(true);
  const [validCost, setValidCost] = useState(true);

  useEffect(() => {
    if (cookiesArr.length != 0) {
      console.log(cookiesArr);
      setCookieName(cookiesArr[0].cookie_id);
    }
  }, [cookiesArr]);

  /**
   * submitForm handles the submission of the form, depending on the
   * current form type selected by the user.
   *
   */
  const submitForm = async () => {
    setError(false); // Initially, there are no errors

    try {
      // Declare storage variable
      let response = [];
      let validityResults = [];

      // Check form input validity
      validityResults = validateForm();

      if (validityResults[0] === true && validityResults[1] === true) {
        // Reset validity variables
        setValidAmount(true);
        setValidCost(true);

        // Submit
        response = await createPackageRecord();

        if (response[0] === 400) {
          // If API response status is an ERROR response
          setError(true);
          // Set the output alertMessage
          setAlertMessage(`ERROR: ${response[1]}`);
          return; // End the function
        } else {
          // Reset the form values
          setCookieName(0);
          setPackageAmount("");
          setPackageCost("");
          setPackageActiveStatus(1);
          // Refresh the cookie data
          getAllPackages("New");
          // Close the Modal
          handleClose();
        }
      } else {
        // Stop form submission
        return;
      }
    } catch (error) {
      setError(true);
      setAlertMessage(error.alertMessage);
    } finally {
      // Show error alertMessage for 3 seconds
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

  /**
   * validateForm performs the validation checks for form inputs.
   *
   * @return {*} An array containing the results of the validity check [packageAmount (bool), packageCost (bool)].
   */
  const validateForm = () => {
    let validAmount = false;
    let validCost = false;

    // Validate packageAmount Input
    if (!isNaN(parseFloat(packageAmount))) {
      validAmount = true;
    }

    // Validate packageCost Input
    if (!isNaN(parseFloat(packageCost))) {
      validCost = true;
    }

    // Set validity variables
    setValidAmount(validAmount);
    setValidCost(validCost);

    // Return Results
    return [validAmount, validCost];
  };

  /**
   * createPackageRecord handles the API call to create a
   * Package record in the database. It creates the Package record
   * with the data entered in the form, uploads the images selected,
   * and links the images to the Package record.
   *
   * @return {*} Array containing [API call status (INT), API call alertMessage (STRING)].
   */
  const createPackageRecord = async () => {
    // Initialise the body of the API call
    let APIBody = `{"cookie_id": ${cookieName}, "amount": ${packageAmount}, "cost": ${packageCost}, "active_status": ${packageActiveStatus}}`;

    // Declare storage variables
    let createStatus;
    let createMsg;

    // Get API response to POST request (create record)
    const createResponse = await postPackageAPI(APIBody)
      .then((results) => {
        // Store result status
        createStatus = results[0].status;
        return results[1]; // Return resulting promise
      })
      .then((results) => {
        // Store result alertMessage
        createMsg = results.msg;
      });

    // Return API results
    return [createStatus, createMsg];
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <div className="form-card">
        <h2 style={{ marginBottom: "20px" }}>New Package</h2>
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
          <Form.Group className="row mb-3">
            <Form.Label
              htmlFor="cookieName"
              className="col-sm-2 col-form-label"
            >
              Name:
            </Form.Label>
            <div className="col-sm-10 ">
              <Form.Select
                className="form-select"
                id="cookieName"
                value={cookieName}
                onChange={(e) => setCookieName(e.target.value)}
              >
                {cookiesArr.map((cookie, index) => {
                  return (
                    <option value={cookie.cookie_id} key={index}>{cookie.name}</option>
                  );
                })}
              </Form.Select>
            </div>
          </Form.Group>
          <Form.Group className="row mb-3">
            <Form.Label
              htmlFor="packageAmount"
              className="col-sm-2 col-form-label"
            >
              Amount:
            </Form.Label>
            <div className="col-sm-10 ">
              <Form.Control
                type="number"
                className={
                  validAmount ? "form-control" : "form-control invalid-input"
                }
                id="packageAmount"
                value={packageAmount}
                onChange={(e) => setPackageAmount(e.target.value)}
                placeholder="0"
                min={0}
                step={1}
                required
              />
            </div>
          </Form.Group>
          <Form.Group className="row mb-3">
            <Form.Label
              htmlFor="packageCost"
              className="col-sm-2 col-form-label"
            >
              Cost:
            </Form.Label>
            <div className="col-sm-10 ">
              <Form.Control
                type="number"
                className={
                  validCost ? "form-control" : "form-control invalid-input"
                }
                id="packageCost"
                value={packageCost}
                onChange={(e) => setPackageCost(e.target.value)}
                placeholder="0.00"
                min={0}
                step={0.01}
                required
              />
            </div>
          </Form.Group>
          <Form.Group className="row mb-3">
            <Form.Label
              htmlFor="cookieStatus"
              className="col-sm-2 col-form-label"
            >
              Status:
            </Form.Label>
            <div className="col-sm-10 ">
              <Form.Select
                className="form-select"
                id="cookieStatus"
                value={packageActiveStatus}
                onChange={(e) => setPackageActiveStatus(e.target.value)}
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </Form.Select>
            </div>
          </Form.Group>
          <Button
            type="button"
            className={"general-button"}
            style={{ width: 100 + "%" }}
            onClick={() => {
              submitForm();
            }}
          >
            {componentState}
          </Button>
        </Form>
      </div>
    </Modal>
  );
};

export default NewPackageModal;
