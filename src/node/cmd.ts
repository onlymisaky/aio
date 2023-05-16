import { spawn } from 'child_process';

interface ExecOptions {
  cwd: string;
  silent: boolean;
  time: boolean;
}

interface ExecResult {
  pid: null | string | number,
  code: null | number,
  stdout: string[],
  stderr: string[],
}

/**
 * @param {string} command 
 * @param {ExecOptions} options 
 * @returns {Promise<ExecResult>}
 */
function execQuick(command, options) {
  let resolve;
  const promise = new Promise((res) => { resolve = res; });

  const { cwd, silent, time } = { cwd: '', silent: false, time: true, ...options, };

  /** @type {string[]} */
  const stdout = [];
  /** @type {string[]} */
  const stderr = [];

  const begin = new Date().getTime();

  const sub = spawn(command, { cwd, shell: true, });

  sub.on('close', (code) => {
    process.stdin.destroy();

    if (!silent) {
      const obj = {
        Command: command,
        Result: code === 0 ? 'Success' : 'Fail'
      }
      if (time) {
        const end = new Date().getTime();
        const waste = ((end - begin) / 1000).toFixed(2);
        obj.Time = `${waste}s`;
      }
      console.table([obj]);
    }

    resolve({ pid: sub.pid, code, stdout, stderr, })
  });

  sub.stdout.on('data', (data) => {
    stdout.push(data.toString());
    if (!silent) {
      process.stdout.write(data);
    }
  });

  sub.stderr.on('data', (data) => {
    stderr.push(data.toString());
    if (!silent) {
      console.log(data.toString());
    }
  });

  process.stdin.on('data', (input) => {
    // https://segmentfault.com/q/1010000017420843
    sub.stdin.write(input.toString() + '\n\r');
  });

  return promise;
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
