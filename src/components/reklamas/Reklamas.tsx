import React, { useState, useRef, useEffect } from 'react';
import useStyles from './ReklamasStyles';
import Reklama, { ReklamaProps } from './reklama/Reklama';
import { Grid, Box, CircularProgress } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import LoopIcon from '@material-ui/icons/Loop';
import { Link, useParams } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';
import { REKLAMAS } from '../../graphql/Reklama';
import { handleGeneralErrors } from '../../utils/ErrorHandler';
import TopAlert from '../ui/alerts/topAlert/TopAlert';
import { useAuth } from '../../providers/authProvider/AuthProvider';
import FilterDrawer from '../ui/filterDrawer/FilterDrawer';
import { Column } from '../ui/dataTable/DataTable';

const Reklamas = () => {

  // Services

  const classes = useStyles();
  const { updateCurrentUser } = useAuth()!;

  const { topicId } = useParams();

  const [totalPages, setTotalPages] = useState(-1);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [filters, setFilters] = useState<{ [index: string]: any } | undefined>(undefined);
  const [reklamas, setReklamas] = useState<(ReklamaProps & { id: number })[] | null>(null);
  const loadDemanded = useRef(true);
  const filerOrderDemanded = useRef(false);

  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState('');

  const { loading, error, data } = useQuery(REKLAMAS, {
    variables: {
      page: page + 1,
      perPage: rowsPerPage,
      filter: {
        topicId: Number.parseInt(topicId!),
        ...filters
      },
      order: {
        order_desc: "inserted_at"
      }
    },
    skip: !loadDemanded && !filerOrderDemanded,
    fetchPolicy: 'no-cache'
  });

  useEffect(() => {

    if (error) {
      setShowAlert(true);
      setAlertText(handleGeneralErrors(error, updateCurrentUser));
    }

  }, [error]);

  useEffect(() => {

    filerOrderDemanded.current = true;
    setPage(0);
    setTotalPages(-1);

  }, [filters]);

  useEffect(() => {

    if (reklamas && reklamas.length === 0) {
      setShowAlert(true);
      setAlertText("No Reklamas Found");
    }

  }, [reklamas]);

  if (showAlert) {
    setTimeout(() => setShowAlert(false), 3_000);
  }

  // Functions 

  const parseData = (data: any) => {
    return data.reklamas.reklamas.map((reklama: any) => (
      {
        id: reklama.id,
        header: reklama.title,
        subheader: new Date(reklama.insertedAt).toLocaleString(),
        image: reklama.images[0] ? reklama.images[0].image : reklama.topic.image,
        imageTitle: reklama.images[0] ? reklama.images[0].name : reklama.topic.imageName,
        shortDescription: reklama.content.substring(0, 50),
        numLikes: 100
      }
    ));
  }

  const loadNextPage = () => {
    loadDemanded.current = true;
    setPage(page + 1);
  }

  const toggleDrawer = () => setIsOpenDrawer(!isOpenDrawer);

  if (data && !loading) {

    if (loadDemanded.current) {
      loadDemanded.current = false;

      let updatedReklamas: (ReklamaProps & { id: number })[] = [];
      if (reklamas) {
        updatedReklamas = [...reklamas];
      }

      updatedReklamas.push(...parseData(data));

      setReklamas(updatedReklamas);
      setTotalPages(data.reklamas.metadata.totalPages);

    } else if (filerOrderDemanded.current) {
      filerOrderDemanded.current = false;

      setReklamas(parseData(data));
      setTotalPages(data.reklamas.metadata.totalPages);
    }
  }

  const filterInputs: Column['filter'][] = [
    { filter: 'title', filterLabel: 'Title', filterType: 'string' }
  ];

  return (
    <>
      {loading
        ? <Box component="div" className={classes.load}>
          <CircularProgress color="secondary" size="2em" />
        </Box>
        : null}
      {showAlert ? <TopAlert msg={alertText} type="error" /> : null}
      <Grid container justify="center" alignItems="stretch"
        spacing={3} className={classes.root}>
        {reklamas && reklamas.length !== 0
          ? reklamas.map(reklama => (
            <Grid item className={classes.reklamasRoot} xs key={reklama.id}>
              <Link to={`/reklamas/${reklama.id}`}>
                <Reklama {...reklama} />
              </Link>
            </Grid>
          ))
          : null
        }
        {(totalPages - 1) > page
          ?
          <Box component="div" className={classes.loader}>
            <Fab aria-label="load" onClick={loadNextPage}>
              <LoopIcon color="secondary" />
            </Fab>
          </Box>
          : null}
      </Grid>
      <FilterDrawer anchor="left"
        open={isOpenDrawer}
        onClose={toggleDrawer}
        filters={filterInputs}
        setFilters={setFilters}
        className={classes.drawer}
      />
      <Fab aria-label="search" color="secondary" className={classes.searchButton} onClick={toggleDrawer}>
        <SearchIcon />
      </Fab>
      <Link to={`/reklamas/create`}>
        <Fab aria-label="add" color="secondary" size="small" className={classes.addButton}>
          <AddIcon />
        </Fab>
      </Link>
    </>
  );
}

export default Reklamas;
