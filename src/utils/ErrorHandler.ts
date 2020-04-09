export const handleGeneralErrors = (error: any, history: any): string => {
  let message = '';
  switch (error.message) {
    case 'Network error: NetworkError when attempting to fetch resource.':
      message = 'Connection error. Please, check your network.';
      break;
    case 'GraphQL error: not_authenticated':
      localStorage.removeItem('currentUser');
      history.push("/");
      message = "User not authenticated."
      break;
    default:
      message = 'There has been a problem. Please, contact the admin.';
      break;
  }

  return message;
}