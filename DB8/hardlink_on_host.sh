# Execute this script on the Host
# This will make hard link of luna-service
mkdir -p /luna/usr/bin
mkdir -p /luna/usr/lib
mkdir -p /luna/usr/sbin
mkdir -p /luna/usr/share
mkdir -p /palm
ln /usr/bin/luna-send /luna/usr/bin/luna-send
ln /usr/bin/luna-send-pub /luna/usr/bin/luna-send-pub
ln /usr/lib/libluna-service2++.so.3.21.2 /luna/usr/lib/libluna-service2++.so.3.21.2
ln /usr/lib/libluna-service2.so.3.21.2 /luna/usr/lib/libluna-service2.so.3.21.2
ln /usr/sbin/ls-control /luna/usr/sbin/ls-control
ln /usr/sbin/ls-hubd /luna/usr/sbin/ls-hubd
ln /usr/sbin/ls-monitor /luna/usr/sbin/ls-monitor
cp -R /usr/share/luna-service2 /luna/usr/share/luna-service2
