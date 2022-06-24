import { useState, useEffect, useRef } from "react";
import {
  getCookieImagesAPI,
  postCookieImageAPI,
  putCookieAPI,
  deleteCookieImageAPI,
} from "../pages/api/cookiesAPI";
import EmblaCarousel from "./EmblaCarousel";
import { Modal, Button, CloseButton, Form, Alert } from "react-bootstrap";

const EditCookieModal = ({ cookie, show, handleClose, getAllCookies }) => {
  // Component Variables
  const componentState = "Update";
  const [isLocalCarousel, setIsLocalCarousel] = useState(false);
  const [isStoredCarousel, setIsStoredCarousel] = useState(false);
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const inputFile = useRef(null); // Reference to "file" input in form

  // Cookie Data Variables
  const [cookieId, setCookieId] = useState("");
  const [cookieName, setCookieName] = useState("");
  const [cookieCost, setCookieCost] = useState("");
  const [cookieActiveStatus, setCookieActiveStatus] = useState(1);
  // Local Image Data (from form)
  const [localImages, setLocalImages] = useState({});
  const [localImageURLs, setLocalImageURLs] = useState([]);
  const [storedImageURLs, setStoredImageURLs] = useState([]);

  // Form Validity Variables
  const [validName, setValidName] = useState(true);
  const [validCost, setValidCost] = useState(true);

  // Manual update handling of EmblaCarousel Components
  const [updateViewKey, setUpdateViewKey] = useState(1);
  const [updateEditKey, setUpdateEditKey] = useState(1);

  useEffect(() => {
    // Set default values
    if (cookie != undefined) {
      resetForm();
    }
  }, [cookie]);

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

        // Submit
        response = await updateCookieRecord();

        if (response[0] === 400) {
          // If API response status is an ERROR response
          setError(true);
          // Set the output alertMessage
          setAlertMessage(`ERROR: ${response[1]}`);
          return; // End the function
        } else {
          // Reset the form values
          setCookieName("");
          setCookieCost("");
          setCookieActiveStatus(1);
          setLocalImages({});
          setLocalImageURLs([]);
          setIsLocalCarousel(false);
          // Refresh the cookie data
          getAllCookies("Edit");
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
   * resetForm handles the reseting of the form on close and onload.
   *
   */
    const resetForm = () => {
      setCookieId(cookie.cookie_id);
      setCookieName(cookie.name);
      setCookieCost(cookie.cost);
      setCookieActiveStatus(cookie.active_status);
      getCookieImages(cookie.cookie_id);
      setValidName(true);
      setValidCost(true);
    }

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

    // If no storedImages exist
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
    <Modal show={show} onHide={handleClose}>
      <div className="form-card">
        <h2 style={{ marginBottom: "20px" }}>Update Cookie</h2>
        <CloseButton
          type="button"
          className={"btn btn-close btn-block btn-form-close"}
          onClick={() => {
            resetForm();
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
              <Form.Control
                type="text"
                className={
                  validName ? "form-control" : "form-control invalid-input"
                }
                id="cookieName"
                value={cookieName}
                onChange={(e) => setCookieName(e.target.value)}
                placeholder="Cookie"
                required
              />
            </div>
          </Form.Group>
          <Form.Group className="row mb-3">
            <Form.Label
              htmlFor="cookieCost"
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
                id="cookieCost"
                value={cookieCost}
                onChange={(e) => setCookieCost(e.target.value)}
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
                value={cookieActiveStatus}
                onChange={(e) => setCookieActiveStatus(e.target.value)}
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </Form.Select>
            </div>
          </Form.Group>
          <Form.Group className="row mb-3">
            <Form.Label
              htmlFor="cookieImages"
              className="col-sm-3 col-form-label"
            >
              New Images:
            </Form.Label>
            <div className="col-sm-9 mb-3">
              <Form.Control
                className="form-control"
                type="file"
                id="cookieImages"
                ref={inputFile}
                multiple
                onChange={(e) => storeLocalImage(e)}
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
          </Form.Group>
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

export default EditCookieModal;
