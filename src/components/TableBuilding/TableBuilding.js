import React, { createContext, useContext } from 'react';
import uuid from 'react-uuid';

const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = React.useState(config);

  const sortedItems = React.useMemo(() => {
    const sortableItems = [...items];

    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        };
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        };
        return 0;
      });
    };
    return sortableItems;
  }, [items, sortConfig])

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    setSortConfig({ key, direction });
  }
  return { items: sortedItems, requestSort, sortConfig };
};

const tableBuildingContext = createContext();

function TableBuilding({ children, data, headers }) {
  const DATA_PROPERTY_INDEX = 0;
  const DATA_TITLE_INDEX = 1;

  const [filteredData, setFilteredData] = React.useState([]);

  const [dataToRender, setDataToRender] = React.useState(data);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(30);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const [totalPageNumber, setTotalPageNumber] = React.useState(0)

  const [tableBodyMarkup, setTableBodyMarkup] = React.useState(null);
  const [value, setValue] = React.useState('');

  const getTotalPageNumber = React.useCallback(() => Math.ceil(dataToRender.length / itemsPerPage), [dataToRender.length, itemsPerPage]);

  const getKeysForFiltering = React.useCallback(() => headers.map(elem => elem[DATA_PROPERTY_INDEX]), [headers]);

  const {
    items,
    requestSort,
    sortConfig,
  } = useSortableData(filteredData);

  const getKeyFor = (key) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === key ? sortConfig.direction : undefined;
  };

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
  }, [headers, indexOfLastItem, indexOfFirstItem]);

  const handleSortBtnClick = (key) => {
    console.log(key)
    requestSort(key);
    setTableBodyMarkup(getTableBodyMarkup(items));
  }

  const tableHeaderMarkup = headers.map((header, index) => (
    <th
      key={uuid()}
    >
      <button
        className={getKeyFor(header[DATA_PROPERTY_INDEX])}
        onClick={() => handleSortBtnClick(header[DATA_PROPERTY_INDEX])}
      >
        {header[DATA_TITLE_INDEX]}
      </button>
    </th>
  ));

  React.useEffect(() => {
    if (data) {
      const filterKeys = getKeysForFiltering();
      setFilteredData(filterDataByKeys(data, filterKeys));
    }
  }, [data, getKeysForFiltering])

  React.useEffect(() => {
    if (filteredData.length > 0) {
      const foundData = searchFilter(value, filteredData);
      setTableBodyMarkup(getTableBodyMarkup(foundData));
      setTotalPageNumber(getTotalPageNumber());
    }
  }, [value, filteredData, getTableBodyMarkup, getTotalPageNumber])

  React.useEffect(() => {
    setTableBodyMarkup(getTableBodyMarkup(items));
  }, [items, getTableBodyMarkup])

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
      <tableBuildingContext.Provider value={{ totalPageNumber, paginate }}>
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
  const { totalPageNumber, paginate } = useContext(tableBuildingContext);

  const pageNumbers = []

  for (let i = 1; i <= totalPageNumber; i++) {
    pageNumbers.push(i);
  }

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
