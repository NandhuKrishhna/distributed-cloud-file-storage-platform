echo "CI/CD Pipeline Started"
echo "Pulling the latest changes from changes"
git pull

echo "Restarting the server"
pm2 restart 0

echo "Showing list of processes"
pm2 list

echo "CI/CD Pipeline Completed"
echo "Showing last 10 lines of logs"
pm2 logs 0 --lines 10