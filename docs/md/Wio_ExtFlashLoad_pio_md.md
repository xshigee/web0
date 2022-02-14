
2022/2/3  
初版

Wio_ExtFlashLoad sketch build by platformio  
# Wio_ExtFlashLoad sketch build by platformio     

## 概要
「[Wio Ext Flash Load](https://macsbug.wordpress.com/2020/06/09/wio-ext-flash-loader/)」、
「[External Flash Loader library for Wio Terminal](https://github.com/ciniml/ExtFlashLoader)」
にあるWio_ExtFlashLoad(WriteSampleMenu.ino)スケッチをplatformioでビルドする。  
arduinoのサンプル・スケッチとして提供されているものだが、plaformioビルド環境でビルドする。  
Wio_ExtFlashLoadは、アプリを起動するメニューになっており、  
SDカードにビルドした.binを起き、それを選択して起動する。

## WriteSampleMenu.ino

以下の手順をダウンロード/ビルド/書き込みする：  

```

# platformioの環境に入る

# プロジェクト・ディレクトリを作成する
mkdir Wio_ExtFlashLoad
cd Wio_ExtFlashLoad

mkdir src
cd src
wget https://raw.githubusercontent.com/ciniml/ExtFlashLoader/master/examples/WriteSampleMenu/WriteSampleMenu.ino
wget https://raw.githubusercontent.com/ciniml/ExtFlashLoader/master/examples/WriteSampleMenu/menu_data.h


cd ..

gedit platformio.ini
# 後節にあるplatformio.iniの内容を作成する

# ビルド＆書き込み
pio run -t upload

```
以上で、実行すると、メニューが表示されるようになる。

## platformio.ini

wio-terminal用：
```

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
    ciniml/ExtFlashLoader@^0.1.2


```

## アプリ用.binを作成する
アプリ用SDの詳細は「[External Flash Loader library for Wio Terminal](https://github.com/ciniml/ExtFlashLoader)」に記述されているので、その中に入れる.binの作成方法について説明する。

「pio run」でビルドすると   
以下に.binができる：
```

.pio/build/seeed_wio_terminal/firmware.bin
```
これをfirmware.binをapp.binにリネームしてSDにコピーする。

これだけでメニューから起動できる。  
ただ、このままだとアプリ起動後、  
メニューに戻ることができないので  
setup()にボタンAを押しながらリセットしたときに  
メニューに戻るコードを埋め込む。  

(1)TFT_eSPI対応アプリの場合、「[External Flash Loader library for Wio Terminal](https://github.com/ciniml/ExtFlashLoader)」の「アプリケーションのメニューアプリ対応」を参照のこと。

(2)LGFX対応アプリの場合は  
以下のコードを埋め込む：
```c++

以下のヘッダーを追加する：
///////////////////////////////////////////
// application menu header
#include <cstdint>
#include <ExtFlashLoader.h>
///////////////////////////////////////////

変更前：
void setup() { 

  lcd.init();
  
-------------------
→
変更後： 
void setup() { 
//// goto application menu /////////////// 
 lcd.init();
 pinMode(WIO_KEY_A, INPUT_PULLUP);
 if( digitalRead(WIO_KEY_A) == LOW) {
    lcd.print("Launching QSPI application\r\n"); // for LGFX
    ExtFlashLoader::ExtFlashLoader loader;
 }
////////////////////////////////////////// 
//
  //lcd.init();

```
platformio.iniには  
以下のライブラリを追加する：  
```

lib_deps = 
    ...
        ＜省略＞
    ...
    #
    ciniml/ExtFlashLoader@^0.1.2

```

## 参照情報
terminal関連:  
[Bootterm – a developer-friendly serial terminal program](https://www.cnx-software.com/2020/12/14/bootterm-a-developer-friendly-serial-terminal-program/)  

LovyanGFX関連：  
[LovyanGFX - Display (LCD / OLED / EPD) graphics library (for ESP32 SPI, I2C, 8bitParallel / ESP8266 SPI, I2C / ATSAMD51 SPI) - M5Stack / M5StickC / TTGO T-Watch / ODROID-GO / ESP-WROVER-KIT / WioTerminal / and more...](https://github.com/lovyan03/LovyanGFX)   
[LovyanGFX LCD Graphics driver](https://macsbug.wordpress.com/2020/07/02/lovyangfx-lcd-graphics-driver/)  
[LovyanGFX-Display ライブラリを使用したスケッチをplatformioでビルドする](https://beta-notes.way-nifty.com/blog/2022/01/post-2dfd22.html)  

platformio関連：  
[arduinoフレームワーク用platformio.ini集](https://beta-notes.way-nifty.com/blog/2021/02/post-2b331d.html)  
[Building Core2 FactoryDemo in PlatformIO](https://community.m5stack.com/topic/2697/building-core2-factorydemo-in-platformio)  
[VSCodeとPlatformIOでM5Stack Core2開発](https://qiita.com/desertfox_i/items/a6ff7deaa0a0b3802bcd)  
[M5Stack Core2とVSCode + PlatformIOとでM5Stackプログラミングを始めてみた。](https://ak1211.com/7701/)  

Arduino-IDE関連：  
[Arduino IDE environment - M5Paper](https://docs.m5stack.com/en/quick_start/m5paper/arduino)  
[Arduino IDEのインストールと設定 (Windows, Mac, Linux対応)](https://www.indoorcorgielec.com/resources/arduinoide%E8%A8%AD%E5%AE%9A/arduino-ide%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%A8%E8%A8%AD%E5%AE%9A/)  

以上
