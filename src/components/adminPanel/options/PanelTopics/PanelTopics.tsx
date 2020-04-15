import React, { useState } from 'react';
import useStyles from './PanelTopicsStyles';
import { TOPICS } from '../../../../graphql/Reklama';
import Card from '@material-ui/core/Card';
import DataTable, { Column } from '../../../ui/dataTable/DataTable';
import TopAlert, { TopAlertProps } from '../../../ui/alerts/topAlert/TopAlert';
import AddIcon from '@material-ui/icons/Add';
import DeleteDialog from './Dialogs/DeleteDialog';
import CreateDialog from './Dialogs/CreateDialog';
import UpdateDialog from './Dialogs/UpdateDialog';
import { Fab } from '@material-ui/core';

const PanelTopics = () => {

  // Services

  const classes = useStyles();
  const [alertType, setAlertType] = useState<TopAlertProps['type']>('error');
  const [alertText, setAlertText] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [topicId, setTopicId] = useState<string | null>(null);

  if (showAlert) {
    setTimeout(() => setShowAlert(false), 1_500);
  }

  // Functions 

  const parseData = (data: any) => ({
    metadata: {
      page: 1,
      totalPages: 1,
      totalResults: data.topics.length
    },
    data: data.topics.map((topic: any) => {
      return {
        id: topic.id,
        title: topic.title,
        description: topic.description,
        image: topic.image
      }
    })
  });

  const handleDelete = (id: string) => {
    setShowDelete(true);
    setTopicId(id);
  }

  const handleUpdate = (id: string) => {
    setShowUpdate(true);
    setTopicId(id);
  }

  const handleCreate = () => {
    setShowCreate(true);
  }

  const columns: Array<Column> = [
    {
      id: 'title', label: 'Title', minWidth: 150,
      filter: { filter: 'title', filterLabel: 'Title', filterType: 'string' },
      order: 'title'
    },
    {
      id: 'description', label: 'Description', minWidth: 200,
      filter: { filter: 'description', filterLabel: 'Description', filterType: 'string' },
      order: 'description'
    },
    {
      id: 'image', label: 'Image', minWidth: 100, image: true, align: 'center'
    }
  ];

  return (
    <>
      {showAlert ? <TopAlert msg={alertText} type={alertType} /> : null}
      <DeleteDialog
        show={showDelete}
        setShow={setShowDelete}
        topicId={topicId}
        setShowAlert={setShowAlert}
        setAlertType={setAlertType}
        setAlertText={setAlertText}
      />
      <CreateDialog
        show={showCreate}
        setShow={setShowCreate}
        setShowAlert={setShowAlert}
        setAlertType={setAlertType}
        setAlertText={setAlertText}
      />
      <UpdateDialog
        show={showUpdate}
        setShow={setShowUpdate}
        setShowAlert={setShowAlert}
        setAlertType={setAlertType}
        setAlertText={setAlertText}
        topicId={topicId}
      />
      <Card className={classes.root}>
        <DataTable
          columns={columns}
          query={TOPICS}
          parseData={parseData}
          setShowError={(value: boolean) => { setShowAlert(value); setAlertType('error'); }}
          setErrorText={setAlertText}
          delete={handleDelete}
          update={handleUpdate}
        />
      </Card>
      <Fab aria-label="add" color="secondary" className={classes.addButton} onClick={handleCreate}>
        <AddIcon />
      </Fab>
    </>
  );
}

export default PanelTopics;
