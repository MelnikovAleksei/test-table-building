# Тестовое задание для [Crazy Panda](https://crazypanda.ru/) на позицию Junior Front-end разработчик

[Ссылка на деплой на Github-pages](https://melnikovaleksei.github.io/test-table-building/)

## Задание:

> Необходимо разработать javascript-компонент для построения таблицы с дополнительными возможностями для пользователя.

> Функционал: Клиентская пагинация: данные необходимо отображать постранично, максимум 50 элементов на страницу, необходимо предоставить пользовательскую навигацию для перехода по страницам.

> Сортировка по столбцам: при нажатии на название столбца строки таблицы сортируются по возрастанию, при повторном клике - по убыванию.

> Фильтрация: компонент предоставляет текстовое поле, в которое пользователь может ввести текст и строки таблицы, данные которых не содержат подстроку, введённую пользователем, скрываются. Перефильтрация осуществляется на каждое изменение значения поля.

### Установка:

```
git clone https://github.com/MelnikovAleksei/test-table-building.git

cd test-table-building

npm install

npm start
```

### Описание работы компонента **TableBuilding**:

Компонент **TableBuilding** принимает данные для отображения в таблице в виде массива с объектами и двумерный массив для отображения конкретных данных, где под индексом **0** указан ключ для объекта с данными и под индексом **1** указан текст заголовка дляотображения в таблице.

Пример данных фильмов для отображения в таблице:

```

[
  {
    "id": 1,
    "nameEN": "Stones in Exile",
    "director": "Стивен Кайак ",
    "country": "США",
    "year": "2010",
    "duration": 61
  },
  {
    "id": 2,
    "nameEN": "All Tomorrow's Parties",
    "director": " Джонатан Кауэтт",
    "country": "Великобритания",
    "year": "2009",
    "duration": 82,
  }
]

```

Пример двумерного массива для отображения конкретных данных из объекта с данными:

```

const TABLE_HEADERS = [
  ['id', 'Id'],
  ['nameEN', 'Film Title'],
  ['duration', 'Duration']
];

```

```

Пример использования:

```
import React from 'react'
import TableBuilding from './TableBuilding';

function App () {

  const TABLE_HEADERS = [
    ['id', 'Id'],
    ['nameEN', 'Film Title'],
    ['duration', 'Duration']
  ];

  const MOVIES_DATA = [
    {
      "id": 1,
      "nameEN": "Stones in Exile",
      "director": "Стивен Кайак ",
      "country": "США",
      "year": "2010",
      "duration": 61
    },
    {
      "id": 2,
      "nameEN": "All Tomorrow's Parties",
      "director": " Джонатан Кауэтт",
      "country": "Великобритания",
      "year": "2009",
      "duration": 82,
    }
  ]

  return (
    <div className="App">
      <TableBuilding data={MOVIES_DATA} headers={TABLE_HEADERS}>
        <TableBuilding.Pagination />
      </TableBuilding>
    </div>
  )
}

```

### Используемые технологии:

* Reactjs
* CSS
* HTML

### Планируемые доработки:

* оптимизация работы приложения

### Используемые библиотеки:

* [react-uuid](https://www.npmjs.com/package/react-uuid)
* [gh-pages](https://www.npmjs.com/package/gh-pages)

Special thanks to [Brad Traversy](https://github.com/bradtraversy) for a tutorial on pagination and [Abdul Basit](https://github.com/AbdulBasit313) for a tutorial on custom dynamic tables.
