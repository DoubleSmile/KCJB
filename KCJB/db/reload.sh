gzip -d back.tar.gz
tar xvf back.tar

mongoimport --drop -d oc -c users ./back/users.mdb
mongoimport --drop -d oc -c gifts ./back/gifts.mdb
mongoimport --drop -d oc -c bills ./back/bills.mdb
mongoimport --drop -d oc -c auto_incs ./back/auto_incs.mdb
mongoimport --drop -d oc -c products ./back/products.mdb

#cp ./back/dump.rdb /var/lib/redis/dump.rdb

