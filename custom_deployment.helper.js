import { spawn } from 'child_process'

const bashChildProcess = spawn('bash', ['./.script.sh'])
bashChildProcess.stdout.on('data', (data) => {
  process.stdout.write(data)
})

bashChildProcess.stderr.on('data', (data) => {
  process.stderr.write(data)
})

bashChildProcess.on('close', (code) => {
  console.log(`Child process exited with code ${code}`)
})

bashChildProcess.on('error', (error) => {
  console.error(`Failed to start subprocess: ${error}`)
})
