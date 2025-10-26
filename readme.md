SecretMemos project

exporting database:
mongodump --db=notepass --archive=notepassdb
or compressed:
mongodump --db=notepass --gzip --archive=notepassdb

copy from container to local folder:
docker cp mongodb_container:/notepassdb ./

copy from ssh location:
scp user@server.com:/home/username/SecretMemosDb/notepassdb ./

copy to docker container:
docker cp ./notepassdb mongodb_container:/

in container exec:
docker container exec -it CONTAINERNAME /bin/sh
mongorestore --gzip --archive=notepassdb 


export file out of container:
docker exec mongodb_container sh -c 'exec mongodump --db notepass --gzip --archive' > dump_`date "+%Y-%m-%d"`.gz
import file in container:
docker exec mongodb_container sh -c 'exec mongorestore --gzip --archive=/dump_2025-10-23.gz'
import file out of container:
docker exec -i mongodb_container sh -c 'mongorestore --gzip --archive' < dump_2025-10-23.gz
