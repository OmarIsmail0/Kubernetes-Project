import { useEffect, useState } from "react";
import "./App.css";
import { Table } from "antd";
import axios from "axios";

function App() {
  const [products, setProducts] = useState();

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Sku",
      dataIndex: "sku",
      key: "sku",
    },
  ];

  useEffect(() => {
    axios
      .get("http://node-app:5000/products")
      .then((e) => setProducts(e.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="App">
      <h1>Products</h1>
      {products && <Table dataSource={products} columns={columns} />}
    </div>
  );
}

export default App;
