    
# RaspberryPiをVolumioをインストールする  

2023/10/1  
初版    
  
## 概要
RaspberryPiを以下のVolumioをインストールする。
これは、headlessの音楽プレーヤーで、webブラウザーで volumioのhttpサーバーにアクセスすることで操作画面を実現している。  

PCが起動していない場合でも、スマフォのアプリ(iPhone/Android用)「volumio」で、PCのwebブラウザーと同様のことを実現しているので、それを利用するとPC不要でスマフォがリモコンになった家電感覚で使用できる。  

また、shairport-syncを内蔵しているのAirPlay_Receiver(server)として、 iPhoneなどからオーディオデータをWiFi経由で受信してRaspberryPiのオーディオ出力で再生できる。  

なお、本記事は「[Headless_RaspberryPiをVolumioをインストールする](https://beta-notes.way-nifty.com/blog/2020/11/post-11c7cc.html)」のVolumio最新版に対応したものにあたる。 

## インストール方法
volumioは、すでに動いているOSに何かをインストールする形ではなく専用SDを作り、それをRaspberryPiに入れて、起動することで volumioが動く。

専用SDの作成には「Raspberry PI Imager」を使用して、OSの選択肢と[Volumio]を選び(USB接続したSDwriterの)SDにVolmioを書き込む。  
\#該当アプリはWindow用、MacOS用、Linux用の３種類がある　　

以下、詳細：  
0. 以下のURLからダウンロートしてImagerをインストールする。
windows用：    
[https://downloads.raspberrypi.org/imager/imager_latest.exe](https://downloads.raspberrypi.org/imager/imager_latest.exe)  
MacOS用：  
[https://downloads.raspberrypi.org/imager/imager_latest.dmg](https://downloads.raspberrypi.org/imager/imager_latest.dmg)  
linux(intel)用:  
[https://downloads.raspberrypi.org/imager/imager_latest_amd64.deb](https://downloads.raspberrypi.org/imager/imager_latest_amd64.deb)  

参照：[Install Raspberry Pi OS using Raspberry Pi Imager](https://www.raspberrypi.com/software/)  

1. インストールしたImagerを起動する。
1. USB接続のUSBwriterを接続する。(OS作成用のSDを入れる)
1. USB接続のUSBwriterのSDをフォーマットする。  
1. OSとして「Volumio」を選択しSDに書き込む。
1. PCからSDを外す。
1. RaspberryPIに該当のSDを入れてブートする。

## 使用ハードウェア
今回のVolmioでは以下のハードを使用する：  

1. [Ｒａｓｐｂｅｒｒｙ　Ｐｉ４　Ｍｏｄｅｌ　Ｂ　８ＧＢ](https://akizukidenshi.com/catalog/g/gM-15359/)  
 RAMは4GB版でも良いと思われるが在庫切れで8GB版にした。
1. [Ｒａｓｐｂｅｒｒｙ　Ｐｉ４　ヒートシンクケース　ファンレス　青](https://akizukidenshi.com/catalog/g/gP-16424/)    
色は言うまでもなく好みの問題。
1. [連結ピンソケット　２×２０（４０Ｐ）　ラズパイ用スタッキングコネクタ](https://akizukidenshi.com/catalog/g/gC-10702/)  
これでゲタをはかさないとケースに干渉する。
1. [Pirate Audio: Headphone Amp for Raspberry Pi](https://shop.pimoroni.com/products/pirate-audio-headphone-amp?variant=31189750480979)  

## 初期設定

簡単に設定できるように有線LANを接続する。
以下のurlをwebブラウザーでアクセスする。
http://volumio.local

すると、設定画面が表示されるので 
画面にしたがって設定する。

ハードに依存している設定は以下のように設定する：　　
```
playback Options
Audio Output:
I2S DAC: ON
DAC Model: HiFiBerry DAC
#今回のPirateAudioは上のDACになるが
#異なるハードの場合、対応しているDACに設定する。

Volume Options
Mixer Type: Software
Default Startup Volume: 10
Max Volume Level: 100
One Click Volume Steps: 1
MPD Client Volume Control: ON
#この設定でスマフォアプリVolmioで
#音量調整ができるようになる。

```
参考：[Volumioのインストールと設定](https://www.openaudiolab.com/settingvolumio/jp/)  

プラグインを使用したいので、無償で良いのでVolumioのアカウント作成する。

## プラグインのインストール
今回、ハードウェアとして使用しているPirateAudioのプラグインがあるのでインストールする。(ボード上のLCDに表示が出るようになる)


メニューのPlugin/Search Plugin/System Hardwareから
[Pirate Audio]を選択してインストールする。



## SSH接続

以下にwebブラウザーでアクセスして
http://volumio.local/dev
SSHの[Enable]をクリックする（無反応だが有効になる）

その状態で以下でSSHでログインする：

ssh volumio@volumio.local

\# パスワードは以下になる：
パスワード：volumio

```
立ち上げメッセージ
                       ___
                      /\_ \                        __
         __  __    ___\//\ \    __  __    ___ ___ /\_\    ___
        /\ \/\ \  / __`\\ \ \  /\ \/\ \ /' __` __`\/\ \  / __`\
        \ \ \_/ |/\ \L\ \\_\ \_\ \ \_\ \/\ \/\ \/\ \ \ \/\ \L\ \
         \ \___/ \ \____//\____\\ \____/\ \_\ \_\ \_\ \_\ \____/
          \/__/   \/___/ \/____/ \/___/  \/_/\/_/\/_/\/_/\/___/

             Free Audiophile Linux Music Player - Version 3.0

          c 2015-2021 Michelangelo Guarise - Volumio Team - Volumio.org

Volumio Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Welcome to Volumio for Raspberry Pi (5.10.92-v7l+ armv7l)

```

参考：
[Headless_RaspberryPiをVolumioをインストールする](https://beta-notes.way-nifty.com/blog/2020/11/post-11c7cc.html) 
[Headless_RaspberryPiでPirateAudioを使用する](https://beta-notes.way-nifty.com/blog/2020/11/post-896215.html)  
[Headless_RaspberryPiをAirPlay_Receiverにする](https://beta-notes.way-nifty.com/blog/2020/11/post-1051ee.html)  
[[Plugin] pirate audio](https://community.volumio.com/t/plugin-pirate-audio/44336)  

[Go to Toplevel](https://xshigee.github.io/web0/)  

