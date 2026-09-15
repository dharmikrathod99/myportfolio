import os from 'os';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';

export interface SystemActionResult {
  success: boolean;
  action: string;
  message: string;
  data?: any;
}

/**
 * Resolves the user's Desktop directory path on Windows / macOS / Linux
 */
export function getDesktopPath(): string {
  const home = os.homedir();
  const directDesktop = path.join(home, 'Desktop');
  if (fs.existsSync(directDesktop)) {
    return directDesktop;
  }
  const oneDriveDesktop = path.join(home, 'OneDrive', 'Desktop');
  if (fs.existsSync(oneDriveDesktop)) {
    return oneDriveDesktop;
  }
  return directDesktop;
}

/**
 * Creates a folder on Desktop or target path
 */
export function createFolder(folderName?: string, location?: string): SystemActionResult {
  try {
    const rawName = (folderName || '').trim() || 'New Folder';
    // Remove invalid filename characters on Windows
    const sanitizedName = rawName.replace(/[<>:"/\\|?*]/g, '_').trim() || 'New Folder';

    let targetDir = getDesktopPath();
    if (location) {
      const locLower = location.toLowerCase().trim();
      if (locLower === 'downloads') {
        targetDir = path.join(os.homedir(), 'Downloads');
      } else if (locLower === 'documents') {
        targetDir = path.join(os.homedir(), 'Documents');
      } else if (path.isAbsolute(location)) {
        targetDir = location;
      }
    }

    fs.mkdirSync(targetDir, { recursive: true });

    let finalPath = path.join(targetDir, sanitizedName);
    let counter = 1;
    while (fs.existsSync(finalPath)) {
      finalPath = path.join(targetDir, `${sanitizedName} (${counter})`);
      counter++;
    }

    fs.mkdirSync(finalPath, { recursive: true });
    const createdName = path.basename(finalPath);
    console.log(`[SystemActions] Created folder: ${finalPath}`);

    return {
      success: true,
      action: 'create_folder',
      message: `Folder "${createdName}" successfully created on your Desktop.`,
      data: { path: finalPath, name: createdName },
    };
  } catch (err: any) {
    console.error('[SystemActions] Error creating folder:', err);
    return {
      success: false,
      action: 'create_folder',
      message: `Could not create folder: ${err.message}`,
    };
  }
}

/**
 * Creates a file on Desktop or target path
 */
export function createFile(fileName?: string, content?: string, location?: string): SystemActionResult {
  try {
    const rawName = (fileName || '').trim() || 'New Document.txt';
    const sanitizedName = rawName.replace(/[<>:"/\\|?*]/g, '_').trim() || 'New Document.txt';

    let targetDir = getDesktopPath();
    if (location) {
      const locLower = location.toLowerCase().trim();
      if (locLower === 'downloads') {
        targetDir = path.join(os.homedir(), 'Downloads');
      } else if (locLower === 'documents') {
        targetDir = path.join(os.homedir(), 'Documents');
      }
    }

    fs.mkdirSync(targetDir, { recursive: true });

    let finalPath = path.join(targetDir, sanitizedName);
    let counter = 1;
    const ext = path.extname(sanitizedName);
    const base = path.basename(sanitizedName, ext);
    while (fs.existsSync(finalPath)) {
      finalPath = path.join(targetDir, `${base} (${counter})${ext}`);
      counter++;
    }

    fs.writeFileSync(finalPath, content || '', 'utf-8');
    const createdName = path.basename(finalPath);
    console.log(`[SystemActions] Created file: ${finalPath}`);

    return {
      success: true,
      action: 'create_file',
      message: `File "${createdName}" created on your Desktop.`,
      data: { path: finalPath, name: createdName },
    };
  } catch (err: any) {
    console.error('[SystemActions] Error creating file:', err);
    return {
      success: false,
      action: 'create_file',
      message: `Could not create file: ${err.message}`,
    };
  }
}

/**
 * Launches an application on the user's computer
 */
const APP_COMMANDS: Record<string, string> = {
  notepad: 'notepad.exe',
  calculator: 'calc.exe',
  calc: 'calc.exe',
  chrome: 'start chrome',
  'google chrome': 'start chrome',
  edge: 'start msedge',
  'microsoft edge': 'start msedge',
  code: 'code',
  vscode: 'code',
  'vs code': 'code',
  terminal: 'start wt || start powershell',
  powershell: 'start powershell',
  cmd: 'start cmd',
  explorer: 'explorer.exe',
  'file explorer': 'explorer.exe',
  files: 'explorer.exe',
  desktop: 'explorer.exe shell:Desktop',
  downloads: 'explorer.exe shell:Downloads',
  settings: 'start ms-settings:',
  taskmgr: 'taskmgr.exe',
  'task manager': 'taskmgr.exe',
  paint: 'mspaint.exe',
};

export function openApp(appName: string): Promise<SystemActionResult> {
  return new Promise((resolve) => {
    const cleanApp = appName.toLowerCase().trim();
    const command = APP_COMMANDS[cleanApp] || `start "" "${appName}"`;

    console.log(`[SystemActions] Launching app: ${cleanApp} -> ${command}`);
    exec(command, (error) => {
      if (error) {
        console.warn(`[SystemActions] Failed to open ${cleanApp}:`, error.message);
        return resolve({
          success: false,
          action: 'open_app',
          message: `Could not open ${appName}: ${error.message}`,
        });
      }
      resolve({
        success: true,
        action: 'open_app',
        message: `Opened ${appName}.`,
      });
    });
  });
}

/**
 * Opens a URL in the default browser
 */
export function openUrl(url: string): Promise<SystemActionResult> {
  return new Promise((resolve) => {
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }
    console.log(`[SystemActions] Opening URL: ${cleanUrl}`);
    exec(`start "" "${cleanUrl}"`, (error) => {
      if (error) {
        return resolve({
          success: false,
          action: 'open_url',
          message: `Could not open URL: ${error.message}`,
        });
      }
      resolve({
        success: true,
        action: 'open_url',
        message: `Opened ${cleanUrl} in your browser.`,
      });
    });
  });
}

/**
 * Gets real-time computer hardware telemetry
 */
export function getSystemStatus(): SystemActionResult {
  const totalMemGB = (os.totalmem() / (1024 ** 3)).toFixed(1);
  const freeMemGB = (os.freemem() / (1024 ** 3)).toFixed(1);
  const usedMemGB = ((os.totalmem() - os.freemem()) / (1024 ** 3)).toFixed(1);
  const uptimeHours = (os.uptime() / 3600).toFixed(1);
  const cpus = os.cpus();
  const cpuModel = cpus.length > 0 ? cpus[0].model.trim() : 'Intel Processor';

  const message = `System telemetry: CPU is ${cpuModel} with ${cpus.length} logical cores. RAM usage is ${usedMemGB} GB out of ${totalMemGB} GB (${freeMemGB} GB free). System uptime is ${uptimeHours} hours.`;

  return {
    success: true,
    action: 'system_status',
    message,
    data: {
      cpuModel,
      cores: cpus.length,
      totalMemGB,
      usedMemGB,
      freeMemGB,
      uptimeHours,
    },
  };
}

/**
 * Executes a system shell command safely
 */
export function executeCommand(cmd: string): Promise<SystemActionResult> {
  return new Promise((resolve) => {
    const lower = cmd.toLowerCase();
    // Safety guard
    if (lower.includes('format ') || lower.includes('del /f /s /q c:') || lower.includes('rmdir /s /q c:')) {
      return resolve({
        success: false,
        action: 'execute_command',
        message: 'Command blocked: destructive root deletion is prohibited.',
      });
    }

    console.log(`[SystemActions] Executing shell command: ${cmd}`);
    exec(cmd, { timeout: 8000 }, (error, stdout, stderr) => {
      if (error) {
        return resolve({
          success: false,
          action: 'execute_command',
          message: `Command error: ${error.message}`,
        });
      }
      const output = (stdout || stderr || 'Command executed successfully.').trim();
      resolve({
        success: true,
        action: 'execute_command',
        message: output.slice(0, 400),
      });
    });
  });
}

/**
 * Fast-path intent parser for immediate system execution
 */
export async function matchQuickSystemIntent(query: string): Promise<SystemActionResult | null> {
  const q = query.toLowerCase().trim().replace(/[?!.,;]/g, '');

  // 1. Create folder (on Desktop by default, or specified location)
  // English: "create a folder called TestFolder", "make a folder named work", "create folder on desktop"
  // Hindi/Hinglish: "desktop par Test naam ka folder banao", "folder banao Test"
  const isCreateFolder =
    (q.includes('create') || q.includes('make') || q.includes('banao') || q.includes('karo')) &&
    (q.includes('folder') || q.includes('directory'));

  if (isCreateFolder) {
    let folderName = 'New Folder';
    // Pattern A: "called X" or "named X" or "naam X" or "titled X"
    const calledMatch = q.match(/(?:called|named|name|naam|titled|jiska naam)\s+['"]?([a-zA-Z0-9_\-]+)['"]?/i);
    // Pattern B: "X naam ka folder"
    const hindiBeforeNaam = q.match(/([a-zA-Z0-9_\-]+)\s+naam(?:\s+ka|\s+se)?\s+folder/i);
    // Pattern C: "folder X"
    const simpleMatch = q.match(/folder\s+['"]?([a-zA-Z0-9_\-]+)['"]?/i);

    if (calledMatch && calledMatch[1] && !['a', 'an', 'the', 'ek', 'on', 'pe', 'par', 'banao', 'ka'].includes(calledMatch[1].toLowerCase())) {
      folderName = calledMatch[1].trim();
    } else if (hindiBeforeNaam && hindiBeforeNaam[1]) {
      folderName = hindiBeforeNaam[1].trim();
    } else if (simpleMatch && simpleMatch[1] && !['a', 'an', 'the', 'ek', 'on', 'pe', 'par', 'banao', 'ka', 'create', 'make', 'called', 'named'].includes(simpleMatch[1].toLowerCase())) {
      folderName = simpleMatch[1].trim();
    }
    return createFolder(folderName, 'desktop');
  }

  // 2. Open Application
  // English: "open notepad", "launch calculator", "open chrome"
  // Hindi: "notepad kholo", "calculator open karo"
  const isOpenApp =
    q.startsWith('open ') ||
    q.startsWith('launch ') ||
    q.endsWith(' kholo') ||
    q.endsWith(' open karo') ||
    q.endsWith(' chalu karo');

  if (isOpenApp) {
    let appName = q
      .replace(/^open\s+/i, '')
      .replace(/^launch\s+/i, '')
      .replace(/\s+kholo$/i, '')
      .replace(/\s+open karo$/i, '')
      .replace(/\s+chalu karo$/i, '')
      .trim();
    if (appName) {
      return await openApp(appName);
    }
  }

  // 3. System status
  if (
    q.includes('system status') ||
    q.includes('cpu usage') ||
    q.includes('ram usage') ||
    q.includes('system telemetry') ||
    q.includes('battery')
  ) {
    return getSystemStatus();
  }

  return null;
}
