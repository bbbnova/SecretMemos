SecretMemos project

exporting database
mongodump --db=notepass --archive=notepassdb

copy from contasiner to local folder
docker cp mongodb_container:/notepassdb .

copy from ssh location
scp user@server.com:/home/username/SecretMemosDb/notepassdb ./

copy to docker container
docker cp ./notepassdb mongodb_container:/

in container exec
docker container exec -it CONTAINERNAME /bin/sh
mongorestore --db=notepass --archive=notepassdb 
