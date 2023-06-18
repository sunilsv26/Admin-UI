import { useEffect, useState } from "react";

const Header = ({ headers, setAllRowsSelected, allRowsSelected }) => {
  const [selected, setSelected] = useState(allRowsSelected);

  useEffect(() => {
    setSelected(allRowsSelected);
  }, [allRowsSelected]);

  const handleAllrows = (e) => {
    setAllRowsSelected(e.target.checked);
  };
  return (
    <thead>
      <tr>
        <th>
          <input type="checkbox" onChange={handleAllrows} checked={selected} />
        </th>

        {headers.map((h) => {
          return <th key={h.key}>{h.title}</th>;
        })}
        <th>Actions</th>
      </tr>
    </thead>
  );
};

export default Header;
