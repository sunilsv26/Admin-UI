import { useCallback, useEffect, useState } from "react";

import classes from "./table.module.css";

const Row = ({ data, onDelete, checked, onRowCheck, updateRow }) => {
  const [selected, setSelected] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    setRowData(data);
  }, [data]);

  useEffect(() => {
    setSelected(checked);
  }, [checked]);

  const handleRowSelect = (e) => {
    setSelected(e.target.checked);
    onRowCheck({ rowID: e.target.name, value: e.target.checked });
  };

  const handleDelete = useCallback(() => {
    onDelete(data.id);
  }, [data, onDelete]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handelClose = () => {
    setEditing(false);
    updateRow(rowData);
  };

  const handleChange = (e) => {
    setRowData((data) => {
      let newData = { ...data };
      newData[e.target.name] = e.target.value;
      return newData;
    });
  };

  return (
    <tr key={data.id} className={selected ? classes.selected : ""}>
      <td>
        <input
          name={data.id}
          type="checkbox"
          checked={selected}
          onChange={handleRowSelect}
        />
      </td>

      {Object.keys(data).map((col) => {
        if (col !== "id") {
          return (
            <td key={data[col]}>
              {isEditing ? (
                <input
                  name={col}
                  value={rowData[col]}
                  onChange={handleChange}
                />
              ) : (
                <div>{data[col]}</div>
              )}
            </td>
          );
        }
        return null;
      })}
      <td>
        <div className={classes.actionCell}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfzIqv3IWwHFtnByVsEh6mJEjqyHDklDg1f12WzOsIKg&s"
            alt="Delete"
            onClick={handleDelete}
          />
          {isEditing ? (
            <button onClick={handelClose}>Save</button>
          ) : (
            <img
              src="https://cdn-icons-png.flaticon.com/512/3597/3597075.png"
              alt="Edit"
              onClick={handleEdit}
            />
          )}
        </div>
      </td>
    </tr>
  );
};

export default Row;
