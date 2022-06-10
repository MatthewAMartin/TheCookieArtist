import { useState, useEffect, useRef } from "react";
import {
  getAllCookiesAPI,
  getLatestCookieIDAPI,
  getCookieImagesAPI,
  postCookieAPI,
  postCookieImageAPI,
  putCookieAPI,
  deleteCookieAPI,
  deleteCookieImageAPI,
} from "../pages/api/cookiesAPI";
import EmblaCarousel from "./EmblaCarousel";

const CookieForm = (form, closeForm) => {
  // Component Variables
  const [componentState, setComponentState] = useState("Create");
  const [isSelect, setIsSelect] = useState(false);
  const [isInput, setIsInput] = useState(true);
  const [isLocalCarousel, setIsLocalCarousel] = useState(false);
  const [isStoredCarousel, setIsStoredCarousel] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const inputFile = useRef(null); // Reference to "file" input in form

  // Cookie Data Variables
  const [cookieArr, setCookiesArr] = useState([{}]);
  const [selectedCookie, setSelectedCookie] = useState(0);
  const [cookieId, setCookieId] = useState(0);
  const [cookieName, setCookieName] = useState("");
  const [cookieCost, setCookieCost] = useState("");
  const [cookieActiveStatus, setCookieActiveStatus] = useState(1);
  // Local Image Data (from form)
  const [localImages, setLocalImages] = useState({});
  const [localImageURLs, setLocalImageURLs] = useState([]);
  // Stored Image Data (from Database)
  const [storedImageURLs, setStoredImageURLs] = useState([]);

  // Form Validity Variables
  const [validName, setValidName] = useState(true);
  const [validCost, setValidCost] = useState(true);

  // Manual update handling of EmblaCarousel Components
  const [updateViewKey, setUpdateViewKey] = useState(1);
  const [updateEditKey, setUpdateEditKey] = useState(1);

  useEffect(() => {
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
        initialiseForm(formType, false, true, false, false);
        break;
      case "Update":
        getAllCookies(); // Gets Cookie data and initialises form
        initialiseForm(formType, true, true, false, false);
        break;
      case "Delete":
        getAllCookies(); // Gets Cookie data and initialises form
        initialiseForm(formType, true, false, false, false);
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
   * @param {*} initIsViewCarousel A boolean defining if the local image carousel should be shown.
   * @param {*} initIsEditCarousel A boolean defining if the stored image carousel should be shown.
   */
  const initialiseForm = (
    formType,
    initIsSelect,
    initIsInput,
    initIsLocalCarousel,
    initIsStoredCarousel
  ) => {
    setComponentState(formType);
    initialiseFormValues(formType);
    setIsSelect(initIsSelect);
    setIsInput(initIsInput);
    setIsLocalCarousel(initIsLocalCarousel);
    setIsStoredCarousel(initIsStoredCarousel);
    setValidName(true);
    setValidCost(true);
  };

  /**
   * initialiseFormValues initialises/updates the form values when the user
   * changes between the form types.
   *
   * @param {*} formType A string defining the type of form that should be shown to the user.
   * @param {*} initCookieId The cookie_id (INT) of the first cookie record.
   * @param {*} initName The name (string) of the first cookie record.
   * @param {*} initCost The cost (string) of the first cookie record.
   * @param {*} initActiveStatus The active_status (INT) of the first cookie record.
   */
  const initialiseFormValues = (
    formType,
    initCookieId,
    initName,
    initCost,
    initActiveStatus
  ) => {
    if (formType === "Create") {
      // Initialise form and variables to empty/default
      setSelectedCookie(0);
      setCookieId(0);
      setCookieName("");
      setCookieCost("");
      setCookieActiveStatus(1);
      setStoredImageURLs([]);
    } else {
      // Initialise the form and variables to the first record in the list
      setSelectedCookie(0);
      setCookieId(initCookieId);
      setCookieName(initName);
      setCookieCost(initCost);
      setCookieActiveStatus(initActiveStatus);
      getCookieImages(initCookieId);
    }

    // Reset file input values
    inputFile.current.value = "";
    setLocalImages({});
    setLocalImageURLs([]);
  };

  /**
   * updateFormValues updates the values of the form entries to fit
   * those of the selected Cookie record. Only used when the user is
   * updating or deleting.
   *
   * @param {*} index The index (INT) of the selected Cookie record.
   */
  const updateFormValues = (index) => {
    setCookieId(cookieArr[index].cookie_id);
    setCookieName(cookieArr[index].name);
    setCookieCost(cookieArr[index].cost);
    setCookieActiveStatus(cookieArr[index].active_status);
    getCookieImages(cookieArr[index].cookie_id);

    // Reset file input values
    inputFile.current.value = "";
    setLocalImages({});
    setLocalImageURLs([]);
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
        setValidName(true);
        setValidCost(true);

        // Submit based on current componentState
        // and store the API call response data
        switch (componentState) {
          case "Create":
            response = await createCookieRecord();
            break;
          case "Update":
            response = await updateCookieRecord();
            getAllCookies();
            break;
          case "Delete":
            response = await deleteCookieRecord();
            getAllCookies();
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
   * @return {*} An array containing the results of the validity check [cookieName (bool), cookieCost (bool)].
   */
  const validateForm = () => {
    let validName = false;
    let validCost = false;

    // Validate cookieName Input
    if (cookieName !== "" && cookieName !== undefined) {
      validName = true;
    }

    // Validate cookieCost Input
    if (!isNaN(parseFloat(cookieCost))) {
      validCost = true;
    }

    // Set validity variables
    setValidName(validName);
    setValidCost(validCost);

    // Return Results
    return [validName, validCost];
  };

  /**
   * getAllCookies handles the API call to get all
   * Cookie data from the database. It then updates the form
   * with that all of that data (initialising the selectedCookie
   * variable to be the first in the list).
   *
   */
  const getAllCookies = () => {
    getAllCookiesAPI().then((results) => {
      // Handle no Cookie records
      if (results.length !== 0) {
        setCookiesArr(results);
        initialiseFormValues(
          "Update/Delete",
          results[0].cookie_id,
          results[0].name,
          results[0].cost,
          results[0].active_status
        );
      } else {
        setCookiesArr([{}]);
        initialiseFormValues("Create");
      }
    });
  };

  /**
   * getLatestID handles the API call to get the cookie_id
   * of the most recently create Cookie record.
   *
   * @return {*} The id (INT) of the most recent record entry.
   */
  const getLatestCookieID = async () => {
    // Declare storage variables
    let latestID;

    // Get API response to GET request
    const latestResponse = await getLatestCookieIDAPI().then((results) => {
      latestID = results.data;
    });

    // Return API result
    return latestID;
  };

  /**
   * getCookieImages handles the API call to get the stored image_urls
   * for a specific cookie_id.
   *
   * @param {*} reqCookieId The cookie_id (INT) of the specified Cookie record.
   */
  const getCookieImages = async (reqCookieId) => {
    let resultsURLs = [];

    // Get API response to GET request
    const latestResponse = await getCookieImagesAPI(reqCookieId)
      .then((results) => {
        return results[1]; // Return resulting promise
      })
      .then((results) => {
        // Store the resulting URLs
        for (let i = 0; i < results.result.length; i++) {
          resultsURLs.push(results.result[i].image_url);
        }
      })
      .then(() => {
        // If the cookie had associated stored images
        if (resultsURLs.length !== 0) {
          // Store those images and show the user
          setStoredImageURLs(resultsURLs);
          setIsStoredCarousel(true);
        } else {
          setStoredImageURLs([]);
          setIsStoredCarousel(false);
        }
      });
  };

  /**
   * createCookieRecord handles the API call to create a
   * Cookie record in the database. It creates the Cookie record
   * with the data entered in the form, uploads the images selected,
   * and links the images to the Cookie record.
   *
   * @return {*} Array containing [API call status (INT), API call alertMessage (STRING)].
   */
  const createCookieRecord = async () => {
    // Initialise the body of the API call
    let APIBody = `{"name": "${cookieName}", "cost": ${cookieCost}, "active_status": ${cookieActiveStatus}}`;

    // Declare storage variables
    let createStatus;
    let createMsg;
    let latestId;

    // Get API response to POST request (create record)
    const createResponse = await postCookieAPI(APIBody)
      .then((results) => {
        // Store result status
        createStatus = results[0].status;
        return results[1]; // Return resulting promise
      })
      .then((results) => {
        // Store result alertMessage
        createMsg = results.msg;
      });

    // Get API response to GET request (lastest record ID)
    const latestResponse = await getLatestCookieID().then((results) => {
      // Store result ID
      latestId = results;
    });

    // For all locally stored Images (link them to the cookie record)
    for (let i = 0; i < localImages.length; i++) {
      // Upload the local Image file
      const imageResponse = await uploadLocalImage(latestId, i);
    }

    // Return API results
    return [createStatus, createMsg];
  };

  /**
   * updateCookieRecord handles the API call to update a
   * Cookie record in the database. It updates the currently
   * selected Cookie in the form, with the currently entered data.
   *
   * @return {*} Array containing [API call status (INT), API call alertMessage (STRING)].
   */
  const updateCookieRecord = async () => {
    // Initialise the body of the API call
    let APIBody = `{"cookie_id": "${cookieId}", "name": "${cookieName}", "cost": ${cookieCost}, "active_status": ${cookieActiveStatus}}`;

    // Declare storage variables
    let updateStatus;
    let updateMsg;

    // Get API response PUT request
    const updateResponse = await putCookieAPI(APIBody)
      .then((results) => {
        // Store result status
        updateStatus = results[0].status;
        return results[1]; // Return resulting promise
      })
      .then((results) => {
        // Store result alertMessage
        updateMsg = results.msg;
      });

    // For all locally stored Images (link them to the cookie record)
    for (let i = 0; i < localImages.length; i++) {
      // Upload the local Image file
      const imageResponse = await uploadLocalImage(cookieId, i);
    }

    // Reset form image data
    setIsLocalCarousel(false);
    setLocalImages({});
    setLocalImageURLs([]);
    getCookieImages(cookieId);

    // Return API results
    return [updateStatus, updateMsg];
  };

  /**
   * deleteCookieRecord handles the API call to delete a
   * Cookie record from the database. It deletes the currently
   * selected Cookie in the form.
   *
   * @return {*} Array containing [API call status (INT), API call alertMessage (STRING)].
   */
  const deleteCookieRecord = async () => {
    // Initialise the body of the API call
    let APIBody = `{"cookie_id": ${cookieId}}`;

    // Declare storage variables
    let deleteStatus;
    let deleteMsg;

    // Delete Cookie images
    // Delete the Cookie Image from the database
    for (let i = 0; i < storedImageURLs.length; i++) {
      deleteCookieImage(storedImageURLs[i]);
    }

    // Get API response to DELETE request
    const deleteResponse = await deleteCookieAPI(APIBody)
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

  /**
   * deleteCookieImage handles the API call to delete a
   * stored image_url from the database. It deletes the record
   * with the image_url that matches the passed string.
   *
   * @param {*} url A string defining what image_url to delete.
   * @return {*} Array containing [API call status (INT), API call alertMessage (STRING)].
   */
  const deleteCookieImage = async (reqImageURL) => {
    // Initialise the body of the API call
    let APIBody = `{"image_url": "${reqImageURL}"}`;

    // Declare storage variables
    let deleteStatus;
    let deleteMsg;

    // Get API response to DELETE request
    const deleteResponse = await deleteCookieImageAPI(APIBody)
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

  /**
   * storeLocalImage stores the uploaded image file data locally,
   * until the user submits the form.
   *
   * @param {*} e An event passed from the element calling the function.
   */
  const storeLocalImage = (e) => {
    // Initialise temp arrays
    let imageArr = [];
    let imageURLArr = [];

    // If user has uploaded any files
    if (e.target.files.length != 0) {
      // Add the files to the temp arrays
      for (let i = 0; i < e.target.files.length; i++) {
        imageArr.push(e.target.files[i]);
        imageURLArr.push(URL.createObjectURL(e.target.files[i]));
      }
      // Show the carousel
      setIsLocalCarousel(true);
    } else {
      // Otherwise, hide the carousel
      setIsLocalCarousel(false);
    }

    // Update the main arrays
    setLocalImages(imageArr);
    setLocalImageURLs(imageURLArr);
  };

  /**
   * uploadLocalImage handles the API call to upload a new
   * image file.
   *
   * @param {*} id An integer defining the Cookie record to link the image to.
   * @param {*} index The index (INT) of the Image from localImages being uploaded.
   */
  const uploadLocalImage = async (reqCookieId, index) => {
    // Get API response to POST request
    const updateResponse = await postCookieImageAPI(
      reqCookieId,
      localImages[index]
    );
  };

  /**
   * deleteLocalImage removes the currently selected image in the
   * carousel, from the image upload arrays (local storage).
   *
   * @param {*} index The current index of the carousel.
   */
  const deleteLocalImage = (index) => {
    // Initialise temp arrays
    let urlArr = localImageURLs;
    let imageArr = localImages;

    // Remove the image and image url from the temp arrays
    if (index > -1) {
      urlArr.splice(index, 1);
      imageArr.splice(index, 1);
    }

    // Update the main arrays
    setLocalImages(imageArr);
    setLocalImageURLs(urlArr);

    // If no localImages exist
    if (imageArr.length === 0) {
      // Reinitialise arrays and hide carousel
      inputFile.current.value = "";
      setLocalImages({});
      setLocalImageURLs([]);
      setIsLocalCarousel(false);
    }

    // Force carousel update
    const newKey = updateViewKey + 1;
    setUpdateViewKey({ newKey });
  };

  /**
   * deleteStoredImage removes the currently selected image in the
   * carousel, from the image stored array (and calls the delete
   * image function).
   *
   * @param {*} index The current index of the carousel.
   */
  const deleteStoredImage = (index) => {
    // Initialise temp array
    let urlArr = storedImageURLs;

    // Delete the Cookie Image from the database
    deleteCookieImage(urlArr[index]);

    // Remove the image and image url from the temp array
    if (index > -1) {
      urlArr.splice(index, 1);
    }

    // Update the main array
    setStoredImageURLs(urlArr);

    // If no localImages exist
    if (urlArr.length === 0) {
      // Reinitialise arrays and hide carousel
      setStoredImageURLs([]);
      setIsStoredCarousel(false);
    }

    // Force carousel update
    const newKey = updateEditKey + 1;
    setUpdateEditKey({ newKey });
  };

  return (
    <>
      <div className="container center form-card">
        <h3>Cookies</h3>
        <button
          type="button"
          className={"btn btn-close btn-block btn-form-close"}
          onClick={() => {form.closeForm()}}
        />
        <p>Use the form below to manage your individual Cookies.</p>
        <div
          className="btn-group mb-3"
          role="group"
          aria-label="Basic radio toggle button group"
          style={{width: 100 + "%"}}
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
          {isSelect && (
            <div className="row mb-3">
              <label
                htmlFor="cookieSelect"
                className="col-sm-12 col-form-label"
              >
                Select a Cookie:
              </label>
              <div className="col-sm-12">
                <select
                  className="form-select"
                  id="cookieSelect"
                  value={selectedCookie}
                  onChange={(e) => {
                    setSelectedCookie(e.target.value);
                    updateFormValues(e.target.value);
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
          )}
          <div className="row mb-3">
            <label htmlFor="cookieName" className="col-sm-2 col-form-label">
              Name:
            </label>
            <div className="col-sm-10 ">
              <input
                type="text"
                className={
                  validName ? "form-control" : "form-control invalid-input"
                }
                id="cookieName"
                value={cookieName}
                onChange={(e) => setCookieName(e.target.value)}
                placeholder="Cookie"
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
            <label htmlFor="cookieCost" className="col-sm-2 col-form-label">
              Cost:
            </label>
            <div className="col-sm-10 ">
              <input
                type="number"
                className={
                  validCost ? "form-control" : "form-control invalid-input"
                }
                id="cookieCost"
                value={cookieCost}
                onChange={(e) => setCookieCost(e.target.value)}
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
            <label htmlFor="cookieStatus" className="col-sm-2 col-form-label">
              Status:
            </label>
            <div className="col-sm-10 ">
              <select
                className="form-select"
                id="cookieStatus"
                value={cookieActiveStatus}
                onChange={(e) => setCookieActiveStatus(e.target.value)}
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
          <div
            className="row mb-3"
            style={{
              display: isInput ? "flex" : "none",
            }}
          >
            <label htmlFor="cookieImages" className="col-sm-3 col-form-label">
              New Images:
            </label>
            <div className="col-sm-9 mb-3">
              <input
                className="form-control"
                type="file"
                id="cookieImages"
                ref={inputFile}
                multiple
                onChange={(e) => storeLocalImage(e)}
                style={{
                  pointerEvents: isInput ? "auto" : "none",
                  backgroundColor: isInput ? "#FFFFFF" : "#DCDCDC",
                  color: isInput ? "#000000" : "#696969",
                }}
              />
            </div>
            {isLocalCarousel && (
              <EmblaCarousel
                urls={localImageURLs}
                deleteImage={deleteLocalImage}
                componentState={componentState}
                key={updateViewKey}
              />
            )}
          </div>
          {isStoredCarousel && (
            <div className="row mb-3">
              <label className="col-sm-12 col-form-label">Stored Images:</label>
              <EmblaCarousel
                urls={storedImageURLs}
                deleteImage={deleteStoredImage}
                componentState={componentState}
                key={updateEditKey}
              />
            </div>
          )}
          <button
            type="button"
            className={
              isInput
                ? "btn btn-outline-primary btn-block"
                : "btn btn-outline-danger btn-block"
            }
            style={{ width: 100 + "%" }}
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

export default CookieForm;
