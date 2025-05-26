export const REQUEST_MAPPING = 'api/v1';
export const ENTITY_API_ENDPOINTS = `${REQUEST_MAPPING}/entity`;

export const LOGIN_API_ENDPOINTS = {
  REQUEST_MAPPING: 'auth',
  LOGIN: 'login',
};

export const ENTITY = {
  GET_ALL: `${ENTITY_API_ENDPOINTS}/all-entities`,
  GET_BY_ID: ENTITY_API_ENDPOINTS,
  CREATE: `${ENTITY_API_ENDPOINTS}/new-entity`,
  UPDATE: `${ENTITY_API_ENDPOINTS}/update-entity`,
  DELETE: `${ENTITY_API_ENDPOINTS}/delete-entity`,
}