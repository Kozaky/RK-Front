import React, { useState } from 'react';
import { DrawerProps, Drawer, Typography, Grid, Button, TextField, FormControl } from "@material-ui/core";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { Column } from "../dataTable/DataTable";
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import useStyles from './FilterDrawerStyles';


type FilterDrawerProps = {
  setFilters: (filters: { [index: string]: any } | undefined) => void,
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

  const handleCheckChange = (e: React.ChangeEvent<any>, filter: string) => {
    const state = { ...filterState };
    state[filter] = e.currentTarget.checked;
    setFilterState(state);
  }

  const handleDateChange = (e: MaterialUiPickersDate, filter: string) => {
    const state = { ...filterState };
    state[filter] = e;
    setFilterState(state);
  }

  const handleSelectChange = (e: React.ChangeEvent<any>, filter: string) => {
    const state = { ...filterState };
    state[filter] = Number.parseInt(e.currentTarget.value);
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
              <Grid item xs={12} key={filter?.filter}>
                <TextField
                  label={filter?.filterLabel}
                  id={"filter-" + filter?.filterLabel}
                  className={classes.input}
                  value={filterState[filter?.filter] || ''}
                  onChange={(event) => handleInputChange(event, filter?.filter)}
                  onKeyUp={handleEnterKey}
                />
              </Grid>
            );
            break;
          case 'boolean':
            filterElement = (
              <Grid item xs={12} direction="row" key={filter?.filter} className={classes.textAlignLeft}>
                <FormControlLabel
                  control={
                    <Checkbox id={"filter-" + filter?.filterLabel}
                      checked={filterState[filter?.filter] || false}
                      color="secondary"
                      onChange={(event) => handleCheckChange(event, filter?.filter)}
                    />
                  }
                  label={filter?.filterLabel}
                  labelPlacement="end"
                  value="end"
                />
              </Grid>
            );
            break;
          case 'date':
            filterElement = (
              <Grid item xs={6} key={filter?.filter}>
                <MuiPickersUtilsProvider utils={DateFnsUtils} >
                  <KeyboardDatePicker
                    margin="normal"
                    id={"filter-" + filter?.filterLabel}
                    label={filter?.filterLabel}
                    format="MM/dd/yyyy"
                    value={filterState[filter?.filter] || null}
                    onChange={(date) => handleDateChange(date, filter?.filter)}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
            );
            break;
          case 'select':
            filterElement = (
              <>
                <Grid item xs={12} direction="row" key={filter?.filter} className={classes.textAlignLeft}>
                  <FormControl>
                    <InputLabel htmlFor={"filter-" + filter?.filterLabel}>{filter?.filterLabel}</InputLabel>
                    <Select
                      native
                      value={filterState[filter?.filter] || null}
                      onChange={(event) => handleSelectChange(event, filter?.filter)}
                      inputProps={{
                        name: filter?.filterLabel,
                        id: "filter-" + filter?.filterLabel,
                      }}
                    >
                      <option aria-label="None" />
                      {
                        filter?.selectValues?.map(selectValue =>
                          <option key={selectValue.value} value={selectValue.value}>{selectValue.label}</option>
                        )
                      }
                    </Select>
                  </FormControl>
                </Grid>
              </>
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
      <Grid container alignItems="flex-start"
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