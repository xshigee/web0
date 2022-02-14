  
2022/1/1  
初版

M5CAMERA CameraWebServer  
# M5CAMERA CameraWebServer       

## 概要
「[M5Camera](https://www.switch-science.com/catalog/5207/)」でCameraWebServerを動かす。  
Arduinoのスケッチとしては、提供されているサンプルそのものものになるが、パッチが必要なので、それについて説明する。  
また、ビルド環境としては、platformioを使用する。  

## ソース入手
以下の手順でソースを入手する：
```
cd ~/Downloads
git clone https://github.com/espressif/arduino-esp32.git

# platformioの環境に入る
mkdir CameraWebSerVer
cd CameraWebSerVer
mkdir src
cd src
cp ~/Downloads/arduino-esp32/libraries/ESP32/examples/Camera/CameraWebServer/*.* src/

cd ..
# platformioのビルドに必要な設定ファイルを入手する
wget https://raw.githubusercontent.com/espressif/arduino-esp32/master/tools/partitions/huge_app.csv

gedit platformio.ini
# 次節のplatformio.iniの内容を作成する：

```

## パッチ

src/CameraWebServer.ino
```c++

#10行あたりを以下のように変更する：
// Select camera model
//#define CAMERA_MODEL_WROVER_KIT // Has PSRAM
//#define CAMERA_MODEL_ESP_EYE // Has PSRAM
#define CAMERA_MODEL_M5STACK_PSRAM // Has PSRAM

#23行あたりを自分のWiFi環境に合わせて変更する：
const char* ssid = "*********";
const char* password = "*********";
```

src/camera_pins.h
```c++

#44行あたりを以下のように変更する：
#define SIOD_GPIO_NUM     22 //25

#55行あたりを以下のように変更する：
#define VSYNC_GPIO_NUM    25 //22
```


## platformio.ini

M5Camera用
```

[env:esp-wrover-kit]
platform = espressif32
board = esp-wrover-kit
framework = arduino
upload_speed = 921600
monitor_speed = 115200
board_build.partitions = huge_app.csv
board_build.f_flash= 80000000L
board_build.flash_mode = qio

build_flags = 
    -DM5CAMERA
    -DBOARD_HAS_PSRAM
    -mfix-esp32-psram-cache-issue

lib_deps = 
    m5stack/Timer-CAM@^0.0.1

lib_ldf_mode = deep+

```

## 動作
シリアル出力にCameraWebServerのIPアドレスが出力されるので、そのIPアドレスでWebブラウザーからアクセスする。

## 参考情報
terminal関連:  
[Bootterm – a developer-friendly serial terminal program](https://www.cnx-software.com/2020/12/14/bootterm-a-developer-friendly-serial-terminal-program/)  


M5Camera関連：  
[M5Cameraのサンプルコードを実行してみる(w/ M5Camera datasheet)](https://mag.switch-science.com/2018/12/21/m5camera-test/)  
[ESP32 Camera Demo](https://github.com/m5stack/esp32-cam-demo/tree/m5cam-psram)    
[M5Stack社のカメラの選び方(2021年1月)](https://lang-ship.com/blog/work/m5stack-camera-2021/)    
[M5Cameraの使い方](https://sample.msr-r.net/category/micon/m5camera/m5camera-overview/)  
[M5Camera をレビューしてみた。分解したり、Arduino IDE でスマホに映したりする実験](https://www.mgo-tec.com/blog-entry-m5camera-arduino.html)  
[M5Camera のHTTP stream を 動画としてキャプチャ](http://ssj.siosalt.tokyo/?p=236)  


platformio関連：  
[Support ESP32 Wrover Module?](https://community.platformio.org/t/support-esp32-wrover-module/17717/7)    
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
