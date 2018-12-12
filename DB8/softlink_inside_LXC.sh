# Execute this script inside LXC
# This will make soft link from the shared directory to LXC's luna service directory
ln -s /luna/usr/sbin/ls-control /usr/sbin/ls-conrtol
ln -s /luna/usr/sbin/ls-hubd /usr/sbin/ls-hubd
ln -s /luna/usr/sbin/ls-monitor /usr/sbin/ls-monitor
ln -s /luna/usr/lib/libluna-service2.so.3.21.2 /usr/lib/libluna-service2.so.3
ln -s /luna/usr/lib/libluna-service2++.so.3.21.2 /usr/lib/libluna-service2++.so.3
cp -Rfv /luna/usr/share/luna-service2/ /usr/share/luna-service2

