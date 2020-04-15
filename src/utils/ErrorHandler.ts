export const handleGeneralErrors = (error: any, updateCurrentUser: any): string => {
  let message = '';
  switch (error.message) {
    case 'Network error: NetworkError when attempting to fetch resource.':
      message = 'Connection error. Please, check your network.';
      break;
    case 'GraphQL error: not_authenticated':
      updateCurrentUser(null);
      message = "User not authenticated."
      break;
    default:
      message = 'There has been a problem. Please, contact the admin.';
      break;
  }

  return message;
}