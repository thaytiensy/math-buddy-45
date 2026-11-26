import net from 'net';
import { spawn } from 'child_process';

const startPort = 4350;
const endPort = 4399;

function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => {
      resolve(false);
    });
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port, '0.0.0.0');
  });
}

async function findAvailablePort() {
  for (let p = startPort; p <= endPort; p++) {
    const available = await checkPort(p);
    if (available) return p;
  }
  return 0;
}

async function main() {
  const port = await findAvailablePort();
  if (!port) {
    console.error('Không tìm thấy cổng trống trong dải 4350 - 4399!');
    process.exit(1);
  }

  console.log(`[Toán Đồng Hành Lớp 4, 5] Đang khởi chạy ứng dụng tại cổng: ${port}`);
  const child = spawn('npx', ['vite', 'preview', '--port', port.toString(), '--host', '0.0.0.0'], {
    stdio: 'inherit',
    shell: true,
  });

  child.on('exit', (code) => {
    process.exit(code || 0);
  });
}

main();
