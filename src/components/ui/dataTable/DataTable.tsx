import React, { useState, SetStateAction, Dispatch, useRef, useEffect } from 'react';
import useStyles from './DataTableStyles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell, { TableCellProps } from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { DocumentNode } from 'graphql';
import { handleGeneralErrors } from '../../../utils/ErrorHandler';
import { useQuery } from '@apollo/react-hooks';
import SearchIcon from '@material-ui/icons/Search';
import { useAuth } from '../../../providers/authProvider/AuthProvider';
import FilterDrawer from '../filterDrawer/FilterDrawer';
import { Fab, TableSortLabel, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import BorderColorIcon from '@material-ui/icons/BorderColor';

export type Column = {
  id: string,
  label: string,
  minWidth: number,
  filter?: {
    filter: string,
    filterLabel: string,
    filterType: "string" | "number" | "datetime" | "boolean"
  },
  image?: boolean,
  order?: string,
  format?: any,
  align?: "inherit" | "left" | "center" | "right" | "justify" | undefined
} & TableCellProps;

type Page = {
  metadata: {
    page: number,
    totalPages: number,
    totalResults: number
  },
  data: Array<any>
}

type DataTableProps = {
  columns: Array<Column>,
  query: DocumentNode,
  parseData: (data: any) => Page,
  setShowError: (value: boolean) => void,
  setErrorText: Dispatch<SetStateAction<string>>,
  update?: (id: string) => void,
  delete?: (id: string) => void,
}

const DataTable = (props: DataTableProps) => {

  // Services

  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [orderArrowsState, setOrderArrowState] = useState<{ [index: string]: any } | undefined>(undefined);
  const [filters, setFilters] = useState<{ [index: string]: any } | undefined>(undefined);
  const [order, setOrder] = useState<{ [index: string]: any } | undefined>(undefined);
  const { updateCurrentUser } = useAuth()!;

  let pageData = useRef<Page | null>(null);

  const { loading, error, data } = useQuery(props.query, {
    variables: {
      page: page + 1,
      perPage: rowsPerPage,
      filter: filters,
      order: order
    },
    pollInterval: 15000
  });

  useEffect(() => {

    if (error) {
      props.setShowError(true);
      props.setErrorText(handleGeneralErrors(error, updateCurrentUser));
    }

  }, [error]);

  // Functions

  const columns = () => {
    return (
      <>
        {props.columns.map((column: Column) => (
          <TableCell
            key={column.id}
            align={column.align!}
            style={{ minWidth: column.minWidth }}
          >
            {column.order
              ? tableCellOrder(column.id, column.order, column.label)
              : column.label
            }
          </TableCell>
        ))}
        {actionsColumn()}
      </>
    )
  }

  const tableCellOrder = (columnId: string, columnOrder: string, columnLabel: string) => {
    return (<TableSortLabel
      active={getActive(columnId)}
      direction={getDirection(columnId)}
      onClick={(e) => handleOrder(e, columnId, columnOrder)}
    >
      {columnLabel}
    </TableSortLabel>
    )
  };

  const actionsColumn = () => {
    let actionsColumn = null;

    if (props.update !== undefined || props.delete !== undefined) {
      actionsColumn = (
        <TableCell
          key="actions"
          align="center"
          style={{ minWidth: 80 }}
        >
          Actions
        </TableCell>
      );
    }

    return actionsColumn;
  }

  const getActive = (column: string) => {

    let active = false;

    if (orderArrowsState !== undefined && orderArrowsState[column] !== undefined) {
      active = orderArrowsState[column].active;
    }

    return active;
  }

  const getDirection = (column: string) => {

    let direction: 'asc' | 'desc' = 'desc';

    if (orderArrowsState !== undefined && orderArrowsState[column] !== undefined
      && (orderArrowsState[column].direction === 'asc'
        || orderArrowsState[column].direction === 'desc')) {
      direction = orderArrowsState[column].direction;
    }

    return direction;
  }

  const handleOrder = (e: React.MouseEvent<any>, column: string, column_order: string) => {
    let { active, direction } = (orderArrowsState !== undefined && orderArrowsState[column])
      ? {
        active: orderArrowsState![column].active,
        direction: toggleDirection(orderArrowsState![column].direction)
      }
      : {
        active: true,
        direction: 'asc'
      }

    let stateCopy = { ...orderArrowsState };
    for (const property in stateCopy) {
      stateCopy[property].active = false;
    }

    stateCopy[column] = { active: active, direction: direction };
    setOrderArrowState(stateCopy);

    let order: { [index: string]: any } = {};
    order['order' + direction.charAt(0).toUpperCase() + direction.substring(1)] = column_order;

    setOrder(order);
  }

  const toggleDirection = (direction: 'asc' | 'desc') => {
    if (direction === 'asc') {
      return 'desc';
    } else {
      return 'asc'
    }
  }

  const tableBody = () => {

    if (loading || error) {
      return null
    }

    pageData.current = props.parseData(data);

    return (
      <>
        {
          pageData.current?.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
            return (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                {props.columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {formatValue(column, value)}
                    </TableCell>
                  );
                })}
                {actionButtons(row['id'])}
              </TableRow>
            );
          })
        }
      </>
    );
  }

  const formatValue = (column: Column, data: any) => {

    let value = data;
    if (column.format && typeof data === 'number') {
      value = column.format(data);
    }

    if (column.image) {
      value = (
        <img src={'data:image/png;base64, ' + data} alt="Topic" height="100" width="100" />
      );
    }

    return value;
  }

  const actionButtons = (id: string) => {
    let actionButtons = null;

    if (props.update !== undefined || props.delete !== undefined) {
      actionButtons = (
        <TableCell key="actions" align="center">
          {props.update !== undefined
            ?
            <IconButton color="secondary" aria-label="update user"
              onClick={() => props.update!(id)}
            >
              <BorderColorIcon />
            </IconButton>
            : null}
          {props.delete !== undefined
            ?
            <IconButton color="secondary" aria-label="delete user"
              onClick={() => props.delete!(id)}
            >
              <DeleteIcon />
            </IconButton>
            : null
          }
        </TableCell>)
    }

    return actionButtons;
  }

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const toggleDrawer = () => setIsOpenDrawer(!isOpenDrawer);

  return (
    <>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns()}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableBody()}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={pageData.current ? pageData.current.metadata.totalPages : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <FilterDrawer anchor="left"
        open={isOpenDrawer}
        onClose={toggleDrawer}
        className={classes.drawer}
        filters={props.columns.map((column: Column) => column.filter)}
        setFilters={setFilters}
      />
      <Fab aria-label="search" color="secondary" className={classes.searchButton} onClick={toggleDrawer}>
        <SearchIcon />
      </Fab>
    </>
  );
}

export default DataTable;