
2023/8/6  
初版  

# LininoOneをplatformioで動かす

## 概要
ディスコンして叩き売りしていたLininoOneを入手した。   
ディスコンしているので最新の情報は収集しにくいが
以下を出発点として情報を収集する：

[Linino Oneをはじめよう！](https://qiita.com/okhiroyuki/items/9c024c6db93a639ee788)  

platformioの使い方は既に知っている前提でplatformio.iniを中心に説明する。
WiFiルーター部分の設定については上のURLを参照のこと。


## platformio.ini

以下のplatformio.iniを使用する：
```

[env:one]
platform = atmelavr
board = one
framework = arduino
monitor_speed = 115200
lib_ldf_mode = deep+

lib_deps =
  arduino-libraries/Bridge@^1.7.0

```

## ssh
WiFiルーター部分はssh(ユーザーID:root)で接続できるが、ファームウェアが古く？接続時にエラーになる。その解決のために、.ssh/configに以下の内容を設定してssh接続する。

.ssh/config
```
Host 192.168.*.*
    KexAlgorithms +diffie-hellman-group1-sha1,diffie-hellman-group14-sha1
    HostkeyAlgorithms +ssh-rsa,ssh-dss
    PubkeyAcceptedAlgorithms +ssh-rsa,ssh-dss
```

設定上、mDNS(linino.local)でのアクセスではなく、IPアドレスでのアクセスが必須となる。

実際のIPアドレスの確認には、pingを利用する：  
```
ping linino.local

```


## 参考情報  
linino関連：  
lininoのサイトが閉鎖しているのでファームウェアアップデートなどができなくなっているが参考のための以下のurlを挙げる：

[Linino ONE--在庫限り](https://www.switch-science.com/products/2152)  
[Arduino YUN　のファームウェアを更新する](https://fight-tsk.blogspot.com/2015/05/arduino-yun.html)  
[Linino ONEでREST APIが使えない問題の解決方法](https://trac.switch-science.com/wiki/linino_one_restapi)  

SSH関連：  
[OpenSSH Legacy Options](https://www.openssh.com/legacy.html)  

AtomS3関連：  
[AtomS3](https://docs.m5stack.com/en/core/AtomS3)
[AtomS3の使い方、端子配列、開発環境、サンプルプログラムで詳しく紹介](https://logikara.blog/atoms3/)  
[M5 AtomS3 (M5Stack製) 用 Arduino サンプル・プログラム](https://bokunimo.net/blog/esp/3464/)  
[M5Stackを使ってみる (MicroPython編)](https://itoi.jp/MicroPython.html#Build)  

Pico_W関連：  
[Raspberry Pi Pico W で Httpサーバ(microdot)とセンサーによるHTTPリクエスト機能を同時に稼働させる](https://tech.torico-corp.com/blog/raspberry-pi-pico-w-microdot-http-server-and-request-async-await/)  
[MicroPython - Pico W](https://micropython.org/download/rp2-pico-w/)  
[Microdot “The impossibly small web framework for Python and MicroPython”](https://microdot.readthedocs.io/en/latest/)  
[Getting Started with Raspberry Pi Pico W using MicroPython](https://how2electronics.com/getting-started-with-raspberry-pi-pico-w-using-micropython/)  

XIAO_ESP32C3関連：  
[Getting Started with Seeed Studio XIAO ESP32C3](https://wiki.seeedstudio.com/XIAO_ESP32C3_Getting_Started/)  
[Seeed Studio XIAO ESP32C3でMicroPython](https://lab.seeed.co.jp/entry/2023/02/20/120000)  
[Seeed Studio XIAO ESP32C3のI/O割り付けに注意](https://lab.seeed.co.jp/entry/2023/04/03/120000)  

M5Stack関連：  
・[PlatformIO M5Stack開発の現状](https://qiita.com/wararyo/items/fc3b90f72a18b24cf456)   
・https://github.com/m5stack/M5StickC-Plus.git  
・https://github.com/m5stack/M5StickC.git   
・https://github.com/m5stack/M5Stack.git   

micro:bit関連：  
・[micro:bit Arduino/MBED開発ツール(v2)(micro:bit-v2対応,linux版)](https://beta-notes.way-nifty.com/blog/2021/01/post-e6d91a.html)   
・[micro:bit v2 で遊ぶ](https://qiita.com/sat0ken/items/13bd03378c28b98a794e)   

platformio関連：
・[platformio.ini for arduino](https://xshigee.github.io/web0/md/platformio_iini_arduino_md.html)  
・[PlatformIO Core (CLI)](https://docs.platformio.org/en/latest/core/index.html)  
・[Arduino-IDEとPlatformioのコンパイラーの挙動の違いについて](https://beta-notes.way-nifty.com/blog/2020/07/post-fbe8f7.html)   
・creating_board:  
```
https://docs.platformio.org/en/latest/platforms/creating_board.html

Installation
1.Create boards directory in core_dir if it doesn’t exist.
2.Create myboard.json file in this boards directory.
3.Search available boards via pio boards command. You should see myboard board.
```


以上
