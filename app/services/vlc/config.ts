import * as fs from 'fs';
import * as readline from 'readline';

// TODO: setup to run on startup?

const defaultHost = ''
const defaultPort = 8080
// TODO: move this to an env var
const defaultPassword = 'seenit-vlc-http'

const vlcSymbols = {
  comment: '#',
  assignment: '=',
  separator: ':',
}

/**
 * Returns an array of read targetLines. Last matched is returned for multiple matches and undefined for lines that don't match
 * @param filePath The file path of the read taret
 * @param targetLines Array of lines to match, accepts additional replacer string or function
*/
export function getLine (filePath: string, targetLines: Array<{ lineMatch: string | RegExp, setLine?: string | ((text: string) => string) }>) {
  return new Promise<Array<string | undefined>>((resolve, reject) => {
    const tempFile = `${filePath}.tmp`
    const readStream = fs.createReadStream(filePath)
    const writeStream = fs.createWriteStream(tempFile)

    const lineReader = readline.createInterface(readStream)
    const targetLine: Array<string | undefined> = Array.from({ length: targetLines.length })

    lineReader.on('line', (line: string) => {
      let lineToWrite = line;
      const targetIndex = targetLines.findIndex(({ lineMatch }) => line.match(lineMatch));
      const target = targetLines[targetIndex]

      if (target) {
        if (target.setLine) {
          lineToWrite = typeof target.setLine === 'string' ? target.setLine : target.setLine(line);
        }

        targetLine[targetIndex] = lineToWrite
      }

      writeStream.write(`${lineToWrite}\n`)
    })

    lineReader.on('close', () => {
      // Finish writing to temp file and replace files.
      // Replace original file with fixed file (the temp file).
      writeStream.end(() => {
        fs.unlink(filePath, (err) => {
          if (err) { return reject(err); }

          fs.rename(tempFile, filePath, (err) => {
            if (err) { return reject(err); }

            resolve(targetLine);
          });
        });
      })
    })
  })
}

function updateLine(line: string, newValue: string | number, type: 'string' | 'array') {

  let newLine = line.replace(new RegExp(`^${vlcSymbols.comment}+`, 'g'), '')
  let [name, values] = newLine.split(vlcSymbols.assignment)

  if (type === 'array') {
    const valueArray = values.split(vlcSymbols.separator).filter((value) => !!value)

    if (!valueArray.includes(String(newValue))) {
      valueArray.push(String(newValue))
    }

    const newValues = valueArray.join(vlcSymbols.separator)
    return [name, newValues].join(vlcSymbols.assignment)
  }

  return [name, values || newValue].join(vlcSymbols.assignment)
}

export const getConfigs = (filePath: string) => getLine(filePath, [
  {
    lineMatch: /^(#| )*extraintf=/g,
    setLine: (currentLine) => updateLine(currentLine, 'http', 'array'),
  },
  {
    lineMatch: /^(#| )*http-port=/g,
    setLine: (currentLine) => updateLine(currentLine, defaultPort, 'string'),
  },
  {
    lineMatch: /^(#| )*http-host=/g,
    setLine: (currentLine) => updateLine(currentLine, defaultHost, 'string'),
  },
  {
    lineMatch: /^(#| )*http-password=/g,
    setLine: (currentLine) => updateLine(currentLine, defaultPassword, 'string'),
  },
]).then(([interfaces, port, host, password]) => ({
  port: port ? port.split(vlcSymbols.assignment)[1] : '',
  host: host ? host.split(vlcSymbols.assignment)[1] || 'localhost' : '',
  password: password ? password.split(vlcSymbols.assignment)[1] : '',
}))
