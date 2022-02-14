
2022/1/6  
platformio.iniのライブラリの表現を  
バージョン付きのものに変更した。  

2022/1/1  
初版

WebRadio for M5Core2  
# WebRadio for M5Core2     

## 概要
WebRadio「[M5Stack-Core2-MediaPlayer](https://github.com/bwbguard/M5Stack-Core2-MediaPlayer)」を動かす。  
Arduinoのスケッチになっているが、platformioでビルドする。  
ターゲットは、M5Core2になっている。  
直接関係ない話だが、同じスケッチが、なぜかArduino-IDEではエラーになりコンパイルできなかった。   
(なにかしらの環境の問題のようだ)  

## プロジェクト作成
以下の手順でplatformioのプロジェクトを作成する：

```bash

# platformio環境に入る
mkdir Core2_Media_Player
cd Core2_Media_Player
mkdir sc
cd src
#　ソースをダウンロードする
wget https://raw.githubusercontent.com/bwbguard/M5Stack-Core2-MediaPlayer/main/Core2_Media_Player.ino

cd ..
# platformioの設定ファイルをダウンロードする
wget https://raw.githubusercontent.com/espressif/arduino-esp32/master/tools/partitions/default_16MB.csv

gedit platormio.ini
# 次節のplatformio.iniの内容を作成する

```

## パッチ
ソースを以下のように変更する。

src/Core2_Media_Player.ino
```c++

#40行あたりを自分のWiFi環境に合わせて変更する：
const char *SSID = "ENTER_SSID_HERE";
const char *PASSWORD = "ENTER_WIFI_PASSWORD_HERE";
```

## platformio.ini
M5Core2用
```

[env:m5core2]
platform = espressif32
board = m5stack-core2
framework = arduino
upload_speed = 2000000
monitor_speed = 115200
board_build.partitions = default_16MB.csv

build_flags = 
    -DM5C2
    -DCORE_DEBUG_LEVEL=4
    -DBOARD_HAS_PSRAM
    -mfix-esp32-psram-cache-issue

lib_deps =
    https://github.com/m5stack/M5Core2.git
    https://github.com/FastLED/FastLED
    ;https://github.com/m5stack/M5Core2/blob/master/examples/core2_for_aws/ArduinoECCX08.zip
    lovyan03/LovyanGFX
    adafruit/Adafruit BMP280 Library @ ^2.5.0
    adafruit/Adafruit Unified Sensor @ ^1.1.4    
    m5stack/UNIT_ENV @ ^0.0.2 
    ;https://github.com/earlephilhower/ESP8266Audio.git
    earlephilhower/ESP8266Audio@^1.9.5

lib_ldf_mode = deep+

```

## 動作
起動するとWiFiでネットワークに接続し、設定されているURLのインターネットラジオが動作する。  
タッチボタンは左から[Vulume],[Station],[Mute]になっている。  

## 参考情報
terminal関連:  
[Bootterm – a developer-friendly serial terminal program](https://www.cnx-software.com/2020/12/14/bootterm-a-developer-friendly-serial-terminal-program/)  

ESP8266Audio関連：  
[ESP8266Audio - supports ESP8266 & ESP32 & Raspberry Pi RP2040](https://github.com/earlephilhower/ESP8266Audio)  
[M5Stack-Core2-MediaPlayer](https://github.com/bwbguard/M5Stack-Core2-MediaPlayer)  
[Arduino Web Radio Player(M5StickC)](https://www.hackster.io/tommyho/arduino-web-radio-player-c4cb23)  

M5Atom関連：    
[M5Atomの細かい仕様](https://raspberrypi.mongonta.com/spec-of-m5atom-matrix-lite/)   
[Grove端子(HY2.0-4P、PH2.0-4P)について調べてみた](https://lang-ship.com/blog/work/grove-hy20-4p/)  

M5StickC/Plus関連：  
[M5StickCのIOについて調べてみた](https://lang-ship.com/blog/work/m5stickc-io/)  
[Arduino(M5StickC)でefont Unicodeフォント表示 完結編](https://lang-ship.com/blog/work/arduino-m5stickc-efont-unicode/)  

M5Core2関連：  
[M5Stack Core2を使ってみました。](https://raspberrypi.mongonta.com/m5stack-core2-review/)  

platformio関連：  
[arduinoフレームワーク用platformio.ini集](https://beta-notes.way-nifty.com/blog/2021/02/post-2b331d.html)  
[Building Core2 FactoryDemo in PlatformIO](https://community.m5stack.com/topic/2697/building-core2-factorydemo-in-platformio)  
[VSCodeとPlatformIOでM5Stack Core2開発](https://qiita.com/desertfox_i/items/a6ff7deaa0a0b3802bcd)  
[M5Stack Core2とVSCode + PlatformIOとでM5Stackプログラミングを始めてみた。](https://ak1211.com/7701/)  

Arduino-IDE関連：  
[Arduino IDE environment - M5Paper](https://docs.m5stack.com/en/quick_start/m5paper/arduino)  
[Arduino IDEのインストールと設定 (Windows, Mac, Linux対応)](https://www.indoorcorgielec.com/resources/arduinoide%E8%A8%AD%E5%AE%9A/arduino-ide%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%A8%E8%A8%AD%E5%AE%9A/)  

M5Stackファミリ関連：   
[M5Core2 Arduino Install](https://beta-notes.way-nifty.com/blog/2021/12/post-adcff4.html)  
[M5Paper Arduino Install](https://beta-notes.way-nifty.com/blog/2021/12/post-273e9a.html)    
[M5CoreInk Arduino Install](https://beta-notes.way-nifty.com/blog/2021/12/post-2fe738.html)  
[M5Stamp-PICO Arduino Install](https://beta-notes.way-nifty.com/blog/2021/12/post-116fc0.html)    
[M5Stamp-C3 Arduino Install](https://beta-notes.way-nifty.com/blog/2021/12/post-9db4dc.html)  
[Wio-Terminal/ESP8622/ESP32ボードを共通のスケッチで動かす(NTP-CLIENT編)](https://beta-notes.way-nifty.com/blog/2020/08/post-3484c0.html)  
[Wio-Terminal/M5Atom/ESP8622/ESP32ボードを共通のスケッチで動かす(v2)(STARWARS編)](https://beta-notes.way-nifty.com/blog/2020/12/post-9f7237.html)  
[Wio-Terminal/M5Atom/ESP8622/ESP32ボードを共通のスケッチで動かす(v2)(MQTT編)](https://beta-notes.way-nifty.com/blog/2020/12/post-c05b04.html)  
[Wio-Terminal/M5Atom/ESP8622/ESP32ボードを共通のスケッチで動かす(v2)(REST-API編)](https://beta-notes.way-nifty.com/blog/2020/12/post-10d0e0.html)  
[Wio-Terminal/M5Atom/ESP8622/ESP32ボードを共通のスケッチで動かす(v2)(OSC編)](https://beta-notes.way-nifty.com/blog/2020/12/post-9b7930.html)  


以上
