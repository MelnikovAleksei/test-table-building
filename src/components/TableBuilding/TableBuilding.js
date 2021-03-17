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
  return { items: sortedItems, requestSort };
};

const tableBuildingContext = createContext();

function TableBuilding({ children, data, headers }) {
  const DATA_PROPERTY_INDEX = 0;
  const DATA_TITLE_INDEX = 1;

  const TABLE_CONTAINER_STYLE_SETTINGS = {
    tableContainer: 'table-container',
  };

  const TABLE_STYLE_SETTINGS = {
    table: 'table',
    tableHead: 'table__head',
    tableBody: 'table__body',
    tableRow: 'table__row',
    tableData: 'table__data',
    tableHeader: 'table__header',
    tableHeaderButton: 'table__header-button',
  };

  const TABLE_FORM_STYLE_SETTINGS = {
    tableForm: 'table-form',
    tableFormInputLabel: 'table-form__input-label',
    tableFormInputField: 'table-form__input-field',
  };

  const [filteredData, setFilteredData] = React.useState([]);

  const [dataToRender, setDataToRender] = React.useState(data);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(50);

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
  } = useSortableData(filteredData);

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
          className={TABLE_STYLE_SETTINGS.tableData}
          key={uuid()}
        >
          {elem[item[DATA_PROPERTY_INDEX]]}
        </td>
      ))

      return (
        <tr
          className={TABLE_STYLE_SETTINGS.tableRow}
          key={uuid()}
        >
          {tdMarkup}
        </tr>
      )
    })
  }, [headers, indexOfLastItem, indexOfFirstItem]);

  const handleSortBtnClick = (key) => {
    requestSort(key);
    setTableBodyMarkup(getTableBodyMarkup(items));
  }

  const tableHeaderMarkup = headers.map((header) => (
    <th
      className={TABLE_STYLE_SETTINGS.tableHeader}
      key={uuid()}
      scope="col"
    >
      <button
        className={TABLE_STYLE_SETTINGS.tableHeaderButton}
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
    setTableBodyMarkup(getTableBodyMarkup(searchFilter(value, items)));
  }, [items, getTableBodyMarkup, value])

  return (
    <div
      className={TABLE_CONTAINER_STYLE_SETTINGS.tableContainer}
    >
      <form
        className={TABLE_FORM_STYLE_SETTINGS.tableForm}
        onSubmit={handleSubmit}
      >
        <label
          className={TABLE_FORM_STYLE_SETTINGS.tableFormInputLabel}
        >
          Search:
          <input
            className={TABLE_FORM_STYLE_SETTINGS.tableFormInputField}
            name="search"
            onChange={handleChange}
            value={value || ''}
          />
        </label>
      </form>
      <tableBuildingContext.Provider value={{ totalPageNumber, paginate }}>
        {children}
        <table
          className={TABLE_STYLE_SETTINGS.table}
        >
          <thead
            className={TABLE_STYLE_SETTINGS.tableHead}
          >
            <tr
              className={TABLE_STYLE_SETTINGS.tableRow}
            >
              {tableHeaderMarkup}
            </tr>
          </thead>
          <tbody
            className={TABLE_STYLE_SETTINGS.tableBody}
          >
            {tableBodyMarkup}
          </tbody>
        </table>
      </tableBuildingContext.Provider>
    </div>
  )
}

TableBuilding.Pagination = function TableBuildingPagination() {
  const { totalPageNumber, paginate } = useContext(tableBuildingContext);

  const pageNumbers = []

  for (let i = 1; i <= totalPageNumber; i++) {
    pageNumbers.push(i);
  }

  const TABLE_NAV_STYLE_SETTINGS = {
    tableNav: 'table-nav',
    tableList: 'table-nav__list',
    tableListItem: 'table-nav__list-item',
    tableListLink: 'table-nav__list-link',
  };

  return (
    <nav
      className={TABLE_NAV_STYLE_SETTINGS.tableNav}
    >
      <ul
        className={TABLE_NAV_STYLE_SETTINGS.tableList}
      >
        {pageNumbers.map((number) => (
          <li
            className={TABLE_NAV_STYLE_SETTINGS.tableListItem}
            key={uuid()}
          >
            <a
              className={TABLE_NAV_STYLE_SETTINGS.tableListLink}
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
