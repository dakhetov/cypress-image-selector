## Описание

Это прототип плагина, который позволяет не использовать селекторы для поиска элементов в DOM-дереве. Вместо этого можно указать изображение нужного элемента, и плагин вернёт DOM-ноду. Далее с ней можно работать, как с обычным элементом, найденным с помощью селектора.

![alt text](https://gitlab.com/dakhetov/cypress-image-selector/-/raw/main/searchImage.png)

## Требования к системе

Для того, чтобы плагин работал, необходимы python библиотеки `imutils` и `opencv-python`.

**Debian**

```bash
apt-get update && apt-get install -y \
        python3 \
        python3-pip

python3 -m pip install imutils
python3 -m pip install opencv-python
```

## Как пользоваться

**Установить плагин**

```bash
npm i -D cypress-image-selector
```

**Подключить плагин**

В файле `cypress/plugin.js` ипротировать и вызвать команду:

```js
const { addCypressImageSelectorPlugin } = require('cypress-image-selector/plugin');

addCypressImageSelectorPlugin(on, config);
```

Если Cypress версии 12 и выше, то подключать плагин надо в файле конфигурации `cypress.config.js`:

```js
const { defineConfig } = require("cypress");
const { addCypressImageSelectorPlugin } = require('cypress-image-selector/plugin');

module.exports = defineConfig({ 
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      addCypressImageSelectorPlugin(on, config);
    },
  },
});
```

**Подключить команду**

В файле `cypress/e2e.js` или `cypress/commands.js` подключить команду для поиска элемента по картинке:

```js
require('cypress-image-selector/command');
```

**Вызов команды в тесте**

В тесте вызвать команду поиска элементов по картинке, передав в нее относительный путь png файла с необходимым элементом:

```js
cy.searchByImage('cypress/imageSelectors/todoLogo.png').should('be.visible');
```

Команда в promise возвращает искомый элемент, потому проверки можно вызывать либо от вызова функции, либо сделать алиас на элемент, если он понадобиться в дальнейшем:

```js
cy.searchByImage('cypress/imageSelectors/todoLogo.png').as('todoElem');
cy.get('@todoElem').should('be.visible');
```