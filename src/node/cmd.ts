import { spawn } from 'child_process';

async function execQuick(command: string, options = { time: true }) {
  return new Promise((resolve, reject) => {
    const silent = options.silent !== false;
    const begin = new Date().getTime();
    const result = {
      pid: null,
      code: null,
      stdout: '',
      stderr: '',
    };

    const { stdout, stderr, pid } = spawn(command, { cwd: options.cwd, shell: true })
      .on(('close'), (code) => {
        if (options.time) {
          const end = new Date().getTime();
          const waste = ((end - begin) / 1000).toFixed(2);
          console.info(`Command:【${command}】executed in ${waste} ms.`);
        }
        if (code !== 0 && !silent) {
          console.error(`Command:【${command}】executed failed.`);
        }

        result.code = code;
        resolve(result);
      });

    stdout.on('data', (data) => {
      const dataStr = data.toString();
      if (!silent) {
        console.info(dataStr);
      }
      result.stdout += dataStr;
    });

    stderr.on('data', (data) => {
      const dataStr = data.toString();
      if (!silent) {
        console.info(dataStr);
      }
      result.stdout += dataStr;
    });

  });
}

function stdoutTable2List(stdout: string) {
  const lines = stdout.split('\n');
  const [head, ...body] = lines;
  // todo 优化正则
  const keys = `${head}      `.match(/([a-zA-Z ]*?[ ]{2,})/g) || [];

  const keyMap = keys.reduce((prev, current) => {
    const key = current.trim();
    const start = head.indexOf(key);
    return {
      ...prev,
      [key]: {
        start,
        end: start + current.length
      }
    }
  }, {});

  const list = body.map((line) => {
    const data = {};
    for (const key in keyMap) {
      const { start, end } = keyMap[key];
      data[key] = line.slice(start, end).trim();
    }
    return data;
  });

  return list;
}
