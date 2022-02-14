
2021/2/21+  
初版  

platformio.ini for arduino
# platformio.ini for arduino

## 概要
arduinoフレームワーク用platformio.ini集   
本記事は。各ボード用のplatformio.iniを集め、platformioの使い方を説明したものである。  
(ホストはubuntu20.04を想定している)  

## 準備
開発ツールをインストールする前に
必要なものをインストールする：
```

sudo apt update

sudo apt install net-tools
sudo apt install git curl
sudo apt install gcc-arm-none-eabi build-essential

sudo apt install cmake
sudo apt install libusb-dev
sudo apt install libusb-1.0-0-dev

sudo apt install picocom

sudo apt install python3-distutils
sudo apt install python3-venv

# lib for Arduino IDE for microbit
sudo apt install libudev1:i386

# for Arduino IDE for ESP32/ESP8266
sudo apt install python-is-python3
pip install pyserial
pip uninstall serial
```

bt(bootterm)のインストール
```

git clone https://github.com/wtarreau/bootterm
cd bootterm
make
sudo make install
```
本ツールは、コマンドとして「bt」と入力すると最近有効になった「/dev/ttyACMx または /dev/ttyUSBx」に接続する。   
参照：[Bootterm – a developer-friendly serial terminal program](https://www.cnx-software.com/2020/12/14/bootterm-a-developer-friendly-serial-terminal-program/)  


## PlatformIOのインストール
```bash

python3 -m venv pio_env
source pio_env/bin/activate

pip install platformio

インストール後も、このツールを使用する場合
同じディレクトリで以下を実行する：  
source pio_env/bin/activate
# 「source」は、「.」でも良い

```
## udev登録
以下を実行して、udevのrulesを登録する：
```bash

curl -fsSL https://raw.githubusercontent.com/platformio/platformio-core/master/scripts/99-platformio-udev.rules | sudo tee /etc/udev/rules.d/99-platformio-udev.rules

sudo udevadm control --reload-rules

sudo usermod -a -G dialout $USER
sudo usermod -a -G plugdev $USER

```

## platformioの使い方

```

# プロジェクトのディレクトリを作る
# (一つのスケッチごとに一つのディレクトリ)
mkdir proj
cd proj

# ソースを置くディレクトリsrcを作る
mkdir src

# スケッチを作成する
# (テスト用には以降に出てくるsrc/ASCIItable.inoを使用する)
gedit src/xxxx.ino

# 使うボードに対応したplatformio.iniを作る
# (内容は以降に出てくるplatform.iniをそのままコピーする)
gedit platformio.ini

# スケッチをビルドする
# (最初の１回はライブラリ・ツールを自動的にダウンロードする)
pio run

# ボードをUSB接続して書き込む
pio run -t upload

# USBシリアルを使っているスケッチならば
# 以下のコマンドでシリアル接続して出力を表示させる
bt
# または
picocom -b115200 /dev/ttyACM0 (または/dev/ttyUSB0)
```

その他の使い方
```

# build結果をクリアする
pio run -t clean

# キャッシュをクリアする
# (ツールやライブラリがダウンロードし直しになるので注意のこと)
sudo rm -r .pio

# 環境を切り替えて書き込む
pio run -e f303 -t upload
pio run -e f103 -t upload 
```

環境を切り替えて書き込む場合のplatformio.iniは   
以下のように複数の環境[env:xxx]を持っていること： 
[]()   
platformio.ini
```

[env:f103]
platform = ststm32
board = nucleo_f103rb
framework = arduino
build_flags = -DNUCLEO_F103RB
monitor_speed = 115200
lib_ldf_mode = deep+

upload_protocol = stlink

#lib_deps = 

[env:f303]
platform = ststm32
board = nucleo_f303k8
framework = arduino
build_flags = -DNUCLEO_F303K8
monitor_speed = 115200
lib_ldf_mode = deep+

upload_protocol = stlink

#lib_deps = 
```
[env:xxxx]のxxxxの部分は環境名にあたり、
ダブらない任意の名前であること。

## テスト用スケッチ
src/ASCIItable.ino
```C++

/*
  ASCII table

  Prints out byte values in all possible formats:
  - as raw binary values
  - as ASCII-encoded decimal, hex, octal, and binary values

  For more on ASCII, see http://www.asciitable.com and http://en.wikipedia.org/wiki/ASCII

  The circuit: No external hardware needed.

  created 2006
  by Nicholas Zambetti <http://www.zambetti.com>
  modified 9 Apr 2012
  by Tom Igoe

  This example code is in the public domain.

  http://www.arduino.cc/en/Tutorial/ASCIITable
*/

void setup() {
  //Initialize serial and wait for port to open:
  Serial.begin(115200);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }

  // prints title with ending line break
  Serial.println("ASCII Table ~ Character Map");
}

// first visible ASCIIcharacter '!' is number 33:
int thisByte = 33;
// you can also write ASCII characters in single quotes.
// for example, '!' is the same as 33, so you could also use this:
// int thisByte = '!';

void loop() {
  // prints value unaltered, i.e. the raw binary version of the byte.
  // The Serial Monitor interprets all bytes as ASCII, so 33, the first number,
  // will show up as '!'
  Serial.write(thisByte);

  Serial.print(", dec: ");
  // prints value as string as an ASCII-encoded decimal (base 10).
  // Decimal is the default format for Serial.print() and Serial.println(),
  // so no modifier is needed:
  Serial.print(thisByte);
  // But you can declare the modifier for decimal if you want to.
  // this also works if you uncomment it:

  // Serial.print(thisByte, DEC);


  Serial.print(", hex: ");
  // prints value as string in hexadecimal (base 16):
  Serial.print(thisByte, HEX);

  Serial.print(", oct: ");
  // prints value as string in octal (base 8);
  Serial.print(thisByte, OCT);

  Serial.print(", bin: ");
  // prints value as string in binary (base 2) also prints ending line break:
  Serial.println(thisByte, BIN);

  // if printed last visible character '~' or 126, stop:
  if (thisByte == 126) {    // you could also use if (thisByte == '~') {
    // This loop loops forever and does nothing
    while (true) {
      continue;
    }
  }
  // go on to the next character
  thisByte++;
}
```
本スケッチはarduinoのサンプルそのもの(bpsのみ変更)である。


## plaformio.ini
(1)platformio.iniの先頭にあたる以下はコメントにあたるので省略している：
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
```
(2)追加するライブラリがある場合は以下のように
「lib_dep= 」以降にライブラリのurlなどを追加する：
```

lib_deps =
    #https://github.com/arduino-libraries/NTPClient.git
    arduino-libraries/NTPClient@^3.1.0

```
(3)以下、各ボード用のplatformio.iniになる。

Arduino Uno
```

[env:uno]
platform = atmelavr
board = uno
framework = arduino
#build_flags = -Dxxxx
upload_protocol = arduino
monitor_speed = 115200
lib_ldf_mode = deep+

#lib_deps = 

```

wio-temirnal
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
    # 551
    #https://github.com/arduino-libraries/NTPClient.git
    arduino-libraries/NTPClient@^3.1.0

```

XIAO
```

[env:seeed_xiao]
platform = atmelsam
board = seeed_xiao
framework = arduino
build_flags = -DXIAO
upload_protocol = sam-ba
monitor_speed = 115200
lib_ldf_mode = deep+

lib_deps =
    olikraus/U8g2 @ ^2.28.7

```

Feather M4
```

[env:adafruit_feather_m4]
platform = atmelsam
board = adafruit_feather_m4
framework = arduino
build_flags = -DFEATHER_M4
upload_protocol = sam-ba
monitor_speed = 115200
lib_ldf_mode = deep+

#lib_deps =
```

Grand Central M4
```

[env:adafruit_grandcentral_m4]
platform = atmelsam
board = adafruit_grandcentral_m4
framework = arduino
build_flags = -DGRANDCENTRAL_M4
upload_protocol = sam-ba
monitor_speed = 115200
lib_ldf_mode = deep+

#lib_deps =
```

M5Atom
```

[env:esp32dev]
platform = espressif32
#board = esp32dev
board = m5stick-c
framework = arduino
build_flags = -DM5ATOM
monitor_speed = 115200
lib_ldf_mode = deep+

lib_deps =
    # use M5Atom lib
    3113
    # use "FastLED"
    126

```

M5StickC
```

[env:esp32dev]
platform = espressif32
board = m5stick-c
framework = arduino
build_flags = -DM5STICK_C
monitor_speed = 115200
lib_ldf_mode = deep+

lib_deps =
    m5stack/M5StickC @ ^0.2.0

```
リセット方法：   
(1)「M5」と書かれたボタンを正面に見て左側にあるボタンを6秒長押して電源を切る。  
(2)そのボタンを再度、２秒長押しをして電源を入れる。（リセットになる）  

[]()  
[]()  
M5StickCPlus
```

[env:esp32dev]
platform = espressif32
board = m5stick-c
framework = arduino
build_flags = -DM5STICK_CP
monitor_speed = 115200
lib_ldf_mode = deep+

lib_deps =
    m5stack/M5StickCPlus @ ^0.0.1

```
リセット方法：   
(1)「M5」と書かれたボタンを正面に見て左側にあるボタンを6秒長押して電源を切る。  
(2)そのボタンを再度、２秒長押しをして電源を入れる。（リセットになる）  

[]()  
[]()  
M5Stack Fire
```

[env:esp32dev]
platform = espressif32
board = m5stack-fire
framework = arduino
build_flags = -DM5STACK_FIRE
monitor_speed = 115200
lib_ldf_mode = deep+

lib_deps =
    m5stack/M5Stack
    https://github.com/lovyan03/LovyanGFX.git

```
Power on/off:   
・Power on: click the red power button on the left   
・Power off: Quickly double-click the red power button on the left  

[]()  
[]()  
ESP32
```

[env:esp32dev]
platform = espressif32
board = esp32dev
framework = arduino
build_flags = -DESP32
monitor_speed = 115200
lib_ldf_mode = deep+

#lib_deps =

```

ESP8266
```

[env:huzzah]
platform = espressif8266
board = esp_wroom_02
framework = arduino
build_flags = -DESP8266
monitor_speed = 115200
lib_ldf_mode = deep+

#lib_deps =

```

micro:bit
```

[env:bbcmicrobit]
platform = nordicnrf51
board = bbcmicrobit
framework = arduino
build_flags = -DMICROBIT -DNRF51_S110
monitor_speed = 115200
lib_ldf_mode = deep+

upload_protocol = cmsis-dap

lib_deps = 
    https://github.com/adafruit/Adafruit_BusIO/archive/master.zip
    https://github.com/sparkfun/SparkFun_MAG3110_Breakout_Board_Arduino_Library/archive/master.zip
    https://cdn-learn.adafruit.com/assets/assets/000/046/217/original/MMA8653.zip
    https://github.com/stm32duino/LSM303AGR/archive/master.zip
    https://github.com/adafruit/Adafruit-GFX-Library/archive/master.zip
    #
    https://github.com/sandeepmistry/arduino-BLEPeripheral/archive/master.zip
    https://github.com/adafruit/Adafruit_Microbit/archive/master.zip
    #
    https://github.com/ht-deko/microbit_Screen/archive/master.zip

```

Nucleo STM32F103RB
```

[env:nucleo_f103rb]
platform = ststm32
board = nucleo_f103rb
framework = arduino
build_flags = -DNUCLEO_F103RB
monitor_speed = 115200
lib_ldf_mode = deep+

upload_protocol = stlink

#lib_deps = 

```

Nucleo STM32F303K8
```

[env:nucleo_f303k8]
platform = ststm32
board = nucleo_f303k8
framework = arduino
build_flags = -DNUCLEO_F303K8
monitor_speed = 115200
lib_ldf_mode = deep+

upload_protocol = stlink

#lib_deps = 

```

TeensyLC
```

[env:teensylc]
platform = teensy
board = teensylc
framework = arduino
#build_flags = -Dxxxx
monitor_speed = 115200
lib_ldf_mode = deep+

upload_protocol = teensy-cli

#lib_deps = 

```

Teensy3.6
```

[env:teensy36]
platform = teensy
board = teensy36
framework = arduino
#build_flags = -Dxxxx
monitor_speed = 115200
lib_ldf_mode = deep+

upload_protocol = teensy-cli

#lib_deps = 

```

Teensy4.0
```

[env:teensy40]
platform = teensy
board = teensy40
framework = arduino
#build_flags = -Dxxxx
monitor_speed = 115200
lib_ldf_mode = deep+

upload_protocol = teensy-cli

#lib_deps = 

```

## ビルド・エラー
Arduino-IDEのコンパイラと異なり、platformioのコンパイラは、関数定義の後方参照を許さないので、
この場合、関数の未定義エラーになる。したがって、Arduino-IDEでビルドできているソースでもエラーになることがある。このときの対応方法は、未定義エラーになる関数定義をプロトタイプ宣言としてソースの先頭に置き、後方参照を解消する。(関数定義の本体の位置はそのままで移動させる必要はない)


## 参考情報

M5Stack関連：  
・[PlatformIO M5Stack開発の現状](https://qiita.com/wararyo/items/fc3b90f72a18b24cf456)   
・https://github.com/m5stack/M5StickC-Plus.git  
・https://github.com/m5stack/M5StickC.git   
・https://github.com/m5stack/M5Stack.git   

micro:bit関連：  
・[micro:bit Arduino/MBED開発ツール(v2)(micro:bit-v2対応,linux版)](https://beta-notes.way-nifty.com/blog/2021/01/post-e6d91a.html)   
・[micro:bit v2 で遊ぶ](https://qiita.com/sat0ken/items/13bd03378c28b98a794e)   

platformio関連：
```

https://docs.platformio.org/en/latest/platforms/creating_board.html

Installation
1.Create boards directory in core_dir if it doesn’t exist.
2.Create myboard.json file in this boards directory.
3.Search available boards via pio boards command. You should see myboard board.
```

・[PlatformIO Core (CLI)](https://docs.platformio.org/en/latest/core/index.html)  
・[Arduino-IDEとPlatformioのコンパイラーの挙動の違いについて](https://beta-notes.way-nifty.com/blog/2020/07/post-fbe8f7.html)   
・[ubuntu20.04をインストールする](https://beta-notes.way-nifty.com/blog/2020/10/post-fa7773.html)   


以上
