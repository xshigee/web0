    
# WSL2で音を鳴らす  

2023/3/8        
初版    
  
## 概要    
本記事は「[WSL2でOSC受信する](https://xshigee.github.io/web0/md/WSL2_OSC_Receive.html)」の続編にあたり、
WSL2関連は設定は同じなので省略して、音を鳴らすための設定について記載する。


## 音を鳴らすための設定
GUIを実現しているWSLgはオーディオ関係としてpulseaudioサーバーを含んでいるので、
pulseaudioの設定をすると音が出るようになる。  
\# ネット情報として、個別にwindows側にpulseaudioサーバーをインストールする話があるが  
\# これは、WSLg実装前の話のようだ。  

WSLgを最新版にインストールするためにWSLをアップデートする。  
```
wsl --update
```

WSL2のlinuxで以下を実行する：
```
sudo apt -y install alsa-tools
sudo apt -y install pulseaudio
export PULSE_SERVER=unix:$(sed 's/unix://g' <<< "$PULSE_SERVER")
# この時点で音が出るようになる。

# 動作確認
aplay /usr/share/sounds/alsa/Side_Right.wav
# これで音が出るはず。

google-chrome
# youtubeにアクセスすると動画と音が再生できる。
# 色々、エラーが出るが、とりあえず、動作する。

・openFrameworksのsoundのサンプルで音が出ることを確認した。
・audacityで音が出ることを確認した。
・ソフト音源のVitalで音が出ることを確認した。
・ソフト音源の'Surge XT'で音が出ることを確認した。

```
WSL2はログイン状態を保存したままPCを落とせるので  
上のexportは、そのまま有効になっている。  
必要があれば、.bashrcにexportを入れても良い。  


## WSLgのインストール状況の確認

WSL2のlinuxで以下を実行する：  
```bash

# wslsysがインストールされていなければ以下を実行する
sudo apt install ubuntu-wsl

# wslsysがエラーになったので対応策にインストールする
sudo apt install bc

wslsys
# 出力
WSL Version: 1
Locale: ja_JP
Release Install Date: Mon Jan  9 17:09:14 JST 2023
Branch: vb_release
Build: 19045
Full Build: 19041.1.amd64fre.vb_release.191206-1406
Display Scaling: 1.25
Windows Theme: light
Windows Uptime: 7d 0h 49m
WSL Uptime: 0d 10h 5m
WSL Release: Ubuntu 22.04.1 LTS
WSL Kernel: Linux 5.15.90.1-microsoft-standard-WSL2
Packages Count: 1426


ls /mnt            
c  wsl  wslg

ls /mnt/wslg/*
/mnt/wslg/PulseAudioRDPSink    /mnt/wslg/pulseaudio.log  /mnt/wslg/weston.log
/mnt/wslg/PulseAudioRDPSource  /mnt/wslg/stderr.log      /mnt/wslg/wlog.log
/mnt/wslg/PulseServer          /mnt/wslg/versions.txt

/mnt/wslg/distro:
bin   dev  home  lib    lib64   lost+found  mnt  proc  run   snap  sys  usr
boot  etc  init  lib32  libx32  media       opt  root  sbin  srv   tmp  var

/mnt/wslg/doc:
FreeRDP             libX11-common  libdrm         libxkbfile    procps-ng-3.3.17
bash                libXau         libepoxy       libxml2       pulseaudio
bash-5.1.8          libXcursor     libfontenc     lmdb          slang-2.3.2
chrony              libXdmcp       libglvnd       mcpp          systemd
dbus-1.15.2         libXext        libjpeg-turbo  mesa          util-linux
expat               libXfixes      libmetalink    mtdev         wayland-protocols-devel
fontconfig-2.13.95  libXfont2      libpciaccess   ncurses       weston
fribidi             libXmu         libpwquality   ncurses-libs  xcursor-themes
gsm                 libXrandr      libseccomp     openssl       xkeyboard-config
harfbuzz            libXrender     libsndfile     p11-kit       xorg-x11-xtrans-devel
libICE              libXt          libuv          pcre-8.45
libSM               libXxf86vm     libwacom       pkgconf

/mnt/wslg/dumps:

/mnt/wslg/runtime-dir:
dbus-1                      vscode-ipc-07e01cfc-3843-40cc-bc2c-1187f1980295.sock  wayland-0.lock
pulse                       vscode-ipc-86f2bcda-0d0c-4ee4-a46f-bf1cca859a56.sock
vscode-git-53320380ba.sock  wayland-0

```

## おまけ Vitalのインストール
[https://vital.audio/](https://vital.audio/)  

通常のインストール('dpkg -i xxxx')で
インストールできなかったので  
以下の手順でインストールする：  　　

```bash
cd ~/Downloads
ar -x VitalInstaller.deb
tar -zxvf data.tar.gz
sudo cp -a usr /
rm -r usr 
which Vital
/usr/bin/Vital
#実行
Vital
```

## おまけ 'Surge XT'のインストール
[https://surge-synthesizer.github.io/downloads](https://surge-synthesizer.github.io/downloads)  

通常のインストール('dpkg -i xxxx')で
インストールできなかったので  
以下の手順でインストールする：　　

```bash
cd ~/Downloads
ar -x surge-xt-linux-x64-1.1.2.deb
xz -dc data.tar.xz | tar xfv -
sudo cp -a usr /
rm -r usr
which 'Surge XT'
/usr/bin/Surge XT
#実行
'Surge XT'
```
実行後、画面の右下にあるメニューで  
[Menu]/[Workflow]/[Show Virtual Keyboard]を  
選ぶと下に鍵盤が出るので、それをクリックして音を出す。

## 参考情報 
WSLg関連；  
[WSLgアーキテクチャ](https://opcdiary.net/wslg%E3%82%A2%E3%83%BC%E3%82%AD%E3%83%86%E3%82%AF%E3%83%81%E3%83%A3/)  
[WSLg Architecture(原文)](https://devblogs.microsoft.com/commandline/wslg-architecture/)  
[WSLG/X11 and WayLand Applications in WSL](https://lpc.events/event/9/contributions/611/attachments/702/1298/XDC2020_-_X11_and_Wayland_applications_in_WSL.pdf)  
[WSL2上のコンテナからWSLgを使用する](https://zenn.dev/holliy/articles/51012ef059aa9f)  
[音が鳴らない（ALSAのエラーが出る）場合、PulseAudioの明示的インストールと環境変数設定をする](https://zenn.dev/cat2151/scraps/53076d45431d49)  


WSL2関連：  
[Linux 用 Windows サブシステムで Linux GUI アプリを実行する](https://learn.microsoft.com/ja-jp/windows/wsl/tutorials/gui-apps)  
[Windows10のWSL（WSLg）でGUIアプリが動くようになった](https://qiita.com/y-tsutsu/items/6bc65c0ce4d20a82a417)  
[Windows WSL2に外部から直接アクセスするための設定](https://rcmdnk.com/blog/2021/03/01/computer-windows-network/)  
[【メモ】WSL2上のsshサーバに外部から接続する](https://tkyonezu.com/windows10/%E3%80%90%E3%83%A1%E3%83%A2%E3%80%91wsl2%E4%B8%8A%E3%81%AEssh%E3%82%B5%E3%83%BC%E3%83%90%E3%81%AB%E5%A4%96%E9%83%A8%E3%81%8B%E3%82%89%E6%8E%A5%E7%B6%9A%E3%81%99%E3%82%8B/)  
[「Windows Subsystem for Linux」が「systemd」に対応へ](https://forest.watch.impress.co.jp/docs/news/1441775.html)  
[ここが変だよ「WSL2」- 自作ディストロ開発で発見した知られざる“バグ”と“事実”](https://logmi.jp/tech/articles/326106)  
[[WSL] ubuntu-wsl - WSL上のUbuntuをもっと便利するメタパッケージ](http://upgrade-windows10.blogspot.com/2020/03/ubuntu-wsl-wslubuntu.html) 

openFrameworks関連：  
[UbuntuでopenFrameworksの開発環境を構築する。](https://qiita.com/nnn112358/items/b6834379e2eeeeae6793)  

TouchOSC関連：  
[TouchOSCMk1](https://hexler.net/touchosc-mk1#get)  
昔からあるTouchOSCで「MK1」付きに改名している  
[Open Sound Control](https://ja.wikipedia.org/wiki/OpenSound_Control)  
[iPhone でスクリーンショットを撮る](https://support.apple.com/ja-jp/HT200289)  

以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  

