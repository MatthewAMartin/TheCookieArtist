import { useState, useEffect } from "react";
import {
  getAllCookiePackagesAPI,
  postPackageAPI,
  putPackageAPI,
  deletePackageAPI,
} from "../pages/api/packagesAPI";
import { getAllCookiesAPI } from "../pages/api/cookiesAPI";

const PackageForm = (form, closeForm) => {
  // Component Variables
  const [componentState, setComponentState] = useState("Create");
  const [isSelect, setIsSelect] = useState(false);
  const [isInput, setIsInput] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Package Data Variables
  const [cookieArr, setCookieArr] = useState([{}]);
  const [packageArr, setPackageArr] = useState([{}]);
  const [selectedCookie, setSelectedCookie] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [packageId, setPackageId] = useState(0);
  const [packageAmount, setPackageAmount] = useState("");
  const [packageCost, setPackageCost] = useState("");
  const [packageActiveStatus, setPackageActiveStatus] = useState(1);

  // Form Validity Variables
  const [validAmount, setValidAmount] = useState(true);
  const [validCost, setValidCost] = useState(true);

  useEffect(() => {
    getAllCookies(); // Get all cookie data (only needs to be called once on component load)
    updateForm("Create"); // Always open at "Create"
  }, [form, closeForm]);

  /**
   * updateForm handles the initialisation/updating of the form to fit the form type
   * that the user has selected.
   *
   * @param {*} formType A string defining the type of form that should be shown to the user.
   */
  const updateForm = (formType) => {
    // Setup form based on current formType
    switch (formType) {
      case "Create":
        initialiseForm(formType, false, true, false);
        break;
      case "Update":
        initialiseForm(formType, true, true, false);
        setIsInput(true);
        break;
      case "Delete":
        initialiseForm(formType, true, false, true);
        setIsInput(false);
        break;
      default:
      // Do nothing
    }
  };

  /**
   * initialiseForm initialises/updates the form when the user
   * changes between the form types.
   *
   * @param {*} formType A string defining the type of form that should be shown to the user.
   * @param {*} initIsSelect A boolean defining if the cookie record select option should be shown.
   * @param {*} initIsInput A boolean defining if the file input element should be shown.
   * @param {*} initIsInput A boolean defining if the form is of type delete.
   */
  const initialiseForm = (
    formType,
    initIsSelect,
    initIsInput,
    initisDelete
  ) => {
    setComponentState(formType);
    setSelectedCookie(0);
    initialiseFormValues(formType);
    if (formType === "Create") {
      setIsEmpty(false);
    }
    setIsSelect(initIsSelect);
    setIsInput(initIsInput);
    setIsDelete(initisDelete);
    setValidAmount(true);
    setValidCost(true);
  };

  /**
   * initialiseFormValues initialises/updates the form values when the user
   * changes between the form types.
   *
   * @param {*} formType A string defining the type of form that should be shown to the user.
   */
  const initialiseFormValues = (formType) => {
    if (formType === "Create") {
      // Initialise form and variables to empty/default
      setSelectedPackage(0);
      setPackageAmount("");
      setPackageCost("");
      setPackageActiveStatus(1);
    } else {
      // Initialise the form and variables to the first record in the list
      setSelectedPackage(0);
      getAllPackages(formType, 0);
    }
  };

  /**
   * initialisePackageValues initialises/updates the form values when the user
   * changes between the form types (specifically for update and delete).
   *
   * @param {*} formType A string defining the type of form that should be shown to the user.
   * @param {*} initPackageId The package_id (INT) of the first package record.
   * @param {*} initAmount The amount (string) of the first package record.
   * @param {*} initCost The cost (string) of the first package record.
   * @param {*} initActiveStatus The active_status (INT) of the first package record.
   */
  const initialisePackageValues = (
    formType,
    initPackageId,
    initPackageAmount,
    initPackageCost,
    initPackageActiveStatus
  ) => {
    if (formType === "Update") {
      setIsInput(true);
    }
    setPackageId(initPackageId);
    setPackageAmount(initPackageAmount);
    setPackageCost(initPackageCost);
    setPackageActiveStatus(initPackageActiveStatus);
  };

  /**
   * updateFormValues updates the values of the form entries to fit
   * those of the selected Package record. Only used when the user is
   * updating or deleting.
   *
   * @param {*} index The index (INT) of the selected Package record.
   */
  const updateFormValues = (index) => {
    setPackageId(packageArr[index].package_id);
    setPackageAmount(packageArr[index].amount);
    setPackageCost(packageArr[index].cost);
    setPackageActiveStatus(packageArr[index].active_status);
  };

  /**
   * cookieSelectHandler determines what occurs when a Cookie option is selected,
   * depending on the current form type. For Create, the form is initialised as
   * empty. For Update/Delete, the cookie's packages are requested and the form is
   * initialised with that data.
   *
   * @param {*} e An event object defining the element that is calling this function.
   */
  const cookieSelectHandler = (e) => {
    setSelectedCookie(e.target.value);
    if (componentState === "Create") {
      initialiseFormValues(componentState);
    } else {
      getAllPackages(componentState, e.target.value);
    }
  };

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

        // Submit based on current componentState
        // and store the API call response data
        switch (componentState) {
          case "Create":
            response = await createPackageRecord();
            break;
          case "Update":
            response = await updatePackageRecord();
            break;
          case "Delete":
            response = await deletePackageRecord();
            break;
          default:
          // Do nothing
        }
        if (response[0] === 400) {
          // If API response status is an ERROR response
          setError(true);
          // Set the output alertMessage
          setAlertMessage(`ERROR: ${response[1]}`);
          return; // End the function
        } else {
          setSuccess(true);
          // Set the output alertMessage
          setAlertMessage(`SUCCESS: ${response[1]}`);
          // Reset the form
          initialiseFormValues(componentState);
        }
      } else {
        // Stop form submission
        return;
      }
    } catch (error) {
      setError(true);
      setSuccess(false);
      setAlertMessage(error.alertMessage);
    } finally {
      // Show error/success alertMessage for 3 seconds
      setTimeout(() => {
        setSuccess(false);
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

    // Validate cookieName Input
    if (!isNaN(parseInt(packageAmount))) {
      validAmount = true;
    }

    // Validate cookieCost Input
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
   * getAllCookies handles the API call to get all
   * Cookie data from the database. It then updates the form
   * with that all of that data (initialising the selectedPackage
   * variable to be the first in the list).
   *
   */
  const getAllCookies = () => {
    getAllCookiesAPI().then((results) => {
      // Handle no Cookie records
      if (results.length !== 0) {
        setCookieArr(results);
        initialiseFormValues(componentState, results[0].cookie_id);
      } else {
        // Do something
      }
    });
  };

  /**
   * getAllPackages handles the API calls to get all Package data
   * related to a specific Cookie record. It then updates the form
   * with that data (or to empty if no Package data exists).
   *
   * @param {*} formType A string defining the type of form that should be shown to the user.
   * @param {*} index The index (INT) of the selected Package record.
   */
  const getAllPackages = (formType, index) => {
    getAllCookiePackagesAPI(cookieArr[index].cookie_id).then((results) => {
      // Handle no Package records
      if (results.result.length !== 0) {
        setPackageArr(results.result);
        initialisePackageValues(
          formType,
          results.result[0].package_id,
          results.result[0].amount,
          results.result[0].cost,
          results.result[0].active_status
        );
        setIsEmpty(false);
      } else {
        // Initialise form and variables to empty/default
        setPackageArr([{}]);
        setSelectedPackage(0);
        setPackageAmount("");
        setPackageCost("");
        setPackageActiveStatus(1);
        setIsEmpty(true);
        setIsInput(false);
      }
    });
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
    let APIBody = `{"cookie_id": ${cookieArr[selectedCookie].cookie_id}, "amount": ${packageAmount}, "cost": ${packageCost}, "active_status": ${packageActiveStatus}}`;

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

  /**
   * updatePackageRecord handles the API call to update a
   * Package record in the database. It updates the currently
   * selected Package in the form, with the currently entered data.
   *
   * @return {*} Array containing [API call status (INT), API call alertMessage (STRING)].
   */
  const updatePackageRecord = async () => {
    // Initialise the body of the API call
    let APIBody = `{"package_id": "${packageId}", "cookie_id": "${cookieArr[selectedCookie].cookie_id}", "amount": ${packageAmount}, "cost": ${packageCost}, "active_status": ${packageActiveStatus}}`;

    // Declare storage variables
    let updateStatus;
    let updateMsg;

    // Get API response PUT request
    const updateResponse = await putPackageAPI(APIBody)
      .then((results) => {
        // Store result status
        updateStatus = results[0].status;
        return results[1]; // Return resulting promise
      })
      .then((results) => {
        // Store result alertMessage
        updateMsg = results.msg;
      });

    // Return API results
    return [updateStatus, updateMsg];
  };

  /**
   * deletePackageRecord handles the API call to delete a
   * Package record from the database. It deletes the currently
   * selected Package in the form.
   *
   * @return {*} Array containing [API call status (INT), API call alertMessage (STRING)].
   */
  const deletePackageRecord = async () => {
    // Initialise the body of the API call
    let APIBody = `{"package_id": ${packageId}}`;

    // Declare storage variables
    let deleteStatus;
    let deleteMsg;

    // Get API response to DELETE request
    const deleteResponse = await deletePackageAPI(APIBody)
      .then((results) => {
        // Store result status
        deleteStatus = results[0].status;
        return results[1]; // Return resulting promise
      })
      .then((results) => {
        // Store result alertMessage
        deleteMsg = results.msg;
      });

    // Return API results
    return [deleteStatus, deleteMsg];
  };

  return (
    <>
      <div className="container center form-card">
        <h3>Cookie Packages</h3>
        <button
          type="button"
          className={"btn btn-close btn-block btn-form-close"}
          onClick={() => {
            form.closeForm();
          }}
        />
        <p>Use the form below to manage your Cookie packages.</p>
        <div
          className="btn-group mb-3"
          role="group"
          aria-label="Basic radio toggle button group"
          style={{ width: 100 + "%" }}
        >
          <input
            type="radio"
            className="btn-check"
            name="btnradio"
            id="btnradio1"
            autoComplete="off"
            value="Create"
            checked={componentState === "Create"}
            onChange={(e) => {
              updateForm(e.currentTarget.value);
            }}
          />
          <label className="btn btn-outline-secondary" htmlFor="btnradio1">
            Create
          </label>
          <input
            type="radio"
            className="btn-check"
            name="btnradio"
            id="btnradio2"
            autoComplete="off"
            value="Update"
            checked={componentState === "Update"}
            onChange={(e) => {
              updateForm(e.currentTarget.value);
            }}
          />
          <label className="btn btn-outline-secondary" htmlFor="btnradio2">
            Update
          </label>
          <input
            type="radio"
            className="btn-check"
            name="btnradio"
            id="btnradio3"
            autoComplete="off"
            value="Delete"
            checked={componentState === "Delete"}
            onChange={(e) => {
              updateForm(e.currentTarget.value);
            }}
          />
          <label className="btn btn-outline-secondary" htmlFor="btnradio3">
            Delete
          </label>
        </div>
        <form>
          <div className="row mb-3">
            <label htmlFor="cookieSelect" className="col-sm-12 col-form-label">
              Select a Cookie:
            </label>
            <div className="col-sm-12">
              <select
                className="form-select"
                id="cookieSelect"
                value={selectedCookie}
                onChange={(e) => {
                  cookieSelectHandler(e);
                }}
              >
                {cookieArr.map(({ name }, index) => (
                  <option key={index} value={index}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {isSelect && (
            <div className="row mb-3">
              <label
                htmlFor="packageSelect"
                className="col-sm-12 col-form-label"
              >
                Select a Package:
              </label>
              <div className="col-sm-12">
                <select
                  className="form-select"
                  id="packageSelect"
                  value={selectedPackage}
                  onChange={(e) => {
                    setSelectedPackage(e.target.value);
                    updateFormValues(e.target.value);
                  }}
                  style={{
                    pointerEvents: !isEmpty ? "auto" : "none",
                    backgroundColor: !isEmpty ? "#FFFFFF" : "#DCDCDC",
                    color: !isEmpty ? "#000000" : "#696969",
                  }}
                >
                  {isEmpty && (
                    <option key="empty" value="0">
                      No Packages for this Cookie
                    </option>
                  )}
                  {packageArr.map(({ amount }, index) => (
                    <option key={index} value={index}>
                      {amount}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          <div className="row mb-3">
            <label htmlFor="packageAmount" className="col-sm-2 col-form-label">
              Amount
            </label>
            <div className="col-sm-10 ">
              <input
                type="number"
                className={
                  validAmount ? "form-control" : "form-control invalid-input"
                }
                id="packageAmount"
                value={packageAmount}
                onChange={(e) => setPackageAmount(e.target.value)}
                placeholder={1}
                min={0}
                step={1}
                required
                style={{
                  pointerEvents: isInput ? "auto" : "none",
                  backgroundColor: isInput ? "#FFFFFF" : "#DCDCDC",
                  color: isInput ? "#000000" : "#696969",
                }}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="packageCost" className="col-sm-2 col-form-label">
              Cost:
            </label>
            <div className="col-sm-10 ">
              <input
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
                style={{
                  pointerEvents: isInput ? "auto" : "none",
                  backgroundColor: isInput ? "#FFFFFF" : "#DCDCDC",
                  color: isInput ? "#000000" : "#696969",
                }}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="packageStatus" className="col-sm-2 col-form-label">
              Status:
            </label>
            <div className="col-sm-10 ">
              <select
                className="form-select"
                id="packageStatus"
                value={packageActiveStatus}
                onChange={(e) => setPackageActiveStatus(e.target.value)}
                style={{
                  pointerEvents: isInput ? "auto" : "none",
                  backgroundColor: isInput ? "#FFFFFF" : "#DCDCDC",
                  color: isInput ? "#000000" : "#696969",
                }}
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
          </div>
          <button
            type="button"
            className={
              isDelete
                ? "btn btn-outline-danger btn-block"
                : "btn btn-outline-primary btn-block"
            }
            style={{
              pointerEvents: !isEmpty ? "auto" : "none",
              backgroundColor: !isEmpty ? "" : "#DCDCDC",
              width: 100 + "%",
            }}
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
          >
            {componentState}
          </button>
        </form>
      </div>

      {success && (
        <div className="alert alert-success form_alert" role="alert">
          {alertMessage}
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          {alertMessage}
        </div>
      )}

      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Submission</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>
                Please confirm your submission. This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={() => {
                  submitForm();
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PackageForm;
