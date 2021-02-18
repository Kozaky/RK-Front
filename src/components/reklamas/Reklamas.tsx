import React, { useState, useRef, useEffect } from 'react';
import useStyles from './ReklamasStyles';
import Reklama, { ReklamaProps } from './reklama/Reklama';
import { Grid, Box, CircularProgress } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import { Link, useParams, useHistory } from "react-router-dom";
import { useQuery } from 'react-apollo';
import { REKLAMAS, REKLAMAS_IMAGES } from '../../graphql/Reklama';
import { TOPIC_IMAGE } from '../../graphql/Topic';
import { handleGeneralErrors } from '../../utils/ErrorHandler';
import TopAlert from '../ui/alerts/topAlert/TopAlert';
import { useAuth } from '../../providers/authProvider/AuthProvider';
import FilterDrawer from '../ui/filterDrawer/FilterDrawer';
import { Column } from '../ui/dataTable/DataTable';

const getReklamaPage = () => {
  let reklamaPage = {
    currentPage: 0,
    totalPages: -1,
    rowsPerPage: 12,
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

type ReklamaParamTypes = {
  topicId: string
}

const Reklamas = ({ setReklamaId, setShowReklamaDetails, hidden }: ReklamasProps) => {

  // Services

  const classes = useStyles();
  const { updateCurrentUser } = useAuth()!;
  const [scrollHeight, setScrollHeight] = useState(0);
  const { topicId } = useParams<ReklamaParamTypes>();

  const [reklamaPage, setReklamaPage] = useState<ReklamaPage>(getReklamaPage());
  const loadDemanded = useRef(true);
  const executeFilter = useRef(false);
  const loadImageDemanded = useRef(true);

  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState('');

  const { error: topicQueryError, data: topicQueryData } = useQuery(TOPIC_IMAGE, {
    variables: {
      id: Number.parseInt(topicId!)
    }
  });

  const { error: reklamaImageQueryError, data: reklamaImageQueryData } = useQuery(REKLAMAS_IMAGES, {
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
    skip: !loadImageDemanded.current,
    fetchPolicy: 'no-cache'
  });

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

    if (topicQueryError) {
      setShowAlert(true);
      setAlertText(handleGeneralErrors(topicQueryError, updateCurrentUser));
    }

  }, [topicQueryError]);

  useEffect(() => {

    if (reklamaImageQueryError) {
      setShowAlert(true);
      setAlertText(handleGeneralErrors(reklamaImageQueryError, updateCurrentUser));
    }

  }, [reklamaImageQueryError]);

  useEffect(() => {

    if (reklamaPage.reklamas && reklamaPage.reklamas.length === 0) {
      setShowAlert(true);
      setAlertText("No Reklamas Found");
    } else if (reklamaPage.reklamas && reklamaImageQueryData) {
      loadImages();
    } else if (reklamaPage.reklamas && topicQueryData && !isImageLoaded()) {
      loadTopicImage();
    }

  }, [reklamaPage.reklamas, topicQueryData, reklamaImageQueryData]);

  useEffect(() => {

    if (reklamaPage.filters || reklamaPage.filters === undefined) {
      executeFilter.current = true;
      loadImageDemanded.current = true;
      setReklamaPage(reklamaPage => ({ ...reklamaPage, currentPage: 0, totalPages: -1 }));
    }

  }, [reklamaPage.filters]);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const element = e.target as HTMLDocument;
      const bottomReached = element.scrollingElement!.scrollHeight - element.scrollingElement!.scrollTop === element.scrollingElement!.clientHeight;
      if (bottomReached) {
        loadNextPage();
      }
    }

    window.addEventListener('scroll', handleScroll);

    return function cleanup() {
      window.removeEventListener('scroll', handleScroll);
    };
  });

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
        image: null,
        imageTitle: null,
        shortDescription: reklama.content.substring(0, 50),
        numLikes: 100
      }
    ));
  }

  const loadNextPage = () => {
    if (reklamaPage.currentPage !== reklamaPage.totalPages - 1) {
      loadDemanded.current = true;
      loadImageDemanded.current = true;
      setReklamaPage({ ...reklamaPage, currentPage: reklamaPage.currentPage + 1 });
    }
  }

  const setFilters = (filters: ReklamaPage['filters']) => {
    setReklamaPage({ ...reklamaPage, filters: filters });
  }

  const toggleDrawer = () => setIsOpenDrawer(!isOpenDrawer);

  const loadTopicImage = () => {

    let updatedReklamas = reklamaPage.reklamas!.map((reklama: ReklamaProps & { id: number }) => (
      {
        ...reklama,
        image: topicQueryData.topic.image,
        imageTitle: topicQueryData.topic.imageName,
      }
    ));

    setReklamaPage({
      ...reklamaPage,
      reklamas: updatedReklamas
    });
  };

  const loadImages = () => {
    loadImageDemanded.current = false;

    let updatedReklamas = reklamaPage.reklamas!.map((reklama: ReklamaProps & { id: number }) => {
      let reklamaImage = reklamaImageQueryData.reklamas.reklamas.find((reklamas: any) => reklamas.id == reklama.id);

      let updatedReklama = { ...reklama };
      if (reklamaImage && reklamaImage.images.length !== 0) {
        updatedReklama.image = reklamaImage.images[0].image;
        updatedReklama.imageTitle = reklamaImage.images[0].imageName;
      }

      return updatedReklama;
    });

    setReklamaPage({
      ...reklamaPage,
      reklamas: updatedReklamas
    });
  };

  const isImageLoaded = () =>
    [...reklamaPage.reklamas!].every((reklama: ReklamaProps & { id: number }) => reklama.image !== null);

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
          )
          })
          : null
        }
        {loading
          ? <Box component="div" className={classes.load}>
            <CircularProgress color="secondary" size="2em" />
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
