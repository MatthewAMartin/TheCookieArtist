import { useState, useEffect } from "react";
import { getAllCookiesAPI } from "../pages/api/cookiesAPI";
import { Table, Button } from "react-bootstrap";
import PackageRow from "./PackageRow";
import NewPackageModal from "./NewPackageModal";
import EditPackageModal from "./EditPackageModal";
import DeleteModal from "./DeleteModal";
import { getAllPackagesAPI, deletePackageAPI } from "../pages/api/packagesAPI";

const PackageTable = () => {
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

  // Cookie & Package Data Variables
  const [packagesArr, setPackagesArr] = useState([]);
  const [cookiesArr, setCookiesArr] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState({});
  const [sortedPackagesArr, setSortedPackagesArr] = useState([]);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState(false);

  useEffect(() => {
    getAllPackages();
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
    const cookiesResponse = await getAllCookiesAPI().then((results) => {
      // Handle no Cookie records
      if (results.length !== 0) {
        setCookiesArr(results);
      } else {
        setCookiesArr([]);
      }
    });
  };

  /**
   * getAllPackages handles the API calls to get all Package data.
   * It then updates the form with that data (or to empty if no
   * Package data exists).
   *
   */
  const getAllPackages = (sortType) => {
    getAllPackagesAPI().then((results) => {
      // Handle no Package records
      if (results.length !== 0) {
        setPackagesArr(results);
        setSortedPackagesArr(sortData(results, "name", sortType));
      } else {
        // Initialise form and variables to empty/default
        setPackagesArr([]);
        setSortedPackagesArr([]);
      }
    });
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
    let APIBody = `{"package_id": ${selectedPackage.package_id}}`;

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

        // Refresh package data
        getAllPackages("Delete");
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
    const sortedPackages = [];
    if (sortKey === "name") {
      sortedPackages = data.sort((x, y) => {
        let a = x[sortKey].toUpperCase(),
          b = y[sortKey].toUpperCase();

        if (tempSortOrder == true) {
          return a == b ? 0 : a > b ? 1 : -1;
        } else {
          return a == b ? 0 : a > b ? -1 : 1;
        }
      });
    } else {
      sortedPackages = data.sort((x, y) => {
        let a = x[sortKey],
          b = y[sortKey];

        if (tempSortOrder == false) {
          return a == b ? 0 : a > b ? 1 : -1;
        } else {
          return a == b ? 0 : a > b ? -1 : 1;
        }
      });
    }

    return sortedPackages;
  };

  return (
    <>
      <div className="header-container">
        <h1 style={{ display: "inline-block", marginBottom: "0px" }}>
          Packages
        </h1>
        <Button className="general-button" onClick={handleNewModalShow}>
          New Package
        </Button>
      </div>
      {sortedPackagesArr.length > 0 ? (
        <Table striped style={{ textAlign: "center" }}>
          <thead>
            <tr>
              <th scope="col">Edit</th>
              <th
                scope="col"
                onClick={() => {
                  setSortField("name");
                  setSortedPackagesArr(sortData(packagesArr, "name"));
                }}
                style={{ cursor: "pointer" }}
              >
                Cookie
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
                  setSortField("amount");
                  setSortedPackagesArr(sortData(packagesArr, "amount"));
                }}
                style={{ cursor: "pointer" }}
              >
                Amount
                {sortOrder ? (
                  <i
                    class="bi bi-caret-down-fill"
                    style={{
                      display: sortField == "amount" ? "inline-block" : "none",
                    }}
                  ></i>
                ) : (
                  <i
                    class="bi bi-caret-up-fill"
                    style={{
                      display: sortField == "amount" ? "inline-block" : "none",
                    }}
                  ></i>
                )}
              </th>
              <th
                scope="col"
                onClick={() => {
                  setSortField("cost");
                  setSortedPackagesArr(sortData(packagesArr, "cost"));
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
                  setSortedPackagesArr(sortData(packagesArr, "active_status"));
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
            {sortedPackagesArr.map((packageItem, index) => {
              return (
                <PackageRow
                  packageItem={packageItem}
                  handleEditOpen={handleEditModalShow}
                  handleDeleteOpen={handleDeleteModalShow}
                  setSelectedPackage={setSelectedPackage}
                  index={index}
                  key={index}
                />
              );
            })}
          </tbody>
        </Table>
      ) : (
        <p>You have no package records. Create some!</p>
      )}

      <NewPackageModal
        show={showNewModal}
        handleClose={handleNewModalClose}
        cookiesArr={cookiesArr}
        getAllPackages={getAllPackages}
      />
      <EditPackageModal
        packageItem={selectedPackage}
        show={showEditModal}
        handleClose={handleEditModalClose}
        getAllPackages={getAllPackages}
      />
      <DeleteModal
        show={showDeleteModal}
        handleClose={handleDeleteModalClose}
        deleteRecord={deletePackageRecord}
      />
    </>
  );
};

export default PackageTable;
