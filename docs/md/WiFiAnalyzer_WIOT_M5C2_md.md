  

2022/1/24  
初版

WiFiAnalyzer for WioT/M5Core2  
# WiFiAnalyzer for WioT/M5Core2      

## 概要
Wio-Terminal用とM5Core2用のWiFiAnallyzerを紹介する。  
Arduinoのスケッチになっているが、platformioでビルドする。  

## Wio-Terminal用
以下の手順でビルト＆書き込みする：

```bash

# platformio環境に入る

mkdir WioWiFiAnalyzer
cd WioWiFiAnalyzer
mkdir src
cd src
#　ソースをダウンロードする
wget https://raw.githubusercontent.com/moononournation/Arduino_GFX/master/examples/WiFiAnalyzer/WioWiFiAnalyzer/WioWiFiAnalyzer.ino

cd ..

gedit platormio.ini
# 次節のplatformio.iniの内容を作成する

```

## platformio.ini(wio-terminal用)

Wio-Terminal用
```

[env:seeed_wio_terminal]
platform = atmelsam
board = seeed_wio_terminal
framework = arduino
;build_flags = -DWIO_TERMINAL
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
    # RTC
    adafruit/RTClib@^2.0.2
    ;powerbroker2/SafeString@^4.1.14
    ;seeed-studio/Seeed Arduino RTC@^2.0.0
    #
    # display libs (* Select Only ONE *)
    ;https://github.com/Seeed-Studio/Seeed_Arduino_LCD/archive/master.zip
    moononournation/GFX Library for Arduino@^1.1.8
    ;lovyan03/LovyanGFX@^0.4.10
    https://github.com/tanakamasayuki/efont.git
    https://github.com/Tamakichi/Arduino-misakiUTF16.git
    #
    # network related
    ;arduino-libraries/NTPClient@^3.1.0
    ;knolleary/PubSubClient@^2.8
    #
    # sensor related
    adafruit/Adafruit Unified Sensor@^1.1.4
    adafruit/Adafruit BME280 Library@^2.2.2
    adafruit/Adafruit DPS310@^1.1.1
    ;wemos/WEMOS SHT3x@^1.0.0
    https://github.com/Seeed-Studio/Grove_SHT31_Temp_Humi_Sensor.git
    #
```
注意：  
display系のライブラリが複数登録されているとビルトでエラーが出なくても正常に実行されない現象があった。  
ヘッダーが異なっているので問題がないと思っていたが、必要なライブラリ以外はコメントアウトする必要がるようだ。  
ダウンロードした(ローカルな)ライブラリをいったんクリアするためには「sudo rm -r .pio」を実行する。  
その後、「pio run -t upload」でビルト＆書き込みを行なう。



## M5Core2用
以下の手順でビルド＆書き込みを行なう：

```bash

# platformio環境に入る

mkdir Core2WiFiAnalyzer
cd Core2WiFiAnalyzer
mkdir src
cd src

#　ソースをダウンロードする
gedit main.ino
以下のurlからソースコードをコピー＆ペーストする：
https://macsbug.wordpress.com/2018/04/30/m5stack-wifianalyzer/
M5STACK WiFiAnalyzer

cd ..
# platformioの設定ファイルをダウンロードする
wget https://raw.githubusercontent.com/espressif/arduino-esp32/master/tools/partitions/default_16MB.csv

gedit platormio.ini
# 次節のplatformio.iniの内容を作成する

```

## パッチ
M5Stack用をM5Core2用に変更するためにソースを以下のように変更する。

src/main.ino
```c++

#9行当たりを以下のように変更する：(M5StackUpdaterは使用しない)
//#include <M5Stack.h>
#include <M5Core2.h>
//#include "M5StackUpdater.h"                          // SD Update

#27行当たりをコメントアウトする：(M5StackUpdaterは使用しない)
//  if(digitalRead(BUTTON_A_PIN) == 0){                // SD Update
//     updateFromFS(SD); ESP.restart();                // SD Update
//  }                                                  // SD Update
 
```

## platformio.ini(M5Core2用)
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
    ;lovyan03/LovyanGFX
    adafruit/Adafruit BMP280 Library @ ^2.5.0
    adafruit/Adafruit Unified Sensor @ ^1.1.4    
    m5stack/UNIT_ENV @ ^0.0.2 
    https://github.com/earlephilhower/ESP8266Audio.git
    ;tobozo/M5Stack-SD-Updater@^1.1.8

lib_ldf_mode = deep+

```

## 参考情報
terminal関連:  
[Bootterm – a developer-friendly serial terminal program](https://www.cnx-software.com/2020/12/14/bootterm-a-developer-friendly-serial-terminal-program/)  

WiFiAnalyzer関連：  
[Dual Band WiFi Analyzer with Wio Terminal](https://www.hackster.io/SeeedStudio/dual-band-wifi-analyzer-with-wio-terminal-a806dd)  
[M5STACK WiFiAnalyzer](https://macsbug.wordpress.com/2018/04/30/m5stack-wifianalyzer/)  

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
