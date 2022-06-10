/**
 * getAllCookiesAPI handles the request and response for getting
 * all cookie records from the database.
 *
 * @return {*} A response.json() (Promise).
 */
export async function getAllCookiesAPI() {
  // Send request
  const response = await fetch("/api/cookies");

  // Return response
  return await response.json();
}

/**
 * getLatestCookieAPI handles the request and response for getting
 * the cookie_id of the most recently created cookie record.
 *
 * @return {*} A response.json() (Promise).
 */
export async function getLatestCookieIDAPI() {
  // Send request
  const response = await fetch("/api/cookies/latest");

  // Return response
  return response.json();
}

/**
 * getCookieImagesAPI handles the request and response for
 * getting all image_urls linked to a specified cookie record.
 *
 * @param {*} id The cookie_id of the record.
 * @return {*} An array containing [response (Object), response.json() (Promise)].
 */
export async function getCookieImagesAPI(id) {
  // Send request
  const response = await fetch(`/api/cookies/images/${id}`);

  // Return response
  return [response, response.json()];
}

/**
 * postCookieAPI handles the request and response for
 * adding cookie records to the database.
 *
 * @param {*} APIBody A json formatted string defining the body of the response.
 * @return {*} An array containing [response, response.json()].
 */
export async function postCookieAPI(APIBody) {
  // Send request
  const response = await fetch("/api/cookies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: APIBody,
  });

  // Return response
  return [response, response.json()];
}

/**
 * postCookieImageAPI handles the request and response for
 * adding images to the application (file storage and
 * database tracking).
 *
 * @param {*} id The cookie_id of the record.
 * @param {*} image The image file being added.
 * @return {*} An array containing [response, response.json()].
 */
export async function postCookieImageAPI(id, image) {
  // Construct the API request body
  const body = new FormData();
  body.append("cookie_id", id);
  body.append("file", image);

  // Send request
  const response = await fetch("/api/cookies/images", {
    method: "POST",
    body,
  });

  // Return response
  return [response, response.json()];
}

/**
 * putCookieAPI handles the request and response for
 * updating cookie records in the database.
 *
 * @param {*} APIBody A json formatted string defining the body of the response.
 * @return {*} An array containing [response, response.json()].
 */
export async function putCookieAPI(APIBody) {
  // Send request
  const response = await fetch("/api/cookies", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: APIBody,
  });

  // Return response
  return [response, response.json()];
}

/**
 * deleteCookieAPI handles the request and response for
 * deleting cookie records from the database.
 *
 * @param {*} APIBody A json formatted string defining the body of the response.
 * @return {*} An array containing [response, response.json()].
 */
export async function deleteCookieAPI(APIBody) {
  // Send request
  const response = await fetch("/api/cookies", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: APIBody,
  });

  // Return response
  return [response, response.json()];
}

/**
 * deleteCookieImageAPI handles the request and response for
 * deleting cookie images from the database (and file storage).
 *
 * @param {*} APIBody A json formatted string defining the body of the response.
 * @return {*} An array containing [response, response.json()].
 */
export async function deleteCookieImageAPI(APIBody) {
  // Send request
  const response = await fetch("/api/cookies/images", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: APIBody,
  });

  // Return response
  return [response, response.json()];
}
