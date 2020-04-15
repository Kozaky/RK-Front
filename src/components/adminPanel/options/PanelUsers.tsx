import React, { useState, Dispatch, SetStateAction } from 'react';
import useStyles from './PanelUsersStyles';
import { USERS, ROLES, UPDATE_USER_ROLE } from '../../../graphql/User';
import Card from '@material-ui/core/Card';
import DataTable, { Column } from '../../ui/dataTable/DataTable';
import TopAlert, { TopAlertProps } from '../../ui/alerts/topAlert/TopAlert';
import { Dialog, List, DialogTitle, ListItem, ListItemText, Divider } from '@material-ui/core';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useAuth } from '../../../providers/authProvider/AuthProvider';
import { handleGeneralErrors } from '../../../utils/ErrorHandler';

const PanelUsers = () => {

  // Services

  const classes = useStyles();
  const [alertType, setAlertType] = useState<TopAlertProps['type']>('error');
  const [alertText, setAlertText] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  if (showAlert) {
    setTimeout(() => setShowAlert(false), 1_500);
  }

  // Functions 

  const parseData = (data: any) => ({
    metadata: {
      page: data.users.metadata.page,
      totalPages: data.users.metadata.totalPages,
      totalResults: data.users.metadata.totalResults
    },
    data: data.users.users.map((user: any) => {
      return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role.type
      }
    })
  });

  const handleUpdate = (id: string) => {
    setShowUpdate(true);
    setUserId(id);
  }

  const columns: Array<Column> = [
    {
      id: 'fullName', label: 'Full Name', minWidth: 170,
      filter: { filter: 'fullName', filterLabel: 'Full Name', filterType: 'string' },
      order: 'full_name'
    },
    {
      id: 'email', label: 'Email', minWidth: 100,
      filter: { filter: 'email', filterLabel: 'Email', filterType: 'string' },
      order: 'email'
    },
    {
      id: 'role', label: 'Role', minWidth: 50,
      filter: { filter: 'role', filterLabel: 'Role', filterType: 'string' }
    }
  ];

  return (
    <>
      {showAlert ? <TopAlert msg={alertText} type={alertType} /> : null}
      <DialogUpdate
        show={showUpdate}
        setShow={setShowUpdate}
        userId={userId}
        setShowAlert={setShowAlert}
        setAlertType={setAlertType}
        setAlertText={setAlertText}
      />
      <Card className={classes.root}>
        <DataTable
          columns={columns}
          query={USERS}
          parseData={parseData}
          setShowError={(value: boolean) => { setShowAlert(value); setAlertType('error'); }}
          setErrorText={setAlertText}
          update={handleUpdate}
        />
      </Card>
    </>
  );
}

type CustomDialogProps = {
  show: boolean,
  setShow: React.Dispatch<React.SetStateAction<boolean>>,
  userId: string | null,
  setShowAlert: Dispatch<SetStateAction<boolean>>,
  setAlertText: Dispatch<SetStateAction<string>>,
  setAlertType: React.Dispatch<React.SetStateAction<"error" | "success" | "info" | "warning" | undefined>>,
}

type Role = {
  id: string,
  type: string,
}

const DialogUpdate = (props: CustomDialogProps) => {

  const classes = useStyles();
  const { updateCurrentUser } = useAuth()!;
  const { loading, error, data } = useQuery(ROLES);
  const [updateUserRole] = useMutation(UPDATE_USER_ROLE);

  if (loading) {
    return null;
  }

  if (error) {
    props.setAlertType('error');
    props.setShowAlert(true);
    props.setAlertText(handleGeneralErrors(error, updateCurrentUser));
    return null;
  }

  const handleChangeRole = (role: string) => {

    updateUserRole({
      variables: {
        userUpdateRoleDetails: {
          id: Number.parseInt(props.userId!),
          roleId: Number.parseInt(role)
        }
      }
    })
      .then(({ data }) => {
        props.setShow(false);
        props.setAlertType('success');
        props.setShowAlert(true);
        props.setAlertText('User updated');
      })
      .catch(error => {
        props.setAlertType('error');
        props.setShowAlert(true);
        props.setAlertText(handleGeneralErrors(error, updateCurrentUser));
      });
  }

  const roles: Array<Role> = data.roles;

  return (
    <Dialog onClose={() => props.setShow(false)}
      aria-labelledby="simple-dialog-title"
      open={props.show}
      className={classes.dialogUpdate}
    >
      <DialogTitle id="simple-dialog-title" color="secondary">Set a Role</DialogTitle>
      <Divider />
      <List>
        {roles.map((role) => (
          <ListItem button onClick={() => handleChangeRole(role.id)} key={role.type}>
            <ListItemText primary={role.type} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  )
}

export default PanelUsers;
