/**
 * getAllCollectionsAPI handles the request and response for getting
 * all collection records from the database.
 *
 * @return {*} A response.json() (Promise).
 */
export async function getAllCollectionsAPI() {
  // Send request
  const response = await fetch("/api/collections");

  // Return response
  return await response.json();
}

/**
 * getLatestCollectionIDAPI handles the request and response for getting
 * the collection_id of the most recently created collection record.
 *
 * @return {*} A response.json() (Promise).
 */
export async function getLatestCollectionIDAPI() {
  // Send request
  const response = await fetch("/api/collections/latest");

  // Return response
  return response.json();
}

/**
 * getCollectionCookiesAPI handles the request and response for getting
 * all collection_cookie records linked to a specified collection record.
 *
 * @param {*} id The collection_id of the record.
 * @return {*} An array containing [response (Object), response.json() (Promise)].
 */
export async function getCollectionCookiesAPI(id) {
  // Send request
  const response = await fetch(`/api/collections/cookies/${id}`);

  // Return response
  return [response, response.json()];
}

/**
 * getCollectionImagesAPI handles the request and response for
 * getting all image_urls linked to a specified collection record.
 *
 * @param {*} id The collection_id of the record.
 * @return {*} An array containing [response (Object), response.json() (Promise)].
 */
export async function getCollectionImagesAPI(id) {
  // Send request
  const response = await fetch(`/api/collections/images/${id}`);

  // Return response
  return [response, response.json()];
}

/**
 * postCollectionAPI handles the request and response for
 * adding collection records to the database.
 *
 * @param {*} APIBody A json formatted string defining the body of the response.
 * @return {*} An array containing [response, response.json()].
 */
export async function postCollectionAPI(APIBody) {
  // Send request
  const response = await fetch("/api/collections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: APIBody,
  });

  // Return response
  return [response, response.json()];
}

/**
 * postCollectionCookieAPI handles the request and response for
 * adding collection_cookie records to the database.
 *
 * @param {*} APIBody A json formatted string defining the body of the response.
 * @return {*} An array containing [response, response.json()].
 */
export async function postCollectionCookieAPI(APIBody) {
  // Send request
  const response = await fetch("/api/collections/cookies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: APIBody,
  });

  // Return response
  return [response, response.json()];
}

/**
 * postCollectionImageAPI handles the request and response for
 * adding images to the application (file storage and
 * database tracking).
 *
 * @param {*} id The collection_id of the record.
 * @param {*} image The image file being added.
 * @return {*} An array containing [response, response.json()].
 */
export async function postCollectionImageAPI(id, image) {
  // Construct the API request body
  const body = new FormData();
  body.append("collection_id", id);
  body.append("file", image);

  // Send request
  const response = await fetch("/api/collections/images", {
    method: "POST",
    body,
  });

  // Return response
  return [response, response.json()];
}

/**
 * putCollectionAPI handles the request and response for
 * updating collection records in the database.
 *
 * @param {*} APIBody A json formatted string defining the body of the response.
 * @return {*} An array containing [response, response.json()].
 */
export async function putCollectionAPI(APIBody) {
  // Send request
  const response = await fetch("/api/collections", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: APIBody,
  });

  // Return response
  return [response, response.json()];
}

/**
 * putCollectionCookieAPI handles the request and response for
 * updating collection_cookie records in the database.
 *
 * @param {*} APIBody A json formatted string defining the body of the response.
 * @return {*} An array containing [response, response.json()].
 */
export async function putCollectionCookieAPI(APIBody) {
  // Send request
  const response = await fetch("/api/collections/cookies", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: APIBody,
  });

  // Return response
  return [response, response.json()];
}

/**
 * deleteCollectionAPI handles the request and response for
 * deleting collection records from the database.
 *
 * @param {*} APIBody A json formatted string defining the body of the response.
 * @return {*} An array containing [response, response.json()].
 */
export async function deleteCollectionAPI(APIBody) {
  // Send request
  const response = await fetch("/api/collections", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: APIBody,
  });

  // Return response
  return [response, response.json()];
}

/**
 * deleteCollectionCookieAPI handles the request and response for
 * deleting collection_cookie records from the database.
 *
 * @param {*} APIBody A json formatted string defining the body of the response.
 * @return {*} An array containing [response, response.json()].
 */
export async function deleteCollectionCookieAPI(APIBody) {
  // Send request
  const response = await fetch("/api/collections/cookies", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: APIBody,
  });

  // Return response
  return [response, response.json()];
}

/**
 * deleteCollectionImageAPI handles the request and response for
 * deleting collection images from the database (and file storage).
 *
 * @param {*} APIBody A json formatted string defining the body of the response.
 * @return {*} An array containing [response, response.json()].
 */
export async function deleteCollectionImageAPI(APIBody) {
  // Send request
  const response = await fetch("/api/collections/images", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: APIBody,
  });

  // Return response
  return [response, response.json()];
}
