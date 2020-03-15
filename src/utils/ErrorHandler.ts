export const getGeneralErrorMsg = (error: any): string => {
  let message = '';

  switch (error.message) {
    case 'Network error: NetworkError when attempting to fetch resource.':
      message = 'Connection error. Please, check your network.';
      break;
    default:
      message = 'There has been a problem. Please, contact the admin.';
      break;
  }

  return message;
}