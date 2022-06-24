import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

const PackageRow = ({
  packageItem,
  handleEditOpen,
  handleDeleteOpen,
  setSelectedPackage,
}) => {
  const [status, setStatus] = useState("");
  useEffect(() => {
    if (packageItem.active_status == 1) {
      setStatus("Active");
    } else {
      setStatus("Inactive");
    }
  }, [packageItem]);

  return (
    <>
      <tr>
        <th scope="row">
          <Button
            className="edit-icon"
            onClick={() => {
              setSelectedPackage(packageItem);
              handleEditOpen();
            }}
          >
            <i className="bi bi-pencil-square"></i>
          </Button>
        </th>
        <td>{packageItem.name}</td>
        <td>{packageItem.amount}</td>
        <td>${packageItem.cost != undefined ? packageItem.cost.toFixed(2) : "0.00"}</td>
        <td>{status}</td>
        <th scope="row">
          <Button
            className="del-icon"
            onClick={() => {
              setSelectedPackage(packageItem);
              handleDeleteOpen();
            }}
          >
            <i className="bi bi-trash"></i>
          </Button>
        </th>
      </tr>
    </>
  );
};

export default PackageRow;
