import React, { useState, useRef, useEffect } from 'react';
import useStyles from './ReklamasStyles';
import Reklama, { ReklamaProps } from './reklama/Reklama';
import { Grid, Box, CircularProgress } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import LoopIcon from '@material-ui/icons/Loop';
import { Link, useParams, useHistory } from "react-router-dom";
import { useQuery } from 'react-apollo';
import { REKLAMAS } from '../../graphql/Reklama';
import { handleGeneralErrors } from '../../utils/ErrorHandler';
import TopAlert from '../ui/alerts/topAlert/TopAlert';
import { useAuth } from '../../providers/authProvider/AuthProvider';
import FilterDrawer from '../ui/filterDrawer/FilterDrawer';
import { Column } from '../ui/dataTable/DataTable';

const getReklamaPage = () => {
  let reklamaPage = {
    currentPage: 0,
    totalPages: -1,
    rowsPerPage: 3,
    reklamas: null,
    filters: null
  };

  if (hasPreviousState()) {
    const previousReklamaPage = window.sessionStorage.getItem('reklamaPage');
    reklamaPage = JSON.parse(previousReklamaPage!);
  }

  return reklamaPage;
}

const hasPreviousState = () => {
  return window.sessionStorage.getItem('reklamaPage') !== null
    && sessionStorage.getItem('scrollPosition');
}

type ReklamaPage = {
  currentPage: number,
  totalPages: number,
  rowsPerPage: number,
  reklamas: (ReklamaProps & { id: number })[] | null,
  filters: { [index: string]: any } | undefined | null
}

const Reklamas = () => {

  // Services

  const classes = useStyles();
  const { updateCurrentUser } = useAuth()!;
  const history = useHistory();
  const { topicId } = useParams();

  const [reklamaPage, setReklamaPage] = useState<ReklamaPage>(getReklamaPage());
  const reklamasGrid = useRef<HTMLDivElement>(null);
  const loadDemanded = useRef(!hasPreviousState());
  const executeFilter = useRef(false);

  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState('');

  const { loading, error, data } = useQuery(REKLAMAS, {
    variables: {
      page: reklamaPage.currentPage + 1,
      perPage: reklamaPage.rowsPerPage,
      filter: {
        topicId: Number.parseInt(topicId!),
        ...reklamaPage.filters
      },
      order: {
        order_desc: "inserted_at"
      }
    },
    skip: !loadDemanded.current && !executeFilter.current,
    fetchPolicy: 'no-cache'
  });

  useEffect(() => {

    const scrollPosition = sessionStorage.getItem('scrollPosition');
    if (scrollPosition !== null) {
      reklamasGrid.current!.scrollTo(0, Number.parseInt(scrollPosition));
    }

  }, []);

  useEffect(() => {

    return () => {
      if (history.location.pathname === '/reklamas/create'
        || history.location.pathname === '/') {
        window.sessionStorage.removeItem('reklamaPage');
        window.sessionStorage.removeItem('scrollPosition');
      }
    }

  }, [history]);

  useEffect(() => {

    if (error) {
      setShowAlert(true);
      setAlertText(handleGeneralErrors(error, updateCurrentUser));
    }

  }, [error]);

  useEffect(() => {

    if (reklamaPage.reklamas && reklamaPage.reklamas.length === 0) {
      setShowAlert(true);
      setAlertText("No Reklamas Found");
    }

  }, [reklamaPage.reklamas]);

  useEffect(() => {

    if (reklamaPage.filters || reklamaPage.filters === undefined) {
      executeFilter.current = true;
      setReklamaPage(reklamaPage => ({ ...reklamaPage, currentPage: 0, totalPages: -1 }));
    }

  }, [reklamaPage.filters]);

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
    setReklamaPage({ ...reklamaPage, currentPage: reklamaPage.currentPage + 1 });
  }

  const setFilters = (filters: ReklamaPage['filters']) => {
    setReklamaPage({ ...reklamaPage, filters: filters });
  }

  const toggleDrawer = () => setIsOpenDrawer(!isOpenDrawer);

  if (data && !loading) {

    if (loadDemanded.current) {
      loadDemanded.current = false;

      let updatedReklamas: (ReklamaProps & { id: number })[] = [];
      if (reklamaPage.reklamas) {
        updatedReklamas = [...reklamaPage.reklamas];
      }

      updatedReklamas.push(...parseData(data));

      setReklamaPage({
        ...reklamaPage,
        reklamas: updatedReklamas,
        totalPages: data.reklamas.metadata.totalPages
      });

    } else if (executeFilter.current) {
      executeFilter.current = false;

      setReklamaPage({
        ...reklamaPage,
        reklamas: parseData(data),
        totalPages: data.reklamas.metadata.totalPages
      });
    }
  }

  const saveState = () => {

    let copyReklamaPage = { ...reklamaPage };

    // if filter is blank, 
    // we change it to null to avoid executing the query when we rerender
    if (copyReklamaPage.filters === undefined) {
      copyReklamaPage = { ...copyReklamaPage, filters: null }
    }

    window.sessionStorage.setItem('reklamaPage', JSON.stringify(copyReklamaPage));
    window.sessionStorage.setItem('scrollPosition', reklamasGrid.current!.scrollTop.toString());
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
        spacing={3} className={classes.root} ref={reklamasGrid}>
        {reklamaPage.reklamas && reklamaPage.reklamas.length !== 0
          ? reklamaPage.reklamas.map(reklama => (
            <Grid item className={classes.reklamasRoot} xs key={reklama.id}>
              <Link to={`/reklamas/${reklama.id}`} onClick={saveState}>
                <Reklama {...reklama} />
              </Link>
            </Grid>
          ))
          : null
        }
        {(reklamaPage.totalPages - 1) > reklamaPage.currentPage
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
