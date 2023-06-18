import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import Header from "./header";
import Row from "./row";
import Pagination from "./pagination";

import classes from "./table.module.css";

const Table = ({ headers, data, edit, pagination, perPage }) => {
  const [allData, setAllData] = useState(data);
  const [currentData, setCurrentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [allRowsSelected, setAllRowsSelected] = useState(false);
  const [rowSelectionStatus, setRowSelectionStatus] = useState({});
  const [searchResult, setSearchResult] = useState([]);

  const iniializeTable = ({ data, startIndex, lastIndex, perPage, page }) => {
    const init = data.slice(startIndex, lastIndex);
    setCurrentData(init);
    initRowStatus(init);
    setAllRowsSelected(false);
    setTotalPages(Math.ceil(data.length / perPage));
    setCurrentPage(page);
  };

  const initRowStatus = (init) => {
    const rowSelection = {};
    init.forEach((row) => {
      rowSelection[row.id] = false;
    });
    setRowSelectionStatus(rowSelection);
  };

  useEffect(() => {
    setAllData(data);
    iniializeTable({
      data,
      startIndex: 0,
      lastIndex: perPage,
      perPage,
      page: 1
    });
  }, [data, perPage]);

  const handleRowCheck = (row) => {
    setRowSelectionStatus((prev) => {
      const newState = { ...prev };
      newState[+row.rowID] = row.value;
      return newState;
    });
  };

  const handleAllRowCheck = (val) => {
    setAllRowsSelected(val);
    setRowSelectionStatus((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (val) {
          newState[key] = true;
        } else {
          newState[key] = false;
        }
      });
      return newState;
    });
  };

  const getDisableStatus = useCallback(() => {
    let disabled = true;
    Object.keys(rowSelectionStatus).forEach((key) => {
      if (rowSelectionStatus[key]) {
        disabled = false;
      }
    });
    return disabled;
  }, [rowSelectionStatus]);

  const updateCurrentData = (page) => {
    const startIndex = perPage * page - perPage;
    const lastIndex = perPage * page;
    if (searchResult.length) {
      iniializeTable({
        data: searchResult,
        startIndex,
        lastIndex,
        perPage,
        page
      });
    } else {
      iniializeTable({ data: allData, startIndex, lastIndex, perPage, page });
    }
  };

  const handlePageChange = ({ type, page }) => {
    switch (type) {
      case "next":
        setCurrentPage((prev) => {
          updateCurrentData(prev + 1);
          return prev + 1;
        });
        break;
      case "prev":
        setCurrentPage((prev) => {
          updateCurrentData(prev - 1);
          return prev - 1;
        });
        break;
      case "first":
        setCurrentPage((prev) => {
          updateCurrentData(1);
          return 1;
        });
        break;
      case "last":
        setCurrentPage((prev) => {
          updateCurrentData(totalPages);
          return totalPages;
        });
        break;
      case "page":
        setCurrentPage((prev) => {
          updateCurrentData(page);
          return page;
        });
        break;
      default:
        break;
    }
  };

  const handleSearch = (e) => {
    const val = e.target.value.trim();
    if (val) {
      const serachResults = allData.filter((row) => {
        return Object.values(row).some((value) => {
          const lowercase = value.toLowerCase();
          if (lowercase.includes(val.toLowerCase())) {
            return row;
          }
        });
      });
      setSearchResult(serachResults);
      iniializeTable({
        data: serachResults,
        startIndex: 0,
        lastIndex: perPage,
        perPage,
        page: 1
      });
    } else {
      iniializeTable({
        data: allData,
        startIndex: 0,
        lastIndex: perPage,
        perPage,
        page: 1
      });
      setSearchResult([]);
    }
  };

  const handelDeleteRow = (id) => {
    const startIndex = perPage * currentPage - perPage;
    const lastIndex = perPage * currentPage;
    setAllData((data) => {
      let newData = data.filter((d) => d.id !== id);
      iniializeTable({
        data: newData,
        startIndex,
        lastIndex,
        page: currentPage,
        perPage
      });
      return newData;
    });
    if (searchResult.length) {
      setSearchResult((results) => {
        let newResults = results.filter((d) => d.id !== id);
        iniializeTable({
          data: newResults,
          startIndex,
          lastIndex,
          page: currentPage,
          perPage
        });
        return newResults;
      });
    }
  };

  const handleDeleteSelected = () => {
    const startIndex = perPage * currentPage - perPage;
    const lastIndex = perPage * currentPage;
    const seletedRows = Object.keys(rowSelectionStatus).filter((key) => {
      return rowSelectionStatus[key] ? key : null;
    });
    setAllData((data) => {
      let newData = data;

      seletedRows.forEach((id) => {
        newData = newData.filter((r) => r.id !== id);
      });
      iniializeTable({
        data: newData,
        startIndex,
        lastIndex,
        page: currentPage,
        perPage
      });
      return newData;
    });
    if (searchResult.length) {
      setSearchResult((results) => {
        let newResults = results;
        seletedRows.forEach((id) => {
          newResults = newResults.filter((r) => r.id !== id);
        });
        iniializeTable({
          data: newResults,
          startIndex,
          lastIndex,
          page: currentPage,
          perPage
        });
        return newResults;
      });
    }
  };

  const handleupdateRow = (row) => {
    const startIndex = perPage * currentPage - perPage;
    const lastIndex = perPage * currentPage;
    setAllData((prev) => {
      let newData = prev.map((r) => {
        if (r.id === row.id) {
          return { ...row };
        }
        return r;
      });
      iniializeTable({
        data: newData,
        startIndex,
        lastIndex,
        page: currentPage,
        perPage
      });
      return newData;
    });
    if (searchResult.length) {
      setSearchResult((prev) => {
        let newResults = prev.map((r) => {
          if (r.id === row.id) {
            return { ...row };
          }
          return r;
        });
        iniializeTable({
          data: newResults,
          startIndex,
          lastIndex,
          page: currentPage,
          perPage
        });
        return newResults;
      });
    }
  };

  return (
    <>
      <input
        type="text"
        onChange={handleSearch}
        className={classes.search}
        placeholder="Type here to filter"
      />
      {currentData.length ? (
        <>
          <div className={classes.tableContainer}>
            <table>
              <Header
                headers={headers}
                edit={edit}
                setAllRowsSelected={handleAllRowCheck}
                allRowsSelected={allRowsSelected}
              />
              <tbody>
                {currentData.map((d) => {
                  return (
                    <Row
                      key={d.id}
                      data={d}
                      edit={edit}
                      checked={allRowsSelected}
                      onRowCheck={handleRowCheck}
                      onDelete={handelDeleteRow}
                      updateRow={handleupdateRow}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            deletBtnStatus={getDisableStatus()}
            handlePageChange={handlePageChange}
            deleteSelected={handleDeleteSelected}
          />
        </>
      ) : (
        <h4>No Record</h4>
      )}
    </>
  );
};

Table.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({ title: PropTypes.string, key: PropTypes.string })
  ),
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      email: PropTypes.string,
      role: PropTypes.string
    })
  ),
  perPage: PropTypes.number
};

Table.defaultProps = {
  headers: [
    { title: "Name", key: "name" },
    { title: "Email", key: "email" },
    { title: "Role", key: "role" }
  ],
  data: [
    {
      id: "1",
      name: "Aaron Miles",
      email: "aaron@geektrust.in",
      role: "Member"
    }
  ],
  perPage: 10
};

export default Table;
