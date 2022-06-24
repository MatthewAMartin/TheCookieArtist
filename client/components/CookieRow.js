import { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";

const CookieRow = ({
  cookie,
  handleEditOpen,
  handleDeleteOpen,
  setSelectedCookie,
}) => {
  const [status, setStatus] = useState("");
  useEffect(() => {
    if (cookie.active_status == 1) {
      setStatus("Active");
    } else {
      setStatus("Inactive");
    }
  }, [cookie]);

  return (
    <>
      <tr>
        <th scope="row">
          <Button
            className="edit-icon"
            onClick={() => {
              setSelectedCookie(cookie);
              handleEditOpen();
            }}
          >
            <i className="bi bi-pencil-square"></i>
          </Button>
        </th>
        <td>{cookie.name}</td>
        <td>${cookie.cost != undefined ? cookie.cost.toFixed(2) : "0.00"}</td>
        <td>{status}</td>
        <th scope="row">
          <Button
            className="del-icon"
            onClick={() => {
              setSelectedCookie(cookie);
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

export default CookieRow;
