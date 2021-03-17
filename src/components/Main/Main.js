import React from 'react';
import TableBuilding from '../TableBuilding/TableBuilding';

import { moviesData } from '../../utils/defaultData/moviesData';

function Main() {
  const MAIN_STYLE_SETTINGS = {
    MAIN: 'main'
  };

  const TABLE_HEADERS = [
    ['id', 'Id'],
    ['nameEN', 'Film Title'],
    ['duration', 'Duration']
  ];

  return (
    <main
      className={MAIN_STYLE_SETTINGS.MAIN}
    >
      <TableBuilding
        data={moviesData}
        headers={TABLE_HEADERS}
      >
        <TableBuilding.Pagination />
      </TableBuilding>
    </main>
  )
}

export default Main;
