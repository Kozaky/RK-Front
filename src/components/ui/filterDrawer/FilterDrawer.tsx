import React, { useState } from 'react';
import { DrawerProps, Drawer, Typography, Grid, Button, TextField } from "@material-ui/core";
import { Column } from "../dataTable/DataTable";
import useStyles from './FilterDrawerStyles';


type FilterDrawerProps = {
  setFilters: React.Dispatch<React.SetStateAction<{ [index: string]: any } | undefined>>,
  filters: Array<Column['filter']>
} & DrawerProps

const FilterDrawer = ({ setFilters, filters, ...rest }: FilterDrawerProps) => {

  // Services

  const classes = useStyles();
  const [filterState, setFilterState] = useState<{ [index: string]: any }>({});

  // Functions

  const handleInputChange = (e: React.ChangeEvent<any>, filter: string) => {
    const state = { ...filterState };
    state[filter] = e.currentTarget.value;
    setFilterState(state);
  }

  const handleSearch = () => {
    setFilters(filterState);
    const { onClose } = rest;
    onClose!({}, "backdropClick");
  }

  const handleClean = () => {
    setFilterState({});
    setFilters(undefined);
    const { onClose } = rest;
    onClose!({}, "backdropClick");
  }

  const handleEnterKey = (e: React.KeyboardEvent) => {
    e.preventDefault();
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  const filterInputs = (
    <>
      {filters.map((filter: Column['filter']) => {

        let filterElement = null;

        switch (filter?.filterType) {
          case 'string':
            filterElement = (
              <Grid item xs key={filter?.filter}>
                <TextField
                  label={filter?.filterLabel}
                  id={"filter-" + filter?.filterLabel}
                  variant="outlined"
                  className={classes.input}
                  value={filterState[filter?.filter] || ''}
                  onChange={(event) => handleInputChange(event, filter?.filter)}
                  onKeyUp={handleEnterKey}
                />
              </Grid>
            );
            break;
          default:
            break;
        }

        return filterElement;
      })}
    </>
  );

  return (
    <Drawer {...rest}>
      <Typography variant="h4" color="secondary" component="h4" className={classes.drawerTitle}>
        FILTERS
      </Typography>
      <Grid container alignItems="center" justify="center"
        spacing={3} className={classes.gridRoot}>
        {filterInputs}
      </Grid>
      <Grid container alignItems="center" justify="center"
        spacing={3} className={classes.gridRoot} direction='column'>
        <Grid item xs>
          <Button variant="contained" color="secondary"
            className={classes.filterButton}
            onClick={(e) => handleClean()}
          >
            Clean
          </Button>
          <Button variant="contained" color="secondary"
            className={classes.filterButton}
            onClick={(e) => handleSearch()}
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </Drawer >
  );
}

export default FilterDrawer;