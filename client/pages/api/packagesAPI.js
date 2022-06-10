/**
 * getAllPackagesAPI handles the request and response for getting
 * all package records from the database.
 *
 * @return {*} A response.json() (Promise).
 */
export async function getAllPackagesAPI() {
  // Send request
  const response = await fetch("/api/packages");

  // Return response
  return await response.json();
}

/**
 * getAllCookiePackagesAPI handles the request and response for getting
 * all package records for a specific Cookie from the database.
 *
 * @return {*} A response.json() (Promise).
 */
 export async function getAllCookiePackagesAPI(id) {
  // Send request
  const response = await fetch(`/api/packages/${id}`);

  // Return response
  return await response.json();
}

/**
 * postPackageAPI handles the request and response for
 * adding package records to the database.
 *
 * @param {*} APIBody A json formatted string defining the body of the response.
 * @return {*} An array containing [response, response.json()].
 */
export async function postPackageAPI(APIBody) {
  // Send request
  const response = await fetch("/api/packages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: APIBody,
  });

  // Return response
  return [response, response.json()];
}

/**
 * putPackageAPI handles the request and response for
 * updating package records in the database.
 *
 * @param {*} APIBody A json formatted string defining the body of the response.
 * @return {*} An array containing [response, response.json()].
 */
export async function putPackageAPI(APIBody) {
  // Send request
  const response = await fetch("/api/packages", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: APIBody,
  });

  // Return response
  return [response, response.json()];
}

/**
 * deletePackageAPI handles the request and response for
 * deleting package records from the database.
 *
 * @param {*} APIBody A json formatted string defining the body of the response.
 * @return {*} An array containing [response, response.json()].
 */
export async function deletePackageAPI(APIBody) {
  // Send request
  const response = await fetch("/api/packages", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: APIBody,
  });

  // Return response
  return [response, response.json()];
}
