
2022/1/29  
誤記修正：  
```

修正前：
wget https://github.com/espressif/arduino-esp32/blob/master/tools/partitions/default_16MB.csv

→  

修正後：
wget https://raw.githubusercontent.com/espressif/arduino-esp32/master/tools/partitions/default_16MB.csv
```

2021/12/22  
初版

M5Core2 Arduino Install
# M5Core2 Arduino Install

## 概要
platformioベースのArduinoフレームワークを使って  
「[M5Stack Core2 IoT開発キット](https://www.switch-science.com/catalog/6530/)」を動かす。   
ホスト環境は、ubuntu20.04とする。  
なお、platformioがインストール済みのものとする。

linuxのplatformioのインストールについては以下を参照のこと。  
・[arduinoフレームワーク用platformio.ini集](https://beta-notes.way-nifty.com/blog/2021/02/post-2b331d.html) 

電源操作：    
・電源オン：ボタン(左側面)のを押す。    
・電源オフ：6秒間ボタン(左側面)を長押しする。    
・リスタート：底にあるリセットボタンを押す。  


## M5Core2_FactoryTestの書き込み方法
まず、FactoryTestの書き込み方法について説明する。  
以下を実行する：

```

# ソースをダウンロードする
cd Downloads/
git clone https://github.com/m5stack/M5-ProductExampleCodes.git

cd pio
# platformio環境に入る
source pio_env/bin/activate

mkdir core2
cd core2
mkdir FactoryTest
cd FactoryTest

# default_16MB.csvをダウンロードする
wget https://raw.githubusercontent.com/espressif/arduino-esp32/master/tools/partitions/default_16MB.csv

# ソースをコピーする
cp -r ~/Downloads/M5-ProductExampleCodes/Core/M5Core2/Arduino/Core2_Factory_test src

gedit platformio.ini
# 次節の内容のplatformio.iniを作成する

# ビルド環境のクリーンアップ
pio -t clean

# M5CoreとPCをUSBで接続する
# ビルド&書き込む
pio -t upload
```
以上で書き込みが完了する。

なお、シリアルデバイスは通常「/dev/ttyACM0」になる。

## platformio.ini
M5Core2のスケッチのビルドには  
必要なライブラリの追加はあり得るが  
基本的には以下のplatformio.iniを使用する。  
platformio.ini
```
[env:m5core2]
platform = espressif32
board = m5stack-core2
framework = arduino
upload_speed = 2000000
monitor_speed = 115200
board_build.partitions = default_16MB.csv

build_flags = 
    -DCORE_DEBUG_LEVEL=4
    -DBOARD_HAS_PSRAM
    -mfix-esp32-psram-cache-issue

lib_deps =
    https://github.com/m5stack/M5Core2.git
    https://github.com/FastLED/FastLED
    ;https://github.com/m5stack/M5Core2/blob/master/examples/core2_for_aws/ArduinoECCX08.zip
    lovyan03/LovyanGFX
    adafruit/Adafruit BME280 Library@^2.1.2
    adafruit/Adafruit Unified Sensor@^1.1
    m5stack/UNIT_ENV @ ^0.0.2	

lib_ldf_mode = deep+

```
新たなプロジェクトをビルドしたい場合、
FactoryTestのディレクトリを、
まるごとコピーして、ディレクトリ名と
src配下のスケッチを変更すれば良い。  

## sketch#1(UNIT_ENV_III)
別のサンプルとして「[M5Stack用温湿度気圧センサユニット Ver.3（ENV Ⅲ）](https://www.switch-science.com/catalog/7254/)」をPORT-Aに接続して温度、湿度、気圧をシリアルに出力するスケッチを動かす。


src/UNIT_ENV_III.ino
```

#include "Wire.h"
#include "UNIT_ENV.h"

SHT3X sht30;
QMP6988 qmp6988;

void setup() {
  Serial.begin(115200);
  Wire.begin(32, 33); // Core2 PORT-A
  qmp6988.init();
}

void loop() {
  if (sht30.get() != 0) {
    return;
  }
  Serial.printf("Temperature: %2.2f℃  Humidity: %0.2f%%  Pressure: %4.1f hPa\r\n", sht30.cTemp, sht30.humidity, qmp6988.calcPressure()/100);
  delay(1);//000);
}
```
M5Stack系ボードで汎用的に使用できるようにシリアル出力のみにしている。
たぶん、依存している部分は「Wire.begin(32, 33);」と思われる。

platformio.iniは上のものが、そのまま使用できる。  
(必要なライブラリは登録済み)


## sketch#2(b3NTP)
b3NTP.ino
```

// select board
////#define WIO_TERMINAL
////#define ESP8266
////#define ESP32
////#define M5ATOM
//------------------

// NTP Client for Wio-Terminal/ESP8266/ESP32
#ifdef M5ATOM
#include "M5Atom.h"
#define ESP32
#endif
#ifdef WIO_TERMAL
//#include <AtWiFi.h>
#include <rpcWiFi.h>
#endif
#ifdef ESP8266
#include <ESP8266WiFi.h>
#endif
#ifdef ESP32
#include <WiFi.h>
#endif

#include <time.h>

#define WIFI_SSID   "your_wifi_ssid"
#define WIFI_PASSWORD   "your_wifi_password"

void setup() {
  Serial.begin(115200);
  delay(100);
  Serial.print("\r\n\nReset:\r\n");

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while(WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(500);
  }
  Serial.println();
  Serial.printf("Connected, IP address: ");
  Serial.println(WiFi.localIP());

  configTzTime("JST-9", "ntp.nict.jp", "ntp.jst.mfeed.ad.jp");   // 2.7.0以降, esp32コンパチ
}

void loop() {
  time_t t;
  struct tm *tm;
  static const char *wd[7] = {"Sun","Mon","Tue","Wed","Thr","Fri","Sat"};

  t = time(NULL);
  tm = localtime(&t);
/*****
  Serial.printf("ESP8266/Arduino ver%s :  %04d/%02d/%02d(%s) %02d:%02d:%02d\n",
        __STR(ARDUINO_ESP8266_GIT_DESC),
        tm->tm_year+1900, tm->tm_mon+1, tm->tm_mday,
        wd[tm->tm_wday],
        tm->tm_hour, tm->tm_min, tm->tm_sec);
****/
  Serial.printf("Arduino NTP:  %04d/%02d/%02d(%s) %02d:%02d:%02d\r\n",
        tm->tm_year+1900, tm->tm_mon+1, tm->tm_mday,
        wd[tm->tm_wday],
        tm->tm_hour, tm->tm_min, tm->tm_sec);
  delay(1000);
}
```
以下はwifi環境に応じて変更すること：
```
#define WIFI_SSID   "your_wifi_ssid"
#define WIFI_PASSWORD   "your_wifi_password"
```
本ソースは、WIO_TERMINAL、ESP8266、ESP32、M5ATOMで共通になっており、platformio.iniの内容でターゲットを切り替えることができる。

platformio.iniは、上のものが、そのまま使用できる。

実行時のシリアル出力(/dev/ttyACM0)：
```
........
Connected, IP address: 192.168.1.15
Arduino NTP:  1970/01/01(Thr) 09:00:04
Arduino NTP:  1970/01/01(Thr) 09:00:05
Arduino NTP:  1970/01/01(Thr) 09:00:06
Arduino NTP:  1970/01/01(Thr) 09:00:07
Arduino NTP:  1970/01/01(Thr) 09:00:08
Arduino NTP:  2021/12/11(Sat) 16:55:59 ← ここでNTPによって時刻が同期している
Arduino NTP:  2021/12/11(Sat) 16:56:00
Arduino NTP:  2021/12/11(Sat) 16:56:01

```

## 参考情報
platformio関連：  
[arduinoフレームワーク用platformio.ini集](https://beta-notes.way-nifty.com/blog/2021/02/post-2b331d.html)  
[Building Core2 FactoryDemo in PlatformIO](https://community.m5stack.com/topic/2697/building-core2-factorydemo-in-platformio)  
[VSCodeとPlatformIOでM5Stack Core2開発](https://qiita.com/desertfox_i/items/a6ff7deaa0a0b3802bcd)  
[M5Stack Core2とVSCode + PlatformIOとでM5Stackプログラミングを始めてみた。](https://ak1211.com/7701/)  

Arduino-IDE関連：  
[Arduino IDE environment - M5Paper](https://docs.m5stack.com/en/quick_start/m5paper/arduino)  
[Arduino IDEのインストールと設定 (Windows, Mac, Linux対応)](https://www.indoorcorgielec.com/resources/arduinoide%E8%A8%AD%E5%AE%9A/arduino-ide%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%A8%E8%A8%AD%E5%AE%9A/)  

M5Stackファミリ関連：    
[M5Paper Arduino Install](https://beta-notes.way-nifty.com/blog/2021/12/post-273e9a.html)    
[M5CoreInk Arduino Install](https://beta-notes.way-nifty.com/blog/2021/12/post-2fe738.html)  
[M5Stamp-PICO Arduino Install](https://beta-notes.way-nifty.com/blog/2021/12/post-116fc0.html)    
[M5Stamp-C3 Arduino Install](https://beta-notes.way-nifty.com/blog/2021/12/post-9db4dc.html)  
[Wio-Terminal/ESP8622/ESP32ボードを共通のスケッチで動かす(NTP-CLIENT編)](https://beta-notes.way-nifty.com/blog/2020/08/post-3484c0.html)  
[Wio-Terminal/M5Atom/ESP8622/ESP32ボードを共通のスケッチで動かす(v2)(STARWARS編)](https://beta-notes.way-nifty.com/blog/2020/12/post-9f7237.html)  
[Wio-Terminal/M5Atom/ESP8622/ESP32ボードを共通のスケッチで動かす(v2)(MQTT編)](https://beta-notes.way-nifty.com/blog/2020/12/post-c05b04.html)  
[Wio-Terminal/M5Atom/ESP8622/ESP32ボードを共通のスケッチで動かす(v2)(REST-API編)](https://beta-notes.way-nifty.com/blog/2020/12/post-10d0e0.html)  
[Wio-Terminal/M5Atom/ESP8622/ESP32ボードを共通のスケッチで動かす(v2)(OSC編)](https://beta-notes.way-nifty.com/blog/2020/12/post-9b7930.html)  

その他：  
[スルーホール用テストワイヤ　ＴＴ－２００　（１０本入）](https://akizukidenshi.com/catalog/g/gC-09831/)

以上
