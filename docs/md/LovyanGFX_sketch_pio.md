
2022/1/30  
初版

LovyanGFX sketch build by platformio  
# LovyanGFX sketch build by platformio     

## 概要
「[LovyanGFX - Display (LCD / OLED / EPD) graphics library](https://github.com/lovyan03/LovyanGFX)」ライブラリを使用したスケッチを
platformioでビルドする。  
arduinoのサンプル・スケッチとして提供されているものだが、plaformioビルド環境では、エラーを出てビルドできないことがある。  
それを解決したplatformio.iniを提供する。  
対応ボードは、M5Core2,M5Stack-Fire,Wio-Terminalとなる。  
スケッチのソースは共通で、platformio.iniの内容で、対応ボードを切り替えることになる。  

## arduino_misaki.ino

以下の手順をダウンロード/ビルド/書き込みする：

```

# platformioの環境に入る

# プロジェクト・ディレクトリを作成する
mkdir arduino_misaki
cd arduino_misaki

mkdir src
cd src
wget https://raw.githubusercontent.com/lovyan03/LovyanGFX/master/examples/HowToUse/4_unicode_fonts/arduino_misaki/arduino_misaki.ino

cd ..

# platformioの設定ファイルをダウンロードする(M5Stack系のみ)
wget https://raw.githubusercontent.com/espressif/arduino-esp32/master/tools/partitions/default_16MB.csv

gedit platformio.ini
# 後節にあるplatformio.iniの内容をビルドするボードに応じて作成する

# ビルド＆書き込み
pio run -t upload

```


## efont.ino
以下の手順をダウンロード/ビルド/書き込みする：

```

# platformioの環境に入る

# プロジェクト・ディレクトリを作成する
mkdir efont
cd efont

mkdir src
cd src
wget https://raw.githubusercontent.com/lovyan03/LovyanGFX/master/examples/HowToUse/4_unicode_fonts/efont/efont.ino

cd ..

# platformioの設定ファイルをダウンロードする(M5Stack系のみ)
wget https://raw.githubusercontent.com/espressif/arduino-esp32/master/tools/partitions/default_16MB.csv

gedit platformio.ini
# 後節にあるplatformio.iniの内容をビルドするボードに応じて作成する

# ビルド＆書き込み
pio run -t upload

```

## LongTextScroll.ino
以下の手順をダウンロード/ビルド/書き込みする：

```

# platformioの環境に入る

# プロジェクト・ディレクトリを作成する
mkdir LongTextScroll
cd LongTextScroll

mkdir src
cd src
wget https://raw.githubusercontent.com/lovyan03/LovyanGFX/master/examples/Standard/LongTextScroll/LongTextScroll.ino

cd ..

# platformioの設定ファイルをダウンロードする(M5Stack系のみ)
wget https://raw.githubusercontent.com/espressif/arduino-esp32/master/tools/partitions/default_16MB.csv

gedit platformio.ini
# 後節にあるplatformio.iniの内容をビルドするボードに応じて作成する

# ビルド＆書き込み
pio run -t upload

```


## 5_images.ino
以下の手順をダウンロード/ビルド/書き込みする：


```

# platformioの環境に入る

# プロジェクト・ディレクトリを作成する
mkdir 5_images
cd 5_images

mkdir src
cd src
wget https://raw.githubusercontent.com/lovyan03/LovyanGFX/master/examples/HowToUse/5_images/5_images.ino
wget https://raw.githubusercontent.com/lovyan03/LovyanGFX/master/examples/HowToUse/5_images/image.h

cd ..

# platformioの設定ファイルをダウンロードする(M5Stack系のみ)
wget https://raw.githubusercontent.com/espressif/arduino-esp32/master/tools/partitions/default_16MB.csv

gedit platformio.ini
# 後節にあるplatformio.iniの内容をビルドするボードに応じて作成する

# ビルド＆書き込み
pio run -t upload

```

## ClockSample.ino
以下の手順をダウンロード/ビルド/書き込みする：

```

# platformioの環境に入る

# プロジェクト・ディレクトリを作成する
mkdir ClockSample
cd ClockSample

mkdir src
cd src
wget https://raw.githubusercontent.com/lovyan03/LovyanGFX/master/examples/Sprite/ClockSample/ClockSample.ino

gedit ClockSample.ino
# 以下のようにパッチをかける
修正前：
#define LGFX_USE_V1
#include <LovyanGFX.hpp>
→
修正後：
#define LGFX_AUTODETECT
//#define LGFX_USE_V1
#include <LovyanGFX.hpp>


cd ..

# platformioの設定ファイルをダウンロードする(M5Stack系のみ)
wget https://raw.githubusercontent.com/espressif/arduino-esp32/master/tools/partitions/default_16MB.csv

gedit platformio.ini
# 後節にあるplatformio.iniの内容をビルドするボードに応じて作成する

# ビルド＆書き込み
pio run -t upload

```

## platformio.ini
上のスケッチをビルドするには、ボードに応じて、   
以下のplatformio.iniを使用する：  

M5Core2用：
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
    m5stack/M5Core2@^0.1.0
    ;https://github.com/m5stack/M5Core2.git
    https://github.com/FastLED/FastLED
    ;https://github.com/m5stack/M5Core2/blob/master/examples/core2_for_aws/ArduinoECCX08.zip
    ;tobozo/ESP32-Chimera-Core@^1.4.0
    lovyan03/LovyanGFX@^0.4.13
    https://github.com/tanakamasayuki/efont.git
    https://github.com/Tamakichi/Arduino-misakiUTF16.git
    #
    adafruit/Adafruit BMP280 Library @ ^2.5.0
    adafruit/Adafruit Unified Sensor @ ^1.1.4    
    m5stack/UNIT_ENV @ ^0.0.2 
    https://github.com/earlephilhower/ESP8266Audio.git
    tobozo/M5Stack-SD-Updater@^1.1.8
 
;lib_ldf_mode = deep+
lib_ldf_mode = deep

```
重要：  
通常の設定と異なり「lib_ldf_mode = deep」(末尾に「+」が無い)にしないとビルドエラーになる。

M5Stack-Fire用：
```

[env:m5stack-fire]
platform = espressif32
board = m5stack-fire
framework = arduino
monitor_speed = 115200

upload_speed = 2000000
upload_protocol = esptool
board_build.partitions = default_16MB.csv

build_flags = 
    -DM5STACK_FIRE
    -DCORE_DEBUG_LEVEL=4
    -DBOARD_HAS_PSRAM
    -mfix-esp32-psram-cache-issue

lib_deps =
    m5stack/M5Stack@^0.3.9
    ;tobozo/ESP32-Chimera-Core@^1.4.0
    lovyan03/LovyanGFX@^0.4.13
    https://github.com/tanakamasayuki/efont.git
    https://github.com/Tamakichi/Arduino-misakiUTF16.git
    #
    adafruit/Adafruit BMP280 Library @ ^2.5.0
    adafruit/Adafruit Unified Sensor @ ^1.1.4    
    m5stack/UNIT_ENV @ ^0.0.2 
    https://github.com/earlephilhower/ESP8266Audio.git
    tobozo/M5Stack-SD-Updater@^1.1.8

;lib_ldf_mode = deep+
lib_ldf_mode = deep

```
重要：  
通常の設定と異なり「lib_ldf_mode = deep」(末尾に「+」が無い)にしないとビルドエラーになる。

Wio-Terminal用：
```

[env:seeed_wio_terminal]
platform = atmelsam
board = seeed_wio_terminal
framework = arduino
build_flags = -DWIO_TERMINAL
upload_protocol = sam-ba
monitor_speed = 115200

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
    ;neironx/RTCLib@^1.6.0
    ;powerbroker2/SafeString@^4.1.14
    ;seeed-studio/Seeed Arduino RTC@^2.0.0
    #
    # display libs (* Select Only ONE *)
    ;https://github.com/Seeed-Studio/Seeed_Arduino_LCD/archive/master.zip
    ;moononournation/GFX Library for Arduino@^1.1.8
    lovyan03/LovyanGFX@^0.4.13
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

lib_ldf_mode = deep+

```

## 参照情報
terminal関連:  
[Bootterm – a developer-friendly serial terminal program](https://www.cnx-software.com/2020/12/14/bootterm-a-developer-friendly-serial-terminal-program/)  

LovyanGFX関連：  
[LovyanGFX - Display (LCD / OLED / EPD) graphics library (for ESP32 SPI, I2C, 8bitParallel / ESP8266 SPI, I2C / ATSAMD51 SPI) - M5Stack / M5StickC / TTGO T-Watch / ODROID-GO / ESP-WROVER-KIT / WioTerminal / and more...](https://github.com/lovyan03/LovyanGFX)   
[LovyanGFX LCD Graphics driver](https://macsbug.wordpress.com/2020/07/02/lovyangfx-lcd-graphics-driver/)  

platformio関連：  
[arduinoフレームワーク用platformio.ini集](https://beta-notes.way-nifty.com/blog/2021/02/post-2b331d.html)  
[Building Core2 FactoryDemo in PlatformIO](https://community.m5stack.com/topic/2697/building-core2-factorydemo-in-platformio)  
[VSCodeとPlatformIOでM5Stack Core2開発](https://qiita.com/desertfox_i/items/a6ff7deaa0a0b3802bcd)  
[M5Stack Core2とVSCode + PlatformIOとでM5Stackプログラミングを始めてみた。](https://ak1211.com/7701/)  

Arduino-IDE関連：  
[Arduino IDE environment - M5Paper](https://docs.m5stack.com/en/quick_start/m5paper/arduino)  
[Arduino IDEのインストールと設定 (Windows, Mac, Linux対応)](https://www.indoorcorgielec.com/resources/arduinoide%E8%A8%AD%E5%AE%9A/arduino-ide%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%A8%E8%A8%AD%E5%AE%9A/)  

M5Core2関連：  
[M5Stack Core2を使ってみました。](https://raspberrypi.mongonta.com/m5stack-core2-review/)  

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
