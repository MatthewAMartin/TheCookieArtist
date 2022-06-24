import { useState, useEffect } from "react";
import {
  getAllCookiesAPI,
  getCookieImagesAPI,
  deleteCookieAPI,
  deleteCookieImageAPI,
} from "../pages/api/cookiesAPI";
import { Table, Button } from "react-bootstrap";
import CookieRow from "./CookieRow";
import NewCookieModal from "./NewCookieModal";
import EditCookieModal from "./EditCookieModal";
import DeleteModal from "./DeleteModal";

const CookieTable = () => {
  // Modal variables
  // NEW
  const [showNewModal, setShowNewModal] = useState(false);
  const handleNewModalClose = () => setShowNewModal(false);
  const handleNewModalShow = () => setShowNewModal(true);
  // EDIT
  const [showEditModal, setShowEditModal] = useState(false);
  const handleEditModalClose = () => setShowEditModal(false);
  const handleEditModalShow = () => setShowEditModal(true);
  // DELETE
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleDeleteModalClose = () => setShowDeleteModal(false);
  const handleDeleteModalShow = () => setShowDeleteModal(true);

  // Cookie Data Variables
  const [cookiesArr, setCookiesArr] = useState([]);
  const [selectedCookie, setSelectedCookie] = useState({});
  const [sortedCookiesArr, setSortedCookiesArr] = useState([]);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState(false);

  useEffect(() => {
    getAllCookies();
  }, []);

  /**
   * getAllCookies handles the API call to get all
   * Cookie data from the database. It then updates the form
   * with that all of that data (initialising the selectedCookie
   * variable to be the first in the list).
   *
   */
  const getAllCookies = async (sortType) => {
    console.log(sortType);

    const cookiesResponse = await getAllCookiesAPI().then((results) => {
      // Handle no Cookie records
      if (results.length !== 0) {
        setCookiesArr(results);
        setSortedCookiesArr(sortData(results, sortField, sortType));
      } else {
        setCookiesArr([]);
        setSortedCookiesArr([]);
      }
    });
  };

  /**
   * getCookieImages handles the API call to get the stored image_urls
   * for a specific cookie_id.
   *
   */
  const getCookieImages = async () => {
    let resultsURLs = [];

    // Get API response to GET request
    const latestResponse = await getCookieImagesAPI(selectedCookie.cookie_id)
      .then((results) => {
        return results[1]; // Return resulting promise
      })
      .then((results) => {
        // Store the resulting URLs
        for (let i = 0; i < results.result.length; i++) {
          resultsURLs.push(results.result[i].image_url);
        }
      });

    return resultsURLs;
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
    let APIBody = `{"cookie_id": ${selectedCookie.cookie_id}}`;

    // Declare storage variables
    let deleteStatus;
    let deleteMsg;

    // Delete Cookie images
    // Delete the Cookie Image from the database
    const imageResponse = await getCookieImages().then((results) => {
      if (results.length > 0) {
        for (let i = 0; i < results.length; i++) {
          deleteCookieImage(results[i]);
        }
      }
    });

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

        // Refresh cookie data
        getAllCookies("Delete");
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

  const sortData = (data, sortKey, sortType) => {
    let tempSortOrder = sortOrder; // This fixes the problem with slow state updates
    
    // Check ascending or descending
    // Only check if selection, not on edit, create or delete
    if (sortType === undefined) {
      if (sortKey === sortField) {
        if (sortOrder === false) {
          setSortOrder(true);
          tempSortOrder = true;
        } else {
          setSortOrder(false);
          tempSortOrder = false;
        }
      } else {
        setSortOrder(true);
        tempSortOrder = true;
      }
    }

    // Sort the data
    const sortedCookies = [];
    if (sortKey === "name") {
      sortedCookies = data.sort((x, y) => {
        let a = x[sortKey].toUpperCase(),
          b = y[sortKey].toUpperCase();

        if (tempSortOrder == true) {
          return a == b ? 0 : a > b ? 1 : -1;
        } else {
          return a == b ? 0 : a > b ? -1 : 1;
        }
      });
    } else {
      sortedCookies = data.sort((x, y) => {
        let a = x[sortKey],
          b = y[sortKey];

        if (tempSortOrder == false) {
          return a == b ? 0 : a > b ? 1 : -1;
        } else {
          return a == b ? 0 : a > b ? -1 : 1;
        }
      });
    }

    return sortedCookies;
  };

  return (
    <>
      <div className="header-container">
        <h1 style={{ display: "inline-block", marginBottom: "0px" }}>
          Cookies
        </h1>
        <Button className="general-button" onClick={handleNewModalShow}>
          New Cookie
        </Button>
      </div>
      {sortedCookiesArr.length > 0 ? (
        <Table striped style={{ textAlign: "center" }}>
          <thead>
            <tr>
              <th scope="col">Edit</th>
              <th
                scope="col"
                onClick={() => {
                  setSortField("name");
                  setSortedCookiesArr(sortData(cookiesArr, "name"));
                }}
                style={{ cursor: "pointer" }}
              >
                Name
                {sortOrder ? (
                  <i
                    class="bi bi-caret-down-fill"
                    style={{
                      display: sortField == "name" ? "inline-block" : "none",
                    }}
                  ></i>
                ) : (
                  <i
                    class="bi bi-caret-up-fill"
                    style={{
                      display: sortField == "name" ? "inline-block" : "none",
                    }}
                  ></i>
                )}
              </th>
              <th
                scope="col"
                onClick={() => {
                  setSortField("cost");
                  setSortedCookiesArr(sortData(cookiesArr, "cost"));
                }}
                style={{ cursor: "pointer" }}
              >
                Cost
                {sortOrder ? (
                  <i
                    class="bi bi-caret-down-fill"
                    style={{
                      display: sortField == "cost" ? "inline-block" : "none",
                    }}
                  ></i>
                ) : (
                  <i
                    class="bi bi-caret-up-fill"
                    style={{
                      display: sortField == "cost" ? "inline-block" : "none",
                    }}
                  ></i>
                )}
              </th>
              <th
                scope="col"
                onClick={() => {
                  setSortField("active_status");
                  setSortedCookiesArr(sortData(cookiesArr, "active_status"));
                }}
                style={{ cursor: "pointer" }}
              >
                Status
                {sortOrder ? (
                  <i
                    class="bi bi-caret-down-fill"
                    style={{
                      display:
                        sortField == "active_status" ? "inline-block" : "none",
                    }}
                  ></i>
                ) : (
                  <i
                    class="bi bi-caret-up-fill"
                    style={{
                      display:
                        sortField == "active_status" ? "inline-block" : "none",
                    }}
                  ></i>
                )}
              </th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {sortedCookiesArr.map((cookie, index) => {
              return (
                <CookieRow
                  cookie={cookie}
                  handleEditOpen={handleEditModalShow}
                  handleDeleteOpen={handleDeleteModalShow}
                  setSelectedCookie={setSelectedCookie}
                  index={index}
                  key={index}
                />
              );
            })}
          </tbody>
        </Table>
      ) : (
        <p>You have no cookie records. Create some!</p>
      )}

      <NewCookieModal
        show={showNewModal}
        handleClose={handleNewModalClose}
        getAllCookies={getAllCookies}
      />
      <EditCookieModal
        cookie={selectedCookie}
        show={showEditModal}
        handleClose={handleEditModalClose}
        getAllCookies={getAllCookies}
      />
      <DeleteModal
        show={showDeleteModal}
        handleClose={handleDeleteModalClose}
        deleteRecord={deleteCookieRecord}
      />
    </>
  );
};

export default CookieTable;
