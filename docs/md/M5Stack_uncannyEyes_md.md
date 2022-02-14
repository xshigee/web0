
2022/1/30  
初版

uncannyeyes sketch build by platformio  
# uncannyeyes sketch build by platformio     

## 概要
「[M5Stack Electronic Animated Eyes](https://macsbug.wordpress.com/2019/05/06/m5stack-electronic-animated-eyes/)」、
「[M5StickC Electronic Animated Eyes](https://macsbug.wordpress.com/2019/05/08/m5stickc-electronic-animated-eyes/)」のuncannyeyesスケッチをplatformioでビルドする。  
両目バージョンは、M5Core2/M5Stack-Fireで共通ソース化する。  
片目バージョンは、M5StickC/M5stickCPlusで共通ソース化する。  
platformio.iniの内容で、対応ボードを切り替えることになる。  



## 両目バージョン
M5Stack-Fireは、オリジナルのソースで動作するが、  
M5Core2でも動作するように共通化する。  

以下の手順をダウンロード/ビルド/書き込みする：

```

# platformioの環境に入る

# プロジェクト・ディレクトリを作成する
mkdir M5Stack_uncannyEyes
cd M5Stack_uncannyEyes

wget https://macsbug.files.wordpress.com/2019/05/m5stack_uncannyeyes.zip_-1.pdf
mv m5stack_uncannyeyes.zip_-1.pdf m5stack_uncannyeyes.zip
unzip m5stack_uncannyeyes.zip 
mv M5Stack_uncannyEyes src
cd src
mv screenshotToConsole.ino screenshotToConsole.ino.bu

gedit M5Stack_uncannyEyes.ino 
# M5Core2のために以下のパッチをかける
```
パッチ内容：  
```

#56行目付近：
#include <M5Stack.h>
→
#ifndef M5C2 
#include <M5Stack.h>
#endif
#ifdef M5C2
#include <M5Core2.h>
#endif
-------------------------------------

#88行目付近：
#define WINK_L_PIN     39 // Pin for LEFT eye wink button
#define BLINK_PIN      38 // Pin for blink button (BOTH eyes)
#define WINK_R_PIN     37 // Pin for RIGHT eye wink button
→
#ifndef M5C2
#define WINK_L_PIN     39 // Pin for LEFT eye wink button
#define BLINK_PIN      38 // Pin for blink button (BOTH eyes)
#define WINK_R_PIN     37 // Pin for RIGHT eye wink button
#endif

#ifdef M5C2
// M5Core2
#define WINK_L_PIN     32 // Pin for LEFT eye wink button
#define BLINK_PIN      32 // Pin for blink button (BOTH eyes)
#define WINK_R_PIN     33 // Pin for RIGHT eye wink button
// for eyes enable status
int eyesStatus = 3; // 1:left 2:right 3:both
#endif
-------------------------------------

#122行目：
  M5.Speaker.begin();
→
#ifndef M5C2
  M5.Speaker.begin();
#endif

#129行目付近：
  pinMode(37, INPUT);pinMode(38, INPUT);pinMode(39, INPUT);
→
#ifndef M5C2
  pinMode(37, INPUT);pinMode(38, INPUT);pinMode(39, INPUT);
#endif
#ifdef M5C2
  pinMode(32, INPUT);pinMode(33, INPUT);
#endif
-------------------------------------

#153行目付近：
  if (e == 0){ M5.Lcd.setAddrWindow (  1,0,128,128);} // set left  window
  if (e == 1){ M5.Lcd.setAddrWindow (191,0,128,128);} // set right window
→
#ifndef M5C2
  if (e == 0){ M5.Lcd.setAddrWindow (  1,0,128,128);} // set left  window
  if (e == 1){ M5.Lcd.setAddrWindow (191,0,128,128);} // set right window
#endif
#ifdef M5C2
switch(eyesStatus) {
  case 3: // both
    if (e == 0){ M5.Lcd.setAddrWindow (  1,0,128,128);} // set left  window
    if (e == 1){ M5.Lcd.setAddrWindow (191,0,128,128);} // set right window
    break;
  case 1: // left
    M5.Lcd.fillRect(191,0,128,128,TFT_BLACK); // clear oposite side
    if (e == 0){ M5.Lcd.setAddrWindow (  1,0,128,128);} // set left  window
    break;
  case 2: // right
    M5.Lcd.fillRect(1,0,128,128,TFT_BLACK); // clear oposite side
    if (e == 1){ M5.Lcd.setAddrWindow (191,0,128,128);} // set right window
    break;
  default:
    break;  
};
#endif
-------------------------------------

#423行付近：
//screenshotToConsole();
}
→
//screenshotToConsole();
#ifdef M5C2
//<<============================================
// touch button
  int keyCode = 0;
  
  TouchPoint_t pos = M5.Touch.getPressPoint();
    if (pos.y > 240) {
      // Yが240以上はボタンのエリア
      if (pos.x < 109) {
        keyCode = 1; // Left Button
      } else if (pos.x > 218) {
        keyCode = 3; // Mid Button
      } else if (pos.x >= 109 && pos.x <= 218) {
        keyCode = 2; // Right Button
      }
      if (keyCode != 0) {
        // ボタンを押した場合には75ミリ秒振動モーターを動かす
        M5.Axp.SetLDOEnable(3, true);
        delay(75);
        M5.Axp.SetLDOEnable(3, false);
        //Serial.println(keyCode);  // for Debug
      }
      if (keyCode == 1) eyesStatus = 1; // Left Button
      if (keyCode == 3) eyesStatus = 2; // Mid Button
      if (keyCode == 2) eyesStatus = 3; // Right Button
    }
    //Serial.println(eyesStatus); // for Debug
//>>===========================================
#endif
}
-------------------------------------
```
続き：
```

cd ..

# platformioの設定ファイルをダウンロードする
wget https://raw.githubusercontent.com/espressif/arduino-esp32/master/tools/partitions/default_16MB.csv

gedit platformio.ini
# 後節にあるplatformio.iniの内容をビルドするボードに応じて作成する

# ビルド＆書き込み
pio run -t upload

```

動作説明：  
1.オリジナル版(M5Stack版)  
オリジナルのものは、左ボタン、右ボタンを押すと、それぞれの目を瞑る(消える)。  
中央ボタンを押すと両目を瞑る(消える)。   
2.M5Core2版  
オリジナルと同じ操作性は実装が難しかったので、  
下の３つのタッチボタンで表示モードの切り替えにした。  
左ボタン、右ボタンを押すとそれぞれの片目を表示するモードになり  
中央ボタンは両目を表示するモードになる。  


## 片目バージョン
M5StickCは、オリジナルのソースで動作するが、  
M5StickCPlusでも動作するように共通化する。  

以下の手順をダウンロード/ビルド/書き込みする：  

```

以下のダウンロードurlがあるが、NOT_FOUNDになり使用できない。  
https://macsbug.files.wordpress.com/2019/05/m5stickc_uncannyeyes_left.zip_.pdf  
https://macsbug.files.wordpress.com/2019/05/m5stickc_uncannyeyes_right.zip_.pdf  

そこで両目バージョンのプロジェクトを流用する：
(1)両目バージョンのプロジェクト・ディレクトリをコピーして
　片目バージョンのプロジェクト・ディレクトリ「M5SCx_uncannyEyes」を作成する。
(2)「M5StickC Electronic Animated Eyes」(https://macsbug.wordpress.com/2019/05/08/m5stickc-electronic-animated-eyes/)の末尾のスケッチ・ソースをコピーして、  
プロジェクト・ディレクトリのM5Stack_uncannyEyes.inoの内容を差し替える。  
(3)以下のようにパッチをかける：  
変更前：
#include <M5StickC.h>
→
変更後：
#ifdef M5STICK_C 
#include <M5StickC.h>
#endif
#ifdef M5STICK_CP
#include <M5StickCPlus.h>
#endif

(4)platformio.iniをM5StickC,M5StickCPlus用に差し替える。  
(5)「pio run -t upload」でビルド＆書き込みする。  

```
動作説明：  
正面の[M5]ボタンを押すと目を瞑る(消える)  

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
    https://github.com/m5stack/M5Core2.git
    https://github.com/FastLED/FastLED
    ;https://github.com/m5stack/M5Core2/blob/master/examples/core2_for_aws/ArduinoECCX08.zip
    ;lovyan03/LovyanGFX
    adafruit/Adafruit BMP280 Library @ ^2.5.0
    adafruit/Adafruit Unified Sensor @ ^1.1.4    
    m5stack/UNIT_ENV @ ^0.0.2 
    https://github.com/earlephilhower/ESP8266Audio.git
    tobozo/M5Stack-SD-Updater@^1.1.8

lib_ldf_mode = deep+

```

M5Stack-Fire用：
```

[env:m5stack-fire]
platform = espressif32
board = m5stack-fire
framework = arduino
monitor_speed = 115200
lib_ldf_mode = deep+

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
    ;lovyan03/LovyanGFX
    adafruit/Adafruit BMP280 Library @ ^2.5.0
    adafruit/Adafruit Unified Sensor @ ^1.1.4    
    m5stack/UNIT_ENV @ ^0.0.2 
    https://github.com/earlephilhower/ESP8266Audio.git
    tobozo/M5Stack-SD-Updater@^1.1.8

```

M5StickC用：
```

[env:M5StickC]
platform = espressif32
board = m5stick-c
framework = arduino
build_flags = -DM5STICK_C
monitor_speed = 115200
lib_ldf_mode = deep+

lib_deps =
    m5stack/M5StickC@^0.2.5
    ;m5stack/M5StickCPlus @ ^0.0.5
    tinyu-zhao/FFT @ ^0.0.1
    ;https://github.com/earlephilhower/ESP8266Audio.git
    earlephilhower/ESP8266Audio@^1.9.5
 
```

M5StickCPlus用：
```

[env:M5StickCPlus]
platform = espressif32
board = m5stick-c
framework = arduino
build_flags = -DM5STICK_CP
monitor_speed = 115200
lib_ldf_mode = deep+

lib_deps =
    ;m5stack/M5StickC@^0.2.5
    m5stack/M5StickCPlus @ ^0.0.5
    tinyu-zhao/FFT @ ^0.0.1
    ;https://github.com/earlephilhower/ESP8266Audio.git
    earlephilhower/ESP8266Audio@^1.9.5

```

## 参照情報
terminal関連:  
[Bootterm – a developer-friendly serial terminal program](https://www.cnx-software.com/2020/12/14/bootterm-a-developer-friendly-serial-terminal-program/)  

M5Core2関連：  
[M5Stack Core2のタッチパネル研究](https://lang-ship.com/blog/work/m5stack-core2-touch/)  
[M5Stack Core2のGPIO調査](https://lang-ship.com/blog/work/m5stack-core2-gpio/)  
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

その他；  
[Wio Electronic Animated Eyes](https://macsbug.wordpress.com/2020/05/26/wio-electronic-animated-eyes/)

以上
