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

  return reklamaPage;
}

type ReklamaPage = {
  currentPage: number,
  totalPages: number,
  rowsPerPage: number,
  reklamas: (ReklamaProps & { id: number })[] | null,
  filters: { [index: string]: any } | undefined | null
}

type ReklamasProps = {
  setReklamaId: React.Dispatch<React.SetStateAction<number | null>>;
  setShowReklamaDetails: React.Dispatch<React.SetStateAction<boolean>>;
  hidden: boolean;
};

const Reklamas = ({ setReklamaId, setShowReklamaDetails, hidden }: ReklamasProps) => {

  // Services

  const classes = useStyles();
  const { updateCurrentUser } = useAuth()!;
  const [scrollHeight, setScrollHeight] = useState(0);
  const { topicId } = useParams();

  const [reklamaPage, setReklamaPage] = useState<ReklamaPage>(getReklamaPage());
  const loadDemanded = useRef(true);
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

    if (!hidden) {
      window.scrollTo(0, scrollHeight);
    }

  }, [hidden]);

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
        id: Number.parseInt(reklama.id),
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

  const showDetails = (reklamaId: number) => {
    setScrollHeight(window.pageYOffset);
    setShowReklamaDetails(true);
    setReklamaId(reklamaId);
  }

  const filterInputs: Column['filter'][] = [
    { filter: 'title', filterLabel: 'Title', filterType: 'string' }
  ];

  return (
    <Box hidden={hidden}>
      {loading
        ? <Box component="div" className={classes.load}>
          <CircularProgress color="secondary" size="2em" />
        </Box>
        : null}
      {showAlert ? <TopAlert msg={alertText} type="error" /> : null}
      <Grid container justify="center" alignItems="stretch"
        spacing={3} className={classes.root}>
        {reklamaPage.reklamas && reklamaPage.reklamas.length !== 0
          ? reklamaPage.reklamas.map(reklama => (
            <Grid item className={classes.reklamasRoot} xs key={reklama.id}>
              <div onClick={(e) => showDetails(reklama.id)} className={classes.linkDiv}>
                <Reklama {...reklama} />
              </div>
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
    </Box >
  );
}

export default Reklamas;
