curl -c cookie -d 'username=root&password=pwd' localhost:3000/api/login
curl -b cookie localhost:3000/api/bill/
#curl -b cookie -d 'ip=192.168.3.3' localhost:3000/api/blacklist/add
#curl -b cookie -d 'ip=192.168.3.3' localhost:3000/api/blacklist/remove
