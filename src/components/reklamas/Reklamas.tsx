import React, { useState, useRef, useEffect } from 'react';
import useStyles from './ReklamasStyles';
import Reklama, { ReklamaProps } from './reklama/Reklama';
import { Grid, Box, CircularProgress } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import { Link, useParams } from "react-router-dom";
import { useQuery, useLazyQuery } from 'react-apollo';
import { REKLAMAS, REKLAMAS_IMAGES, LOCATIONS } from '../../graphql/Reklama';
import { TOPIC_IMAGE } from '../../graphql/Topic';
import { handleGeneralErrors } from '../../utils/ErrorHandler';
import TopAlert from '../ui/alerts/topAlert/TopAlert';
import { useAuth } from '../../providers/authProvider/AuthProvider';
import FilterDrawer from '../ui/filterDrawer/FilterDrawer';
import { Column } from '../ui/dataTable/DataTable';


const isMaxPage = (reklamaPage: ReklamaPage) => {
  return reklamaPage.totalPages !== null && reklamaPage.totalPages <= reklamaPage.currentPage
}

type ReklamaPage = {
  currentPage: number,
  totalPages: number | null,
  rowsPerPage: number,
  reklamas: (ReklamaProps)[] | null,
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
  const { currentUser } = useAuth()!;

  const [reklamaPage, setReklamaPage] = useState<ReklamaPage>({
    currentPage: 0,
    totalPages: null,
    rowsPerPage: 12,
    reklamas: null,
    filters: null
  });
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
        topicId: Number.parseInt(topicId),
        ...reklamaPage.filters
      },
      order: {
        order_desc: "inserted_at"
      }
    },
    skip: (!loadDemanded.current && !executeFilter.current) || isMaxPage(reklamaPage),
    fetchPolicy: 'no-cache'
  });

  const [getTopicImage, { called: getTopicImageCalled, data: topicImageData, error: getTopicImageError }] = useLazyQuery(
    TOPIC_IMAGE,
    {
      variables: {
        id: Number.parseInt(topicId)
      }
    }
  );

  const [getReklamaImages, { data: reklamaImagesData, error: getReklamaImagesError }] = useLazyQuery(
    REKLAMAS_IMAGES,
    {
      variables: {
        page: reklamaPage.currentPage + 1,
        perPage: reklamaPage.rowsPerPage,
        filter: {
          topicId: Number.parseInt(topicId),
          ...reklamaPage.filters
        },
        order: {
          order_desc: "inserted_at"
        }
      },
      fetchPolicy: 'no-cache'
    }
  );

  const { loading: loadingLocations, error: getReklamaLocationsError, data: locationsData } = useQuery(LOCATIONS);

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

    if (getTopicImageError) {
      setShowAlert(true);
      setAlertText(handleGeneralErrors(getTopicImageError, updateCurrentUser));
    }

  }, [getTopicImageError]);

  useEffect(() => {

    if (getReklamaImagesError) {
      setShowAlert(true);
      setAlertText(handleGeneralErrors(getReklamaImagesError, updateCurrentUser));
    }

  }, [getReklamaImagesError]);

  useEffect(() => {

    if (getReklamaLocationsError) {
      setShowAlert(true);
      setAlertText(handleGeneralErrors(getReklamaLocationsError, updateCurrentUser));
    }

  }, [getReklamaLocationsError]);

  useEffect(() => {

    if (reklamaPage.reklamas && reklamaPage.reklamas.length === 0) {
      setShowAlert(true);
      setAlertText("No Reklamas Found");
    } else if (reklamaPage.reklamas && topicImageData && !isImageLoaded()) {
      loadTopicImage();
    }

  }, [reklamaPage.reklamas, topicImageData]);

  useEffect(() => {

    if (reklamaPage.reklamas && reklamaImagesData) {
      loadImages();
    }

  }, [reklamaImagesData]);

  useEffect(() => {

    if (reklamaPage.filters || reklamaPage.filters === undefined) {
      executeFilter.current = true;
      setReklamaPage(page => ({ ...page, currentPage: 0, totalPages: null }));
    }

  }, [reklamaPage.filters]);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      if (!hidden) {
        const element = e.target as HTMLDocument;
        const bottomReached = element.scrollingElement!.scrollHeight - element.scrollingElement!.scrollTop === element.scrollingElement!.clientHeight;
        if (bottomReached) {
          loadNextPage();
        }
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
        userEmail: reklama.user.email,
        locationName: reklama.location.name
      }
    ));
  }

  const loadNextPage = () => {
    if (!loading && (!reklamaPage.totalPages || (reklamaPage.currentPage !== reklamaPage.totalPages - 1))) {
      loadDemanded.current = true;
      setReklamaPage({ ...reklamaPage, currentPage: reklamaPage.currentPage + 1 });
    }
  }

  const setFilters = (filters: ReklamaPage['filters']) => {
    setReklamaPage({ ...reklamaPage, filters: filters });
  }

  const toggleDrawer = () => setIsOpenDrawer(!isOpenDrawer);

  const loadTopicImage = () => {

    let updatedReklamas = reklamaPage.reklamas!
      .map((reklama: ReklamaProps) => {
        if (!reklama.image) {
          return {
            ...reklama,
            image: topicImageData.topic.image,
            imageTitle: topicImageData.topic.imageName,
          }
        } else {
          return reklama
        }
      });

    setReklamaPage({
      ...reklamaPage,
      reklamas: updatedReklamas
    });
  };

  const loadImages = () => {
    let updatedReklamas = reklamaPage.reklamas!.map((reklama: ReklamaProps) => {
      let reklamaImage = reklamaImagesData.reklamas.reklamas.find((reklamas: any) => reklamas.id == reklama.id);

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
    [...reklamaPage.reklamas!].every((reklama: ReklamaProps) => reklama.image !== null);


  const getDeletePermission = (reklama: ReklamaProps) => currentUser?.email === reklama.userEmail;
  const getEditPermission = (reklama: ReklamaProps) => currentUser?.email === reklama.userEmail;

  if (data && !loading) {

    if (loadDemanded.current) {
      loadDemanded.current = false;
      getReklamaImages();

      let updatedReklamas: (ReklamaProps)[] = [];
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
      getReklamaImages();

      setReklamaPage({
        ...reklamaPage,
        reklamas: parseData(data),
        totalPages: data.reklamas.metadata.totalPages
      });
    }

    if (!getTopicImageCalled) {
      getTopicImage();
    }
  }

  const showDetails = (reklamaId: number) => {
    setScrollHeight(window.pageYOffset);
    setShowReklamaDetails(true);
    setReklamaId(reklamaId);
  }

  const deleteReklama = (reklamaId: number) => {
    let updatedReklamas = [...reklamaPage.reklamas!];
    updatedReklamas = updatedReklamas.filter((reklama: ReklamaProps) => reklama.id !== reklamaId);

    setReklamaPage({
      ...reklamaPage,
      reklamas: updatedReklamas
    });
  }

  const buildFilterInputs = () => {
    let filters: Column['filter'][] = [
      { filter: 'title', filterLabel: 'Title', filterType: 'string' },
      { filter: 'insertedAfter', filterLabel: "From", filterType: 'date' },
      { filter: 'insertedBefore', filterLabel: "To", filterType: 'date' }
    ];

    if (!loadingLocations && locationsData) {
      const parsedLocations = locationsData.locations.map((location: any) => (
        {
          value: location.id,
          label: location.name
        }
      ));

      filters.push({ filter: 'locationId', filterLabel: 'Location', filterType: 'select', selectValues: parsedLocations });
      filters.push({ filter: 'currentUser', filterLabel: 'My Reklamas', filterType: 'boolean' });
    }

    return filters;
  }

  const filterInputs: Column['filter'][] = buildFilterInputs();

  return (
    <Box hidden={hidden}>
      {showAlert ? <TopAlert msg={alertText} type="error" /> : null}
      <Grid container justify="center" alignItems="stretch"
        spacing={3} className={classes.root}>
        {reklamaPage.reklamas && reklamaPage.reklamas.length !== 0
          ? reklamaPage.reklamas.map(reklama => (
            <Grid item className={classes.reklamasRoot} xs key={reklama.id}>
              <Reklama {...reklama}
                edit={getEditPermission(reklama)}
                delete={getDeletePermission(reklama)}
                deleteReklama={deleteReklama}
                showDetails={showDetails}
                setShowAlert={setShowAlert}
                setAlertText={setAlertText}
              />
            </Grid>
          ))
          : null
        }
        {(loading || loadingLocations)
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
