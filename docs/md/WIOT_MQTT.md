  
2022/1/20  
初版

Wio-Terminal MQTT  
# Wio-Terminal MQTT     

## 概要
Wio-TerminalでMQTTを動かす。    
「[MQTT on Wio Terminal](https://www.hackster.io/Salmanfarisvp/mqtt-on-wio-terminal-4ea8f8)」の記事のコードを利用して、Wio-TerminalでMQTTを動かす。  
ビルド環境としては、platformioを使用する。  
ここでは、Wio-TerminalをPublisher(送信側)、PCやiPhoneをSubscriber(受信側)にする。  

## Publisher(送信側)
当該の「[MQTT on Wio Terminal](https://www.hackster.io/Salmanfarisvp/mqtt-on-wio-terminal-4ea8f8)」の記事のコードにある[ボタン]でコードをコピーまたはダウンロードして
platformioのプロジェクト(ディレクトリ)のsrc配下に置く。  
\# ダウンロードしたものは、ファイルタイプが「.c」になっているので、「.ino」にする。  

src配下に置いたコードに以下のパッチを当てる：  

src/WioTerminal_MQTT_Example.ino  
```c++

#6行目付近を以下のように変更する。(新しいファームを使用する)
//#include <AtWiFi.h>  //  old firmware
#include <rpcWiFi.h>

#22行目付近を自分のWiFi環境に合わせて変更する。
// Update these with values suitable for your network.
const char* ssid = "***"; // WiFi Name
const char* password = "***";  // WiFi Password
const char* mqtt_server = "broker.mqtt-dashboard.com";  // MQTT Broker URL

```

plaformio.iniは以下のものにする：
platformio.ini
```

; PlatformIO Project Configuration File
;
;   Build options: build flags, source filter
;   Upload options: custom upload port, speed and extra flags
;   Library options: dependencies, extra library storages
;   Advanced options: extra scripting
;
; Please visit documentation for the other options and examples
; https://docs.platformio.org/page/projectconf.html

[env:seeed_wio_terminal]
platform = atmelsam
board = seeed_wio_terminal
framework = arduino
build_flags = -DWIO_TERMINAL
upload_protocol = sam-ba
monitor_speed = 115200
lib_ldf_mode = deep+

lib_deps = 
    https://github.com/Seeed-Studio/Seeed_Arduino_mbedtls/archive/dev.zip
    https://github.com/Seeed-Studio/Seeed_Arduino_rpcUnified/archive/master.zip
    https://github.com/Seeed-Studio/Seeed_Arduino_rpcBLE/archive/master.zip
    https://github.com/Seeed-Studio/Seeed_Arduino_rpcWiFi/archive/master.zip
    https://github.com/Seeed-Studio/Seeed_Arduino_FreeRTOS/archive/master.zip
    https://github.com/Seeed-Studio/Seeed_Arduino_FS/archive/master.zip
    https://github.com/Seeed-Studio/Seeed_Arduino_SFUD/archive/master.zip
    #
    https://github.com/Seeed-Studio/Seeed_Arduino_LCD/archive/master.zip
    #
    arduino-libraries/NTPClient@^3.1.0
    #
    powerbroker2/SafeString@^4.1.14
    seeed-studio/Seeed Arduino RTC@^2.0.0
    #
    lovyan03/LovyanGFX@^0.4.10
    https://github.com/tanakamasayuki/efont.git
    https://github.com/Tamakichi/Arduino-misakiUTF16.git
    #
    adafruit/Adafruit Unified Sensor@^1.1.4
    adafruit/Adafruit BME280 Library@^2.2.2
    adafruit/Adafruit DPS310@^1.1.1
    adafruit/RTClib@^2.0.2
    ;neironx/RTCLib@^1.6.0
    ;wemos/WEMOS SHT3x@^1.0.0
    https://github.com/Seeed-Studio/Grove_SHT31_Temp_Humi_Sensor.git
    #
    knolleary/PubSubClient@^2.8

```

以下のコマンドラインでビルドと書き込みを行う：
```bash

pio run -t upload

#通信ソフトを起動する
bt -L 1
```

USBシリアルからは、publishしているメッセージが表示される。


## Subscriber(受信側)
Subscriberとしては、Andoroid,iPhone,PCが使用できるが、ここでは、PCとiPhoneを取り上げる：  

PCの場合：  
以下のurlにwebブラウザーでアクセスする。  
http://www.hivemq.com/demos/websocket-client/  
websocket client  
  
[Connect]をクリックして、broker-serverに接続して
Subscriptionsの[Add New Topic Subuscription]をクリックして
Wio-TerminalのPublisherで使用しているTopicの「WTout」を入力して
Subscribeする。  
そうすると、Wio-Terminalからのメッセージが表示される。
以下、表示例：  

```

Messages

    2022-01-20 09:02:49
    Topic: WTout
    Qos: 0
    Wio Terminal #6241
    2022-01-20 09:02:47
    Topic: WTout
    Qos: 0
    Wio Terminal #6240
    2022-01-20 09:02:45
    Topic: WTout
    Qos: 0
    Wio Terminal #6239
    2022-01-20 09:02:42
    Topic: WTout
    Qos: 0
    Wio Terminal #6238
　　...
```

iPhoneの場合：  
アプリとしてMQTTtoolかEasyMQTTをインストールして
以下の情報を設定する：  

MQTTtool設定情報：  
```

HOST broker.mqtt-dashboard.com
Port 1883
Client ID アプリ側で自動設定されるので特に入力は無い
Username/Passwaordは不要。
SubscribeのTopicは「WTout」を設定する。
```

EasyMQTT設定情報：  
```

HOST broker.mqtt-dashboard.com
Port 1883
Client ID Wio Terminal MQTT
Username/Passwaordは不要。
SubscribeのTopicは「WTout」を設定する。
```

## broker-serverの設定情報
MQTT connection settings
```
Connection Name: Public MQTT Broker
Client ID: Wio Terminal MQTT(任意)
Broker Web/IP address: broker.mqtt-dashboard.com
TCP Port: 1883
Websocket Port: 8000

```

以下をアクセスするとMQTTのアクセス状況が表示される：   
http://broker.mqtt-dashboard.com/  
HIVEMQ MQTT Dashboard  


## 参考情報
terminal関連:  
[Bootterm – a developer-friendly serial terminal program](https://www.cnx-software.com/2020/12/14/bootterm-a-developer-friendly-serial-terminal-program/)  

Wio-Terminal関連：   
[wio-terminal firmware update(v2) (linux)](https://beta-notes.way-nifty.com/blog/2020/12/post-5475cb.html)  
[nixieクロックにＮＴＰクライアントの機能を追加する(v2,rpcファーム対応)](https://beta-notes.way-nifty.com/blog/2020/12/post-04d322.html)  

MQTT関連：  
[Wio-Terminal/M5Atom/ESP8622/ESP32ボードを共通のスケッチで動かす(v2)(MQTT編)](https://beta-notes.way-nifty.com/blog/2020/12/post-c05b04.html)  
[10 Free Public MQTT Brokers(Private & Public)](https://mntolia.com/10-free-public-private-mqtt-brokers-for-testing-prototyping/)  

platformio関連：  
[arduinoフレームワーク用platformio.ini集](https://beta-notes.way-nifty.com/blog/2021/02/post-2b331d.html)  
[Wio-Terminal/M5Atom/ESP8622/ESP32ボードを共通のスケッチで動かす(v2)(STARWARS編)](https://beta-notes.way-nifty.com/blog/2020/12/post-9f7237.html)  
[Wio-Terminal/M5Atom/ESP8622/ESP32ボードを共通のスケッチで動かす(v2)(MQTT編)](https://beta-notes.way-nifty.com/blog/2020/12/post-c05b04.html)  
[Wio-Terminal/M5Atom/ESP8622/ESP32ボードを共通のスケッチで動かす(v2)(REST-API編)](https://beta-notes.way-nifty.com/blog/2020/12/post-10d0e0.html)  
[Wio-Terminal/M5Atom/ESP8622/ESP32ボードを共通のスケッチで動かす(v2)(OSC編)](https://beta-notes.way-nifty.com/blog/2020/12/post-9b7930.html)  
[Building Core2 FactoryDemo in PlatformIO](https://community.m5stack.com/topic/2697/building-core2-factorydemo-in-platformio)  
[VSCodeとPlatformIOでM5Stack Core2開発](https://qiita.com/desertfox_i/items/a6ff7deaa0a0b3802bcd)  
[M5Stack Core2とVSCode + PlatformIOとでM5Stackプログラミングを始めてみた。](https://ak1211.com/7701/)  
[Arduino勉強会/37-RaspberryPi Picoをはじめよう - デバッガー](http://www.pwv.co.jp/~take/TakeWiki/index.php?Arduino%E5%8B%89%E5%BC%B7%E4%BC%9A%2F37-RaspberryPi%20Pico%E3%82%92%E3%81%AF%E3%81%98%E3%82%81%E3%82%88%E3%81%86)  

Arduino-IDE関連：  
[Raspberry Pi PicoでI2C/SPI通信](https://garchiving.com/i2c-spi-communication-with-pico/)  
[Arduino IDE environment - M5Paper](https://docs.m5stack.com/en/quick_start/m5paper/arduino)  
[Arduino IDEのインストールと設定 (Windows, Mac, Linux対応)](https://www.indoorcorgielec.com/resources/arduinoide%E8%A8%AD%E5%AE%9A/arduino-ide%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%A8%E8%A8%AD%E5%AE%9A/)  


以上
