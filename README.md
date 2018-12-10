#webOS Containerization Development
###Composible webOS 를 위한 webOS DB8 containerization
#
#
### 각 경로에 대한 정보
##### `before_build`: 빌드 전 작업에 필요한 수정된 bitbake 레시피
##### `LXC`: webOS 이미지에 리눅스 컨테이너 및 의존성, 설정파일 (+install script)
##### `DB8`: DB8 컨테이너를 webOS 상에 구현하기 위한 파일 및 설정
##### `load_lxc_db8_on_boot`: 부팅 타임에 LXC 와 DB8 을 구동하기 위한 설정파일
##### `performance_test_app`: 성능 측정을 위한 enact 어플리케이션(ipk 파일 및 소스)
##### `webOS_dev_image`: 위의 모든 과정이 갱신된 webOS 개발 이미지(라즈베리파이)
#
#
## 1. webOS 이미지 빌드 전 작업
`before_build` 디렉토리에 수정된 bitbake 레시피가 있다.
수정된 bitbake 레시피는 webOS 개발 이미지에 gcc 를 추가하여 빌드할 수 있도록 한다.
<pre><code>webos-image-devel.bb : build-webos/meta-webosose/meta-webos/recipes-core/images 디렉토리에 복사
webos-recipe-blacklist-world.inc: build-webos/meta-webosose/meta-webos/conf/distro/include 디렉토리에 복사</code></pre>

bitbake 레시피를 수정 후, 다음의 커맨드로 webOS 개발 이미지를 빌드한다. 
<pre><code>make webos-image-devel</code></pre>
#
## 2. 빌드 후
빌드 후에 생성된 라즈베리파이 이미지를 microSD 카드에 flash 한다. fdisk 및 resize2fs 를 이용하여 파일시스템의 용량을 늘려서 개발을 위한 추가 용량을 확보한다.
#
## 3. LXC 구현
`LXC` 디렉토리 안에는 LXC 와 의존성 패키지들이 있다.
webOS 에 복사 후, `install`을 실행시키면 의존성 패키지 및 LXC 가 설치된다.
`network.conf` 파일은 LXC 네트워크 설정 파일로 LXC 를 생성할때 필요하다.
다음의 커맨드로 컨테이너를 만든다.
<pre><code>lxc-create -t download -f network.conf -n <컨테이너 이름></code></pre>

컨테이너가 생성되면 /usr/var/lib/lxc 경로에 config 있는 config 파일을 다음과 같이 수정하거나 이 곳(`LXC` 디렉토리)에 있는 `config` 파일로 대체한다.
<pre><code>아래의 두줄을 lxc.uts.name 바로 위에 추가
lxc.mount.entry = /luna luna none rw,bind,create=dir 0.0
lxc.mount.entry = /run/luna-service2 run/luna-service2 none rw,bind,create=dir 0.0
</code></pre>
다음의 커맨드로 컨테이너를 실행하고 컨테이너로 들어간다.
<pre><code>lxc-start <컨테이너 이름>
lxc-attach <컨테이너 이름></code></pre>
컨테이너 안에 들어갔으면 /root 링크를 /home/root 에 만들어둔다. (bashrc 적용)
<pre><code>ln -s /root /home/root</code></pre>
#
## 4. DB8 Containerization
#### DB8 구현
`DB8` 디렉토리는 LXC 안에 DB8 를 구현하기 위한 경로이다.
DB8 과 의존성을 ipk 파일 및 apt 로 설치할 것이기 때문에 사전작업으로 opkg 를 설치한다.
이 과정에서 경로 안에 있는 opkg.conf 파일이 필요하며, opkg 가 ipk 파일을 정해진 repository 에서 받아올 수 있도록 repository 서버를 만들고 설정파일에 추가해야 한다.
webOS 이미지 빌드 과정에서 BUILD/deploy/ipk 이하의 경로에서 ipk 파일들이 만들어지는데 이 경로를 URL 로 받아올 수 있도록 작업한다.
`opkg.conf` 파일 내용을 수정하여 ipk 파일을 받아올 수 있는 URL 로 바꾼다.
그 후, `install_db8` 을 실행한다. (opkg.conf 파일이 install_db8 파일과 같은 경로에 있어야 한다.)
#### LXC 와 Host 간 Communication
공유 디렉토리 방식으로 접근하며, 이미 3. LXC 구현 단계에서 루나 서비스를 공유하기 위한 공유디렉토리를 설정하였다.
호스트에서 `hardlink_on_host.sh` 스크립트를 실행하면 루나 서비스에 대한 하드링크가 생성한다.
컨테이너에 lxc-attach 명령어로 들어가서 `softlink_inside_LXC.sh` 스크립트를 실행하여 루나 서비스에 대한 소프트 링크를 생성한다.
#
## 5. 부팅 타임 LXC, DB8 로딩
기존에 있는 DB8 을 대체하려면 먼저 부팅 타임에 컨테이너가 DB8 보다 먼저 실행시켜서 컨테이너 안에 DB8 이 실행되도록 한다.
호스트의 /etc/systemd/system 경로에 접근하여 다음의 파일을 `load_lxc_db8_on_boot` 경로에 있는 파일로 대체한다.
<pre><code>db8-maindb.service
default-webos.target
lxc-start.service</code></pre>
#
## 6. 성능 측정 어플리케이션
`performance_test_app` 디렉토리에는 성능 측정을 위한 테스트 어플리케이션(ipk)과 소스코드가 있다.
ipk 파일을 opkg 로 webOS 에 설치할 수 있다.
#
## 7. webOS 개발 이미지
지금까지 한 작업들이 모두 포함된 webOS 개발 이미지이다.
