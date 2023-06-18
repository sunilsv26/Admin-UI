import { useEffect, useState } from "react";

import Table from "../components/table/table";

import { getDataAPICall } from "../utils/api/api-utils";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setError] = useState("");

  const initializeHeaders = (data) => {
    let newHeaders = [];
    Object.keys(data[0]).forEach((key) => {
      if (key !== "id") {
        let header = key.charAt(0).toUpperCase() + key.slice(1);
        newHeaders.push({ title: header, key: key });
      }
    });
    setHeaders(newHeaders);
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        const result = await getDataAPICall(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        );
        setUsers(result);
        initializeHeaders(result);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Failed to get data !");
      }
    };
    getUsers();
  }, []);

  return (
    <>
      {loading ? (
        <h4>Fetching data...</h4>
      ) : hasError ? (
        <h4>{hasError}</h4>
      ) : (
        <Table headers={headers} data={users} />
      )}
    </>
  );
};

export default Home;
