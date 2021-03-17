import React, { createContext, useContext } from 'react';
import uuid from 'react-uuid';

const tableBuildingContext = createContext();

function TableBuilding({ children, data, headers }) {

  const DATA_PROPERTY_INDEX = 0;
  const DATA_TITLE_INDEX = 1;

  const [filteredData, setFilteredData] = React.useState([]);

  const [dataToRender, setDataToRender] = React.useState([]);

  const [currenPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(50);

  const indexOfLastItem = currenPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const [tableBodyMarkup, setTableBodyMarkup] = React.useState(null);
  const [value, setValue] = React.useState('');

  const getKeysForFiltering = () => headers.map(elem => elem[DATA_PROPERTY_INDEX]);

  const filterDataByKeys = (data, filtersKeys) => data.map((obj) => {
    const result = {};
    Object.keys(obj).forEach((key) => {
      filtersKeys.forEach((filterKey) => {
        if (key === filterKey) {
          result[key] = obj[key];
        }
      })
    })
    return result;
  })

  const searchFilter = (searchQuery, data) => {
    const filterKeyword = (item) => {
      return JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())
    }
    return data.filter(item => filterKeyword(item));
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();
  };

  const handleChange = (evt) => {
    const target = evt.target;
    const value = target.value;

    setValue(value);
    setDataToRender(searchFilter(value, filteredData));
    setTableBodyMarkup(getTableBodyMarkup(dataToRender))
  };

  const paginate = (number) => {
    setCurrentPage(number);
  };

  const getTableBodyMarkup = React.useCallback((data) => {
    return data.slice(indexOfFirstItem, indexOfLastItem).map((elem) => {
      const tdMarkup = headers.map((item) => (
        <td
          key={uuid()}
        >
          {elem[item[DATA_PROPERTY_INDEX]]}
        </td>
      ))

      return (
        <tr
          key={uuid()}
        >
          {tdMarkup}
        </tr>
      )
    })
  }, [headers, indexOfLastItem, indexOfFirstItem])

  const tableHeaderMarkup = headers.map((header) => (
    <th
      key={uuid()}
    >
      {header[DATA_TITLE_INDEX]}
    </th>
  ));

  React.useEffect(() => {
    if (data) {
      const filterKeys = getKeysForFiltering();
      setFilteredData(filterDataByKeys(data, filterKeys));
    }
  }, [data])

  React.useEffect(() => {
    if (filteredData.length > 0) {
      console.log(filteredData)
      const foundData = searchFilter(value, filteredData);
      setTableBodyMarkup(getTableBodyMarkup(foundData));
    }

  }, [value, filteredData, getTableBodyMarkup])

  return (
    <div>
      <form
        onSubmit={handleSubmit}
      >
        <label>
          Search:
          <input
            name="search"
            onChange={handleChange}
            value={value || ''}
          />
        </label>
      </form>
      <tableBuildingContext.Provider value={{ data, itemsPerPage, paginate }}>
        {children}
      </tableBuildingContext.Provider>
      <table>
        <thead>
          <tr>
            {tableHeaderMarkup}
          </tr>
        </thead>
        <tbody>
          {tableBodyMarkup}
        </tbody>
      </table>
    </div>
  )
}

TableBuilding.Pagination = function TableBuildingPagination() {
  const { data, itemsPerPage, paginate } = useContext(tableBuildingContext);

  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  };

  return (
    <nav>
      <ul>
        {pageNumbers.map((number) => (
          <li
            key={uuid()}
          >
            <a
              href='!#'
              onClick={() => paginate(number)}
            >
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default TableBuilding;
