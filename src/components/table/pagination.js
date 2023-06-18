import classes from "./table.module.css";

const Pagination = ({
  deletBtnStatus,
  currentPage,
  handlePageChange,
  totalPages,
  deleteSelected
}) => {
  const makeNumArr = (num) => new Array(num).fill("").map((_, i) => i + 1);
  return (
    <div className={classes.table_footer}>
      <button
        disabled={deletBtnStatus}
        className={classes.deleteBtn}
        onClick={deleteSelected}
      >
        Delete Selected
      </button>
      <div className={classes.paginator}>
        <button
          disabled={currentPage === 1}
          className={classes.paginatorBtn}
          onClick={() => handlePageChange({ type: "first" })}
        >
          {" "}
          {"<<"}
        </button>
        <button
          disabled={currentPage === 1}
          className={classes.paginatorBtn}
          onClick={() => handlePageChange({ type: "prev" })}
        >
          {" "}
          {"<"}
        </button>
        {makeNumArr(totalPages).map((page) => {
          return (
            <button
              key={page}
              className={`${classes.paginatorBtn} ${page === currentPage ? classes.activePage : ""}`}
              onClick={() => handlePageChange({ type: "page", page: page })}
            >
              {page}
            </button>
          );
        })}
        <button
          className={classes.paginatorBtn}
          onClick={() => handlePageChange({ type: "next" })}
          disabled={currentPage === totalPages}
        >
          {" "}
          {">"}
        </button>
        <button
          className={classes.paginatorBtn}
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange({ type: "last" })}
        >
          {" "}
          {">>"}
        </button>
      </div>
    </div>
  );
};

export default Pagination;
