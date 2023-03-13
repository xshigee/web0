    
# WSL2にdockerをインストールする  

2023/3/12+        
初版    
  
## 概要    
本記事は「[WSL2でOSC受信する](https://xshigee.github.io/web0/md/WSL2_OSC_Receive.html)」の続編にあたり、  
WSL2関連は設定は同じなので省略して、dockerのインストールについて記載する。

## systemdを有効にする
WSL2のlinuxで以下を実行する：  
```bash

sudo nano /etc/wsl.conf

#以下の内容に編集する
[boot]
systemd=true

```
設定を有効にするために  
PowerShellで以下を実行してWSL2を再起動する。
```
wsl --shutdown
```

以下のコマンドで、  
PID=1 が systemd であれば   
正常に動作していることになる：

```bash

ps -e

PID TTY         TIME CMD
  1 ?        00:00:01 systemd
  2 ?        00:00:00 init-systemd(Ub
  5 ?        00:00:00 init
＜省略＞

```


## インストール手順
WSL2のlinuxで以下を実行する：  
```bash

sudo apt update
sudo apt upgrade -y
sudo apt install -y docker.io
sudo apt install -y cgroupfs-mount

# Dockerを起動する
sudo cgroupfs-mount
sudo service docker start

# バージョン確認
sudo docker version
Client:
 Version:           20.10.21
 API version:       1.41
 Go version:        go1.18.1
 Git commit:        20.10.21-0ubuntu1~22.04.2
 Built:             Thu Mar  2 18:26:04 2023
 OS/Arch:           linux/amd64
 Context:           default
 Experimental:      true

Server:
 Engine:
  Version:          20.10.21
  API version:      1.41 (minimum version 1.12)
  Go version:       go1.18.1
  Git commit:       20.10.21-0ubuntu1~22.04.2
  Built:            Wed Feb 15 15:26:57 2023
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.6.12-0ubuntu1~22.04.1
  GitCommit:        
 runc:
  Version:          1.1.4-0ubuntu1~22.04.1
  GitCommit:        
 docker-init:
  Version:          0.19.0
  GitCommit:

# 動作確認
sudo docker run --rm hello-world

#以下のメッセージが表示されればOKとなる。
#(実際には他のメッセージも表示される)
Hello from Docker!
This message shows that your installation appears to be working correctly.
#以下、省略

# Webサーバーが起動するようにnginxコンテナをpull/起動する
sudo docker run --name hogehoge -d -p 8080:80 nginx
```
Webサーバーの動作確認は、WSL2の設定として、localhostを無効にしているので  
PCの外から見えるIPアドレスでアクセスする必要がある。  

PowerShellの以下のコマンドで外から見えるIPアドレスを確認する：  
```PowerShell

ipconfig
```
例として、このIPアドレスが"192.168.0.8"の場合   
http://192.168.0.8:8080/   
にwindows側のwebブラウザーでアクセスする。

Webブラウザー画面に「Welcome to ngnix!」と表示されればOKとなる。


## おまけ nanoで日本語が文字化けしている場合の解消方法
日本語の設定が不十分の場合、文字化けするようなので  
WSL2のlinuxで以下を実行する： 
```bash

sudo apt install language-pack-ja

#設定の確認
locale -a
C
C.utf8
POSIX
ja_JP.utf8

```

## 参考情報 
docker関連：  
[Use docker containers without Docker Desktop in WSL2 with Ubuntu](https://avenir.ro/use-docker-containers-without-docker-desktop-in-wsl2-with-ubuntu/)  
[Windows Subsystem for Linux(WSL)で Docker を利用する](https://simplestar-tech.hatenablog.com/entry/2019/10/14/101551)  

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

