const path = require('path');
const execSync = require('child_process').execSync;

function extractJson(str) {
    // Убираем ANSI escape-коды и лишние символы
    const cleanedStr = str.replace(/\u001b\[\d{2}m/g, '').replace(/[\[\]"\\\n]/g, '').trim();
  
    // Преобразуем строку в JSON
    try {
      const json = JSON.parse(cleanedStr.replace(/'/g, '"'));
      return json;
    } catch (error) {
      console.error('Невозможно преобразовать строку в JSON:', error);
      return null;
    }
  }

module.exports = {
    addCypressImageSelectorPlugin(on, config) {
        on('task', {
            searchByImage({ screenPath, elemntPath }) {
                const res = execSync(
                    `viewportHeight=${config.viewportHeight} viewportWidth=${
                        config.viewportWidth
                    } outerImagePath="${screenPath}" innerImagePath="${process.cwd()}/${elemntPath}" node ${path.join(__dirname, 'src/run.js')}`,
                );
                const result = extractJson(res.toString());
                console.log(result);                
                return result
            },
        })
    }
}